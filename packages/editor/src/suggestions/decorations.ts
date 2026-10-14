import type { Node as PMNode } from '@tiptap/pm/model'
import type { JSONContent } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Transaction } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { EditorView } from '@tiptap/pm/view'
import { markdownToDoc } from '../core/markdown'
import { diffLines } from './lineDiff'
import {
  searchTextRanges,
} from './textSearch'
import type { Suggestion } from './types'

export const suggestionsPluginKey = new PluginKey<SuggestionsPluginState>(
  'suggestions',
)

export type { FoundRange } from './textSearch'

interface FlashEntry {
  id: string
  from: number
  to: number
  cls: string
}

export interface SuggestionsPluginState {
  decorations: DecorationSet
  suggestions: Suggestion[]
  diffBase?: string
  diffVisible: boolean
  flashes: FlashEntry[]
}

type PluginMeta =
  | { type: 'setSuggestions'; suggestions: Suggestion[] }
  | { type: 'addFlash'; id: string; from: number; to: number; cls: string }
  | { type: 'removeFlash'; id: string }
  | { type: 'setDiffBase'; base: string }
  | { type: 'toggleDiff'; visible?: boolean }
  | { type: 'clearDiff' }

export function findRanges(doc: PMNode, searchText: string) {
  return searchTextRanges(doc, searchText)
}

interface DocLine {
  pos: number
  end: number
  text: string
}

function collectDocLines(doc: PMNode): DocLine[] {
  const lines: DocLine[] = []
  doc.forEach((child, offset) => {
    if (child.type.name === 'bulletList' || child.type.name === 'orderedList') {
      child.forEach((item, itemOffset) => {
        const pos = offset + 1 + itemOffset
        lines.push({ pos, end: pos + item.nodeSize, text: item.textContent })
      })
    } else {
      lines.push({ pos: offset, end: offset + child.nodeSize, text: child.textContent })
    }
  })
  return lines
}

function removedWidget(text: string) {
  return () => {
    const el = document.createElement('div')
    el.className = 'rs-diff-removed'
    el.textContent = text
    return el
  }
}

function collectJsonLines(node: JSONContent): string[] {
  if (node.type === 'bulletList' || node.type === 'orderedList') {
    return (node.content ?? []).flatMap((item) => collectJsonLines(item))
  }
  if (node.content?.length) {
    return node.content.flatMap((child) => collectJsonLines(child))
  }
  return [node.text ?? '']
}

function buildDiffDecorations(doc: PMNode, base: string): Decoration[] {
  const currentLines = collectDocLines(doc)
  const baseLines = collectJsonLines(markdownToDoc(base))
  const rows = diffLines(
    baseLines.join('\n'),
    currentLines.map((l) => l.text).join('\n'),
  )
  const decos: Decoration[] = []
  let j = 0
  for (const row of rows) {
    if (row.type === 'same') {
      j += 1
      continue
    }
    if (row.type === 'added') {
      const line = currentLines[j]
      if (line && row.text) {
        decos.push(Decoration.node(line.pos, line.end, { class: 'rs-diff-added' }))
      }
      j += 1
    } else {
      const line = currentLines[j]
      const at = line ? line.pos : doc.content.size
      decos.push(
        Decoration.widget(at, removedWidget(row.text), { side: -1 }),
      )
    }
  }
  return decos
}

function buildDecorations(
  state: SuggestionsPluginState,
  doc: PMNode,
): DecorationSet {
  const decos: Decoration[] = []
  for (const sug of state.suggestions) {
    if (!sug.searchText) continue
    const cls =
      sug.kind === 'remove' ? 'rs-mark-remove' : 'rs-mark-replace'
    for (const r of findRanges(doc, sug.searchText)) {
      decos.push(
        Decoration.inline(
          r.from,
          r.to,
          { class: cls },
          { suggestionId: sug.id },
        ),
      )
    }
  }
  if (state.diffVisible && state.diffBase !== undefined) {
    decos.push(...buildDiffDecorations(doc, state.diffBase))
  }
  for (const f of state.flashes) {
    decos.push(Decoration.inline(f.from, f.to, { class: f.cls }, { flashId: f.id }))
  }
  return DecorationSet.create(doc, decos)
}

function apply(
  tr: Transaction,
  value: SuggestionsPluginState,
): SuggestionsPluginState {
  let next = value
  const meta = tr.getMeta(suggestionsPluginKey) as PluginMeta | undefined
  if (meta) {
    switch (meta.type) {
      case 'setSuggestions':
        next = { ...next, suggestions: meta.suggestions }
        break
      case 'addFlash':
        next = {
          ...next,
          flashes: [...next.flashes, { id: meta.id, from: meta.from, to: meta.to, cls: meta.cls }],
        }
        break
      case 'removeFlash':
        next = { ...next, flashes: next.flashes.filter((f) => f.id !== meta.id) }
        break
      case 'setDiffBase':
        next = { ...next, diffBase: meta.base }
        break
      case 'toggleDiff':
        next = { ...next, diffVisible: meta.visible ?? !next.diffVisible }
        break
      case 'clearDiff':
        next = { ...next, diffBase: undefined, diffVisible: false }
        break
    }
  }
  if (!tr.docChanged && next === value) return value
  return { ...next, decorations: buildDecorations(next, tr.doc) }
}

export function createSuggestionsPlugin(handlers: {
  onSuggestionClick: (id: string, pos: number) => void
}): Plugin<SuggestionsPluginState> {
  return new Plugin<SuggestionsPluginState>({
    key: suggestionsPluginKey,
    state: {
      init: () => ({
        decorations: DecorationSet.empty,
        suggestions: [],
        diffVisible: false,
        flashes: [],
      }),
      apply,
    },
    props: {
      decorations: (state) =>
        suggestionsPluginKey.getState(state)?.decorations,
      handleClick: (view, pos) => {
        const st = suggestionsPluginKey.getState(view.state)
        if (!st) return false
        for (const deco of st.decorations.find(pos, pos + 1)) {
          const id = (deco.spec as { suggestionId?: string }).suggestionId
          if (id) {
            handlers.onSuggestionClick(id, pos)
            return true
          }
        }
        return false
      },
    },
  })
}

function dispatchMeta(view: EditorView, meta: PluginMeta) {
  view.dispatch(view.state.tr.setMeta(suggestionsPluginKey, meta))
}

export function setSuggestions(view: EditorView, suggestions: Suggestion[]) {
  dispatchMeta(view, { type: 'setSuggestions', suggestions })
}

export function flashRange(
  view: EditorView,
  from: number,
  to: number,
  color: 'green' | 'amber',
) {
  const end = Math.min(Math.max(to, from + 1), view.state.doc.content.size)
  const id = `flash-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  dispatchMeta(view, {
    type: 'addFlash',
    id,
    from,
    to: end,
    cls: color === 'green' ? 'rs-flash-green' : 'rs-flash-amber',
  })
  window.setTimeout(() => {
    if (!view.dom.isConnected) return
    dispatchMeta(view, { type: 'removeFlash', id })
  }, 1500)
}

export function setDiffBase(view: EditorView, base: string) {
  dispatchMeta(view, { type: 'setDiffBase', base })
}

export function toggleDiff(view: EditorView, visible?: boolean) {
  dispatchMeta(view, { type: 'toggleDiff', visible })
}

export function clearDiff(view: EditorView) {
  dispatchMeta(view, { type: 'clearDiff' })
}
