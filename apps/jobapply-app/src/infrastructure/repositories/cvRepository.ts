import api, { USE_MOCK } from '../http/client'
import { MOCK_CV } from '../mock/data'
import type {
  CV,
  CVCreatePayload,
  PublishCVPayload,
  PublishCVResponse,
  PublishedCV,
  CVLocaleVersion,
  CVLocalePayload,
  ATSReport,
} from '../../domain/cv/types'
import {
  createCVFromPersonalDataAndLocale,
  createInitialPTBRContent,
} from '../../domain/cv/helpers'

// In-memory CV store for mock mode (null = not created yet)
let mockCV: CV | null = null
let mockCVInitialized = false

// Stores published CV snapshots keyed by public_id (mock only)
const mockPublishedCVs = new Map<string, PublishedCV>()

/** Returns the published CV snapshot for a given public_id (mock only). */
export function getMockPublishedCV(publicId: string): PublishedCV | null {
  return mockPublishedCVs.get(publicId) ?? null
}

function delay(ms = 500) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function getCV(id: string): Promise<CV> {
  if (USE_MOCK) {
    await delay()
    if (!mockCVInitialized) {
      mockCV = { ...MOCK_CV }
      mockCVInitialized = true
    }
    if (!mockCV || mockCV._id !== id) {
      throw { response: { data: { message: 'CV não encontrado' }, status: 404 } }
    }
    return { ...mockCV, localeVersions: [...(mockCV.localeVersions ?? [])] }
  }

  const { data } = await api.get<{ cv: CV }>(`/cv/${id}`)
  return data.cv
}

export async function createCV(payload: CVCreatePayload): Promise<CV> {
  if (USE_MOCK) {
    await delay(700)
    if (mockCV) throw { response: { data: { message: 'Usuário já possui um CV' }, status: 409 } }
    mockCVInitialized = true

    // Create initial CV with mock PT-BR content for new users
    const initialPTBRContent = createInitialPTBRContent()
    mockCV = createCVFromPersonalDataAndLocale(
      payload,
      initialPTBRContent,
      `cv-${Date.now()}`,
      'user-001'
    )

    return { ...mockCV }
  }

  const { data } = await api.post<{ cv: CV }>('/cv', payload)
  return data.cv
}

export async function updateCV(id: string, payload: CVCreatePayload): Promise<CV> {
  if (USE_MOCK) {
    await delay(600)
    if (!mockCV) throw { response: { data: { message: 'CV não encontrado' }, status: 404 } }

    // Update personal data while preserving locale content
    mockCV = {
      ...mockCV,
      ...payload,
      _id: id,
      updatedAt: new Date().toISOString(),
      // Preserve existing localeVersions
      localeVersions: mockCV.localeVersions,
      tailoredVersions: mockCV.tailoredVersions,
    }
    return { ...mockCV }
  }

  const { data } = await api.put<{ cv: CV }>(`/cv/${id}`, payload)
  return data.cv
}

export async function deleteCV(id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(400)
    mockCV = null
    mockCVInitialized = false
    return
  }
  await api.delete(`/cv/${id}`)
}

export async function updateCVLocale(
  id: string,
  locale: 'en' | 'pt-BR',
  payload: CVLocalePayload,
): Promise<CVLocaleVersion> {
  if (USE_MOCK) {
    await delay(500)
    if (!mockCV) throw { response: { data: { message: 'CV não encontrado' }, status: 404 } }
    const version: CVLocaleVersion = { locale, ...payload }
    const versions = [...(mockCV.localeVersions ?? [])]
    const idx = versions.findIndex((v) => v.locale === locale)
    if (idx >= 0) versions[idx] = version
    else versions.push(version)
    mockCV = { ...mockCV, localeVersions: versions }
    return version
  }

  const { data } = await api.put<{ localeVersion: CVLocaleVersion }>(
    `/cv/${id}/version/${locale}`,
    payload,
  )
  return data.localeVersion
}

export async function deleteCVLocale(id: string, locale: 'en' | 'pt-BR'): Promise<void> {
  if (USE_MOCK) {
    await delay(300)
    if (!mockCV) throw { response: { data: { message: 'CV não encontrado' }, status: 404 } }
    mockCV = {
      ...mockCV,
      localeVersions: (mockCV.localeVersions ?? []).filter((v) => v.locale !== locale),
    }
    return
  }
  await api.delete(`/cv/${id}/version/${locale}`)
}

