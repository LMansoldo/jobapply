import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MappedCV, InterviewPrep } from '../../types'
import { parseJobDescription } from '../../platforms/utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

function buildPrompt(cv: MappedCV, jd: string, locale?: string): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  return `You are an expert career coach and interview trainer.

You will receive a candidate's CV and a job description. Your goal is to generate interview preparation material that bridges the candidate's real experience with the specific requirements of this role.

## CV Sections

**Contact:** ${cv.sections.contact}

**Summary:** ${cv.sections.summary}

**Skills:** ${cv.sections.skills}

**Experience:** ${cv.sections.experience}

**Education:** ${cv.sections.education}

**Languages:** ${cv.sections.languages}

## Job Description

${jd}

## Your tasks

### stories
Generate exactly 5 compelling interview stories in STAR format (Situation, Task, Action, Result woven into a cohesive narrative paragraph — do NOT use headers like "Situation:" inside the paragraph). Each story must:
- Map a specific, concrete requirement from the JD to a real experience from the CV
- Be written as a flowing 4-6 sentence narrative, not bullet points
- Include a measurable result when the CV provides data to support it
- Sound natural and confident when spoken aloud

### overallPositioning
Write a 2-3 sentence coaching statement on exactly how this candidate should frame and pitch themselves for this specific role given their background. Be direct and concrete — name the specific angle they should lead with.

Respond ONLY with a valid JSON object, no markdown, no preamble.
All string values MUST be written in ${lang}.
{
  "stories": [{ "jdRequirement": "specific requirement from JD", "story": "STAR narrative paragraph" }],
  "overallPositioning": "coaching statement"
}`
}

export async function interviewPrepAnalyzerNode(input: {
  cv: MappedCV
  jobDescription: string
  locale?: string
}): Promise<InterviewPrep> {
  const prompt = buildPrompt(input.cv, parseJobDescription(input.jobDescription), input.locale)

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  let parsed: InterviewPrep
  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    parsed = JSON.parse(clean) as InterviewPrep
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${raw.slice(0, 200)}`)
  }

  return {
    stories: parsed.stories ?? [],
    overallPositioning: parsed.overallPositioning ?? '',
  }
}
