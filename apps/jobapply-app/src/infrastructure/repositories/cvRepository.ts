import api, { USE_MOCK } from '../http/client'
import { MOCK_CV } from '../mock/data'
import type {
  CV,
  CVCreatePayload,
  TailorCVResponse,
  PublishCVPayload,
  PublishCVResponse,
  PublishedCV,
  CVLocaleVersion,
  CVLocalePayload,
  ATSReport,
  InterviewPrep,
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

export async function tailorCV(cvId: string, jobId: string): Promise<TailorCVResponse> {
  if (USE_MOCK) {
    await delay(1500)
    if (!mockCV) throw { response: { data: { message: 'CV não encontrado' }, status: 404 } }
    const ptBrVersion = mockCV.localeVersions?.find((v) => v.locale === 'pt-BR')
    const summary = ptBrVersion?.summary ?? ''
    const tailored = `# CV Adaptado – ${mockCV.fullName}\n\n## Resumo\n${summary}\n\n> *Este currículo foi otimizado para a vaga (jobId: ${jobId}).*\n`
    return { tailoredCV: tailored }
  }

  const { data } = await api.post<TailorCVResponse>(`/cv/${cvId}/tailor`, { jobId })
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
): Promise<AnalyzeCVResponse> {
  if (USE_MOCK) {
    await delay(1200)
    const report: ATSReport = {
      universalScore: 72,
      platforms: [
        { platform: 'LinkedIn', score: 75, missingPreferred: ['Docker', 'AWS'] },
        { platform: 'Gupy', score: 68, missingPreferred: ['Scrum'] },
      ],
      tips: [
        { tip: 'Adicione mais palavras-chave técnicas ao resumo', priority: 'high' },
        { tip: 'Inclua métricas quantitativas nas experiências', priority: 'medium' },
      ],
      optimalTemplate: {
        keywordsToAdd: ['Docker', 'AWS', 'CI/CD'],
        keywordPhrases: [],
        keywordsToRephrase: [{ from: 'desenvolvedor', to: 'engenheiro de software' }],
        formatFixes: ['Use bullet points instead of paragraphs in experience section'],
      },
      semanticGaps: [
        'Familiaridade prática com Material UI (MUI): O CV indica que o candidato substituiu o Material-UI em um projeto, o que mostra conhecimento sobre a ferramenta, mas não experiência em seu uso.',
        'Contexto da indústria laboratorial: A JD busca experiência em uma aplicação laboratorial global, enquanto o histórico do candidato é predominantemente em finanças e e-commerce.',
      ],
    }
    return { report, locale }
  }

  const body: Record<string, string> = { locale, jobDescription }
  if (jobId) body.jobId = jobId
  const { data } = await api.post<AnalyzeCVResponse>(`/cv/${cvId}/analyze`, body)
  return data
}

export interface GenerateCoverLetterResponse {
  coverLetter: string
}

export async function generateCoverLetter(
  cvId: string,
  jobId: string | undefined,
  locale: 'en' | 'pt-BR',
): Promise<GenerateCoverLetterResponse> {
  if (USE_MOCK) {
    await delay(2000)
    return {
      coverLetter: `Prezado(a) recrutador(a),\n\nEscrevo para expressar meu interesse na vaga anunciada. Com minha experiência sólida em desenvolvimento de software, acredito que posso contribuir significativamente para a equipe.\n\nAtenciosamente,\n${mockCV?.fullName ?? 'Candidato'}`,
    }
  }

  const body: Record<string, string> = { locale }
  if (jobId) body.jobId = jobId
  const { data } = await api.post<GenerateCoverLetterResponse>(
    `/cv/${cvId}/cover-letter`,
    body,
  )
  return data
}

export interface GenerateVideoScriptResponse {
  script: string
}

export async function generateVideoScript(
  cvId: string,
  jobId: string | undefined,
  locale: 'en' | 'pt-BR',
): Promise<GenerateVideoScriptResponse> {
  if (USE_MOCK) {
    await delay(2500)
    return {
      script: `Olá! Meu nome é ${mockCV?.fullName ?? 'Candidato'}.\n\nEstou muito animado com esta oportunidade. Nos últimos anos, venho desenvolvendo minhas habilidades em engenharia de software e gostaria de compartilhar como posso agregar valor à sua equipe.\n\nObrigado por assistir!`,
    }
  }

  const body: Record<string, string> = { locale }
  if (jobId) body.jobId = jobId
  const { data } = await api.post<GenerateVideoScriptResponse>(
    `/cv/${cvId}/video-script`,
    body,
  )
  return data
}

export interface GenerateInterviewPrepResponse {
  interviewPrep: InterviewPrep
  locale: 'en' | 'pt-BR'
}

export async function generateInterviewPrep(
  cvId: string,
  jobId: string | undefined,
  locale: 'en' | 'pt-BR',
  jobDescription?: string,
): Promise<GenerateInterviewPrepResponse> {
  if (USE_MOCK) {
    await delay(2000)
    return {
      interviewPrep: {
        stories: [
          {
            jdRequirement: 'Liderança técnica de equipes ágeis',
            story: 'Na minha última posição, assumi a liderança técnica de um squad de 5 engenheiros durante um momento crítico de reordenação organizacional. A missão era entregar um novo módulo de pagamentos em 10 semanas sem atrasar o roadmap existente. Implementei cerimônias ágeis adaptadas ao contexto remoto e criei um board compartilhado para visibilidade de bloqueios. Entregamos no prazo com zero incidentes P1 nos primeiros 30 dias e o NPS interno do time subiu de 62 para 78.',
          },
        ],
        overallPositioning: 'Posicione-se como um engenheiro sênior com histórico comprovado de entrega em ambientes de alta pressão. Lidere com seus projetos de maior impacto e conecte-os diretamente aos desafios descritos na vaga.',
      },
      locale,
    }
  }

  const body: Record<string, string> = { locale }
  if (jobId) body.jobId = jobId
  if (jobDescription) body.jobDescription = jobDescription
  const { data } = await api.post<GenerateInterviewPrepResponse>(
    `/cv/${cvId}/interview-prep`,
    body,
  )
  return data
}
