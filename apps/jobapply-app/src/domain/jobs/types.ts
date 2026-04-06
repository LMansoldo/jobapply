export interface Job {
  _id: string
  title: string
  company: string
  location?: string
  description: string
  tailoredDescription?: string
  tags: string[]
  url?: string
  salary?: string
  status: 'open' | 'closed' | 'applied'
  createdAt: string
}

export interface PaginatedJobsResponse {
  total: number
  page: number
  limit: number
  jobs: Job[]
}

export interface JobFilters {
  title?: string
  company?: string
  location?: string
  status?: 'open' | 'closed' | 'applied' | ''
  tags?: string
  page?: number
  limit?: number
}

export interface BulkJobsPayload {
  jobs: Array<{
    title: string
    company: string
    location?: string
    description: string
    tags?: string[]
    url?: string
    salary?: string
    status?: 'open' | 'closed' | 'applied'
  }>
}

export interface BulkJobsResponse {
  inserted: number
  jobs: Job[]
}

export interface TailorJobResponse {
  jobId: string
  tailoredDescription: string
}
