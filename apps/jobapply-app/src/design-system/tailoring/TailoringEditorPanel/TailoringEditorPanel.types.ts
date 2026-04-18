import type { KeywordPhrase, ATSTip, RemoveSuggestion } from '../../../domain/cv/types'
export type { KeywordPhrase, ATSTip, RemoveSuggestion }

export interface EditorKeywords {
  toAdd: string[]
  toRephrase: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  semanticGaps?: string[]
  tips?: ATSTip[]
  removeSuggestions?: RemoveSuggestion[]
}

export interface TailoringEditorPanelProps {
  value: string
  onChange: (v: string) => void
  locale?: 'pt-BR' | 'en'
  editorKeywords?: EditorKeywords
  onInsertKeyword?: (keyword: string) => void
  onReplaceKeyword?: (from: string, to: string) => void
  /** Show red notification dot when there's analysis or reanalysis */
  hasAnalysisNotification?: boolean
  /** Job title for adding objective section */
  jobTitle?: string
  /** Trigger a new ATS analysis run */
  onReanalyze?: () => void
  /** True while an ATS analysis is in progress — disables the reanalyze menu item */
  reanalyzeLoading?: boolean
  onDownloadPDF?: () => void | Promise<void>
  onExportMarkdown?: () => void
  onSaveAsVersion?: () => void
}

export interface TailoringEditorHandle {
  /** Insert text at the current cursor position and flash green */
  insertAtCursor: (text: string) => void
  /** Find `from` in the document, replace with `to`, scroll to it and flash amber */
  findAndReplace: (from: string, to: string) => void
  /** Clear all diff decorations */
  clearDiff: () => void
  /** Toggle diff visibility */
  toggleDiff: () => void
  /** Reset diff base to current text */
  resetDiffBase: () => void
}