export async function publishCV(id: string, payload?: PublishCVPayload): Promise<PublishCVResponse> {
  if (USE_MOCK) {
    await delay(600)
    if (!mockCV) throw { response: { data: { message: 'CV não encontrado' }, status: 404 } }
    const publicId = `pub-${Date.now()}`
    const localeKey = payload?.locale ?? 'pt-BR'
    const localeVersion = mockCV.localeVersions?.find((v) => v.locale === localeKey)
      ?? mockCV.localeVersions?.[0]
    const published: PublishedCV = {
      _id: `published-${id}`,
      user: mockCV.user,
      public_id: publicId,
      fullName: payload?.fullName ?? mockCV.fullName,
      email: payload?.email ?? mockCV.email,
      phone: payload?.phone ?? mockCV.phone,
      location: payload?.location ?? mockCV.location,
      linkedin: payload?.linkedin ?? mockCV.linkedin,
      github: payload?.github ?? mockCV.github,
      portfolio: payload?.portfolio ?? mockCV.portfolio,
      objective: payload?.objective ?? mockCV.objective,
      summary: payload?.summary ?? localeVersion?.summary ?? '',
      skills: payload?.skills ?? localeVersion?.skills ?? [],
      experience: payload?.experience ?? localeVersion?.experience ?? [],
      education: payload?.education ?? localeVersion?.education ?? [],
      languages: payload?.languages ?? mockCV.languages,
      certifications: payload?.certifications,
      projects: payload?.projects ?? localeVersion?.projects,
      published_at: new Date().toISOString(),
    }
    mockPublishedCVs.set(publicId, published)
    return { public_id: publicId, published }
  }

  const { data } = await api.post<PublishCVResponse>(`/cv/${id}/publish`, payload ?? {})
  return data
}

export interface AnalyzeCVResponse {
  report: ATSReport
  locale: 'en' | 'pt-BR'
}

export async function analyzeCV(
  cvId: string,
  jobId: string | undefined,
  locale: 'en' | 'pt-BR',
  jobDescription: string,
  cvMarkdown: string,
  atsPlatform?: string,
): Promise<AnalyzeCVResponse> {
  if (USE_MOCK) {
    await delay(1200)
    const report: ATSReport = {
      universalScore: 72,
      scoreBreakdown: { keywordCoverage: 75, contentQuality: 70, format: 80 },
      matchedKeywords: ['React', 'TypeScript'],
      missingKeywords: ['Docker', 'AWS', 'CI/CD'],
      tips: [
        { tip: 'Add required keywords: Docker, AWS', priority: 'critical' },
        { tip: 'Include quantitative metrics', priority: 'medium' },
      ],
      optimalTemplate: {
        keywordsToAdd: ['Docker', 'AWS', 'CI/CD'],
        keywordPhrases: [],
        keywordsToRephrase: [],
        formatFixes: [],
      },
      semanticGaps: ['Lacks containerization experience'],
    }
    return { report, locale }
  }

  const body: Record<string, string> = { locale, jobDescription, cvMarkdown }
  if (jobId) body.jobId = jobId
  if (atsPlatform) body.atsPlatform = atsPlatform
  const { data } = await api.post<AnalyzeCVResponse>(`/cv/${cvId}/analyze`, body)
  return data
}

export interface GenerateResumeResponse {
  resume: string
  locale: 'en' | 'pt-BR'
}

export async function generateResume(
  cvId: string,
  jobId: string | undefined,
  locale: 'en' | 'pt-BR',
  jobDescription: string,
  cvMarkdown: string,
): Promise<GenerateResumeResponse> {
  if (USE_MOCK) {
    await delay(2500)
    return {
      resume: `# CV Mock — Tailored Resume\n\n## Summary\nThis is a mock ATS-optimized resume generated for the target role.\n\n## Skills\n**Frontend:** React, TypeScript, Svelte\n\n## Experience\n### Senior Engineer | Mock Company\n**Jan 2023 – Present**\n- Built scalable frontend systems using React and TypeScript.\n`,
      locale,
    }
  }

  const body: Record<string, string> = { locale, jobDescription, cvMarkdown }
  if (jobId) body.jobId = jobId
  const { data } = await api.post<GenerateResumeResponse>(`/cv/${cvId}/generate-resume`, body)
  return data
}

