export interface TailoringContextBarProps {
  /** Manual job description shown in the bar */
  manualDescription?: string
  /** Whether ATS analysis is currently running */
  isAnalysisRunning: boolean
  /** When provided, renders the "New analysis" button (pass only once a report exists) */
  onNewAnalysis?: () => void
  /** ATS score to display as a compact badge on mobile (0 = hidden) */
  currentScore?: number
}
