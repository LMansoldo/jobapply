import api, { USE_MOCK } from '../http/client'
import { MOCK_CV } from '../mock/data'
import type {
  CV,
  CVCreatePayload,
  TailorCVResponse,
  PublishCVPayload,
  PublishCVResponse,
  CVLocaleVersion,
  CVLocalePayload,
} from '../../domain/cv/types'

// In-memory CV store for mock mode (null = not created yet)
let mockCV: CV | null = null
let mockCVInitialized = false

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
    mockCV = {
      _id: `cv-${Date.now()}`,
      user: 'user-001',
      ...payload,
      languages: payload.languages ?? [],
      tailoredVersions: [],
      localeVersions: [],
      updatedAt: new Date().toISOString(),
    }
    return { ...mockCV }
  }

  const { data } = await api.post<{ cv: CV }>('/cv', payload)
  return data.cv
}

export async function updateCV(id: string, payload: CVCreatePayload): Promise<CV> {
  if (USE_MOCK) {
    await delay(600)
    if (!mockCV) throw { response: { data: { message: 'CV não encontrado' }, status: 404 } }
    mockCV = { ...mockCV, ...payload, _id: id, updatedAt: new Date().toISOString() }
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
    return {
      public_id: publicId,
      published: {
        _id: `published-${id}`,
        user: mockCV.user,
        public_id: publicId,
        fullName: payload?.fullName ?? mockCV.fullName,
        email: payload?.email ?? mockCV.email,
        phone: payload?.phone ?? mockCV.phone,
        skills: payload?.skills ?? [],
        experience: payload?.experience ?? [],
        education: payload?.education ?? [],
        languages: mockCV.languages,
        published_at: new Date().toISOString(),
      },
    }
  }

  const { data } = await api.post<PublishCVResponse>(`/cv/${id}/publish`, payload ?? {})
  return data
}

export async function tailorCV(cvId: string, jobId: string): Promise<TailorCVResponse> {
  if (USE_MOCK) {
    await delay(1500)
    if (!mockCV) throw { response: { data: { message: 'CV não encontrado' }, status: 404 } }
    const ptBrVersion = mockCV.localeVersions?.find((v) => v.locale === 'pt-BR')
    const headline = ptBrVersion?.summary?.headline ?? ''
    const stack = ptBrVersion?.objective?.main_stack?.join(', ') ?? ''
    const tailored = `# CV Adaptado – ${mockCV.fullName}\n\n## Resumo\n${headline}\n\n> *Este currículo foi otimizado para a vaga (jobId: ${jobId}).*\n\n**Stack relevante:** ${stack}\n`
    return { tailoredCV: tailored }
  }

  const { data } = await api.post<TailorCVResponse>(`/cv/${cvId}/tailor`, { jobId })
  return data
}
