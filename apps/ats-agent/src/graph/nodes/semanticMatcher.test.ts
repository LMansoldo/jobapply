import { describe, it, expect } from 'vitest'
import { anchorEvidence } from './semanticMatcher'
import type { RequirementMatch } from '../../types'

function match(partial: Partial<RequirementMatch>): RequirementMatch {
  return {
    term: 'design systems',
    tier: 'important',
    kind: 'semantic',
    confidence: 0.8,
    evidence: '',
    ...partial,
  }
}

describe('anchorEvidence', () => {
  it('leaves a semantic match unchanged when the evidence is present in the CV', () => {
    const cvText = 'Built a shared Svelte component library replacing Material-UI across 5 teams.'
    const m = match({
      kind: 'semantic',
      evidence: 'Built a shared Svelte component library replacing Material-UI',
    })

    const result = anchorEvidence(m, cvText)

    expect(result).toEqual(m)
  })

  it('downgrades to missing when the evidence is not found in the CV', () => {
    const cvText = 'Built REST APIs with Node.js and Express for the payments team.'
    const m = match({
      kind: 'semantic',
      evidence: 'Led design system rollout across the org',
    })

    const result = anchorEvidence(m, cvText)

    expect(result).toEqual({
      ...m,
      kind: 'missing',
      confidence: 0,
      evidence: '',
    })
  })

  it('anchors correctly across accent and case differences', () => {
    const cvText = 'Bacharelado em Educação Física pela Universidade Federal.'
    const m = match({
      term: 'physical education degree',
      kind: 'transferable',
      evidence: 'BACHARELADO EM educacao fisica',
    })

    const result = anchorEvidence(m, cvText)

    expect(result).toEqual(m)
  })

  it('leaves a missing match unchanged even without evidence', () => {
    const cvText = 'Some CV text.'
    const m = match({ kind: 'missing', confidence: 0, evidence: '' })

    const result = anchorEvidence(m, cvText)

    expect(result).toEqual(m)
  })
})
