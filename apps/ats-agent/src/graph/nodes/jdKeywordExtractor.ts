import { genAI } from '../../lib/gemini'
import { parseJobDescription } from '../../lib/jd'
import type { WeightedKeyword } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

function buildPrompt(jd: string): string {
  return `You are an ATS keyword specialist. Extract the most important keywords from the job description below.

Rules:
- Prefer compound terms over individual words ("design system" not "design" + "system")
- Include specific technologies, frameworks, tools, methodologies, domain concepts
- Include soft skills only if specific and repeated ("cross-functional collaboration", not "communication")
- Exclude generic filler: "requirements", "experience", "team", "company", "candidate", "role", "years"
- Return 15–25 terms maximum, each lowercase
- Weight: "required" = appears in mandatory requirements section OR repeated 2+ times; "preferred" = rest
- jobTitle: exact job title as written in the job description

Job Description:
${jd}

Respond ONLY with valid JSON, no markdown, no explanation:
{ "jobTitle": "...", "keywords": [{ "term": "...", "weight": "required" | "preferred" }] }`
}

export async function jdKeywordExtractorNode(state: {
  input: { jobDescription: string }
}): Promise<{ jdKeywords: string[]; weightedKeywords: WeightedKeyword[]; jobTitle: string }> {
  const jd = parseJobDescription(state.input.jobDescription)
  const result = await model.generateContent(buildPrompt(jd))
  const raw = result.response.text()

  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean) as { jobTitle: string; keywords: Array<{ term: string; weight: string }> }
    if (!parsed.keywords || !Array.isArray(parsed.keywords)) throw new Error('Expected keywords array')
    const weightedKeywords: WeightedKeyword[] = parsed.keywords
      .filter((k) => typeof k.term === 'string' && (k.weight === 'required' || k.weight === 'preferred'))
      .map((k) => ({ term: k.term, weight: k.weight as 'required' | 'preferred' }))
    return {
      jdKeywords: weightedKeywords.map((k) => k.term),
      weightedKeywords,
      jobTitle: typeof parsed.jobTitle === 'string' ? parsed.jobTitle : '',
    }
  } catch {
    return { jdKeywords: [], weightedKeywords: [], jobTitle: '' }
  }
}
