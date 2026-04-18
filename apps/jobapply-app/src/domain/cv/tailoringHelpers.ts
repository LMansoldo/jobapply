/**
 * @file tailoringHelpers.ts
 * @description Pure functions for mapping ATSReport → ATSPanel display props and editor data.
 */
import type { ATSReport, ATSTip, RephraseEntry, KeywordPhrase, RemoveSuggestion } from './types'
import type { ATSCategory, ATSKeyword } from '../../design-system/ats/ATSPanel/ATSPanel.types'

export interface ATSPanelData {
  score: number
  categories: ATSCategory[]
  keywords: ATSKeyword[]
  suggestionsCount: number
  projectedScore: number
  scoreDelta: number
}

export interface EditorKeywords {
  toAdd: string[]
  toRephrase: RephraseEntry[]
  keywordPhrases: KeywordPhrase[]
  semanticGaps: string[]
  tips: ATSTip[]
  removeSuggestions: RemoveSuggestion[]
}

const SCORE_GAIN_PER_SUGGESTION = 1.5
const MAX_SCORE = 100
const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

function collectRequiredMissing(report: ATSReport): string[] {
  return report.optimalTemplate?.keywordsToAdd ?? []
}

function collectPreferredMissing(report: ATSReport, requiredMissing: string[]): string[] {
  const requiredSet = new Set(requiredMissing)
  const fromPlatforms = (report.platforms ?? []).flatMap((p) => p.missingPreferred ?? [])
  return [...new Set(fromPlatforms)].filter((k) => !requiredSet.has(k))
}

function buildKeywords(
  jobTags: string[],
  requiredMissing: string[],
  preferredMissing: string[],
): ATSKeyword[] {
  const missingSet = new Set([...requiredMissing, ...preferredMissing])
  const found = jobTags
    .filter((tag) => !missingSet.has(tag))
    .map((keyword): ATSKeyword => ({ keyword, status: 'found' }))
  const weak = preferredMissing.map((keyword): ATSKeyword => ({ keyword, status: 'weak' }))
  const missing = requiredMissing.map((keyword): ATSKeyword => ({ keyword, status: 'missing' }))
  return [...found, ...weak, ...missing]
}

function buildCategories(report: ATSReport): ATSCategory[] {
  return (report.platforms ?? []).map((p) => ({ name: p.platform, value: p.score }))
}

function countSuggestions(report: ATSReport): number {
  const fixes = report.optimalTemplate?.formatFixes ?? []
  const tips = report.tips ?? []
  const rephrase = report.optimalTemplate?.keywordsToRephrase ?? []
  const remove = report.removeSuggestions ?? []
  return fixes.length + tips.length + rephrase.length + remove.length
}

function computeProjectedScore(universalScore: number, suggestionsCount: number): number {
  return Math.min(MAX_SCORE, Math.round(universalScore + suggestionsCount * SCORE_GAIN_PER_SUGGESTION))
}

export function buildSuggestionsList(report: ATSReport): string[] {
  const fixes = report.optimalTemplate?.formatFixes ?? []
  const sortedTips = [...(report.tips ?? [])]
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3))
    .map((t) => t.tip)
  const rephrase = (report.optimalTemplate?.keywordsToRephrase ?? []).map((r) => `↺ "${r.from}" → "${r.to}"`)
  return [...fixes, ...sortedTips, ...rephrase]
}

export function buildEditorKeywords(report: ATSReport): EditorKeywords {
  return {
    toAdd: report.optimalTemplate?.keywordsToAdd ?? [],
    toRephrase: report.optimalTemplate?.keywordsToRephrase ?? [],
    keywordPhrases: report.optimalTemplate?.keywordPhrases ?? [],
    semanticGaps: report.semanticGaps ?? [],
    tips: report.tips ?? [],
    removeSuggestions: report.removeSuggestions ?? [],
  }
}

export function mapATSReportToPanel(report: ATSReport, jobTags: string[]): ATSPanelData {
  const requiredMissing = collectRequiredMissing(report)
  const preferredMissing = collectPreferredMissing(report, requiredMissing)
  const keywords = buildKeywords(jobTags, requiredMissing, preferredMissing)
  const categories = buildCategories(report)
  const suggestionsCount = countSuggestions(report)
  const projectedScore = computeProjectedScore(report.universalScore, suggestionsCount)
  const scoreDelta = projectedScore - report.universalScore

  return {
    score: report.universalScore,
    categories,
    keywords,
    suggestionsCount,
    projectedScore,
    scoreDelta,
  }
}

/**
 * Prepend an Objective/Objetivo section to a markdown CV string if one doesn't exist.
 * Inserts it immediately before ## Resumo / ## Summary, or at the very top if neither exists.
 */
export function prependObjectiveSection(
  markdown: string,
  locale: 'en' | 'pt-BR',
  jobTitle: string,
): string {
  const objectiveRe = /^#{1,2}\s+(Objetivo|Objective)\s*$/im
  if (objectiveRe.test(markdown)) return markdown

  const heading = locale === 'pt-BR' ? '## Objetivo' : '## Objective'
  const content = jobTitle || (locale === 'pt-BR' ? 'Posição desejada' : 'Desired position')

  const summaryRe = /^#{1,2}\s+(Resumo|Summary)\s*$/im
  const summaryMatch = summaryRe.exec(markdown)

  if (summaryMatch) {
    const insertAt = summaryMatch.index
    return `${markdown.slice(0, insertAt)}${heading}\n\n${content}\n\n${markdown.slice(insertAt)}`
  }

  return `${heading}\n\n${content}\n\n${markdown}`
}
