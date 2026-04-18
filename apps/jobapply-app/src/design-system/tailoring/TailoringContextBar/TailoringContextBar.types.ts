import type { Job } from '../../../domain/jobs/types'

export interface TailoringContextBarProps {
  /** Job data for context display (null in manual mode) */
  job: Job | null
  /** Manual job description (shown when job is null) */
  manualDescription?: string
  /** Whether ATS analysis is currently running */
  isAnalysisRunning: boolean
  /** Callback when back button is clicked */
  onBack: () => void
  /** Language for job context display */
  lang?: 'pt-BR' | 'en'
  /** ATS score to display as a compact badge on mobile (0 = hidden) */
  currentScore?: number
}
