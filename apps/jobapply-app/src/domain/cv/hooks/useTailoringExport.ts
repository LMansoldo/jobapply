/**
 * @file useTailoringExport.ts
 * @description Provides export handlers (PDF, Markdown, version save) for the tailoring workspace.
 * Encapsulates file download logic and user feedback messaging.
 */
import { useCallback, useRef, useEffect } from 'react'
import { downloadMarkdownText, downloadMarkdownAsPdf } from '../helpers'
import type { CV } from '../types'
import type { Job } from '../../jobs/types'

interface MessageApi {
  loading: (content: string, duration?: number) => void
  success: (content: string) => void
  error: (content: string) => void
  warning: (content: string) => void
  destroy: () => void
  info: (content: string) => void
}

interface UseTailoringExportParams {
  cv: CV | null
  tailoredContent: string
  chosenLocale: 'en' | 'pt-BR' | null
  setupLocale: 'en' | 'pt-BR'
  job: Job | null
  manualDescription: string
  message: MessageApi
  t: (key: string, options?: Record<string, unknown>) => string
}

export interface UseTailoringExportReturn {
  handleDownloadPDF: () => Promise<void>
  handleExportMarkdown: () => void
  handleSaveAsVersion: () => void
}

export function useTailoringExport({
  cv,
  tailoredContent,
  chosenLocale,
  setupLocale,
  job,
  manualDescription,
  message,
  t,
}: UseTailoringExportParams): UseTailoringExportReturn {
  const messageRef = useRef(message)
  const tRef = useRef(t)
  useEffect(() => { messageRef.current = message })
  useEffect(() => { tRef.current = t })

  const handleDownloadPDF = useCallback(async () => {
    if (!tailoredContent || !cv) {
      messageRef.current.warning(tRef.current('tailoring.noContentToExport'))
      return
    }
    try {
      messageRef.current.loading(tRef.current('tailoring.generatingPDF'), 0)
      const locale = chosenLocale ?? setupLocale
      const jobTitle = job?.title ?? manualDescription.split('\n')[0]?.substring(0, 50) ?? 'untitled'
      await downloadMarkdownAsPdf(tailoredContent, cv, locale, jobTitle)
      messageRef.current.destroy()
      messageRef.current.success(tRef.current('tailoring.downloadPDFSuccess'))
    } catch (error) {
      messageRef.current.destroy()
      console.error('PDF generation error:', error)
      messageRef.current.error(tRef.current('tailoring.downloadPDFError'))
    }
  }, [tailoredContent, cv, chosenLocale, setupLocale, job, manualDescription])

  const handleExportMarkdown = useCallback(() => {
    if (!tailoredContent) {
      messageRef.current.warning(tRef.current('tailoring.noContentToExport'))
      return
    }
    downloadMarkdownText(tailoredContent, 'cv-otimizado')
    messageRef.current.success(tRef.current('tailoring.exportMarkdownSuccess'))
  }, [tailoredContent])

  const handleSaveAsVersion = useCallback(() => {
    messageRef.current.info(tRef.current('tailoring.saveAsVersion') + ' (feature em desenvolvimento)')
  }, [])

  return { handleDownloadPDF, handleExportMarkdown, handleSaveAsVersion }
}
