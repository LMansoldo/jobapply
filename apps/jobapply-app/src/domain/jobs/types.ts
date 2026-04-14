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
  contractType?: 'clt' | 'pj' | 'freelance' | 'internship'
  modality?: 'remote' | 'hybrid' | 'onsite'
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'specialist'
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
  contractTypes?: string[]
  modalities?: string[]
  experienceLevels?: string[]
  maxSalary?: number
  sort?: 'newest' | 'oldest'
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
