import { hasMetric, heuristicInsights, isGenericPhrase } from './bulletAdvisor'
import type { BulletInsight, ComposedKeyword, KeywordMatch, MappedCV, ScoreBreakdown } from '../../types'

// ── score composition — fatos claros, aderentes à JD, legíveis e bem posicionados ──
// Keywords são um caminho até a análise (gapAdvisor/tips), nunca penalizam o score.
const W = { factClarity: 0.35, jdAdherence: 0.30, readability: 0.20, prominence: 0.15 }

const TIER_WEIGHT: Record<ComposedKeyword['tier'], number> = { 'must-have': 3, important: 2, 'nice-to-have': 0 }

export function keywordCoverageOf(keywords: ComposedKeyword[], keywordMatches: KeywordMatch[]): number {
  const matchedByTerm = new Set(keywordMatches.filter((m) => m.matched).map((m) => m.term))

  let weightedMatched = 0
  let weightedTotal = 0
  for (const kw of keywords) {
    const weight = TIER_WEIGHT[kw.tier]
    if (weight === 0) continue // nice-to-have nunca penaliza
    weightedTotal += weight
    if (matchedByTerm.has(kw.term)) weightedMatched += weight
  }
  // no required keywords at all: fall back to unweighted ratio over ALL keywords
  // (never reward an empty denominator with 100)
  return weightedTotal === 0
    ? (keywords.length === 0 ? 100 : Math.round((matchedByTerm.size / keywords.length) * 100))
    : Math.min(100, Math.max(0, Math.round((weightedMatched / weightedTotal) * 100)))
}

function avg(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length
}

// Força de um feito: clareza + aderência à JD + presença de métrica. Determina
// quais bullets "os olhos" devem encontrar primeiro.
export function bulletStrength(insight: BulletInsight): number {
  return 0.4 * insight.clarity + 0.4 * insight.jdRelevance + 0.2 * (hasMetric(insight.text) ? 100 : 0)
}

// Onde os olhos batem primeiro: primeiro bullet do cargo mais recente, decaindo
// por distância (F-pattern de leitura).
function bulletVisibility(positionIndex: number, bulletIndex: number): number {
  return 100 / (1 + positionIndex + bulletIndex)
}

function scoreProminence(insights: BulletInsight[]): number {
  if (insights.length === 0) return 0
  const strongest = [...insights].sort((a, b) => bulletStrength(b) - bulletStrength(a)).slice(0, 3)
  return Math.min(100, Math.round(avg(strongest.map((i) => bulletVisibility(i.positionIndex, i.bulletIndex)))))
}

// Legibilidade humana: bullets escaneáveis — comprimento saudável, sem primeira
// pessoa, sem frase genérica; summary curto o bastante para ser lido.
function scoreReadability(insights: BulletInsight[], mapped: MappedCV): number {
  if (insights.length === 0) {
    return mapped.sections.experience?.trim() ? 50 : 100
  }

  let penalty = 0
  for (const i of insights) {
    const words = i.text.trim().split(/\s+/).length
    if (words < 6 || words > 32) penalty += 15
    if (/\b(i|me|my|we|our)\b/i.test(i.text)) penalty += 10
    if (isGenericPhrase(i.text)) penalty += 5
  }
  penalty /= insights.length

  const summary = mapped.sections.summary ?? ''
  if (summary.length > 600) penalty += 10

  return Math.min(100, Math.max(0, Math.round(100 - penalty)))
}

export function scoreComposerNode(state: {
  mapped: MappedCV
  keywords: ComposedKeyword[]
  keywordMatches: KeywordMatch[]
  bulletInsights?: BulletInsight[]
}): {
  scoreBreakdown: ScoreBreakdown
  universalScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  bulletInsights: BulletInsight[]
} {
  const { mapped, keywords, keywordMatches } = state
  const insights = state.bulletInsights ?? heuristicInsights(mapped, keywords)

  const keywordCoverage = keywordCoverageOf(keywords, keywordMatches) // informativo

  const factClarity = insights.length === 0 ? 50 : Math.round(avg(insights.map((i) => i.clarity)))
  // sem bullets, o único sinal de aderência disponível é a cobertura literal da JD
  const jdAdherence = insights.length === 0
    ? (keywords.length > 0 ? keywordCoverage : 50)
    : Math.round(avg(insights.map((i) => i.jdRelevance)))
  const humanReadability = scoreReadability(insights, mapped)
  const prominence = scoreProminence(insights)

  const universalScore = Math.min(100, Math.round(
    W.factClarity * factClarity +
    W.jdAdherence * jdAdherence +
    W.readability * humanReadability +
    W.prominence * prominence,
  ))

  const matchedKeywords = keywordMatches.filter((m) => m.matched).map((m) => m.term)
  const missingKeywords = keywordMatches.filter((m) => !m.matched).map((m) => m.term)

  return {
    scoreBreakdown: { factClarity, jdAdherence, humanReadability, prominence, keywordCoverage },
    universalScore,
    matchedKeywords,
    missingKeywords,
    bulletInsights: insights,
  }
}
