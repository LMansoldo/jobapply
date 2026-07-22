import { describe, it, expect } from 'vitest'
import { renderResume } from './renderer'
import type { ResumeDraft, ResumeSource } from '../../types'

const source: ResumeSource = {
  positions: [
    {
      header: '### Senior Dev | Acme | Remote',
      period: 'Jan 2022 - Present',
      context: 'Led the frontend team across 3 products',
      bullets: ['Reduced load time by 40%', 'Built React library'],
    },
  ],
  educationRaw: '### BSc Computer Science\nUFSP | 2019',
  summaryRaw: 'Senior developer',
  skillsRaw: 'React, TypeScript',
}

const draft: ResumeDraft = {
  summary: 'Senior React and TypeScript developer with 5 years experience',
  skills: [{ category: 'Frontend', items: ['React', 'TypeScript'] }],
  experience: [{
    positionIndex: 0,
    include: true,
    context: 'Led the frontend team across 3 products, improving velocity',
    bullets: [{ sourceIndex: 0, text: 'Reduced load time by 40% via code splitting' }],
  }],
}

describe('renderResume', () => {
  it('renders Objective when jobTitle is provided', () => {
    const output = renderResume(draft, source, 'Senior Frontend Engineer', 'en')
    expect(output).toContain('## Objective')
    expect(output).toContain('Senior Frontend Engineer')
  })

  it('omits Objective when jobTitle is empty', () => {
    const output = renderResume(draft, source, '', 'en')
    expect(output).not.toContain('## Objective')
  })

  it('includes verbatim position header and period', () => {
    const output = renderResume(draft, source, 'Dev', 'en')
    expect(output).toContain('### Senior Dev | Acme | Remote')
    expect(output).toContain('**Jan 2022 - Present**')
  })

  it('context paragraph appears before bullets, with blank line', () => {
    const output = renderResume(draft, source, 'Dev', 'en')
    const ctxIdx = output.indexOf('Led the frontend team')
    const bulletIdx = output.indexOf('- Reduced')
    expect(ctxIdx).toBeLessThan(bulletIdx)
    const between = output.slice(ctxIdx, bulletIdx)
    expect(between).toContain('\n\n')
  })

  it('position with include: false is omitted', () => {
    const d: ResumeDraft = { ...draft, experience: [{ ...draft.experience[0], include: false }] }
    const output = renderResume(d, source, 'Dev', 'en')
    expect(output).not.toContain('Jan 2022 - Present')
  })

  it('educationRaw appears verbatim', () => {
    const output = renderResume(draft, source, 'Dev', 'en')
    expect(output).toContain('BSc Computer Science')
    expect(output).toContain('UFSP | 2019')
  })

  it('pt-BR locale uses Portuguese section labels', () => {
    const output = renderResume(draft, source, 'Dev Sênior', 'pt-BR')
    expect(output).toContain('## Objetivo')
    expect(output).toContain('## Experiência Profissional')
  })

  it('no triple blank lines in output', () => {
    const output = renderResume(draft, source, 'Dev', 'en')
    expect(output).not.toMatch(/\n{3,}/)
  })
})
