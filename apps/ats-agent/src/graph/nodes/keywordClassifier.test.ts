import { describe, it, expect } from 'vitest'
import { parseKeywordVerdictsResponse, applyKeywordVerdicts, mergeOrGroups } from './keywordClassifier'
import type { ComposedKeyword, JdChunkInput } from '../../types'

const keywords: ComposedKeyword[] = [
  { term: 'react', tier: 'must-have', variants: ['next js'] },
  { term: 'next js', tier: 'must-have', variants: ['nextjs'] },
  { term: 'angular', tier: 'must-have', variants: [] },
  { term: 'vue', tier: 'must-have', variants: [] },
  { term: 'gitlab ci cd pipelines', tier: 'must-have', variants: ['ci cd pipelines'] },
  { term: 'english c1', tier: 'must-have', variants: [] },
]

describe('parseKeywordVerdictsResponse', () => {
  it('parses valid verdicts', () => {
    const raw = JSON.stringify({
      verdicts: [
        { term: 'angular', action: 'merge_into', mergeInto: 'react' },
        { term: 'vue', action: 'merge_into', mergeInto: 'react' },
        { term: 'gitlab ci cd pipelines', action: 'strip_variant', stripVariants: ['ci cd pipelines'] },
        { term: 'english c1', action: 'reclassify', keywordClass: 'credential' },
      ],
    })
    const verdicts = parseKeywordVerdictsResponse(raw)
    expect(verdicts).toHaveLength(4)
    expect(verdicts[0]).toMatchObject({ term: 'angular', action: 'merge_into', mergeInto: 'react' })
  })

  it('filters invalid actions, terms and classes', () => {
    const raw = JSON.stringify({
      verdicts: [
        { term: 'react', action: 'explode' },
        { action: 'keep' },
        { term: '', action: 'keep' },
        { term: 'english c1', action: 'reclassify', keywordClass: 'magic' },
      ],
    })
    expect(parseKeywordVerdictsResponse(raw)).toEqual([
      { term: 'english c1', action: 'reclassify', mergeInto: undefined, stripVariants: undefined, keywordClass: undefined },
    ])
  })

  it('throws on malformed JSON', () => {
    expect(() => parseKeywordVerdictsResponse('nope')).toThrow()
  })
})

describe('applyKeywordVerdicts', () => {
  it('merges OR alternatives into variants of the target keyword', () => {
    const verdicts = parseKeywordVerdictsResponse(JSON.stringify({
      verdicts: [
        { term: 'next js', action: 'merge_into', mergeInto: 'react' },
        { term: 'angular', action: 'merge_into', mergeInto: 'react' },
        { term: 'vue', action: 'merge_into', mergeInto: 'react' },
      ],
    }))
    const result = applyKeywordVerdicts(keywords, verdicts)
    expect(result.map((k) => k.term)).toEqual(['react', 'gitlab ci cd pipelines', 'english c1'])
    const react = result[0]
    expect(react.variants).toEqual(expect.arrayContaining(['next js', 'nextjs', 'angular', 'vue']))
  })

  it('strips variants that swallow the differentiating token', () => {
    const verdicts = parseKeywordVerdictsResponse(JSON.stringify({
      verdicts: [{ term: 'gitlab ci cd pipelines', action: 'strip_variant', stripVariants: ['ci cd pipelines'] }],
    }))
    const result = applyKeywordVerdicts(keywords, verdicts)
    expect(result.find((k) => k.term === 'gitlab ci cd pipelines')?.variants).toEqual([])
  })

  it('applies keywordClass via reclassify and keep', () => {
    const verdicts = parseKeywordVerdictsResponse(JSON.stringify({
      verdicts: [
        { term: 'english c1', action: 'reclassify', keywordClass: 'credential' },
        { term: 'react', action: 'keep', keywordClass: 'skill' },
      ],
    }))
    const result = applyKeywordVerdicts(keywords, verdicts)
    expect(result.find((k) => k.term === 'english c1')?.keywordClass).toBe('credential')
    expect(result.find((k) => k.term === 'react')?.keywordClass).toBe('skill')
  })

  it('ignores verdicts for unknown terms and self-merges', () => {
    const verdicts = parseKeywordVerdictsResponse(JSON.stringify({
      verdicts: [
        { term: 'nonexistent', action: 'strip_variant', stripVariants: ['x'] },
        { term: 'react', action: 'merge_into', mergeInto: 'react' },
      ],
    }))
    const result = applyKeywordVerdicts(keywords, verdicts)
    expect(result.map((k) => k.term)).toEqual(keywords.map((k) => k.term))
  })

  it('returns keywords untouched on empty verdicts', () => {
    expect(applyKeywordVerdicts(keywords, [])).toEqual(keywords)
  })
})

describe('deterministic OR-group merge', () => {
  const orChunks: JdChunkInput[] = [
    { type: 'skill', attr: 'React, Next.js, Angular, or Vue', tier: 'must-have' },
    { type: 'tool', attr: 'Jest or Vitest', tier: 'must-have' },
  ]
  const kws: ComposedKeyword[] = [
    { term: 'react', tier: 'must-have', variants: ['nextjs'] },
    { term: 'next js', tier: 'must-have', variants: [] },
    { term: 'angular', tier: 'must-have', variants: [] },
    { term: 'vue', tier: 'must-have', variants: [] },
    { term: 'kubernetes', tier: 'nice-to-have', variants: [] },
  ]

  it('merges keywords contained in an either-or atom into the first (JD order)', () => {
    const merged = mergeOrGroups(kws, orChunks)
    expect(merged.map((k) => k.term)).toEqual(['react', 'kubernetes'])
    expect(merged[0].variants).toEqual(expect.arrayContaining(['next js', 'angular', 'vue', 'nextjs']))
  })

  it('keeps keywords not present in any or-atom untouched', () => {
    const merged = mergeOrGroups(kws, orChunks)
    expect(merged.find((k) => k.term === 'kubernetes')).toEqual({ term: 'kubernetes', tier: 'nice-to-have', variants: [] })
  })

  it('does nothing without or-atoms', () => {
    const noOr: JdChunkInput[] = [{ type: 'tool', attr: 'React', tier: 'must-have' }]
    expect(mergeOrGroups(kws, noOr)).toEqual(kws)
  })

  it('ignores atoms where only one keyword appears', () => {
    const single: JdChunkInput[] = [{ type: 'tool', attr: 'react or preact', tier: 'must-have' }]
    const merged = mergeOrGroups([{ term: 'react', tier: 'must-have', variants: [] }], single)
    expect(merged).toEqual([{ term: 'react', tier: 'must-have', variants: [] }])
  })
})
