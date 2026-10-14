import { describe, it, expect } from 'vitest'
import { parseGapAnalysisResponse } from './gapAdvisor'
import type { ComposedKeyword } from '../../types'

const missing: ComposedKeyword[] = [
  { term: 'design systems', tier: 'must-have', variants: [] },
  { term: 'kubernetes', tier: 'important', variants: [] },
]

describe('parseGapAnalysisResponse', () => {
  it('splits rephrase and absent verdicts', () => {
    const raw = JSON.stringify({
      entries: [
        { keyword: 'design systems', verdict: 'rephrase', cvPhrase: 'built shared component library', suggestedRewrite: 'Built a design system of shared components', phrases: [] },
        { keyword: 'kubernetes', verdict: 'absent', cvPhrase: '', suggestedRewrite: '', phrases: ['worked with kubernetes clusters'] },
      ],
    })
    const result = parseGapAnalysisResponse(raw, missing)
    expect(result.rephraseGaps).toEqual([
      { keyword: 'design systems', cvPhrase: 'built shared component library', suggestedRewrite: 'Built a design system of shared components' },
    ])
    expect(result.absentKeywords).toEqual(['kubernetes'])
    expect(result.keywordPhrases).toEqual([{ keyword: 'kubernetes', phrases: ['worked with kubernetes clusters'] }])
  })

  it('uncovered keywords fall back to absent', () => {
    const raw = JSON.stringify({
      entries: [
        { keyword: 'design systems', verdict: 'rephrase', cvPhrase: 'x', suggestedRewrite: 'y' },
      ],
    })
    expect(parseGapAnalysisResponse(raw, missing).absentKeywords).toEqual(['kubernetes'])
  })

  it('caps phrases and remove suggestions', () => {
    const raw = JSON.stringify({
      entries: [
        { keyword: 'kubernetes', verdict: 'absent', phrases: ['a', 'b', 'c', 'd', 'e'] },
      ],
      removeSuggestions: Array.from({ length: 8 }, (_, i) => ({ section: 'skills', item: `item ${i}`, reason: `reason ${i}` })),
    })
    const result = parseGapAnalysisResponse(raw, missing)
    expect(result.keywordPhrases[0].phrases).toHaveLength(3)
    expect(result.removeSuggestions).toHaveLength(5)
  })

  it('ignores unknown keywords and duplicates', () => {
    const raw = JSON.stringify({
      entries: [
        { keyword: 'not-a-requirement', verdict: 'absent' },
        { keyword: 'kubernetes', verdict: 'absent' },
        { keyword: 'Kubernetes', verdict: 'absent' },
      ],
    })
    const result = parseGapAnalysisResponse(raw, missing)
    expect(result.absentKeywords).toEqual(['kubernetes', 'design systems'])
  })

  it('downgrades fabricated rephrases (shared head + new qualifier) to absent', () => {
    const missing2: ComposedKeyword[] = [{ term: 'visual regression testing', tier: 'important', variants: [] }]
    const raw = JSON.stringify({
      entries: [
        { keyword: 'visual regression testing', verdict: 'rephrase', cvPhrase: 'automated regression testing', suggestedRewrite: 'Added visual regression testing' },
      ],
    })
    const result = parseGapAnalysisResponse(raw, missing2)
    expect(result.rephraseGaps).toEqual([])
    expect(result.absentKeywords).toEqual(['visual regression testing'])
  })

  it('keeps legitimate conceptual rephrases with no shared head', () => {
    const missing2: ComposedKeyword[] = [{ term: 'web application architecture', tier: 'must-have', variants: [] }]
    const raw = JSON.stringify({
      entries: [
        { keyword: 'web application architecture', verdict: 'rephrase', cvPhrase: 'Microservices', suggestedRewrite: 'Designed web application architecture using microservices' },
      ],
    })
    const result = parseGapAnalysisResponse(raw, missing2)
    expect(result.rephraseGaps).toHaveLength(1)
    expect(result.absentKeywords).toEqual([])
  })

  it('throws on malformed JSON', () => {
    expect(() => parseGapAnalysisResponse('garbage', missing)).toThrow()
  })
})
