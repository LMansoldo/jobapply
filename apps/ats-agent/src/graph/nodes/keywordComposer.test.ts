import { describe, it, expect } from 'vitest'
import { parseComposedKeywordsResponse } from './keywordComposer'

describe('parseComposedKeywordsResponse', () => {
  it('parses valid keywords and normalizes terms', () => {
    const raw = JSON.stringify({
      keywords: [
        { term: 'Node.js', tier: 'must-have', variants: ['nodejs', 'node'] },
        { term: 'REST APIs', tier: 'important', variants: [] },
      ],
    })
    expect(parseComposedKeywordsResponse(raw)).toEqual([
      { term: 'node js', tier: 'must-have', variants: ['nodejs', 'node'] },
      { term: 'rest apis', tier: 'important', variants: [] },
    ])
  })

  it('strips markdown code fences', () => {
    const raw = '```json\n' + JSON.stringify({ keywords: [{ term: 'react', tier: 'must-have', variants: [] }] }) + '\n```'
    expect(parseComposedKeywordsResponse(raw)).toEqual([{ term: 'react', tier: 'must-have', variants: [] }])
  })

  it('filters invalid entries', () => {
    const raw = JSON.stringify({
      keywords: [
        { term: 'react', tier: 'must-have', variants: [] },
        { term: 'react', tier: 'someday', variants: [] },
        { tier: 'must-have', variants: [] },
        { term: '', tier: 'must-have', variants: [] },
        { term: 'x'.repeat(81), tier: 'must-have', variants: [] },
        { term: 'vue', tier: 'nice-to-have', variants: ['vuejs', 42, '', 'x'.repeat(81)] },
      ],
    })
    expect(parseComposedKeywordsResponse(raw)).toEqual([
      { term: 'react', tier: 'must-have', variants: [] },
      { term: 'vue', tier: 'nice-to-have', variants: ['vuejs'] },
    ])
  })

  it('merges duplicate terms instead of dropping', () => {
    const raw = JSON.stringify({
      keywords: [
        { term: 'Docker', tier: 'important', variants: ['docker compose'] },
        { term: 'docker', tier: 'must-have', variants: ['containers'] },
      ],
    })
    // 'docker compose' and 'containers' are distinct concepts — the guard drops them
    expect(parseComposedKeywordsResponse(raw)).toEqual([
      { term: 'docker', tier: 'important', variants: [] },
    ])
  })

  it('throws on malformed JSON', () => {
    expect(() => parseComposedKeywordsResponse('nope')).toThrow()
  })
})

describe('variant guard (isPlausibleVariant via parse)', () => {
  const parseWith = (variants: string[], term = 'continuous integration') =>
    parseComposedKeywordsResponse(JSON.stringify({ keywords: [{ term, tier: 'must-have', variants }] }))[0]?.variants ?? []

  it('accepts abbreviations and initialisms', () => {
    expect(parseWith(['ci/cd', 'CI'])).toEqual(['ci cd', 'ci'])
    expect(parseWith(['d3'], 'data visualization platforms')).toEqual(['d3'])
  })

  it('accepts concatenation and small suffixes', () => {
    expect(parseWith(['nodejs'], 'node js')).toEqual(['nodejs'])
    expect(parseWith(['reactjs', 'reacts'], 'react')).toEqual(['reactjs', 'reacts'])
  })

  it('rejects loose conceptual words that are not surface forms', () => {
    expect(parseWith(['components'], 'componentization')).toEqual([])
    expect(parseWith(['visualizations'], 'data visualization platforms')).toEqual([])
    expect(parseWith(['web'], 'web application architecture')).toEqual([])
    expect(parseWith(['app'], 'web application architecture')).toEqual([])
  })

  it('rejects variants longer than the term token count', () => {
    expect(parseWith(['senior software engineer level'], 'senior level experience')).toEqual([])
  })
})
