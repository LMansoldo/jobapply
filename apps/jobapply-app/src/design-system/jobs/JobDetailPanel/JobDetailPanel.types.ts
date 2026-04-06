import type { Job } from '../../../domain/jobs/types'

export interface JobDetailPanelProps {
  job: Job
  onApply?: (job: Job) => void
  onSave?: (job: Job) => void
  onTailor?: (job: Job) => void
}
