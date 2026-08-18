import type { MappedCV, JDRequirement, RequirementMatch } from '../../types'

// Sections searched for literal/alias matches. MappedCV has no dedicated
// "objective" section — education stands in for it (mirrors the JD requirement
// wording "summary, objective/education").
const SEARCHABLE_SECTIONS: Array<keyof MappedCV['sections']> = ['experience', 'skills', 'summary', 'education']

const TIER_WEIGHT: Record<JDRequirement['tier'], number> = {
  'must-have': 3,
  important: 2,
  'nice-to-have': 0,
}

function norm(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function matchesWordBoundary(text: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`).test(text)
}

function termMatchesSection(sectionText: string, term: string): boolean {
  const n = norm(sectionText)
  const t = norm(term)
  if (matchesWordBoundary(n, t)) return true
  if (!t.endsWith('s') && matchesWordBoundary(n, t + 's')) return true
  if (!t.endsWith('s') && matchesWordBoundary(n, t + 'es')) return true
  if (t.endsWith('s') && t.length > 3 && matchesWordBoundary(n, t.slice(0, -1))) return true
  return false
}

function findMatch(mapped: MappedCV, req: JDRequirement): { section: string } | null {
  const terms = [req.term, ...req.aliases]
  for (const section of SEARCHABLE_SECTIONS) {
    const text = mapped.sections[section] ?? ''
    for (const term of terms) {
      if (termMatchesSection(text, term)) {
        return { section }
      }
    }
  }
  return null
}

export function literalScorerNode(state: {
  mapped: MappedCV
  requirements: JDRequirement[]
}): { literalCoverage: number; matched: RequirementMatch[]; unmatched: JDRequirement[] } {
  const { mapped, requirements } = state
  const matched: RequirementMatch[] = []
  const unmatched: JDRequirement[] = []

  let weightedMatched = 0
  let weightedTotal = 0

  for (const req of requirements) {
    const weight = TIER_WEIGHT[req.tier]
    weightedTotal += weight

    const hit = findMatch(mapped, req)
    if (hit) {
      // Presence is binary: any section hit counts as a full match — no
      // multiplying by section weight (that was the old deflation bug).
      weightedMatched += weight
      matched.push({
        term: req.term,
        tier: req.tier,
        kind: 'exact',
        confidence: 1,
        evidence: hit.section,
      })
    } else {
      unmatched.push(req)
    }
  }

  const literalCoverage =
    weightedTotal === 0 ? 100 : Math.min(100, Math.max(0, Math.round((weightedMatched / weightedTotal) * 100)))

  return { literalCoverage, matched, unmatched }
}
