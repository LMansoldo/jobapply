import { describe, it, expect } from 'vitest'
import { verifyResumeDraft } from './verifier'
import type { ResumeDraft, ResumeSource } from '../../types'

const source: ResumeSource = {
  positions: [
    {
      header: '### Senior Dev | Acme',
      period: 'Jan 2022 - Present',
      context: 'Led the frontend team across 3 products',
      bullets: [
        'Reduced load time by 40% via code splitting',   // [0]
        'Built React component library used by 3 teams', // [1]
        'Mentored 2 junior developers',                  // [2]
      ],
    },
  ],
  educationRaw: '### BSc CS\nUFSP',
  summaryRaw: 'Senior frontend developer with 5 years experience in React and TypeScript',
  skillsRaw: 'React, TypeScript, Node.js',
}

const jd = 'We are looking for a senior React developer with TypeScript experience and team leadership skills.'
const jdKeywords = ['react', 'typescript', 'leadership']

function makeDraft(bullets: Array<{ sourceIndex: number; text: string }>): ResumeDraft {
  return {
    summary: 'Senior React and TypeScript developer with 5 years experience',
    skills: [{ category: 'Frontend', items: ['React', 'TypeScript'] }],
    experience: [{
      positionIndex: 0,
      include: true,
      context: 'Led the frontend team across 3 products, improving developer velocity',
      bullets,
    }],
  }
}

describe('verifyResumeDraft', () => {
  it('legitimate rewrite integrating keyword passes', () => {
    const draft = makeDraft([{ sourceIndex: 0, text: 'Reduced load time by 40% via code splitting, improving React app performance' }])
    const { draft: verified, report } = verifyResumeDraft(draft, source, jd, jdKeywords)
    expect(report.violations).toHaveLength(0)
    expect(verified.experience[0].bullets[0].text).toContain('40%')
  })

  it('metric-dropped: revert to original', () => {
    const draft = makeDraft([{ sourceIndex: 0, text: 'Improved load time via code splitting' }])
    const { draft: verified, report } = verifyResumeDraft(draft, source, jd, jdKeywords)
    expect(report.violations[0]?.rule).toBe('metric-dropped')
    expect(verified.experience[0].bullets[0].text).toBe(source.positions[0].bullets[0])
  })

  it('metric-invented: revert to original', () => {
    const draft = makeDraft([{ sourceIndex: 0, text: 'Reduced load time by 40% and improved conversion by 25%' }])
    const { draft: verified, report } = verifyResumeDraft(draft, source, jd, jdKeywords)
    expect(report.violations[0]?.rule).toBe('metric-invented')
    expect(verified.experience[0].bullets[0].text).toBe(source.positions[0].bullets[0])
  })

  it('low-overlap (Jaccard < 0.2): revert to original', () => {
    const draft = makeDraft([{ sourceIndex: 0, text: 'Completely different unrelated text about marketing campaigns' }])
    const { draft: verified, report } = verifyResumeDraft(draft, source, jd, jdKeywords)
    expect(report.violations[0]?.rule).toBe('low-overlap')
    expect(verified.experience[0].bullets[0].text).toBe(source.positions[0].bullets[0])
  })

  it('jd-contamination: phrase from JD not in CV → revert', () => {
    // "team leadership skills" is in JD but not in original CV bullets
    const draft = makeDraft([{ sourceIndex: 0, text: 'Reduced load time by 40% demonstrating team leadership skills' }])
    const { draft: verified, report } = verifyResumeDraft(draft, source, jd, jdKeywords)
    expect(report.violations[0]?.rule).toBe('jd-contamination')
    expect(verified.experience[0].bullets[0].text).toBe(source.positions[0].bullets[0])
  })

  it('invalid-source: sourceIndex out of range → bullet discarded', () => {
    const draft = makeDraft([{ sourceIndex: 99, text: 'Some bullet' }])
    const { draft: verified, report } = verifyResumeDraft(draft, source, jd, jdKeywords)
    expect(report.violations[0]?.rule).toBe('invalid-source')
    expect(verified.experience[0].bullets).toHaveLength(0)
  })

  it('duplicate sourceIndex: second bullet discarded', () => {
    const draft = makeDraft([
      { sourceIndex: 0, text: 'Reduced load time by 40% via React optimization' },
      { sourceIndex: 0, text: 'Another rewrite of the same bullet' },
    ])
    const { draft: verified, report } = verifyResumeDraft(draft, source, jd, jdKeywords)
    const dupViolation = report.violations.find((v) => v.rule === 'invalid-source')
    expect(dupViolation).toBeDefined()
    expect(verified.experience[0].bullets.length).toBeLessThanOrEqual(1)
  })
})
