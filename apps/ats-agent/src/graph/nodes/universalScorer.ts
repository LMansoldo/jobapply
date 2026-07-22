import type { MappedCV, WeightedKeyword, ScoreBreakdown } from '../../types'

// Thresholds — named for calibration
const SECTION_WEIGHTS: Record<string, number> = { experience: 1.0, skills: 0.7, summary: 0.4 }
const GENERIC_PHRASES = [
  'responsável por', 'auxiliava', 'atuava em', 'trabalhava com', 'participava de',
  'contribuía para', 'ajudava', 'suportava', 'apoiava', 'colaborava',
  'fazia parte', 'desenvolvia atividades', 'executava tarefas',
  'responsible for', 'worked with', 'assisted in',
]
const METRICS_PATTERN = /\d+\s*(%|R\$|\$|reais|mil|milhão|k\b|x\b|vezes|usuários|users|requests|deploys|horas|dias|ms|s\b)/i

function norm(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
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

function scoreKeywordCoverage(cv: MappedCV, keywords: WeightedKeyword[]): {
  keywordCoverage: number
  matchedKeywords: string[]
  missingKeywords: string[]
} {
  if (keywords.length === 0) return { keywordCoverage: 0, matchedKeywords: [], missingKeywords: [] }

  let weightedMatched = 0
  let weightedTotal = 0
  const matched: string[] = []
  const missing: string[] = []

  for (const kw of keywords) {
    const importanceWeight = kw.weight === 'required' ? 2 : 1
    weightedTotal += importanceWeight

    let bestSectionWeight = 0
    for (const [section, sectionW] of Object.entries(SECTION_WEIGHTS)) {
      const text = cv.sections[section as keyof typeof cv.sections] ?? ''
      if (termMatchesSection(text, kw.term)) {
        bestSectionWeight = Math.max(bestSectionWeight, sectionW)
      }
    }

    if (bestSectionWeight > 0) {
      weightedMatched += importanceWeight * bestSectionWeight
      matched.push(kw.term)
    } else {
      missing.push(kw.term)
    }
  }

  const keywordCoverage = Math.round((weightedMatched / weightedTotal) * 100)
  return { keywordCoverage: Math.min(100, keywordCoverage), matchedKeywords: matched, missingKeywords: missing }
}

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

  // Penalise generic language (cap -40)
  score -= Math.min(40, genericCount * 8)

  // Penalise low metric ratio (cap -30)
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
    if (!cv.sections[s]?.trim()) score -= 15
  }
  if (!/\S+@\S+/.test(cv.sections.contact ?? '')) score -= 15
  if (cv.entities.experiencePeriods.some((p) => !p.period?.trim())) score -= 10
  return Math.max(0, score)
}

export function universalScorerNode(state: {
  mapped: MappedCV
  weightedKeywords: WeightedKeyword[]
}): { scoreBreakdown: ScoreBreakdown; matchedKeywords: string[]; missingKeywords: string[] } {
  const { keywordCoverage, matchedKeywords, missingKeywords } = scoreKeywordCoverage(state.mapped, state.weightedKeywords)
  const contentQuality = scoreContentQuality(state.mapped)
  const format = scoreFormat(state.mapped)
  return {
    scoreBreakdown: { keywordCoverage, contentQuality, format },
    matchedKeywords,
    missingKeywords,
  }
}
