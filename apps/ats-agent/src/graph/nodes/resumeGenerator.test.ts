import { describe, it, expect } from 'vitest'
import { applyProminenceOrder } from './resumeGenerator'
import type { ComposedKeyword, ResumeDraft } from '../../types'

const keywords: ComposedKeyword[] = [{ term: 'react', tier: 'must-have', variants: [] }]

function draft(bullets: string[]): ResumeDraft {
  return {
    summary: 'Senior developer',
    skills: [{ category: 'Frontend', items: ['React'] }],
    experience: [{
      positionIndex: 0,
      include: true,
      context: 'Led the platform team',
      bullets: bullets.map((text, sourceIndex) => ({ sourceIndex, text })),
    }],
  }
}

describe('applyProminenceOrder', () => {
  it('orders bullets by heuristic strength: strongest fact first', () => {
    const ordered = applyProminenceOrder(draft([
      'Responsible for the team',
      'Reduced AWS costs by 40% using react and caching',
      'Built internal tooling for the platform team',
    ]), keywords)

    expect(ordered.experience[0].bullets.map((b) => b.text)).toEqual([
      'Reduced AWS costs by 40% using react and caching', // metric + keyword → strongest
      'Built internal tooling for the platform team',     // concrete, no metric/keyword
      'Responsible for the team',                         // generic
    ])
  })

  it('keeps sourceIndex binding and original order on ties', () => {
    const ordered = applyProminenceOrder(draft([
      'Shipped the design system for react apps',
      'Shipped the component library for react apps',
    ]), keywords)

    expect(ordered.experience[0].bullets.map((b) => b.sourceIndex)).toEqual([0, 1])
  })
})
