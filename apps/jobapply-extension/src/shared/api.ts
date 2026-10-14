import type { ATSReport } from '@jobapply/contracts'
import { clearAuth, getAuth, type StoredAuth } from './storage'
import type { ExtensionCV } from './report'

export const AUTH_EXPIRED_EVENT = 'jobapply:unauthorized'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const FALLBACK_MESSAGES: Record<number, string> = {
  0: 'Could not connect to the server. Check that the API is running.',
  400: 'Invalid request.',
  403: 'Access denied.',
  404: 'Resource not found.',
  409: 'Conflict: the resource already exists.',
  500: 'Internal server error.',
  502: 'Analysis service is unavailable.',
  504: 'Analysis timed out. Try again.'
}

interface RequestInitish {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

async function request<T>(path: string, { method = 'GET', body }: RequestInitish = {}): Promise<T> {
  const auth: StoredAuth | null = await getAuth()
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {})
      },
      ...(body !== undefined && { body: JSON.stringify(body) })
    })
  } catch {
    throw new ApiError(0, FALLBACK_MESSAGES[0])
  }

  if (response.status === 401) {
    await clearAuth()
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw new ApiError(401, auth?.token ? 'Session expired. Please sign in again.' : 'Please sign in to continue.')
  }

  const data = (await response.json().catch(() => null)) as (Record<string, unknown> & { message?: string }) | null

  if (!response.ok) {
    const message = data?.message ?? FALLBACK_MESSAGES[response.status] ?? 'Unexpected error.'
    throw new ApiError(response.status, message)
  }

  return data as T
}

export interface AuthUser {
  id: string
  name: string
  email: string
  cv?: string | null
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface RegisterResponse {
  user: AuthUser
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/users/login', { method: 'POST', body: { email, password } })
}

export function register(name: string, email: string, password: string): Promise<RegisterResponse> {
  return request<RegisterResponse>('/users/register', { method: 'POST', body: { name, email, password } })
}

export function getCV(id: string): Promise<{ cv: ExtensionCV }> {
  return request<{ cv: ExtensionCV }>(`/cv/${id}`)
}

export interface CVSavePayload {
  fullName: string
  email: string
  markdown?: string
}

export function createCV(payload: CVSavePayload): Promise<{ cv: ExtensionCV }> {
  return request<{ cv: ExtensionCV }>('/cv', { method: 'POST', body: payload })
}

export function updateCV(id: string, payload: CVSavePayload): Promise<{ cv: ExtensionCV }> {
  return request<{ cv: ExtensionCV }>(`/cv/${id}`, { method: 'PUT', body: payload })
}

export interface AnalyzeResponse {
  report: ATSReport
  locale: 'en' | 'pt-BR'
}

export async function analyzeCV(cvMarkdown: string, jobDescription: string, locale: 'en' | 'pt-BR'): Promise<AnalyzeResponse> {
  const { requestId } = await request<{ requestId: string }>('/cv/analyze', {
    method: 'POST',
    body: { cvMarkdown, jobDescription, locale }
  })
  const report = await consumeAnalyzeStream(requestId)
  return { report, locale }
}

async function consumeAnalyzeStream(requestId: string): Promise<ATSReport> {
  const auth: StoredAuth | null = await getAuth()
  let response: Response
  try {
    response = await fetch(`${BASE_URL}/cv/analyze/${requestId}/stream`, {
      headers: {
        Accept: 'text/event-stream',
        ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {})
      }
    })
  } catch {
    throw new ApiError(0, FALLBACK_MESSAGES[0])
  }

  if (response.status === 401) {
    await clearAuth()
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw new ApiError(401, auth?.token ? 'Session expired. Please sign in again.' : 'Please sign in to continue.')
  }

  if (!response.ok || !response.body) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null
    throw new ApiError(response.status, data?.message ?? FALLBACK_MESSAGES[response.status] ?? 'Unexpected error.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let chunk = await reader.read()
  while (!chunk.done) {
    buffer += decoder.decode(chunk.value, { stream: true })

    let sep = buffer.indexOf('\n\n')
    while (sep !== -1) {
      const frame = buffer.slice(0, sep)
      buffer = buffer.slice(sep + 2)
      sep = buffer.indexOf('\n\n')

      const dataLine = frame.split('\n').find((line) => line.startsWith('data:'))
      if (!dataLine) continue // heartbeat comment
      const job = JSON.parse(dataLine.slice(5).trim()) as { status: string; report?: ATSReport; error?: string }
      if (job.status === 'done' && job.report) return job.report
      if (job.status === 'error') throw new ApiError(502, job.error ?? FALLBACK_MESSAGES[502])
    }

    chunk = await reader.read()
  }

  throw new ApiError(504, FALLBACK_MESSAGES[504])
}

export interface GenerateResumeResponse {
  resume: string
  scoreBefore: number
  scoreAfter: number
  locale: 'en' | 'pt-BR'
}

export function generateResume(
  cvMarkdown: string,
  jobDescription: string,
  locale: 'en' | 'pt-BR'
): Promise<GenerateResumeResponse> {
  return request<GenerateResumeResponse>('/cv/generate-resume/direct', {
    method: 'POST',
    body: { cvMarkdown, jobDescription, locale }
  })
}
