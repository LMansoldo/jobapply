import { describe, it, expect } from 'vitest'
import { booleanMatcherNode } from './booleanMatcher'
import type { ComposedKeyword, MappedCV } from '../../types'

const baseMapped: MappedCV = {
  sections: {
    contact: 'john@example.com',
    summary: 'Senior React developer with TypeScript expertise',
    skills: 'React, TypeScript, Node.js, Postgres',
    experience: 'Built React apps. Reduced AWS costs by 40%. Led team of 5 engineers.',
    education: 'BSc Computer Science',
    languages: 'English: Fluent, Portuguese: Native',
  },
  entities: {
    jobTitles: [], companies: [], skills: [], techStack: [], softSkills: [],
    dates: [], degrees: [], urls: [], experiencePeriods: [],
  },
  raw: {},
}

function kw(term: string, tier: ComposedKeyword['tier'] = 'must-have', variants: string[] = []): ComposedKeyword {
  return { term, tier, variants }
}

describe('booleanMatcherNode', () => {
  it('matches exact terms case-insensitively and reports the section', () => {
    const { keywordMatches } = booleanMatcherNode({ mapped: baseMapped, keywords: [kw('typescript'), kw('postgres')] })
    expect(keywordMatches).toEqual([
      { term: 'typescript', tier: 'must-have', matched: true, section: 'skills', evidence: expect.any(String) },
      { term: 'postgres', tier: 'must-have', matched: true, section: 'skills', evidence: expect.any(String) },
    ])
  })

  it('matches through punctuation differences (Node.js term vs "Node.js" text)', () => {
    const { keywordMatches } = booleanMatcherNode({ mapped: baseMapped, keywords: [kw('node js')] })
    expect(keywordMatches[0].matched).toBe(true)
    expect(keywordMatches[0].section).toBe('skills')
  })

  it('matches via variants', () => {
    const { keywordMatches } = booleanMatcherNode({ mapped: baseMapped, keywords: [kw('amazon web services', 'must-have', ['aws'])] })
    expect(keywordMatches[0].matched).toBe(true)
    expect(keywordMatches[0].section).toBe('experience')
  })

  it('matches singular/plural forms', () => {
    const cv: MappedCV = { ...baseMapped, sections: { ...baseMapped.sections, skills: 'rest apis, graphql' } }
    const { keywordMatches } = booleanMatcherNode({ mapped: cv, keywords: [kw('rest api')] })
    expect(keywordMatches[0].matched).toBe(true)
  })

  it('does not match substrings inside words', () => {
    const { keywordMatches } = booleanMatcherNode({ mapped: baseMapped, keywords: [kw('go'), kw('java')] })
    expect(keywordMatches.every((m) => !m.matched)).toBe(true)
  })

  it('reports unmatched keywords with empty section', () => {
    const { keywordMatches } = booleanMatcherNode({ mapped: baseMapped, keywords: [kw('kubernetes')] })
    expect(keywordMatches[0]).toEqual({ term: 'kubernetes', tier: 'must-have', matched: false, section: '', evidence: '' })
  })

  it('evidence captures the surrounding normalized text', () => {
    const { keywordMatches } = booleanMatcherNode({
      mapped: { ...baseMapped, sections: { ...baseMapped.sections, experience: 'cut AWS spend by 40% using lambda and docker' } },
      keywords: [kw('docker')],
    })
    expect(keywordMatches[0].matched).toBe(true)
    expect(keywordMatches[0].evidence).toContain('docker')
  })
})
