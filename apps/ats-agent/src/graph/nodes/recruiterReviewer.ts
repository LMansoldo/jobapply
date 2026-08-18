import { genAI } from '../../lib/gemini'
import { parseJobDescription } from '../../lib/jd'
import type { MappedCV, JDIntentSignal, RecruiterReview } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

interface RecruiterResult {
  narrativeScore: number
  seniorityScore: number
  domainFitScore: number
  notes: string[]
}

export function clampScore(value: unknown): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

function buildPrompt(cv: MappedCV, jd: string, intentSignals: JDIntentSignal[], locale?: string): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  const signalsBlock = intentSignals.length
    ? intentSignals
        .map((s) => `- "${s.text}" → ${s.effect} on "${s.target}"`)
        .join('\n')
    : 'None.'

  return `<system>
You are a senior technical recruiter reading this CV as a human, not a keyword-matching bot. You read fast, you have seen thousands of resumes, and you can tell within a paragraph whether someone actually did the work they claim. Respond ONLY with a valid JSON object — no markdown, no explanation, no preamble. All string values MUST be in ${lang}. This is non-negotiable.
</system>

<style_rules>
Notes must be sober, factual, and specific — never hype, never AI-smell phrases.
NEVER use: "results-driven", "passionate", "significantly improved", "seamless", "dynamic", "innovative", em-dashes.
Each note must point at something concrete: a bullet, a phrase, a gap. State what is there, what is missing, and (if relevant) what to do about it.
</style_rules>

<intent_signals>
The job description contains the following reweighting signals extracted by a prior analysis step. You MUST honor them: if a signal downweights an area, do NOT penalize domainFitScore for the candidate lacking that area. If a signal upweights an area, weigh alignment with it more heavily.
${signalsBlock}
</intent_signals>

<cv>
  <contact>${cv.sections.contact}</contact>
  <summary>${cv.sections.summary}</summary>
  <skills>${cv.sections.skills}</skills>
  <experience>${cv.sections.experience}</experience>
  <education>${cv.sections.education}</education>
  <languages>${cv.sections.languages}</languages>
</cv>

<job_description>
${jd}
</job_description>

<instructions>
Score the candidate 0-100 on each of the following, then write 3-6 notes.

### narrativeScore
Do the bullets tell a coherent story of impact — context, action, measurable result — or are they flat task lists? Reward specific, credible detail. Penalize vague claims with no outcome attached.

### seniorityScore
Does the demonstrated scope and ownership (team size, budget, decision authority, breadth of systems owned) match the seniority level the job description asks for? A senior-level JD with only IC task bullets should score lower here; a match between demonstrated scope and required scope should score high.

### domainFitScore
How well does the candidate's industry/domain background align with what this role needs? Apply the intent signals above — do not penalize for gaps the signals say to downweight.

### notes
3 to 6 actionable, sober, factual observations. Reference specific bullets or phrases where possible. Example style: "Bullet 'Operated under strict hardware constraints' states a condition, not an outcome — add the result." No hype, no filler, no encouragement — just what a recruiter would actually flag.
</instructions>

Respond with this exact JSON shape:
{
  "narrativeScore": 0,
  "seniorityScore": 0,
  "domainFitScore": 0,
  "notes": ["string"]
}`
}

export async function recruiterReviewerNode(state: {
  mapped: MappedCV
  jobDescription: string
  intentSignals?: JDIntentSignal[]
  locale?: string
}): Promise<{ recruiterReview: RecruiterReview }> {
  const jd = parseJobDescription(state.jobDescription)
  const prompt = buildPrompt(state.mapped, jd, state.intentSignals ?? [], state.locale)

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean) as RecruiterResult

    return {
      recruiterReview: {
        narrativeScore: clampScore(parsed.narrativeScore),
        seniorityScore: clampScore(parsed.seniorityScore),
        domainFitScore: clampScore(parsed.domainFitScore),
        notes: Array.isArray(parsed.notes) ? parsed.notes.filter((n) => typeof n === 'string') : [],
      },
    }
  } catch {
    return {
      recruiterReview: { narrativeScore: 50, seniorityScore: 50, domainFitScore: 50, notes: [] },
    }
  }
}
