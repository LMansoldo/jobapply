export type SuggestionKind = 'replace' | 'remove' | 'insert' | 'comment'

export interface Suggestion {
  id: string
  kind: SuggestionKind
  section?: string
  searchText?: string
  from?: string
  to?: string
  item?: string
  reason?: string
  keyword?: string
  phrases?: string[]
  text?: string
  priority?: string
}
