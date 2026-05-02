import { genAI } from '../../lib/gemini'

const proModel = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

function buildCvPrompt(cvRaw: string): string {
  return `<system>
You are an ATS keyword extraction specialist. Extract all technical keywords, professional terms, and domain concepts from the CV below.

Rules:
- Include technologies, frameworks, tools, programming languages, methodologies, and domain concepts
- Include job titles, certifications, and industry-specific terms
- Include soft skills only if they are specific and substantive (e.g. "cross-functional collaboration", not "communication")
- Preserve compound terms exactly as they appear (e.g. "design system", "machine learning", "api rest")
- Exclude generic filler words, section headers, and non-skill nouns (e.g. "experience", "team", "company", "years", "role")
- Each term should be lowercase
- Return 20–40 terms

Respond ONLY with a valid JSON array of strings. No markdown, no explanation.
Example: ["react", "typescript", "design system", "unit testing", "ci/cd", "micro-frontends", "cross-functional collaboration"]
</system>

<cv>
${cvRaw}
</cv>`
}

function buildJdPrompt(jdRaw: string): string {
  return `<system>
You are an ATS keyword extraction specialist. Extract the most important keywords, compound terms, and required competencies from the job description below.

Rules:
- Prioritize compound terms over individual words ("design system" not "design" + "system")
- Include specific technologies, frameworks, tools, methodologies, and domain concepts
- Include required soft skills if specific and repeated ("cross-functional collaboration", "stakeholder management")
- Include job titles, certifications, and industry terms mentioned as requirements
- Exclude generic filler words, section headers, and non-skill nouns (e.g. "requirements", "experience", "team", "company", "candidate", "opportunity", "role", "years")
- Return 15–25 terms maximum
- Each term should be lowercase
- If the JD is vague or very short, infer likely requirements from context

Respond ONLY with a valid JSON array of strings. No markdown, no explanation.
Example: ["react", "design system", "typescript", "unit testing", "code review", "cross-browser debugging", "agile"]
</system>

<job_description>
${jdRaw}
</job_description>`
}

function parseJsonArray(raw: string): string[] {
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean)
  if (!Array.isArray(parsed)) throw new Error('Expected array')
  return parsed.filter((k): k is string => typeof k === 'string')
}

export async function extractKeywordsNode(state: {
  input: { jobDescription: string }
  mapped?: { sections: Record<string, string> }
}): Promise<{
  jdKeywords: string[]
  cvKeywords: string[]
  keywordGaps: string[]
}> {
  const cvRaw = state.mapped
    ? Object.values(state.mapped.sections).filter(Boolean).join('\n\n')
    : ''

  const jdRaw = state.input.jobDescription

  // Run CV and JD extraction in parallel via the same Pro model
  const [cvResult, jdResult] = await Promise.all([
    proModel.generateContent(buildCvPrompt(cvRaw)),
    proModel.generateContent(buildJdPrompt(jdRaw)),
  ])

  const cvKeywords = parseJsonArray(cvResult.response.text())
  const jdKeywords = parseJsonArray(jdResult.response.text())

  // Compute gaps: jdKeywords not found in cvKeywords (case-insensitive)
  const cvLower = cvKeywords.map(k => k.toLowerCase())
  const keywordGaps = jdKeywords.filter(k => !cvLower.includes(k.toLowerCase()))

  return { jdKeywords, cvKeywords, keywordGaps }
}
