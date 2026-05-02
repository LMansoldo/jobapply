/**
 * @file JobDetail.types.ts
 * @description Type definitions for the JobDetail component.
 */
import type { Job } from '../../types'

/** Props for the JobDetail component */
export interface JobDetailProps {
  /** The job to display details for */
  job: Job
  /** ID of the job currently being deleted (for loading state) */
  deletingId: string | null
  /** ID of the job currently being tailored (for loading state) */
  tailoringId: string | null
  /** Callback to delete the job by ID */
  onDelete: (id: string) => void
  /** Callback to trigger AI tailoring for the job */
  onTailor: (job: Job) => void
}
