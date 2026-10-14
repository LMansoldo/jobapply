import { describe, it, expect } from 'vitest'
import { parseJdChunksResponse } from './jdExtractor'

const valid = JSON.stringify({
  jobTitle: 'Senior Frontend Engineer',
  chunks: [
    { type: 'tool', attr: 'React', tier: 'must-have' },
    { type: 'req', attr: '5+ years of experience', tier: 'must-have' },
    { type: 'domain', attr: 'fintech', tier: 'nice-to-have' },
    { type: 'soft', attr: 'ownership', tier: 'important' },
    { type: 'credential', attr: 'English fluency', tier: 'important' },
    { type: 'skill', attr: 'system design', tier: 'must-have' },
  ],
})

describe('parseJdChunksResponse', () => {
  it('parses a valid response', () => {
    const { jobTitle, chunks } = parseJdChunksResponse(valid)
    expect(jobTitle).toBe('Senior Frontend Engineer')
    expect(chunks).toHaveLength(6)
  })

  it('strips markdown code fences', () => {
    const { jobTitle, chunks } = parseJdChunksResponse('```json\n' + valid + '\n```')
    expect(jobTitle).toBe('Senior Frontend Engineer')
    expect(chunks).toHaveLength(6)
  })

  it('filters invalid types, tiers and attrs', () => {
    const raw = JSON.stringify({
      chunks: [
        { type: 'tool', attr: 'React', tier: 'must-have' },
        { type: 'magic', attr: 'React', tier: 'must-have' },
        { type: 'tool', attr: 'Vue', tier: 'someday' },
        { type: 'tool', attr: '', tier: 'must-have' },
        { type: 'tool', attr: 'x'.repeat(81), tier: 'must-have' },
        { type: 'tool', tier: 'must-have' },
      ],
    })
    expect(parseJdChunksResponse(raw).chunks).toEqual([{ type: 'tool', attr: 'React', tier: 'must-have' }])
  })

  it('deduplicates identical chunks after normalization', () => {
    const raw = JSON.stringify({
      chunks: [
        { type: 'tool', attr: 'Node.js', tier: 'must-have' },
        { type: 'tool', attr: 'node js', tier: 'important' },
      ],
    })
    expect(parseJdChunksResponse(raw).chunks).toHaveLength(1)
  })

  it('tolerates missing jobTitle', () => {
    const raw = JSON.stringify({ chunks: [{ type: 'tool', attr: 'React', tier: 'must-have' }] })
    expect(parseJdChunksResponse(raw).jobTitle).toBe('')
  })

  it('throws on malformed JSON', () => {
    expect(() => parseJdChunksResponse('not json')).toThrow()
  })
})
