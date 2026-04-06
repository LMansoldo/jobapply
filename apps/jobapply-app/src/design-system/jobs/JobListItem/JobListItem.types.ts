import type { Job } from '../../../domain/jobs/types'

export interface JobListItemProps {
  job: Job
  isSelected?: boolean
  isViewed?: boolean
  isHot?: boolean
  onClick?: (job: Job) => void
  onDismiss?: (id: string) => void
}
