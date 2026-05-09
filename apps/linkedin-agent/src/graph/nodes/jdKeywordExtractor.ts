import { genAI } from '../../lib/gemini'
import type { GraphState } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

function buildPrompt(jd: string): string {
  return `You are a LinkedIn recruiter keyword specialist. Extract the most important keywords from this job description for LinkedIn profile SEO.

Return three groups:
- required: appear in job title or mandatory requirements
- preferred: appear as "nice to have" or differentials
- inferred: typical for this role/sector but not explicitly listed

Rules:
- Prefer compound terms over individual words
- Include technologies, methodologies, domain concepts
- Exclude generic nouns (team, company, role, years, requirements)
- 8-12 terms per group maximum

Job Description:
${jd}

Respond ONLY with valid JSON, no markdown:
{"required": ["string"], "preferred": ["string"], "inferred": ["string"]}`
}

export async function jdKeywordExtractorNode(
  state: Pick<GraphState, 'input'>
): Promise<Pick<GraphState, 'jdKeywords'>> {
  const jd = state.input.jobDescription
  if (!jd || jd.trim().length < 20) {
    return { jdKeywords: [] }
  }

  try {
    const result = await model.generateContent(buildPrompt(jd))
    const raw = result.response.text()
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean) as { required?: string[]; preferred?: string[]; inferred?: string[] }
    const all = [
      ...(parsed.required ?? []),
      ...(parsed.preferred ?? []),
      ...(parsed.inferred ?? []),
    ].filter((k): k is string => typeof k === 'string')
    return { jdKeywords: all }
  } catch {
    return { jdKeywords: [] }
  }
}
