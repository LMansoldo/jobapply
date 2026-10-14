import type { EditorKeywords } from '@jobapply/contracts'

export type { EditorKeywords }
export type { KeywordPhrase, ATSTip, RemoveSuggestion } from '@jobapply/contracts'
export type { EditorHandle as TailoringEditorHandle } from '@jobapply/editor'

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
  /** Trigger CV rewrite */
  onRewriteCV?: () => void
  /** True while CV rewrite is in progress */
  rewriteLoading?: boolean
  /** Trigger 1-page resume generation via generateResume endpoint */
  onGenerateResume?: () => void
  /** True while resume generation is in progress */
  resumeLoading?: boolean
  onDownloadPDF?: () => void | Promise<void>
  onExportMarkdown?: () => void
  onSaveAsVersion?: () => void | Promise<void>
}
