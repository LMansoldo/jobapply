import type {
  Job,
  JobFilters,
  PaginatedJobsResponse,
  BulkJobsPayload,
  BulkJobsResponse,
  TailorJobResponse,
} from './types'

export interface IJobsRepository {
  fetchJobs(filters?: JobFilters): Promise<PaginatedJobsResponse>
  bulkCreateJobs(payload: BulkJobsPayload): Promise<BulkJobsResponse>
  deleteJob(id: string): Promise<void>
  tailorJobDescription(id: string): Promise<TailorJobResponse>
}
