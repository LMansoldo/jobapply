import type {
  CV,
  CVCreatePayload,
  CVLocaleVersion,
  CVLocalePayload,
  PublishCVPayload,
  PublishCVResponse,
  TailorCVResponse,
  ATSReport,
  InterviewPrep,
} from './types'

export interface AnalyzeCVResponse {
  report: ATSReport
  locale: 'en' | 'pt-BR'
}

export interface GenerateCoverLetterResponse {
  coverLetter: string
}

export interface GenerateVideoScriptResponse {
  script: string
}

export interface GenerateInterviewPrepResponse {
  interviewPrep: InterviewPrep
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
  tailorCV(cvId: string, jobId: string): Promise<TailorCVResponse>
  analyzeCV(cvId: string, jobId: string | undefined, locale: 'en' | 'pt-BR', jobDescription: string): Promise<AnalyzeCVResponse>
  generateCoverLetter(cvId: string, jobId: string | undefined, locale: 'en' | 'pt-BR'): Promise<GenerateCoverLetterResponse>
  generateVideoScript(cvId: string, jobId: string | undefined, locale: 'en' | 'pt-BR'): Promise<GenerateVideoScriptResponse>
  generateInterviewPrep(cvId: string, jobId: string | undefined, locale: 'en' | 'pt-BR', jobDescription?: string): Promise<GenerateInterviewPrepResponse>
}
