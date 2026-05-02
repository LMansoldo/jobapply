import type { Job } from '../../../domain/jobs/types'

export type DSJobCardVariant = 'default' | 'featured'

export interface DSJobCardProps {
  job: Job
  variant?: DSJobCardVariant
  isSelected?: boolean
  onClick?: () => void
  onApply?: (job: Job) => void
}
