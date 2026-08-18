import { genAI } from '../../lib/gemini'
import { parseJobDescription } from '../../lib/jd'
import type { JDIntentSignal, JDRequirement } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

function buildPrompt(jd: string): string {
  return `You are an ATS requirements analyst. Extract structured hiring requirements and intent signals from the job description below.

RULES:
- tier taxonomy:
  - "must-have": appears in a mandatory/required section OR stated as a hiring condition (degree, years of experience, "must", "required")
  - "important": emphasized or repeated but not stated as mandatory
  - "nice-to-have": introduced by "ideally", "bonus", "plus", "a plus", or optional tool lists
- CRITICAL alias-collapsing rule: an enumerated "of choice" list like "IDE of choice (Cursor, Windsurf, Claude Code)" becomes ONE requirement (tier "nice-to-have", category "tool") with aliases: ["cursor","windsurf","claude code"] — NOT three separate requirements. Apply the same collapsing to any "e.g. X, Y, Z" enumeration that means "any of".
- aliases: include equivalent or abbreviated forms of the term for literal matching (e.g. term "apache velocity js" → aliases ["velocity", "vlt", "apache velocity"]). Use an empty array if there are none.
- category: one of "skill" | "tool" | "domain" | "credential" | "soft"
- intentSignals: capture phrases that reweight a requirement or area of the job, e.g. "prioritize a solid front-end engineer, not an email developer first" → { "text": "...", "effect": "downweight", "target": "email development" }. Use an empty array if there are none.
- Return 15–25 requirements maximum, each term lowercase
- jobTitle: exact job title as written in the job description

Job Description:
${jd}

Respond ONLY with valid JSON, no markdown, no explanation:
{ "jobTitle": "...", "requirements": [{ "term": "...", "tier": "must-have" | "important" | "nice-to-have", "category": "skill" | "tool" | "domain" | "credential" | "soft", "aliases": ["..."] }], "intentSignals": [{ "text": "...", "effect": "downweight" | "upweight", "target": "..." }] }`
}

const VALID_TIERS = new Set(['must-have', 'important', 'nice-to-have'])
const VALID_CATEGORIES = new Set(['skill', 'tool', 'domain', 'credential', 'soft'])
const VALID_EFFECTS = new Set(['downweight', 'upweight'])

export async function requirementExtractorNode(state: {
  input: { jobDescription: string }
}): Promise<{ requirements: JDRequirement[]; intentSignals: JDIntentSignal[]; jobTitle: string }> {
  const jd = parseJobDescription(state.input.jobDescription)
  const result = await model.generateContent(buildPrompt(jd))
  const raw = result.response.text()

  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean) as {
      jobTitle: string
      requirements: Array<{ term: string; tier: string; category: string; aliases: string[] }>
      intentSignals: Array<{ text: string; effect: string; target: string }>
    }
    if (!parsed.requirements || !Array.isArray(parsed.requirements)) throw new Error('Expected requirements array')

    const requirements: JDRequirement[] = parsed.requirements
      .filter(
        (r) =>
          typeof r.term === 'string' &&
          r.term.length > 0 &&
          VALID_TIERS.has(r.tier) &&
          VALID_CATEGORIES.has(r.category),
      )
      .map((r) => ({
        term: r.term,
        tier: r.tier as JDRequirement['tier'],
        category: r.category as JDRequirement['category'],
        aliases: Array.isArray(r.aliases) ? r.aliases.filter((a) => typeof a === 'string') : [],
      }))

    const intentSignals: JDIntentSignal[] = Array.isArray(parsed.intentSignals)
      ? parsed.intentSignals
          .filter(
            (s) =>
              typeof s.text === 'string' &&
              typeof s.target === 'string' &&
              VALID_EFFECTS.has(s.effect),
          )
          .map((s) => ({
            text: s.text,
            effect: s.effect as JDIntentSignal['effect'],
            target: s.target,
          }))
      : []

    return {
      requirements,
      intentSignals,
      jobTitle: typeof parsed.jobTitle === 'string' ? parsed.jobTitle : '',
    }
  } catch {
    return { requirements: [], intentSignals: [], jobTitle: '' }
  }
}
