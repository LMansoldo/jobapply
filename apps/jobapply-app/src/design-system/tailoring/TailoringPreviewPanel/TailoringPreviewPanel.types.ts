import type { Job } from '../../../domain/jobs/types'
import type { CV, CVLocaleVersion } from '../../../domain/cv/types'

export interface TailoringPreviewPanelProps {
  cv: CV | null
  locale: CVLocaleVersion | null
  job: Job | null
  currentScore: number
  projectedScore: number
  scoreDelta: number
  onDownloadPDF?: () => void
  onDownloadDOCX?: () => void
  onExportMarkdown?: () => void
  onSaveAsVersion?: () => void
}
