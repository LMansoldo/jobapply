import { describe, expect, it } from 'vitest'
import type { Node as PMNode } from '@tiptap/pm/model'
import { Schema } from '@tiptap/pm/model'
import { buildTextMap, searchTextRanges } from './textSearch'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
    text: { group: 'inline' },
  },
  marks: {
    strong: {},
  },
})

type Part = string | { text: string; bold?: boolean }

function makeDoc(parts: Part[]): PMNode {
  const nodes = parts.map((part) =>
    typeof part === 'string'
      ? schema.text(part)
      : schema.text(
          part.text,
          part.bold ? [schema.marks.strong.create()] : [],
        ),
  )
  return schema.node('doc', null, [schema.node('paragraph', null, nodes)])
}

describe('buildTextMap', () => {
  it('concatenates text nodes with their positions', () => {
    const doc = makeDoc(['Comfortable ', { text: 'across', bold: true }, ' the stack'])
    const map = buildTextMap(doc)
    expect(map.text).toBe('Comfortable across the stack')
    expect(map.segments).toEqual([
      { pos: 1, text: 'Comfortable ' },
      { pos: 13, text: 'across' },
      { pos: 19, text: ' the stack' },
    ])
  })
})

describe('searchTextRanges', () => {
  it('finds a match inside a single text node', () => {
    const doc = makeDoc(['Hello world'])
    const ranges = searchTextRanges(doc, 'world')
    expect(ranges).toEqual([{ from: 7, to: 12 }])
    expect(doc.textBetween(ranges[0].from, ranges[0].to)).toBe('world')
  })

  it('finds a match crossing a bold node (no asterisks)', () => {
    const doc = makeDoc(['Comfortable ', { text: 'across', bold: true }, ' the stack'])
    const ranges = searchTextRanges(doc, 'Comfortable across the stack')
    expect(ranges).toHaveLength(1)
    expect(doc.textBetween(ranges[0].from, ranges[0].to)).toBe(
      'Comfortable across the stack',
    )
  })

  it('finds partial matches crossing 2-3 nodes', () => {
    const doc = makeDoc(['Comfortable ', { text: 'across', bold: true }, ' the stack'])
    const across = searchTextRanges(doc, 'across the')
    expect(doc.textBetween(across[0].from, across[0].to)).toBe('across the')
    const comfortable = searchTextRanges(doc, 'Comfortable across')
    expect(doc.textBetween(comfortable[0].from, comfortable[0].to)).toBe(
      'Comfortable across',
    )
  })

  it('is case-insensitive', () => {
    const doc = makeDoc(['Comfortable Across the stack'])
    const ranges = searchTextRanges(doc, 'comfortable across')
    expect(doc.textBetween(ranges[0].from, ranges[0].to)).toBe(
      'Comfortable Across',
    )
  })

  it('finds multiple occurrences', () => {
    const doc = makeDoc(['Docker e docker e DOCKER hoje'])
    const ranges = searchTextRanges(doc, 'docker')
    expect(ranges).toHaveLength(3)
    expect(doc.textBetween(ranges[0].from, ranges[0].to)).toBe('Docker')
    expect(doc.textBetween(ranges[1].from, ranges[1].to)).toBe('docker')
    expect(doc.textBetween(ranges[2].from, ranges[2].to)).toBe('DOCKER')
  })

  it('matches across a paragraph boundary (concatenated text)', () => {
    const doc = schema.node('doc', null, [
      schema.node('paragraph', null, [schema.text('End of line')]),
      schema.node('paragraph', null, [schema.text('Start here')]),
    ])
    const ranges = searchTextRanges(doc, 'lineStart')
    expect(ranges).toEqual([{ from: 8, to: 19 }])
    expect(doc.textBetween(ranges[0].from, ranges[0].to)).toBe('lineStart')
  })

  it('returns empty for no match', () => {
    const doc = makeDoc(['Hello world'])
    expect(searchTextRanges(doc, 'kubernetes')).toEqual([])
  })

  it('returns empty for empty or whitespace search', () => {
    const doc = makeDoc(['Hello world'])
    expect(searchTextRanges(doc, '')).toEqual([])
    expect(searchTextRanges(doc, '   ')).toEqual([])
  })
})
