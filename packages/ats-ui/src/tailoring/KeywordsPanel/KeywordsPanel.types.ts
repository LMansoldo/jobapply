export interface EditorKeywords {
  toAdd: string[]
  toRephrase: Array<{ from: string; to: string }>
}

export interface KeywordsPanelProps {
  /** Keywords data */
  editorKeywords?: EditorKeywords
  /** Callback to insert a keyword */
  onInsertKeyword: (keyword: string) => void
  /** Callback to replace a keyword */
  onReplaceKeyword: (from: string, to: string) => void
  /** Callback to make a new request with updated CV */
  onNewRequest?: () => void
  /** Whether new request button should be shown */
  showNewRequestButton?: boolean
}

export interface KeywordItemProps {
  keyword: string
  type: 'add' | 'rephrase'
  onClick: () => void
  title?: string
}