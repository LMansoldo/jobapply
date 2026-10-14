import { describe, it, expect } from 'vitest'
import { parseBulletInsightsResponse, heuristicInsight, heuristicInsights, flattenBullets } from './bulletAdvisor'
import type { ComposedKeyword, MappedCV } from '../../types'

const keywords: ComposedKeyword[] = [
  { term: 'kubernetes', tier: 'must-have', variants: [] },
  { term: 'graphql', tier: 'important', variants: [] },
]

const baseMapped: MappedCV = {
  sections: {
    contact: '', summary: '', skills: '', experience: '', education: '', languages: '',
  },
  entities: {
    jobTitles: [], companies: [], skills: [], techStack: [], softSkills: [],
    dates: [], degrees: [], urls: [],
    experiencePeriods: [],
  },
  raw: {
    experience: [
      { role: 'Senior Dev', highlights: ['Reduced AWS costs by 40% via caching', 'Responsible for the team'] },
      { role: 'Intern', highlights: ['  ', 'Migrated 12 services to kubernetes'] },
    ],
  },
}

describe('flattenBullets', () => {
  it('flattens experience highlights skipping empty ones', () => {
    const bullets = flattenBullets(baseMapped)
    expect(bullets).toEqual([
      { positionIndex: 0, bulletIndex: 0, role: 'Senior Dev', text: 'Reduced AWS costs by 40% via caching' },
      { positionIndex: 0, bulletIndex: 1, role: 'Senior Dev', text: 'Responsible for the team' },
      { positionIndex: 1, bulletIndex: 1, role: 'Intern', text: 'Migrated 12 services to kubernetes' },
    ])
  })
})

describe('heuristicInsight', () => {
  it('metric-backed, concrete fact scores high clarity', () => {
    const i = heuristicInsight({ positionIndex: 0, bulletIndex: 0, role: 'Dev', text: 'Reduced AWS costs by 40% via caching' }, keywords)
    expect(i.clarity).toBe(100)
  })

  it('generic responsibility claim scores low clarity', () => {
    const i = heuristicInsight({ positionIndex: 0, bulletIndex: 1, role: 'Dev', text: 'Responsible for the team' }, keywords)
    // generic −45, no metric −20, short −15
    expect(i.clarity).toBe(20)
  })

  it('jdRelevance reflects literal keyword presence, neutral without keywords', () => {
    const hit = heuristicInsight({ positionIndex: 0, bulletIndex: 0, role: 'Dev', text: 'Migrated services to kubernetes clusters' }, keywords)
    expect(hit.jdRelevance).toBe(50)
    const miss = heuristicInsight({ positionIndex: 0, bulletIndex: 0, role: 'Dev', text: 'Reduced AWS costs by 40%' }, keywords)
    expect(miss.jdRelevance).toBe(0)
    const neutral = heuristicInsight({ positionIndex: 0, bulletIndex: 0, role: 'Dev', text: 'Reduced AWS costs by 40%' }, [])
    expect(neutral.jdRelevance).toBe(50)
  })
})

describe('heuristicInsights', () => {
  it('covers every non-empty bullet', () => {
    const insights = heuristicInsights(baseMapped, keywords)
    expect(insights).toHaveLength(3)
    expect(insights.map((i) => [i.positionIndex, i.bulletIndex])).toEqual([[0, 0], [0, 1], [1, 1]])
  })
})

describe('parseBulletInsightsResponse', () => {
  it('maps scores by id, clamps and keeps source-of-truth text/role', () => {
    const bullets = flattenBullets(baseMapped)
    const raw = JSON.stringify({
      bullets: [
        { positionIndex: 0, bulletIndex: 0, clarity: 150, jdRelevance: -5, issue: '  ', suggestion: 'Could mention the caching layer' },
        { positionIndex: 0, bulletIndex: 1, clarity: 30, jdRelevance: 10, issue: 'states no concrete fact', suggestion: 'Led a team of 5 engineers' },
      ],
    })
    const insights = parseBulletInsightsResponse(raw, bullets, keywords)

    expect(insights).toHaveLength(3)
    // out-of-range clamps to 0-100; blank issue dropped; suggestion kept
    expect(insights[0]).toMatchObject({ clarity: 100, jdRelevance: 0, suggestion: 'Could mention the caching layer' })
    expect(insights[0].issue).toBeUndefined()
    expect(insights[0].text).toBe('Reduced AWS costs by 40% via caching')
    expect(insights[1]).toMatchObject({ clarity: 30, jdRelevance: 10, issue: 'states no concrete fact' })
    // uncovered bullet falls back to heuristic
    expect(insights[2]).toEqual(heuristicInsight(bullets[2], keywords))
  })

  it('ignores malformed entries entirely', () => {
    const bullets = flattenBullets(baseMapped)
    const raw = JSON.stringify({
      bullets: [
        { clarity: 80 },
        { positionIndex: 'zero', bulletIndex: 1, clarity: 80 },
      ],
    })
    const insights = parseBulletInsightsResponse(raw, bullets, keywords)
    expect(insights).toEqual(bullets.map((b) => heuristicInsight(b, keywords)))
  })
})
