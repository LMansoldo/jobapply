import type {
  ATSReport, AiSmellFix, BulletInsight, ChunkTier, ComposedKeyword, GapAnalysis, KeywordMatch, MappedCV, ScoreBreakdown,
} from '../../types'
import { bulletStrength } from './scoreComposer'

const SECTIONS_ORDER = ['contact', 'objective', 'summary', 'skills', 'expertise', 'experience', 'education', 'languages']

const TIER_RANK: Record<ChunkTier, number> = { 'must-have': 0, important: 1, 'nice-to-have': 2 }

function buildSemanticGaps(gapAnalysis: GapAnalysis, keywords: ComposedKeyword[], missingKeywords: string[]): string[] {
  const tierByTerm = new Map(keywords.map((k) => [k.term, k.tier]))

  const gaps: string[] = []
  for (const gap of gapAnalysis.rephraseGaps) {
    gaps.push(`The CV says "${gap.cvPhrase}", which means "${gap.keyword}" — reword it using the JD's exact term.`)
  }
  for (const term of gapAnalysis.absentKeywords) {
    const tier = tierByTerm.get(term)
    if (tier === 'must-have' || tier === 'important') {
      gaps.push(`JD requires "${term}" (${tier}); no evidence found in the CV.`)
    }
  }
  // safety net: keywords not covered by the gap analysis still surface
  for (const term of missingKeywords) {
    const tier = tierByTerm.get(term)
    if ((tier === 'must-have' || tier === 'important') && !gapAnalysis.rephraseGaps.some((g) => g.keyword === term) && !gapAnalysis.absentKeywords.includes(term)) {
      gaps.push(`JD requires "${term}" (${tier}); no evidence found in the CV.`)
    }
  }
  return gaps.slice(0, 12)
}

// onde os olhos batem primeiro: primeiro bullet do cargo mais recente
function visibility(positionIndex: number, bulletIndex: number): number {
  return 100 / (1 + positionIndex + bulletIndex)
}

function buildTips(
  keywords: ComposedKeyword[],
  keywordMatches: KeywordMatch[],
  gapAnalysis: GapAnalysis,
  insights: BulletInsight[],
  breakdown: ScoreBreakdown,
  mapped?: MappedCV,
  aiSmellFixes: AiSmellFix[] = [],
): ATSReport['tips'] {
  const tips: ATSReport['tips'] = []

  // ── fatos e posicionamento primeiro ──
  for (const fix of aiSmellFixes.slice(0, 3)) {
    tips.push({
      priority: 'high',
      tip: fix.rewrite
        ? `Reads as AI-written (${fix.issues.join(', ')}) — use: "${fix.rewrite}"`
        : `Reads as AI-written (${fix.issues.join(', ')}) — rewrite it in plain, factual language.`,
    })
  }

  if (insights.length > 0) {
    const strongest = [...insights].sort((a, b) => bulletStrength(b) - bulletStrength(a))[0]
    const vis = visibility(strongest.positionIndex, strongest.bulletIndex)
    if (vis < 50) {
      tips.push({
        priority: 'high',
        tip: `Your strongest fact ("${strongest.text.slice(0, 80)}${strongest.text.length > 80 ? '…' : ''}") is buried — move it to the first bullet of your most recent role.`,
      })
    }

    const weakClarity = insights
      .filter((i) => i.clarity < 50)
      .sort((a, b) => a.clarity - b.clarity)
      .slice(0, 3)
    for (const i of weakClarity) {
      tips.push({ priority: 'high', tip: i.suggestion ? `Bullet lacks a concrete fact — try: "${i.suggestion}"` : `Bullet of "${i.role || 'a role'}" states no concrete fact — rewrite it as action + result.` })
    }

    if (breakdown.jdAdherence < 50) {
      tips.push({ priority: 'high', tip: 'Most experience bullets prove little of what this job demands — lead with the facts that match the role\'s requirements.' })
    }

    if (mapped) {
      const requiredSections: Array<keyof MappedCV['sections']> = ['summary', 'skills', 'experience', 'education']
      for (const s of requiredSections) {
        if (!mapped.sections[s]?.trim()) tips.push({ priority: 'high', tip: `Add a ${s} section — recruiters and ATS expect it.` })
      }
      if (mapped.entities.experiencePeriods.some((p) => !p.period?.trim())) {
        tips.push({ priority: 'high', tip: 'Some experience entries have no dates — add them, undated roles read as gaps.' })
      }
    }
  }

  // ── keywords como caminho, não como sentença ──
  const missingByTier = (tier: ChunkTier) =>
    keywordMatches.filter((m) => !m.matched && m.tier === tier).map((m) => m.term)

  const missingMust = missingByTier('must-have')
  const missingImportant = missingByTier('important')
  const missingNice = missingByTier('nice-to-have')

  if (missingMust.length > 0) {
    tips.push({ priority: 'high', tip: `Missing must-have requirements: ${missingMust.slice(0, 8).join(', ')}` })
  }
  for (const gap of gapAnalysis.rephraseGaps.slice(0, 5)) {
    tips.push({ priority: 'medium', tip: `The CV expresses "${gap.keyword}" as "${gap.cvPhrase}" — reword it with the JD's exact term.` })
  }
  if (missingImportant.length > 0) {
    tips.push({ priority: 'medium', tip: `Missing important requirements: ${missingImportant.slice(0, 8).join(', ')}` })
  }
  if (missingNice.length > 0) {
    tips.push({ priority: 'medium', tip: `Nice-to-haves not shown: ${missingNice.slice(0, 8).join(', ')}` })
  }

  const priority = { critical: 0, high: 1, medium: 2 }
  return tips.sort((a, b) => priority[a.priority] - priority[b.priority])
}

