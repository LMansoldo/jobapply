import type { Job } from '../../../domain/jobs/types'

export interface TailoringPreviewPanelProps {
  markdownContent?: string
  job: Job | null
  currentScore: number
  projectedScore: number
  scoreDelta: number
  onDownloadPDF?: () => void
  onExportMarkdown?: () => void
  onSaveAsVersion?: () => void
}
