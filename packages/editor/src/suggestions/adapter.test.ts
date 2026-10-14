import { describe, expect, it } from 'vitest'
import { buildSuggestions } from './adapter'

describe('buildSuggestions', () => {
  it('returns [] for undefined keywords', () => {
    expect(buildSuggestions(undefined)).toEqual([])
  })

  it('returns [] for empty keywords', () => {
    expect(buildSuggestions({ toAdd: [], toRephrase: [] })).toEqual([])
  })

  it('maps toAdd to insert suggestions with keyword and no searchText', () => {
    const [sug] = buildSuggestions({ toAdd: ['Kubernetes'], toRephrase: [] })
    expect(sug.kind).toBe('insert')
    expect(sug.keyword).toBe('Kubernetes')
    expect(sug.searchText).toBeUndefined()
    expect(sug.phrases).toBeUndefined()
  })

  it('maps toRephrase to replace suggestions with searchText=from', () => {
    const [sug] = buildSuggestions({
      toAdd: [],
      toRephrase: [{ from: 'made apps', to: 'built applications' }],
    })
    expect(sug.kind).toBe('replace')
    expect(sug.searchText).toBe('made apps')
    expect(sug.from).toBe('made apps')
    expect(sug.to).toBe('built applications')
  })

  it('maps keywordPhrases to insert suggestions with phrases', () => {
    const [sug] = buildSuggestions({
      toAdd: [],
      toRephrase: [],
      keywordPhrases: [
        { keyword: 'CI/CD', phrases: ['ci/cd pipelines', 'continuous delivery'] },
      ],
    })
    expect(sug.kind).toBe('insert')
    expect(sug.keyword).toBe('CI/CD')
    expect(sug.phrases).toEqual(['ci/cd pipelines', 'continuous delivery'])
  })

  it('maps semanticGaps to comment suggestions with text', () => {
    const [sug] = buildSuggestions({
      toAdd: [],
      toRephrase: [],
      semanticGaps: ['No metrics for mentoring'],
    })
    expect(sug.kind).toBe('comment')
    expect(sug.text).toBe('No metrics for mentoring')
  })

  it('maps tips to comment suggestions with priority', () => {
    const [sug] = buildSuggestions({
      toAdd: [],
      toRephrase: [],
      tips: [{ priority: 'high', tip: 'Quantify results' }],
    })
    expect(sug.kind).toBe('comment')
    expect(sug.text).toBe('Quantify results')
    expect(sug.priority).toBe('high')
  })

  it('maps removeSuggestions to remove suggestions with section/item/reason', () => {
    const [sug] = buildSuggestions({
      toAdd: [],
      toRephrase: [],
      removeSuggestions: [
        { section: 'Skills', item: 'HTML, CSS', reason: 'Too basic' },
      ],
    })
    expect(sug.kind).toBe('remove')
    expect(sug.section).toBe('Skills')
    expect(sug.item).toBe('HTML, CSS')
    expect(sug.searchText).toBe('HTML, CSS')
    expect(sug.reason).toBe('Too basic')
  })

  it('dedupes rephrase entries with the same from', () => {
    const sugs = buildSuggestions({
      toAdd: [],
      toRephrase: [
        { from: 'made apps', to: 'built applications' },
        { from: 'made apps', to: 'another phrasing' },
      ],
    })
    expect(sugs).toHaveLength(1)
    expect(sugs[0].to).toBe('built applications')
  })

  it('dedupes remove entries with the same reason', () => {
    const sugs = buildSuggestions({
      toAdd: [],
      toRephrase: [],
      removeSuggestions: [
        { section: 'Skills', item: 'HTML', reason: 'Too basic' },
        { section: 'Skills', item: 'CSS', reason: 'Too basic' },
      ],
    })
    expect(sugs).toHaveLength(1)
    expect(sugs[0].item).toBe('HTML')
  })

  it('dedupes insert entries with the same keyword across toAdd and keywordPhrases', () => {
    const sugs = buildSuggestions({
      toAdd: ['Docker'],
      toRephrase: [],
      keywordPhrases: [{ keyword: 'Docker', phrases: ['docker compose'] }],
    })
    expect(sugs).toHaveLength(1)
    expect(sugs[0].phrases).toEqual(['docker compose'])
  })

  it('generates stable ids across calls', () => {
    const keywords = {
      toAdd: ['Docker'],
      toRephrase: [{ from: 'made apps', to: 'built apps' }],
    }
    expect(buildSuggestions(keywords)).toEqual(buildSuggestions(keywords))
  })
})