export function aggregatorNode(state: {
  universalScore?: number
  scoreBreakdown?: ScoreBreakdown
  bulletInsights?: BulletInsight[]
  aiSmellFixes?: AiSmellFix[]
  mapped?: MappedCV
  keywords?: ComposedKeyword[]
  keywordMatches?: KeywordMatch[]
  matchedKeywords?: string[]
  missingKeywords?: string[]
  gapAnalysis?: GapAnalysis
}): { report: ATSReport } {
  const breakdown = state.scoreBreakdown ?? { factClarity: 0, jdAdherence: 0, humanReadability: 0, prominence: 0, keywordCoverage: 0 }
  const insights = state.bulletInsights ?? []
  const aiSmellFixes = state.aiSmellFixes ?? []
  const matchedKeywords = state.matchedKeywords ?? []
  const missingKeywords = state.missingKeywords ?? []
  const keywords = state.keywords ?? []
  const keywordMatches = state.keywordMatches ?? []
  const gapAnalysis = state.gapAnalysis ?? { rephraseGaps: [], absentKeywords: [], keywordPhrases: [], removeSuggestions: [] }

  // keywordsToAdd: truly absent keywords (rephrase gaps go to keywordsToRephrase), tier-sorted
  const keywordsToAdd = [...new Set(gapAnalysis.absentKeywords)]
    .sort((a, b) => (TIER_RANK[keywords.find((k) => k.term === a)?.tier ?? 'nice-to-have']) - (TIER_RANK[keywords.find((k) => k.term === b)?.tier ?? 'nice-to-have']))
    .slice(0, 20)

  const report: ATSReport = {
    universalScore: state.universalScore ?? 0,
    scoreBreakdown: breakdown,
    bulletInsights: insights,
    aiSmellFixes,
    matchedKeywords,
    missingKeywords,
    semanticGaps: buildSemanticGaps(gapAnalysis, keywords, missingKeywords),
    optimalTemplate: {
      sectionsOrder: SECTIONS_ORDER,
      keywordsToAdd,
      keywordPhrases: gapAnalysis.keywordPhrases,
      keywordsToRephrase: gapAnalysis.rephraseGaps.map((g) => ({ from: g.cvPhrase, to: g.suggestedRewrite })),
      formatFixes: [],
    },
    tips: buildTips(keywords, keywordMatches, gapAnalysis, insights, breakdown, state.mapped, aiSmellFixes),
    removeSuggestions: gapAnalysis.removeSuggestions,
  }

  return { report }
}
