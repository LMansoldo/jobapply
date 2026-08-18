import type { MappedCV, JDRequirement, RequirementMatch, RecruiterReview, ScoreBreakdown } from '../../types'

// ── content quality + format (deterministic; carried over from universalScorer) ──
const GENERIC_PHRASES = [
  'responsável por', 'auxiliava', 'atuava em', 'trabalhava com', 'participava de',
  'contribuía para', 'ajudava', 'suportava', 'apoiava', 'colaborava',
  'fazia parte', 'desenvolvia atividades', 'executava tarefas',
  'responsible for', 'worked with', 'assisted in',
]
const METRICS_PATTERN = /\d+\s*(%|R\$|\$|reais|mil|milhão|k\b|x\b|vezes|usuários|users|requests|deploys|horas|dias|ms|s\b)/i

function scoreContentQuality(cv: MappedCV): number {
  const highlights = (cv.raw.experience ?? []).flatMap((e) => e.highlights ?? [])
  if (highlights.length === 0) return 50

  let score = 100
  let genericCount = 0
  let metricCount = 0
  for (const h of highlights) {
    if (GENERIC_PHRASES.some((p) => h.toLowerCase().includes(p))) genericCount++
    if (METRICS_PATTERN.test(h)) metricCount++
  }
  score -= Math.min(40, genericCount * 8)
  const metricRatio = metricCount / highlights.length
  if (metricRatio < 0.4) {
    const pctBelow = Math.round((0.4 - metricRatio) * 100)
    score -= Math.min(30, Math.floor(pctBelow / 10) * 5)
  }
  return Math.max(0, score)
}

function scoreFormat(cv: MappedCV): number {
  let score = 100
  const requiredSections: Array<keyof typeof cv.sections> = ['summary', 'skills', 'experience', 'education']
  for (const s of requiredSections) {
    if (!cv.sections[s]?.trim()) score -= 12
  }
  if (cv.entities.experiencePeriods.some((p) => !p.period?.trim())) score -= 10
  return Math.max(0, score)
}

// ── score composition ──────────────────────────────────────────────────────────
const TIER_WEIGHT: Record<JDRequirement['tier'], number> = { 'must-have': 3, important: 2, 'nice-to-have': 0 }
const KIND_RANK: Record<RequirementMatch['kind'], number> = { exact: 3, semantic: 2, transferable: 1, missing: 0 }

// Universal score weights (sum to 1.0); niceToHaveBonus adds up to +5 on top.
const W = { literal: 0.20, semantic: 0.30, recruiter: 0.25, content: 0.10, format: 0.15 }
const NICE_BONUS_CAP = 5

function creditForKind(m: RequirementMatch | undefined): number {
  if (!m) return 0
  if (m.kind === 'exact') return 1
  if (m.kind === 'semantic') return Math.max(0, Math.min(1, m.confidence))
  if (m.kind === 'transferable') return 0.5 * Math.max(0, Math.min(1, m.confidence))
  return 0
}

export function scoreComposerNode(state: {
  mapped: MappedCV
  requirements: JDRequirement[]
  matched: RequirementMatch[]         // exact matches from literalScorer
  semanticMatches: RequirementMatch[] // from semanticMatcher (unmatched resolved)
  literalCoverage: number
  recruiterReview: RecruiterReview
}): {
  scoreBreakdown: ScoreBreakdown
  universalScore: number
  requirementMatches: RequirementMatch[]
  matchedKeywords: string[]
  missingKeywords: string[]
  semanticGaps: string[]
} {
  const { mapped, requirements, matched, semanticMatches, literalCoverage, recruiterReview } = state

  // best match per requirement term (exact beats semantic beats transferable beats missing)
  const bestByTerm = new Map<string, RequirementMatch>()
  for (const m of [...matched, ...semanticMatches]) {
    const cur = bestByTerm.get(m.term)
    if (!cur || KIND_RANK[m.kind] > KIND_RANK[cur.kind]) bestByTerm.set(m.term, m)
  }

  // one RequirementMatch per requirement (synthesize missing where absent)
  const requirementMatches: RequirementMatch[] = requirements.map((req) =>
    bestByTerm.get(req.term) ?? { term: req.term, tier: req.tier, kind: 'missing', confidence: 0, evidence: '' },
  )

  const matchedKeywords: string[] = []
  const missingKeywords: string[] = []
  for (const rm of requirementMatches) {
    if (rm.kind === 'missing') missingKeywords.push(rm.term)
    else matchedKeywords.push(rm.term)
  }

  // semantic coverage over must-have + important, crediting semantic/transferable partially
  let weightedCredit = 0
  let weightedTotal = 0
  for (const req of requirements) {
    const w = TIER_WEIGHT[req.tier]
    if (w === 0) continue
    weightedTotal += w
    weightedCredit += w * creditForKind(bestByTerm.get(req.term))
  }
  const semanticCoverage = weightedTotal === 0 ? 100 : Math.round((weightedCredit / weightedTotal) * 100)

  // nice-to-have bonus: presence only, never penalizes
  const niceReqs = requirements.filter((r) => r.tier === 'nice-to-have')
  const niceMatched = niceReqs.filter((r) => creditForKind(bestByTerm.get(r.term)) > 0).length
  const niceToHaveBonus = niceReqs.length === 0 ? 0 : Math.round((niceMatched / niceReqs.length) * 100)

  const recruiterScore = Math.round(
    0.4 * recruiterReview.narrativeScore + 0.3 * recruiterReview.seniorityScore + 0.3 * recruiterReview.domainFitScore,
  )

  const contentQuality = scoreContentQuality(mapped)
  const format = scoreFormat(mapped)

  const universalScore = Math.min(100, Math.round(
    W.literal * literalCoverage +
    W.semantic * semanticCoverage +
    W.recruiter * recruiterScore +
    W.content * contentQuality +
    W.format * format +
    (niceToHaveBonus / 100) * NICE_BONUS_CAP,
  ))

  const scoreBreakdown: ScoreBreakdown = {
    keywordCoverage: literalCoverage, // legacy mirror for existing consumers
    contentQuality,
    format,
    literalCoverage,
    semanticCoverage,
    niceToHaveBonus,
    recruiterScore,
  }

  // human-readable gaps: unmet must-have/important first, then recruiter observations
  const gapStrings = requirementMatches
    .filter((rm) => rm.kind === 'missing' && rm.tier !== 'nice-to-have')
    .map((rm) => `JD requires "${rm.term}" (${rm.tier}); no evidence found in the CV.`)
  const semanticGaps = [...gapStrings, ...recruiterReview.notes].slice(0, 8)

  return { scoreBreakdown, universalScore, requirementMatches, matchedKeywords, missingKeywords, semanticGaps }
}
