import { genAI } from '../../lib/gemini'
import type { MappedCV, JDRequirement, MatchKind, RequirementMatch } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

interface RawMatch {
  term: string
  kind: MatchKind
  confidence: number
  evidence: string
}

interface SemanticMatchResult {
  matches: RawMatch[]
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/**
 * Deterministic anti-hallucination guard: downgrades any non-missing match
 * whose evidence is not a verbatim (accent/case-insensitive) substring of the
 * full CV text to `missing`. Guarantees no semantic/transferable match ever
 * ships without a real anchor in the CV.
 */
export function anchorEvidence(match: RequirementMatch, cvText: string): RequirementMatch {
  if (match.kind === 'missing') return match

  const normalizedEvidence = normalize(match.evidence)
  const normalizedCv = normalize(cvText)

  if (!normalizedEvidence || !normalizedCv.includes(normalizedEvidence)) {
    return { ...match, kind: 'missing', confidence: 0, evidence: '' }
  }

  return match
}

function buildCvText(cv: MappedCV): string {
  return [
    cv.sections.contact,
    cv.sections.summary,
    cv.sections.skills,
    cv.sections.experience,
    cv.sections.education,
    cv.sections.languages,
  ].join('\n')
}

function buildPrompt(cv: MappedCV, unmatched: JDRequirement[]): string {
  const terms = unmatched.map((r) => `- ${r.term}`).join('\n')

  return `<system>
You are a senior technical recruiter evaluating whether a CV demonstrates specific job requirements, even when the exact keyword is absent. Respond ONLY with a valid JSON object — no markdown, no explanation, no preamble.
</system>

<cv>
  <contact>${cv.sections.contact}</contact>
  <summary>${cv.sections.summary}</summary>
  <skills>${cv.sections.skills}</skills>
  <experience>${cv.sections.experience}</experience>
  <education>${cv.sections.education}</education>
  <languages>${cv.sections.languages}</languages>
</cv>

<unmatched_requirements>
${terms}
</unmatched_requirements>

<instructions>
For EACH requirement listed above, decide whether the CV demonstrates it WITHOUT the literal keyword being present anywhere in the CV.

- "semantic": the CV clearly demonstrates the same competency in different words (e.g. "built a shared Svelte component library replacing Material-UI" demonstrates "design systems").
- "transferable": adjacent/related experience that partially transfers, not a direct demonstration.
- "missing": no evidence anywhere in the CV.

The "evidence" field MUST be a verbatim substring copied exactly, character-for-character, from the CV text above when kind is "semantic" or "transferable". Use an empty string "" when kind is "missing". Do NOT paraphrase, translate, or invent evidence — copy it exactly as it appears in the CV, or the match will be discarded.
</instructions>

Respond with this exact JSON shape:
{
  "matches": [
    { "term": "string", "kind": "semantic" | "transferable" | "missing", "confidence": 0.0, "evidence": "string" }
  ]
}`
}

export async function semanticMatcherNode(state: {
  mapped: MappedCV
  unmatched: JDRequirement[]
}): Promise<{ semanticMatches: RequirementMatch[] }> {
  if (state.unmatched.length === 0) return { semanticMatches: [] }

  const cvText = buildCvText(state.mapped)
  const prompt = buildPrompt(state.mapped, state.unmatched)

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  let parsed: SemanticMatchResult
  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    parsed = JSON.parse(clean) as SemanticMatchResult
  } catch {
    return { semanticMatches: [] }
  }

  const tierByTerm = new Map(state.unmatched.map((r) => [r.term, r.tier]))

  const matches: RequirementMatch[] = (parsed.matches ?? [])
    .filter((m) => tierByTerm.has(m.term))
    .map((m) => anchorEvidence(
      {
        term: m.term,
        tier: tierByTerm.get(m.term)!,
        kind: m.kind,
        confidence: m.confidence,
        evidence: m.evidence,
      },
      cvText,
    ))

  return { semanticMatches: matches }
}
