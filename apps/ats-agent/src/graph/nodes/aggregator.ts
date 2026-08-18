import type {
  ATSReport, ScoreBreakdown, KeywordPhrase, RemoveSuggestion,
  JDRequirement, RequirementMatch, RecruiterReview,
} from '../../types'

const SECTIONS_ORDER = ['contact', 'objective', 'summary', 'skills', 'expertise', 'experience', 'education', 'languages']

function buildTips(
  requirements: JDRequirement[],
  missingKeywords: string[],
  semanticGaps: string[],
): ATSReport['tips'] {
  const tips: ATSReport['tips'] = []

  const tierByTerm = new Map(requirements.map((r) => [r.term, r.tier]))
  const missingByTier = (tier: JDRequirement['tier']) => missingKeywords.filter((k) => tierByTerm.get(k) === tier)

  const missingMust = missingByTier('must-have')
  const missingImportant = missingByTier('important')
  const missingNice = missingByTier('nice-to-have')

  if (missingMust.length > 0) {
    tips.push({ priority: 'critical', tip: `Missing must-have requirements: ${missingMust.slice(0, 8).join(', ')}` })
  }
  if (missingImportant.length > 0) {
    tips.push({ priority: 'high', tip: `Missing important requirements: ${missingImportant.slice(0, 8).join(', ')}` })
  }
  for (const gap of semanticGaps.slice(0, 5)) {
    tips.push({ priority: 'high', tip: gap })
  }
  if (missingNice.length > 0) {
    tips.push({ priority: 'medium', tip: `Nice-to-haves not shown: ${missingNice.slice(0, 8).join(', ')}` })
  }

  const priority = { critical: 0, high: 1, medium: 2 }
  return tips.sort((a, b) => priority[a.priority] - priority[b.priority])
}

export function aggregatorNode(state: {
  input?: { locale?: string }
  universalScore?: number
  scoreBreakdown?: ScoreBreakdown
  matchedKeywords?: string[]
  missingKeywords?: string[]
  requirements?: JDRequirement[]
  requirementMatches?: RequirementMatch[]
  recruiterReview?: RecruiterReview
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
}): { report: ATSReport } {
  const breakdown = state.scoreBreakdown ?? { keywordCoverage: 0, contentQuality: 0, format: 0 }
  const missingKeywords = state.missingKeywords ?? []
  const matchedKeywords = state.matchedKeywords ?? []
  const requirements = state.requirements ?? []
  const semanticGaps = state.semanticGaps ?? []

  // order keywordsToAdd: must-have, then important, then the rest
  const tierRank: Record<string, number> = { 'must-have': 0, important: 1, 'nice-to-have': 2 }
  const tierByTerm = new Map(requirements.map((r) => [r.term, r.tier]))
  const keywordsToAdd = [...missingKeywords]
    .sort((a, b) => (tierRank[tierByTerm.get(a) ?? 'nice-to-have'] ?? 3) - (tierRank[tierByTerm.get(b) ?? 'nice-to-have'] ?? 3))
    .slice(0, 20)

  const report: ATSReport = {
    universalScore: state.universalScore ?? 0,
    scoreBreakdown: breakdown,
    matchedKeywords,
    missingKeywords,
    semanticGaps,
    optimalTemplate: {
      sectionsOrder: SECTIONS_ORDER,
      keywordsToAdd,
      keywordPhrases: state.keywordPhrases ?? [],
      keywordsToRephrase: state.rephraseSuggestions ?? [],
      formatFixes: [],
    },
    tips: buildTips(requirements, missingKeywords, semanticGaps),
    removeSuggestions: state.removeSuggestions ?? [],
    requirementMatches: state.requirementMatches ?? [],
    recruiterReview: state.recruiterReview,
  }

  return { report }
}
