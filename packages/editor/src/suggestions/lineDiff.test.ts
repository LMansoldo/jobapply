import { describe, expect, it } from 'vitest'
import { diffLines } from './lineDiff'

describe('diffLines', () => {
  it('returns all same rows for identical strings', () => {
    expect(diffLines('a\nb\nc', 'a\nb\nc')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'same', text: 'b' },
      { type: 'same', text: 'c' },
    ])
  })

  it('marks appended lines as added', () => {
    expect(diffLines('a', 'a\nb')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'added', text: 'b' },
    ])
  })

  it('marks deleted lines as removed', () => {
    expect(diffLines('a\nb\nc', 'a\nc')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'removed', text: 'b' },
      { type: 'same', text: 'c' },
    ])
  })

  it('handles mixed added and removed lines', () => {
    expect(diffLines('a\nold\nb', 'a\nnew\nb\nextra')).toEqual([
      { type: 'same', text: 'a' },
      { type: 'removed', text: 'old' },
      { type: 'added', text: 'new' },
      { type: 'same', text: 'b' },
      { type: 'added', text: 'extra' },
    ])
  })

  it('handles empty base as a single empty removed line', () => {
    expect(diffLines('', 'a\nb')).toEqual([
      { type: 'removed', text: '' },
      { type: 'added', text: 'a' },
      { type: 'added', text: 'b' },
    ])
  })

  it('handles empty current as a single empty added line', () => {
    expect(diffLines('a\nb', '')).toEqual([
      { type: 'removed', text: 'a' },
      { type: 'removed', text: 'b' },
      { type: 'added', text: '' },
    ])
  })

  it('returns a single same row when both strings are empty', () => {
    expect(diffLines('', '')).toEqual([{ type: 'same', text: '' }])
  })

  it('preserves order of interleaved changes', () => {
    const rows = diffLines('h1\npara1\nh2\npara2', 'h1\npara1-editada\nh2\npara2')
    expect(rows.filter((r) => r.type !== 'same')).toEqual([
      { type: 'removed', text: 'para1' },
      { type: 'added', text: 'para1-editada' },
    ])
  })
})
