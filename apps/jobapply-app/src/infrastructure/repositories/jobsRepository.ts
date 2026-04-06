import api, { USE_MOCK } from '../http/client'
import { MOCK_JOBS } from '../mock/data'
import type {
  Job,
  JobFilters,
  PaginatedJobsResponse,
  BulkJobsPayload,
  BulkJobsResponse,
  TailorJobResponse,
} from '../../domain/jobs/types'

// In-memory store for mock mode
let mockJobs: Job[] = [...MOCK_JOBS]

function delay(ms = 500) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function fetchJobs(filters: JobFilters = {}): Promise<PaginatedJobsResponse> {
  if (USE_MOCK) {
    await delay()
    const { title, company, location, status, tags, page = 1, limit = 20 } = filters

    let results = [...mockJobs]

    if (title) results = results.filter((j) => j.title.toLowerCase().includes(title.toLowerCase()))
    if (company)
      results = results.filter((j) => j.company.toLowerCase().includes(company.toLowerCase()))
    if (location)
      results = results.filter((j) =>
        j.location?.toLowerCase().includes(location.toLowerCase()),
      )
    if (status) results = results.filter((j) => j.status === status)
    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim().toLowerCase())
      results = results.filter((j) => tagList.some((t) => j.tags.map((x) => x.toLowerCase()).includes(t)))
    }

    const total = results.length
    const start = (page - 1) * limit
    const jobs = results.slice(start, start + limit)
    return { total, page, limit, jobs }
  }

  const { data } = await api.get<PaginatedJobsResponse>('/jobs', { params: filters })
  return data
}

export async function bulkCreateJobs(payload: BulkJobsPayload): Promise<BulkJobsResponse> {
  if (USE_MOCK) {
    await delay(800)
    const newJobs: Job[] = payload.jobs.map((j, i) => ({
      _id: `job-mock-${Date.now()}-${i}`,
      title: j.title,
      company: j.company,
      location: j.location,
      description: j.description,
      tailoredDescription: undefined,
      tags: j.tags ?? [],
      url: j.url,
      salary: j.salary,
      status: j.status ?? 'open',
      createdAt: new Date().toISOString(),
    }))
    mockJobs = [...newJobs, ...mockJobs]
    return { inserted: newJobs.length, jobs: newJobs }
  }

  const { data } = await api.post<BulkJobsResponse>('/jobs/bulk', payload)
  return data
}

export async function deleteJob(id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(400)
    mockJobs = mockJobs.filter((j) => j._id !== id)
    return
  }
  await api.delete(`/jobs/${id}`)
}

export async function tailorJobDescription(id: string): Promise<TailorJobResponse> {
  if (USE_MOCK) {
    await delay(1200)
    const job = mockJobs.find((j) => j._id === id)
    if (!job) throw { response: { data: { message: 'Vaga não encontrada' }, status: 404 } }
    const tailored = `[TAILORED] ${job.description} — Optimized for ${job.company} with keywords: ${job.tags.join(', ')}.`
    mockJobs = mockJobs.map((j) =>
      j._id === id ? { ...j, tailoredDescription: tailored } : j,
    )
    return { jobId: id, tailoredDescription: tailored }
  }

  const { data } = await api.post<TailorJobResponse>(`/jobs/${id}/tailor-description`)
  return data
}
