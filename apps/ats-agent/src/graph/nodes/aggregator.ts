import type { ATSReport, ScoreBreakdown, KeywordPhrase, RemoveSuggestion, WeightedKeyword } from '../../types'

const SECTIONS_ORDER = ['contact', 'objective', 'summary', 'skills', 'expertise', 'experience', 'education', 'languages']

function buildTips(
  missingKeywords: string[],
  weightedKeywords: WeightedKeyword[],
  semanticGaps: string[],
): ATSReport['tips'] {
  const tips: ATSReport['tips'] = []

  const requiredTerms = new Set(weightedKeywords.filter((k) => k.weight === 'required').map((k) => k.term))
  const preferredTerms = new Set(weightedKeywords.filter((k) => k.weight === 'preferred').map((k) => k.term))

  const missingRequired = missingKeywords.filter((k) => requiredTerms.has(k))
  const missingPreferred = missingKeywords.filter((k) => preferredTerms.has(k))

  if (missingRequired.length > 0) {
    tips.push({
      priority: 'critical',
      tip: `Add these required keywords to your CV: ${missingRequired.slice(0, 8).join(', ')}`,
    })
  }

  for (const gap of semanticGaps.slice(0, 5)) {
    tips.push({ priority: 'high', tip: gap })
  }

  if (missingPreferred.length > 0) {
    tips.push({
      priority: 'medium',
      tip: `Consider adding these preferred keywords: ${missingPreferred.slice(0, 8).join(', ')}`,
    })
  }

  const priority = { critical: 0, high: 1, medium: 2 }
  return tips.sort((a, b) => priority[a.priority] - priority[b.priority])
}

export function aggregatorNode(state: {
  input?: { locale?: string }
  scoreBreakdown?: ScoreBreakdown
  matchedKeywords?: string[]
  missingKeywords?: string[]
  weightedKeywords?: WeightedKeyword[]
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
}): { report: ATSReport } {
  const breakdown = state.scoreBreakdown ?? { keywordCoverage: 0, contentQuality: 0, format: 0 }
  const missingKeywords = state.missingKeywords ?? []
  const matchedKeywords = state.matchedKeywords ?? []
  const weightedKeywords = state.weightedKeywords ?? []
  const semanticGaps = state.semanticGaps ?? []

  const universalScore = Math.round(
    0.6 * breakdown.keywordCoverage +
    0.25 * breakdown.contentQuality +
    0.15 * breakdown.format
  )

  const report: ATSReport = {
    universalScore,
    scoreBreakdown: breakdown,
    matchedKeywords,
    missingKeywords,
    semanticGaps,
    optimalTemplate: {
      sectionsOrder: SECTIONS_ORDER,
      keywordsToAdd: missingKeywords.slice(0, 20),
      keywordPhrases: state.keywordPhrases ?? [],
      keywordsToRephrase: state.rephraseSuggestions ?? [],
      formatFixes: [],
    },
    tips: buildTips(missingKeywords, weightedKeywords, semanticGaps),
    removeSuggestions: state.removeSuggestions ?? [],
  }

  return { report }
}
