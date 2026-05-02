/**
 * @file useTailoringExport.ts
 * @description Provides export handlers (PDF, Markdown, version save) for the tailoring workspace.
 * Encapsulates file download logic and user feedback messaging.
 * handleSaveAsVersion uses useMutation for automatic loading/error state.
 */
import { useCallback, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { downloadMarkdownText, downloadMarkdownAsPdf, parseMarkdownToLocale } from '../helpers'
import { updateCVLocale } from '../../../infrastructure/repositories/cvRepository'
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
  handleSaveAsVersion: () => Promise<void>
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

  const saveVersionMutation = useMutation({
    mutationFn: async () => {
      if (!tailoredContent || !cv) {
        throw new Error('no-content')
      }
      const locale = chosenLocale ?? setupLocale
      const { data, errors } = parseMarkdownToLocale(tailoredContent, locale)
      if (errors.length > 0 || !data) throw new Error('parse-error')
      messageRef.current.loading(tRef.current('tailoring.savingVersion'), 0)
      await updateCVLocale(cv._id, locale, data)
    },
    onSuccess: () => {
      messageRef.current.destroy()
      messageRef.current.success(tRef.current('tailoring.saveVersionSuccess'))
    },
    onError: (error: Error) => {
      messageRef.current.destroy()
      if (error.message === 'no-content') {
        messageRef.current.warning(tRef.current('tailoring.noContentToExport'))
      } else if (error.message === 'parse-error') {
        messageRef.current.error(tRef.current('tailoring.saveVersionParseError'))
      } else {
        messageRef.current.error(tRef.current('tailoring.saveVersionError'))
      }
    },
  })

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

  const handleSaveAsVersion = useCallback(async () => {
    await saveVersionMutation.mutateAsync()
  }, [saveVersionMutation])

  return { handleDownloadPDF, handleExportMarkdown, handleSaveAsVersion }
}
