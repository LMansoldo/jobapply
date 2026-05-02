import type { Job } from '../../../domain/jobs/types'
import type { ATSPanelData } from '../../../domain/cv/tailoringHelpers'
import type { KeywordPhrase, RemoveSuggestion } from '../../../domain/cv/types'

export interface EditorKeywords {
  toAdd: string[]
  toRephrase: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
}

export interface ATSWorkspaceProps {
  /** Whether ATS data is loading */
  atsLoading: boolean
  /** ATS panel data (score, categories, keywords) */
  panelData?: ATSPanelData
  /** Score improvement delta */
  scoreDelta: number
  /** All suggestions for the CV */
  allSuggestions: string[]
  /** Current suggestion index (1-based) */
  currentSuggestion: number
  /** Total number of suggestions */
  suggestionsCount: number
  /** Keywords to add/rephrase */
  editorKeywords?: EditorKeywords
  /** Whether tailoring is in progress */
  tailoring: boolean
  /** Current tailored content */
  tailoredContent: string
  /** Selected locale */
  chosenLocale?: string
  /** Callback to update tailored content */
  onTailoredContentChange: (content: string) => void
  /** Job data for preview */
  job: Job | null
  /** Current ATS score */
  currentScore: number
  /** Projected score after changes */
  projectedScore: number
  /** Callback when suggestion navigation changes */
  onSuggestionChange: (index: number) => void
  /** Callback to insert a keyword */
  onInsertKeyword: (keyword: string) => void
  /** Callback to replace a keyword */
  onReplaceKeyword: (from: string, to: string) => void
  /** Callback to re-run ATS analysis */
  onReanalyze: () => void
  /** Callback to rewrite the CV via tailorCV endpoint (only available in job mode) */
  onRewriteCV?: () => void
  /** True while CV rewrite is running */
  rewriteLoading?: boolean
  /** Callback to generate a 1-page resume (replaces editor content) */
  onGenerateResume?: () => void
  /** True while resume generation is running */
  resumeLoading?: boolean
  /** Callback for PDF download */
  onDownloadPDF: () => void
  /** Callback for markdown export */
  onExportMarkdown: () => void
  /** Callback to save as version */
  onSaveAsVersion: () => Promise<void>
  /** Keyword phrases suggestions (10 ready-to-use bullets) */
  keywordPhrases?: KeywordPhrase[]
  /** Suggestions for CV items to remove */
  removeSuggestions?: RemoveSuggestion[]
  /** Callback when user copies a keyword phrase */
  onCopyPhrase?: (phrase: string) => void
}