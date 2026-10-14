import { describe, it, expect } from 'vitest'
import { parseCvChunksResponse } from './cvExtractor'

describe('parseCvChunksResponse', () => {
  it('parses a valid response', () => {
    const raw = JSON.stringify({
      chunks: [
        { type: 'tool', attr: 'AWS', section: 'experience' },
        { type: 'credential', attr: 'BSc Computer Science', section: 'education' },
        { type: 'soft', attr: 'ownership', section: 'summary' },
      ],
    })
    expect(parseCvChunksResponse(raw)).toEqual([
      { type: 'tool', attr: 'AWS', section: 'experience' },
      { type: 'credential', attr: 'BSc Computer Science', section: 'education' },
      { type: 'soft', attr: 'ownership', section: 'summary' },
    ])
  })

  it('filters invalid sections and types', () => {
    const raw = JSON.stringify({
      chunks: [
        { type: 'tool', attr: 'AWS', section: 'contact' },
        { type: 'magic', attr: 'AWS', section: 'skills' },
        { type: 'tool', attr: 'Docker', section: 'skills' },
      ],
    })
    expect(parseCvChunksResponse(raw)).toEqual([{ type: 'tool', attr: 'Docker', section: 'skills' }])
  })

  it('deduplicates identical chunks after normalization', () => {
    const raw = JSON.stringify({
      chunks: [
        { type: 'tool', attr: 'React', section: 'skills' },
        { type: 'tool', attr: '  react ', section: 'experience' },
      ],
    })
    expect(parseCvChunksResponse(raw)).toHaveLength(1)
  })
})
