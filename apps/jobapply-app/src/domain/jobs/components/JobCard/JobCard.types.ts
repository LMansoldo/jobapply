/**
 * @file JobCard.types.ts
 * @description Type definitions for the JobCard component.
 */
import type { Job } from '../../types'

/** Props for the JobCard component */
export interface JobCardProps {
  /** The job data to display */
  job: Job
  /** Whether this card is currently selected */
  isSelected: boolean
  /** Callback when the card is clicked */
  onClick: (job: Job) => void
}
