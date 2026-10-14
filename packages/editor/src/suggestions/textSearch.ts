import type { Node as PMNode } from '@tiptap/pm/model'

export interface TextSegment {
  pos: number
  text: string
}

export interface TextMap {
  text: string
  segments: TextSegment[]
}

export interface FoundRange {
  from: number
  to: number
}

export function buildTextMap(doc: PMNode): TextMap {
  const segments: TextSegment[] = []
  let text = ''
  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return
    segments.push({ pos, text: node.text })
    text += node.text
  })
  return { text, segments }
}

function locate(segments: TextSegment[], offset: number): number | null {
  let start = 0
  for (const seg of segments) {
    const end = start + seg.text.length
    if (offset < end) return seg.pos + (offset - start)
    start = end
  }
  return null
}

export function searchTextRanges(doc: PMNode, search: string): FoundRange[] {
  const needle = search.trim().toLowerCase()
  if (!needle) return []
  const { text, segments } = buildTextMap(doc)
  const haystack = text.toLowerCase()
  const ranges: FoundRange[] = []
  let idx = haystack.indexOf(needle)
  while (idx !== -1) {
    const from = locate(segments, idx)
    const to = locate(segments, idx + needle.length - 1)
    if (from !== null && to !== null) {
      ranges.push({ from, to: to + 1 })
    }
    idx = haystack.indexOf(needle, idx + needle.length)
  }
  return ranges
}
