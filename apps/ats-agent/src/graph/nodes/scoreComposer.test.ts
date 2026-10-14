import { describe, it, expect } from 'vitest'
import { scoreComposerNode, bulletStrength } from './scoreComposer'
import type { BulletInsight, ComposedKeyword, KeywordMatch, MappedCV } from '../../types'

const baseMapped: MappedCV = {
  sections: {
    contact: 'john@example.com',
    summary: 'Senior developer',
    skills: 'React, Node.js',
    experience: 'Built apps. Reduced costs by 40%.',
    education: 'BSc Computer Science',
    languages: 'English: Fluent',
  },
  entities: {
    jobTitles: [], companies: [], skills: [], techStack: [], softSkills: [],
    dates: [], degrees: [], urls: [],
    experiencePeriods: [{ role: 'Dev', company: 'Acme', period: 'Jan 2021 - Present' }],
  },
  raw: {
    experience: [
      {
        highlights: [
          'Reduced AWS costs by 40% via caching',
          'Led team of 5 engineers delivering 12 deploys per week',
        ],
      },
    ],
  },
}

function kw(term: string, tier: ComposedKeyword['tier']): ComposedKeyword {
  return { term, tier, variants: [] }
}

function match(term: string, matched: boolean): KeywordMatch {
  return { term, tier: 'must-have', matched, section: matched ? 'skills' : '', evidence: '' }
}

function insight(overrides: Partial<BulletInsight>): BulletInsight {
  return {
    positionIndex: 0,
    bulletIndex: 0,
    role: 'Dev',
    text: 'Reduced AWS costs by 40% via caching',
    clarity: 80,
    jdRelevance: 80,
    ...overrides,
  }
}

describe('keywordCoverage (informativo)', () => {
  it('is tier-weighted and nice-to-haves never penalize', () => {
    const keywords = [kw('react', 'must-have'), kw('graphql', 'must-have'), kw('vue', 'nice-to-have')]
    const matches = [match('react', true), match('graphql', false), match('vue', false)]
    const { scoreBreakdown } = scoreComposerNode({ mapped: baseMapped, keywords, keywordMatches: matches })
    // 3 matched of 6 weighted → 50
    expect(scoreBreakdown.keywordCoverage).toBe(50)
  })

  it('splits matched/missing keyword lists', () => {
    const keywords = [kw('react', 'must-have'), kw('vue', 'nice-to-have')]
    const matches = [match('react', true), match('vue', false)]
    const { matchedKeywords, missingKeywords } = scoreComposerNode({ mapped: baseMapped, keywords, keywordMatches: matches })
    expect(matchedKeywords).toEqual(['react'])
    expect(missingKeywords).toEqual(['vue'])
  })

  it('empty keyword set yields perfect coverage', () => {
    const { scoreBreakdown } = scoreComposerNode({ mapped: baseMapped, keywords: [], keywordMatches: [] })
    expect(scoreBreakdown.keywordCoverage).toBe(100)
  })
})

describe('keywords não penalizam o score principal', () => {
  it('same insights, different keyword outcomes → same universalScore', () => {
    const insights = [insight({ positionIndex: 0, bulletIndex: 0 }), insight({ positionIndex: 0, bulletIndex: 1 })]
    const full = scoreComposerNode({
      mapped: baseMapped,
      keywords: [kw('react', 'must-have')],
      keywordMatches: [match('react', true)],
      bulletInsights: insights,
    })
    const empty = scoreComposerNode({
      mapped: baseMapped,
      keywords: [kw('react', 'must-have'), kw('graphql', 'must-have'), kw('kubernetes', 'must-have')],
      keywordMatches: [match('react', false), match('graphql', false), match('kubernetes', false)],
      bulletInsights: insights,
    })
    expect(full.universalScore).toBe(empty.universalScore)
    expect(full.scoreBreakdown.keywordCoverage).not.toBe(empty.scoreBreakdown.keywordCoverage)
  })

  it('missing every must-have does not tank the score', () => {
    const insights = [insight({}), insight({ positionIndex: 0, bulletIndex: 1 })]
    const { universalScore } = scoreComposerNode({
      mapped: baseMapped,
      keywords: [kw('react', 'must-have'), kw('graphql', 'must-have')],
      keywordMatches: [match('react', false), match('graphql', false)],
      bulletInsights: insights,
    })
    expect(universalScore).toBeGreaterThan(60)
  })
})

