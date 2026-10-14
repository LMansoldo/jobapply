import { describe, it, expect } from 'vitest'
import { aggregatorNode } from './aggregator'
import type { AiSmellFix, BulletInsight, ComposedKeyword, GapAnalysis, KeywordMatch } from '../../types'

const keywords: ComposedKeyword[] = [
  { term: 'react', tier: 'must-have', variants: [] },
  { term: 'kubernetes', tier: 'must-have', variants: [] },
  { term: 'graphql', tier: 'important', variants: [] },
  { term: 'vue', tier: 'nice-to-have', variants: [] },
]

const matches: KeywordMatch[] = [
  { term: 'react', tier: 'must-have', matched: true, section: 'skills', evidence: '' },
  { term: 'kubernetes', tier: 'must-have', matched: false, section: '', evidence: '' },
  { term: 'graphql', tier: 'important', matched: false, section: '', evidence: '' },
  { term: 'vue', tier: 'nice-to-have', matched: false, section: '', evidence: '' },
]

const gapAnalysis: GapAnalysis = {
  rephraseGaps: [
    { keyword: 'graphql', cvPhrase: 'built API layer', suggestedRewrite: 'Built an API layer with GraphQL' },
  ],
  absentKeywords: ['kubernetes'],
  keywordPhrases: [{ keyword: 'kubernetes', phrases: ['worked with kubernetes'] }],
  removeSuggestions: [{ section: 'skills', item: 'flash', reason: 'irrelevant for this role' }],
}

const breakdown = { factClarity: 80, jdAdherence: 70, humanReadability: 90, prominence: 60, keywordCoverage: 50 }

const insights: BulletInsight[] = [
  { positionIndex: 0, bulletIndex: 0, role: 'Intern', text: 'Responsible for the team', clarity: 20, jdRelevance: 10, issue: 'states no concrete fact', suggestion: 'Coordinated a team of 5' },
  { positionIndex: 1, bulletIndex: 2, role: 'Dev', text: 'Reduced AWS costs by 40% via caching', clarity: 85, jdRelevance: 90 },
]

describe('aggregatorNode', () => {
  it('builds the report with repurposed semanticGaps, rephrase entries and bullet insights', () => {
    const { report } = aggregatorNode({
      universalScore: 62,
      scoreBreakdown: breakdown,
      bulletInsights: insights,
      keywords,
      keywordMatches: matches,
      matchedKeywords: ['react'],
      missingKeywords: ['kubernetes', 'graphql', 'vue'],
      gapAnalysis,
    })

    expect(report.universalScore).toBe(62)
    expect(report.scoreBreakdown).toEqual(breakdown)
    expect(report.bulletInsights).toEqual(insights)
    expect(report.matchedKeywords).toEqual(['react'])
    expect(report.optimalTemplate.keywordsToRephrase).toEqual([
      { from: 'built API layer', to: 'Built an API layer with GraphQL' },
    ])
    expect(report.optimalTemplate.keywordPhrases).toEqual(gapAnalysis.keywordPhrases)
    expect(report.optimalTemplate.keywordsToAdd).toEqual(['kubernetes'])
    expect(report.removeSuggestions).toEqual(gapAnalysis.removeSuggestions)
    expect(report.semanticGaps.some((g) => g.includes('graphql'))).toBe(true)
    expect(report.semanticGaps.some((g) => g.includes('kubernetes'))).toBe(true)
  })

  it('surfaces buried strongest fact and weak bullets before keyword advice', () => {
    const { report } = aggregatorNode({
      scoreBreakdown: breakdown,
      bulletInsights: insights,
      keywords,
      keywordMatches: matches,
      gapAnalysis,
    })

    // strongest fact at p1.b2 (visibility 20) → buried tip comes first
    expect(report.tips[0].priority).toBe('high')
    expect(report.tips[0].tip).toContain('buried')
    // weak bullet surfaces its suggestion
    expect(report.tips.some((t) => t.tip.includes('Coordinated a team of 5'))).toBe(true)
    // keyword advice demoted to medium, after fact advice
    const rephraseIdx = report.tips.findIndex((t) => t.tip.includes('graphql'))
    const buriedIdx = report.tips.findIndex((t) => t.tip.includes('buried'))
    expect(rephraseIdx).toBeGreaterThan(buriedIdx)
    expect(report.tips.find((t) => t.tip.includes('graphql'))?.priority).toBe('medium')
  })

  it('flags missing required sections and undated experience', () => {
    const { report } = aggregatorNode({
      scoreBreakdown: breakdown,
      bulletInsights: insights,
      mapped: {
        sections: { contact: '', summary: '', skills: '', experience: '', education: '', languages: '' },
        entities: {
          jobTitles: [], companies: [], skills: [], techStack: [], softSkills: [],
          dates: [], degrees: [], urls: [],
          experiencePeriods: [{ role: 'Dev', company: 'Acme', period: '' }],
        },
        raw: {},
      },
      keywords,
      keywordMatches: matches,
      gapAnalysis,
    })

    expect(report.tips.filter((t) => t.tip.includes('section'))).toHaveLength(4)
    expect(report.tips.some((t) => t.tip.includes('no dates'))).toBe(true)
  })

  it('surfaces ai-smell fixes as high tips ahead of keyword advice', () => {
    const aiSmellFixes: AiSmellFix[] = [
      { location: 'p0.b0', original: 'Leveraged Kubernetes', rewrite: 'Ran workloads on Kubernetes', issues: ['banned:leveraged'] },
      { location: 'summary', original: 'In conclusion, an engineer', rewrite: '', issues: ['preamble'] },
    ]
    const { report } = aggregatorNode({
      scoreBreakdown: breakdown,
      aiSmellFixes,
      keywords,
      keywordMatches: matches,
      gapAnalysis,
    })
    expect(report.aiSmellFixes).toEqual(aiSmellFixes)
    expect(report.tips[0].priority).toBe('high')
    expect(report.tips[0].tip).toContain('Ran workloads on Kubernetes')
    expect(report.tips.some((t) => t.tip.includes('plain, factual'))).toBe(true)
  })

  it('falls back to empty structures when state is missing', () => {
    const { report } = aggregatorNode({})
    expect(report.universalScore).toBe(0)
    expect(report.scoreBreakdown).toEqual({ factClarity: 0, jdAdherence: 0, humanReadability: 0, prominence: 0, keywordCoverage: 0 })
    expect(report.bulletInsights).toEqual([])
    expect(report.tips).toEqual([])
    expect(report.semanticGaps).toEqual([])
    expect(report.optimalTemplate.keywordsToAdd).toEqual([])
  })
})
