import type {
  CV,
  CVCreatePayload,
  CVLocaleVersion,
  CVLocalePayload,
  PublishCVPayload,
  PublishCVResponse,
  ATSReport,
} from './types'

export interface AnalyzeCVResponse {
  report: ATSReport
  locale: 'en' | 'pt-BR'
}

export interface GenerateResumeResponse {
  resume: string
  locale: 'en' | 'pt-BR'
}

export interface ICVRepository {
  getCV(id: string): Promise<CV>
  createCV(payload: CVCreatePayload): Promise<CV>
  updateCV(id: string, payload: CVCreatePayload): Promise<CV>
  deleteCV(id: string): Promise<void>
  updateCVLocale(id: string, locale: 'en' | 'pt-BR', payload: CVLocalePayload): Promise<CVLocaleVersion>
  deleteCVLocale(id: string, locale: 'en' | 'pt-BR'): Promise<void>
  publishCV(id: string, payload?: PublishCVPayload): Promise<PublishCVResponse>
  analyzeCV(cvId: string, jobId: string | undefined, locale: 'en' | 'pt-BR', jobDescription: string, cvMarkdown: string, atsPlatform?: string): Promise<AnalyzeCVResponse>
  generateResume(cvId: string, jobId: string | undefined, locale: 'en' | 'pt-BR', jobDescription: string, cvMarkdown: string): Promise<GenerateResumeResponse>
}
