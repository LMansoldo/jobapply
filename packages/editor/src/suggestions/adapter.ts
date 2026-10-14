import type { EditorKeywords } from '@jobapply/contracts'
import type { Suggestion, SuggestionKind } from './types'

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function makeId(
  kind: SuggestionKind,
  parts: Array<string | undefined>,
): string {
  return [kind, ...parts.map((p) => slug(p ?? '')).filter(Boolean)].join(':')
}

export function buildSuggestions(
  keywords: EditorKeywords | undefined,
): Suggestion[] {
  if (!keywords) return []
  const seen = new Set<string>()
  const out: Suggestion[] = []

  function push(sug: Suggestion, dedupeKey: string) {
    if (seen.has(dedupeKey)) return
    seen.add(dedupeKey)
    out.push(sug)
  }

  for (const { keyword, phrases } of keywords.keywordPhrases ?? []) {
    push(
      {
        id: makeId('insert', [keyword]),
        kind: 'insert',
        keyword,
        phrases,
      },
      `insert:${keyword.toLowerCase().trim()}`,
    )
  }

  for (const keyword of keywords.toAdd ?? []) {
    push(
      {
        id: makeId('insert', [keyword]),
        kind: 'insert',
        keyword,
      },
      `insert:${keyword.toLowerCase().trim()}`,
    )
  }

  for (const { from, to } of keywords.toRephrase ?? []) {
    push(
      {
        id: makeId('replace', [from, to]),
        kind: 'replace',
        searchText: from,
        from,
        to,
      },
      `replace:${from.toLowerCase().trim()}`,
    )
  }

  for (const gap of keywords.semanticGaps ?? []) {
    push(
      {
        id: makeId('comment', [gap]),
        kind: 'comment',
        text: gap,
      },
      `comment:${gap.toLowerCase().trim()}`,
    )
  }

  for (const { priority, tip } of keywords.tips ?? []) {
    push(
      {
        id: makeId('comment', [tip]),
        kind: 'comment',
        text: tip,
        priority,
      },
      `comment:${tip.toLowerCase().trim()}`,
    )
  }

  for (const { section, item, reason } of keywords.removeSuggestions ?? []) {
    push(
      {
        id: makeId('remove', [item, reason]),
        kind: 'remove',
        section,
        item,
        searchText: item,
        reason,
      },
      `remove:${(reason ?? item).toLowerCase().trim()}`,
    )
  }

  return out
}
