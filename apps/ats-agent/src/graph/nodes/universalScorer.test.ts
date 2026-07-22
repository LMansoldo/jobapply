import { describe, it, expect } from 'vitest'
import { universalScorerNode } from './universalScorer'
import type { MappedCV } from '../../types'

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

describe('universalScorerNode', () => {
  it('matches required keyword in experience (weight 2x) and preferred in skills (weight 1x)', () => {
    const result = universalScorerNode({
      mapped: baseMapped,
      weightedKeywords: [
        { term: 'react', weight: 'required' },
        { term: 'python', weight: 'preferred' },
      ],
    })
    expect(result.matchedKeywords).toContain('react')
    expect(result.missingKeywords).toContain('python')
    expect(result.scoreBreakdown.keywordCoverage).toBeGreaterThan(0)
    expect(result.scoreBreakdown.keywordCoverage).toBeLessThan(100)
  })

  it('"java" does not match "javascript"', () => {
    const cv: MappedCV = {
      ...baseMapped,
      sections: { ...baseMapped.sections, experience: 'Works with javascript and java frameworks' },
    }
    const result = universalScorerNode({
      mapped: cv,
      weightedKeywords: [{ term: 'java', weight: 'required' }],
    })
    expect(result.matchedKeywords).toContain('java')
    expect(result.missingKeywords).not.toContain('java')
  })

  it('compound term "design system" matches as phrase', () => {
    const cv: MappedCV = {
      ...baseMapped,
      sections: { ...baseMapped.sections, experience: 'Built a design system for the team' },
    }
    const result = universalScorerNode({
      mapped: cv,
      weightedKeywords: [{ term: 'design system', weight: 'required' }],
    })
    expect(result.matchedKeywords).toContain('design system')
  })

  it('empty weightedKeywords → keywordCoverage = 0', () => {
    const result = universalScorerNode({ mapped: baseMapped, weightedKeywords: [] })
    expect(result.scoreBreakdown.keywordCoverage).toBe(0)
    expect(result.matchedKeywords).toHaveLength(0)
    expect(result.missingKeywords).toHaveLength(0)
  })

  it('cv with no highlights → contentQuality = 50', () => {
    const cv: MappedCV = {
      ...baseMapped,
      raw: { experience: [{ role: 'Dev', company: 'Co', period: '2020', context: 'Did stuff' }] },
    }
    const result = universalScorerNode({ mapped: cv, weightedKeywords: [] })
    expect(result.scoreBreakdown.contentQuality).toBe(50)
  })

  it('missing experience section → format penalised by 15', () => {
    const cv: MappedCV = {
      ...baseMapped,
      sections: { ...baseMapped.sections, experience: '' },
    }
    const result = universalScorerNode({ mapped: cv, weightedKeywords: [] })
    expect(result.scoreBreakdown.format).toBeLessThanOrEqual(85)
  })

  it('experience-section match scores higher than skills-only match', () => {
    const expOnly: MappedCV = {
      ...baseMapped,
      sections: { ...baseMapped.sections, experience: 'typescript developer', skills: '' },
    }
    const skillsOnly: MappedCV = {
      ...baseMapped,
      sections: { ...baseMapped.sections, experience: '', skills: 'typescript' },
    }
    const kw = [{ term: 'typescript', weight: 'required' as const }]
    const rExp = universalScorerNode({ mapped: expOnly, weightedKeywords: kw })
    const rSkills = universalScorerNode({ mapped: skillsOnly, weightedKeywords: kw })
    expect(rExp.scoreBreakdown.keywordCoverage).toBeGreaterThan(rSkills.scoreBreakdown.keywordCoverage)
  })
})
