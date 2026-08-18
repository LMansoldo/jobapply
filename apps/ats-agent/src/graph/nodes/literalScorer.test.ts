import { describe, it, expect } from 'vitest'
import { literalScorerNode } from './literalScorer'
import type { MappedCV, JDRequirement } from '../../types'

const baseMapped: MappedCV = {
  sections: {
    contact: 'john@example.com',
    summary: 'Senior React developer with TypeScript expertise',
    skills: 'React, TypeScript, Node.js',
    experience: 'Built React apps with TypeScript. Led team of 5 engineers. Reduced load time by 40%.',
    education: 'BSc Computer Science',
    languages: 'English: Fluent',
  },
  entities: {
    jobTitles: ['Senior Frontend Engineer'],
    companies: ['Acme Corp'],
    skills: ['React', 'TypeScript'],
    techStack: ['React', 'TypeScript', 'Node.js'],
    softSkills: ['leadership'],
    dates: ['2021', '2023'],
    degrees: ['BSc Computer Science'],
    urls: [],
    experiencePeriods: [{ role: 'Senior Frontend Engineer', company: 'Acme Corp', period: 'Jan 2021 - Present' }],
  },
  raw: {
    experience: [
      {
        role: 'Senior Frontend Engineer',
        company: 'Acme Corp',
        period: 'Jan 2021 - Present',
        context: 'Led frontend team',
        highlights: [
          'Built React component library used by 3 teams',
          'Reduced load time by 40% via code splitting',
        ],
      },
    ],
  },
}

function req(partial: Partial<JDRequirement> & Pick<JDRequirement, 'term' | 'tier'>): JDRequirement {
  return { category: 'skill', aliases: [], ...partial }
}

describe('literalScorerNode', () => {
  it('CV with all must-haves only in skills (not experience) yields ~100 literalCoverage — deflation bug is gone', () => {
    const cv: MappedCV = {
      ...baseMapped,
      sections: { ...baseMapped.sections, experience: 'Generic responsibilities with no keyword mentions.', skills: 'React, TypeScript, Node.js' },
    }
    const requirements: JDRequirement[] = [
      req({ term: 'react', tier: 'must-have' }),
      req({ term: 'typescript', tier: 'must-have' }),
      req({ term: 'node.js', tier: 'must-have' }),
    ]
    const result = literalScorerNode({ mapped: cv, requirements })
    expect(result.literalCoverage).toBe(100)
    expect(result.unmatched).toHaveLength(0)
  })

  it('a missing nice-to-have does not lower literalCoverage', () => {
    const requirements: JDRequirement[] = [
      req({ term: 'react', tier: 'must-have' }),
      req({ term: 'typescript', tier: 'important' }),
      req({ term: 'graphql', tier: 'nice-to-have' }),
    ]
    const result = literalScorerNode({ mapped: baseMapped, requirements })
    expect(result.literalCoverage).toBe(100)
    expect(result.unmatched.map((r) => r.term)).toContain('graphql')
  })

  it('matches via alias when the literal term is absent from the CV', () => {
    const requirements: JDRequirement[] = [
      req({ term: 'apache velocity js', tier: 'must-have', aliases: ['velocity'] }),
    ]
    const cv: MappedCV = {
      ...baseMapped,
      sections: { ...baseMapped.sections, skills: 'React, TypeScript, Velocity' },
    }
    const result = literalScorerNode({ mapped: cv, requirements })
    expect(result.literalCoverage).toBe(100)
    expect(result.matched).toHaveLength(1)
    expect(result.matched[0].term).toBe('apache velocity js')
    expect(result.unmatched).toHaveLength(0)
  })

  it('a genuinely absent must-have lands in unmatched and lowers coverage', () => {
    const requirements: JDRequirement[] = [
      req({ term: 'react', tier: 'must-have' }),
      req({ term: 'kubernetes', tier: 'must-have' }),
    ]
    const result = literalScorerNode({ mapped: baseMapped, requirements })
    expect(result.unmatched.map((r) => r.term)).toContain('kubernetes')
    expect(result.literalCoverage).toBe(50)
  })

  it('empty requirements → coverage 100, matched [], unmatched []', () => {
    const result = literalScorerNode({ mapped: baseMapped, requirements: [] })
    expect(result.literalCoverage).toBe(100)
    expect(result.matched).toHaveLength(0)
    expect(result.unmatched).toHaveLength(0)
  })
})
