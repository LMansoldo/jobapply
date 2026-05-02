import { genAI } from '../../lib/gemini'
import type { SectionAnalysis } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

function buildPrompt(cvRaw: string, jdRaw: string, jdKeywords: string[], locale?: string): string {
  const lang = locale === 'pt-BR' ? 'Brazilian Portuguese' : 'English'

  return `<system>
You are an ATS specialist analyzing a CV section by section. Focus exclusively on FORMAT: section clarity, bullet usage, keyword density, absence of tables/images, ATS parser readability, structure.

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
Analyze the candidate's CV FORMAT against the job description and ATS best practices. For each field:

1. keywordsFromJd: Which JD keywords are effectively placed for ATS parsers to find?
2. keywordsMissing: Which JD keywords are absent or poorly positioned for ATS detection?
3. phrasesToKeep: Which formatting patterns or section structures are working well?
4. phrasesToAlter: Which formatting issues need fixing (e.g. inconsistent bullet style, poor section ordering, lack of keyword density)? Provide original and suggestion.
5. phrasesToRemove: Which formatting elements hurt ATS readability (e.g. tables, columns, images)?
6. suggestedPhrases: What formatting changes or structural improvements would strengthen ATS performance?

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

export async function analyzeFormatNode(state: {
  input: { jobDescription: string; locale?: string }
  mapped?: { sections: Record<string, string> }
  jdKeywords?: string[]
}): Promise<{ analysisFormat: SectionAnalysis }> {
  const cvRaw = state.mapped
    ? Object.values(state.mapped.sections).filter(Boolean).join('\n\n')
    : ''
  const jdKeywords = state.jdKeywords ?? []

  const prompt = buildPrompt(cvRaw, state.input.jobDescription, jdKeywords, state.input.locale)

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    // Strip markdown fences, then extract the outermost JSON object
    const stripped = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const jsonMatch = stripped.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON object found in response')
    const parsed = JSON.parse(jsonMatch[0])

    return {
      analysisFormat: {
        keywordsFromJd: Array.isArray(parsed.keywordsFromJd) ? parsed.keywordsFromJd : [],
        keywordsMissing: Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : [],
        phrasesToKeep: Array.isArray(parsed.phrasesToKeep) ? parsed.phrasesToKeep : [],
        phrasesToAlter: Array.isArray(parsed.phrasesToAlter) ? parsed.phrasesToAlter : [],
        phrasesToRemove: Array.isArray(parsed.phrasesToRemove) ? parsed.phrasesToRemove : [],
        suggestedPhrases: Array.isArray(parsed.suggestedPhrases) ? parsed.suggestedPhrases : [],
      },
    }
  } catch (err) {
    console.error('analyzeFormatNode: error, returning empty analysis', err)
    return {
      analysisFormat: {
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
