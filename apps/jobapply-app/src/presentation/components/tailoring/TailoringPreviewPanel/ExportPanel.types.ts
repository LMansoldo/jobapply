import type { ATSCategory } from '@jobapply/ats-ui'

export interface ExportPanelProps {
  atsScore: number
  atsCategories?: ATSCategory[]
  currentScore: number
  projectedScore: number
  scoreDelta: number
  onDownloadPDF?: () => void
  onExportMarkdown?: () => void
  onSaveAsVersion?: () => void
}
