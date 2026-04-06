import type {
  CV,
  CVCreatePayload,
  CVLocaleVersion,
  CVLocalePayload,
  PublishCVPayload,
  PublishCVResponse,
  TailorCVResponse,
} from './types'

export interface ICVRepository {
  getCV(id: string): Promise<CV>
  createCV(payload: CVCreatePayload): Promise<CV>
  updateCV(id: string, payload: CVCreatePayload): Promise<CV>
  deleteCV(id: string): Promise<void>
  updateCVLocale(id: string, locale: 'en' | 'pt-BR', payload: CVLocalePayload): Promise<CVLocaleVersion>
  deleteCVLocale(id: string, locale: 'en' | 'pt-BR'): Promise<void>
  publishCV(id: string, payload?: PublishCVPayload): Promise<PublishCVResponse>
  tailorCV(cvId: string, jobId: string): Promise<TailorCVResponse>
}
