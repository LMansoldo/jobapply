import { genAI } from '../../lib/gemini'
import type { SectionAnalysis } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

function buildPrompt(cvRaw: string, jdRaw: string, jdKeywords: string[], locale?: string): string {
  const lang = locale === 'pt-BR' ? 'Brazilian Portuguese' : 'English'

  return `<system>
You are an ATS specialist analyzing a CV section by section. Focus exclusively on EDUCATION: academic degrees, fields of study, certifications, relevant courses.

Respond ONLY with a valid JSON object matching the schema below. No markdown, no explanation. All text MUST be in ${lang}.
</system>

<cv>
${cvRaw}
</cv>

<job_description>
${jdRaw}
</job_description>

<jd_keywords>
${jdKeywords.join(', ')}
</jd_keywords>

<instructions>
Analyze the candidate's EDUCATION against the job description. For each field:

1. keywordsFromJd: Which JD keywords appear in the education section? List them.
2. keywordsMissing: Which JD keywords related to education/credentials are absent?
3. phrasesToKeep: Which education entries are strong and should be preserved?
4. phrasesToAlter: Which education phrases are weak or poorly presented? Provide original and suggestion.
5. phrasesToRemove: Which education content is irrelevant or outdated for this role?
6. suggestedPhrases: What new education-oriented phrases would strengthen the CV?

Respond with this EXACT JSON shape:
{
  "keywordsFromJd": ["string"],
  "keywordsMissing": ["string"],
  "phrasesToKeep": ["string"],
  "phrasesToAlter": [{"original": "string", "suggestion": "string"}],
  "phrasesToRemove": ["string"],
  "suggestedPhrases": ["string"]
}
</instructions>`
}

export async function analyzeEducationNode(state: {
  input: { jobDescription: string; locale?: string }
  mapped?: { sections: Record<string, string> }
  jdKeywords?: string[]
}): Promise<{ analysisEducation: SectionAnalysis }> {
  const cvRaw = state.mapped
    ? Object.values(state.mapped.sections).filter(Boolean).join('\n\n')
    : ''
  const jdKeywords = state.jdKeywords ?? []

  const prompt = buildPrompt(cvRaw, state.input.jobDescription, jdKeywords, state.input.locale)

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean)

    return {
      analysisEducation: {
        keywordsFromJd: Array.isArray(parsed.keywordsFromJd) ? parsed.keywordsFromJd : [],
        keywordsMissing: Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : [],
        phrasesToKeep: Array.isArray(parsed.phrasesToKeep) ? parsed.phrasesToKeep : [],
        phrasesToAlter: Array.isArray(parsed.phrasesToAlter) ? parsed.phrasesToAlter : [],
        phrasesToRemove: Array.isArray(parsed.phrasesToRemove) ? parsed.phrasesToRemove : [],
        suggestedPhrases: Array.isArray(parsed.suggestedPhrases) ? parsed.suggestedPhrases : [],
      },
    }
  } catch (err) {
    console.error('analyzeEducationNode: error, returning empty analysis', err)
    return {
      analysisEducation: {
        keywordsFromJd: [],
        keywordsMissing: [],
        phrasesToKeep: [],
        phrasesToAlter: [],
        phrasesToRemove: [],
        suggestedPhrases: [],
      },
    }
  }
}
