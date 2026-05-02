import type { PlatformScore, ATSReport } from '../../types'

const SECTIONS_ORDER = ['contact', 'objective', 'summary', 'skills', 'expertise', 'experience', 'education', 'languages']

function buildTips(platforms: PlatformScore[], semanticGaps: string[]): ATSReport['tips'] {
  const tips: ATSReport['tips'] = []

  // Critical: required keywords missing
  const platformsWithRequired = platforms.filter(p => p.missingRequired.length > 0)
  if (platformsWithRequired.length > 0) {
    const allMissing = [...new Set(platformsWithRequired.flatMap(p => p.missingRequired))]
    tips.push({
      priority: 'critical',
      tip: `Add these required keywords to your CV (missing from at least one platform): ${allMissing.slice(0, 8).join(', ')}`,
      applicableTo: platformsWithRequired.map(p => p.platform),
    })
  }

  // Critical: flags that appear across 3+ platforms
  const allFlags = platforms.flatMap(p => p.flags.map(f => ({ flag: f, platform: p.platform })))
  const flagMap = new Map<string, string[]>()
  for (const { flag, platform } of allFlags) {
    const key = flag.toLowerCase().slice(0, 40)
    const existing = flagMap.get(key) ?? []
    existing.push(platform)
    flagMap.set(key, existing)
  }
  for (const [key, affectedPlatforms] of flagMap) {
    if (affectedPlatforms.length >= 2) {
      const originalFlag = allFlags.find(f => f.flag.toLowerCase().startsWith(key))?.flag ?? key
      tips.push({
        priority: affectedPlatforms.length >= 3 ? 'critical' : 'high',
        tip: originalFlag,
        applicableTo: affectedPlatforms,
      })
    }
  }

  // High: semantic gaps
  for (const gap of semanticGaps.slice(0, 5)) {
    tips.push({
      priority: 'high',
      tip: gap,
      applicableTo: platforms.map(p => p.platform),
    })
  }

  // Medium: preferred keywords missing from multiple platforms
  const allPreferred = [...new Set(platforms.flatMap(p => p.missingPreferred))]
  if (allPreferred.length > 0) {
    tips.push({
      priority: 'medium',
      tip: `Consider adding these preferred/nice-to-have keywords: ${allPreferred.slice(0, 8).join(', ')}`,
      applicableTo: platforms.filter(p => p.missingPreferred.length > 0).map(p => p.platform),
    })
  }

  // Sort: critical → high → medium
  const priority = { critical: 0, high: 1, medium: 2 }
  return tips.sort((a, b) => priority[a.priority] - priority[b.priority])
}

// Platform weights by target market
const WEIGHTS_BR: Record<string, number> = {
  Gupy: 3.0,
  Catho: 1.5,
  Vagas: 1.5,
  Inhire: 1.5,
  Workday: 0.8,
  Greenhouse: 0.8,
  Lever: 0.8,
  iCIMS: 0.8,
}

const WEIGHTS_GLOBAL: Record<string, number> = {
  Workday: 3.0,
  Greenhouse: 2.5,
  Lever: 1.5,
  iCIMS: 1.5,
  Gupy: 0.5,
  Catho: 0.3,
  Vagas: 0.3,
  Inhire: 0.5,
}

function weightedScore(platforms: PlatformScore[], locale?: string): number {
  const weights = locale === 'pt-BR' ? WEIGHTS_BR : WEIGHTS_GLOBAL
  let totalWeight = 0
  let weightedSum = 0
  for (const p of platforms) {
    const w = weights[p.platform] ?? 1.0
    weightedSum += p.score * w
    totalWeight += w
  }
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0
}

export function aggregatorNode(state: {
  input?: { locale?: string }
  platformScores?: PlatformScore[]
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: ATSReport['optimalTemplate']['keywordPhrases']
  removeSuggestions?: ATSReport['removeSuggestions']
}): { report: ATSReport } {
  const platforms = state.platformScores ?? []
  const semanticGaps = state.semanticGaps ?? []

  if (platforms.length === 0) throw new Error('aggregatorNode: no platform scores in state')

  // Single platform: use its score directly (no weighting distortion)
  const universalScore = platforms.length === 1
    ? platforms[0].score
    : weightedScore(platforms, state.input?.locale)

  // Keywords to add: union of missingRequired + missingPreferred across all platforms
  const keywordsToAdd = [...new Set([
    ...platforms.flatMap(p => p.missingRequired),
    ...platforms.flatMap(p => p.missingPreferred),
  ])].slice(0, 20)

  const keywordsToRephrase = state.rephraseSuggestions ?? []

  const formatFixes: string[] = []

  const report: ATSReport = {
    universalScore,
    platforms,
    semanticGaps,
    optimalTemplate: {
      sectionsOrder: SECTIONS_ORDER,
      keywordsToAdd,
      keywordPhrases: state.keywordPhrases ?? [],
      keywordsToRephrase,
      formatFixes,
    },
    tips: buildTips(platforms, semanticGaps),
    removeSuggestions: state.removeSuggestions ?? [],
  }

  return { report }
}
