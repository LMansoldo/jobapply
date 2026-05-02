import type { ATSCategory } from '../../ats/ATSPanel/ATSPanel.types'

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
