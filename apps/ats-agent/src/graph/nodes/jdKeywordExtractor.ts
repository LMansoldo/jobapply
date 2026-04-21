import { GoogleGenerativeAI } from '@google/generative-ai'
import { parseJobDescription } from '../../platforms/utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

function buildPrompt(jd: string): string {
  return `You are an ATS keyword specialist. Extract the most important keywords and compound terms from the job description below.

Rules:
- Prefer compound terms over individual words ("design system" not "design" + "system")
- Include specific technologies, frameworks, tools, methodologies, and domain concepts
- Include soft skills only if they are specific and repeated ("cross-functional collaboration", not "communication")
- Exclude generic filler words, section headers, and non-skill nouns (e.g. "requirements", "experience", "team", "company", "candidate", "opportunity", "role", "years")
- Return 15–25 terms maximum
- Each term should be lowercase

Job Description:
${jd}

Respond ONLY with a valid JSON array of strings. No markdown, no explanation.
Example: ["react", "design system", "typescript", "unit testing", "code review", "cross-browser debugging"]`
}

export async function jdKeywordExtractorNode(state: {
  input: { jobDescription: string }
}): Promise<{ jdKeywords: string[] }> {
  const jd = parseJobDescription(state.input.jobDescription)

  const result = await model.generateContent(buildPrompt(jd))
  const raw = result.response.text()

  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean)
    if (!Array.isArray(parsed)) throw new Error('Expected array')
    return { jdKeywords: parsed.filter((k): k is string => typeof k === 'string') }
  } catch {
    return { jdKeywords: [] }
  }
}
