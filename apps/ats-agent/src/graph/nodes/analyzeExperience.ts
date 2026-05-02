import { genAI } from '../../lib/gemini'
import type { SectionAnalysis } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

function buildPrompt(cvRaw: string, jdRaw: string, jdKeywords: string[], locale?: string): string {
  const lang = locale === 'pt-BR' ? 'Brazilian Portuguese' : 'English'

  return `<system>
You are an ATS specialist analyzing a CV section by section. Focus exclusively on EXPERIENCE: roles, responsibilities, achievements, tenure, domains of expertise.

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
Analyze the candidate's EXPERIENCE against the job description. For each field:

1. keywordsFromJd: Which JD keywords appear in the experience section? List them.
2. keywordsMissing: Which JD keywords are absent from the experience section?
3. phrasesToKeep: Which experience bullet points or descriptions are strong and should be preserved?
4. phrasesToAlter: Which phrases are weak, vague, or poorly articulated? Provide original and a specific suggestion.
5. phrasesToRemove: Which content in the experience section is irrelevant or harmful for this role?
6. suggestedPhrases: What new experience-oriented phrases would strengthen the CV for this JD?

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

export async function analyzeExperienceNode(state: {
  input: { jobDescription: string; locale?: string }
  mapped?: { sections: Record<string, string> }
  jdKeywords?: string[]
}): Promise<{ analysisExperience: SectionAnalysis }> {
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
      analysisExperience: {
        keywordsFromJd: Array.isArray(parsed.keywordsFromJd) ? parsed.keywordsFromJd : [],
        keywordsMissing: Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : [],
        phrasesToKeep: Array.isArray(parsed.phrasesToKeep) ? parsed.phrasesToKeep : [],
        phrasesToAlter: Array.isArray(parsed.phrasesToAlter) ? parsed.phrasesToAlter : [],
        phrasesToRemove: Array.isArray(parsed.phrasesToRemove) ? parsed.phrasesToRemove : [],
        suggestedPhrases: Array.isArray(parsed.suggestedPhrases) ? parsed.suggestedPhrases : [],
      },
    }
  } catch (err) {
    console.error('analyzeExperienceNode: error, returning empty analysis', err)
    return {
      analysisExperience: {
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