describe('composição 35/30/20/15', () => {
  it('averages insight scores and follows the weights', () => {
    const insights = [
      insight({ positionIndex: 0, bulletIndex: 0, clarity: 80, jdRelevance: 80, text: 'Reduced AWS costs by 40% via caching layer for enterprise clients' }),
      insight({ positionIndex: 0, bulletIndex: 1, clarity: 80, jdRelevance: 80, text: 'Led team of 5 engineers delivering 12 deploys per week' }),
      insight({ positionIndex: 1, bulletIndex: 0, clarity: 80, jdRelevance: 80, text: 'Built internal tooling adopted 20 x across teams' }),
    ]
    const { scoreBreakdown, universalScore } = scoreComposerNode({
      mapped: baseMapped,
      keywords: [],
      keywordMatches: [],
      bulletInsights: insights,
    })
    expect(scoreBreakdown.factClarity).toBe(80)
    expect(scoreBreakdown.jdAdherence).toBe(80)
    // readability: all bullets 6-32 words, no first person, no generic → 100
    expect(scoreBreakdown.humanReadability).toBe(100)
    // prominence: strongest 3 at visibility 100, 50, 50 → 67
    expect(scoreBreakdown.prominence).toBe(67)
    expect(universalScore).toBe(Math.round(0.35 * 80 + 0.3 * 80 + 0.2 * 100 + 0.15 * 67))
  })

  it('prominence rewards strongest facts in F-pattern positions', () => {
    const strongText = 'Reduced AWS costs by 40% via caching'
    const weakText = 'Helped the team with various daily engineering tasks and activities'
    const leading = scoreComposerNode({
      mapped: baseMapped,
      keywords: [],
      keywordMatches: [],
      bulletInsights: [
        insight({ positionIndex: 0, bulletIndex: 0, clarity: 90, jdRelevance: 90, text: strongText }),
        insight({ positionIndex: 0, bulletIndex: 1, clarity: 40, jdRelevance: 40, text: weakText }),
      ],
    })
    const buried = scoreComposerNode({
      mapped: baseMapped,
      keywords: [],
      keywordMatches: [],
      bulletInsights: [
        insight({ positionIndex: 0, bulletIndex: 0, clarity: 40, jdRelevance: 40, text: weakText }),
        insight({ positionIndex: 2, bulletIndex: 3, clarity: 90, jdRelevance: 90, text: strongText }),
      ],
    })
    expect(leading.scoreBreakdown.prominence).toBeGreaterThan(buried.scoreBreakdown.prominence)
  })

  it('readability penalizes long bullets, first person and generic phrases', () => {
    const { scoreBreakdown } = scoreComposerNode({
      mapped: baseMapped,
      keywords: [],
      keywordMatches: [],
      bulletInsights: [
        insight({ text: 'I was responsible for the whole migration strategy of the platform and I worked with many stakeholders across the entire organization to deliver every single phase of the plan on schedule and under budget constraints' }),
      ],
    })
    // long (>32 words) + first person + generic → 100 - 30
    expect(scoreBreakdown.humanReadability).toBe(70)
  })

  it('no bullets: factClarity neutral, jdAdherence falls back to keywordCoverage', () => {
    const { scoreBreakdown } = scoreComposerNode({
      mapped: { ...baseMapped, raw: { experience: [] } },
      keywords: [kw('react', 'must-have'), kw('graphql', 'must-have')],
      keywordMatches: [match('react', true), match('graphql', false)],
      bulletInsights: [],
    })
    expect(scoreBreakdown.factClarity).toBe(50)
    expect(scoreBreakdown.jdAdherence).toBe(50) // coverage 50
    expect(scoreBreakdown.prominence).toBe(0)
  })
})

describe('fallback determinístico (sem bulletInsights — re-score do resume)', () => {
  it('derives insights heuristically from raw.experience', () => {
    const { bulletInsights, scoreBreakdown } = scoreComposerNode({
      mapped: baseMapped,
      keywords: [],
      keywordMatches: [],
    })
    expect(bulletInsights).toHaveLength(2)
    expect(bulletInsights[0].clarity).toBeGreaterThan(0)
    expect(scoreBreakdown.factClarity).toBeGreaterThan(0)
  })

  it('generic phrase scores lower clarity than a metric-backed fact', () => {
    const { bulletInsights } = scoreComposerNode({
      mapped: {
        ...baseMapped,
        raw: {
          experience: [
            { highlights: ['Responsible for the team', 'Reduced load time by 40%'] },
          ],
        } as MappedCV['raw'],
      },
      keywords: [],
      keywordMatches: [],
    })
    expect(bulletInsights[0].clarity).toBeLessThan(bulletInsights[1].clarity)
  })
})

describe('bulletStrength', () => {
  it('ranks metric-backed, relevant facts above the rest', () => {
    const strong = insight({ clarity: 90, jdRelevance: 90, text: 'Cut costs by 40%' })
    const weak = insight({ clarity: 90, jdRelevance: 90, text: 'Cut costs across the board with no measurable outcome' })
    expect(bulletStrength(strong)).toBeGreaterThan(bulletStrength(weak))
  })
})
