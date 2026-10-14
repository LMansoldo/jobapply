import { flattenExtensions } from '@tiptap/core'
import type { JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { MarkdownManager } from '@tiptap/markdown'

export function buildStarterKit() {
  return StarterKit.configure({ heading: { levels: [1, 2, 3] } })
}

export const markdownManager = new MarkdownManager({
  extensions: flattenExtensions([buildStarterKit()]),
  markedOptions: { gfm: false },
})

export function markdownToDoc(md: string): JSONContent {
  return markdownManager.parse(md)
}

export function docToMarkdown(doc: JSONContent): string {
  return markdownManager.serialize(doc)
}

function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
}

function unescapeMarkdownSyntax(text: string): string {
  return text.replace(/\\([\\`*_[\]~])/g, '$1')
}

function toDashBullets(text: string): string {
  return text.replace(/^(\s*)[*+](\s)/gm, '$1-$2')
}

function trimTrailingWhitespace(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
}

function clearBlankOnlyEntityLines(text: string): string {
  return text
    .split('\n')
    .map((line) => (/^[ \t]*(?:&nbsp;|\u00A0)[ \t]*$/.test(line) ? '' : line))
    .join('\n')
}

function collapseBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n')
}

type ListMarkerClass = 'bullet' | 'ordered'

function listMarkerClass(line: string): ListMarkerClass | null {
  if (/^\s*-\s/.test(line)) return 'bullet'
  if (/^\s*\d+[.)]\s/.test(line)) return 'ordered'
  return null
}

function indentOf(line: string): number {
  const match = line.match(/^[ \t]*/)
  return match ? match[0].length : 0
}

function belongsToSameList(prev: string, next: string): boolean {
  const prevClass = listMarkerClass(prev)
  const nextClass = listMarkerClass(next)
  if (!prevClass || !nextClass) return false
  if (prevClass === nextClass) return true
  return indentOf(prev) > 0 && indentOf(next) === 0
}

function tightenLists(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const isBlank = line.trim() === ''
    const prev = result.length > 0 ? result[result.length - 1] : ''
    const next = lines[i + 1]
    if (isBlank && belongsToSameList(prev, next ?? '')) {
      continue
    }
    result.push(line)
  }
  return result.join('\n')
}

function padListStarts(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const prev = result.length > 0 ? result[result.length - 1] : ''
    if (
      listMarkerClass(line) !== null &&
      result.length > 0 &&
      prev.trim() !== '' &&
      listMarkerClass(prev) === null
    ) {
      result.push('')
    }
    result.push(line)
  }
  return result.join('\n')
}

function padHeadings(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (/^#{1,6}\s/.test(line)) {
      if (result.length > 0 && result[result.length - 1].trim() !== '') {
        result.push('')
      }
      result.push(line)
      const next = lines[i + 1]
      if (typeof next === 'string' && next.trim() !== '') {
        result.push('')
      }
      continue
    }
    result.push(line)
  }
  return result.join('\n')
}

function ensureFinalNewline(text: string): string {
  if (text.trim() === '') return ''
  return text.replace(/\n+$/, '') + '\n'
}

export function normalize(md: string): string {
  let text = md.replace(/\r\n?/g, '\n')
  text = decodeEntities(text)
  text = toDashBullets(text)
  text = unescapeMarkdownSyntax(text)
  text = trimTrailingWhitespace(text)
  text = clearBlankOnlyEntityLines(text)
  text = collapseBlankLines(text)
  text = tightenLists(text)
  text = padListStarts(text)
  text = padHeadings(text)
  return ensureFinalNewline(text)
}
