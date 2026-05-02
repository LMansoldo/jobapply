/**
 * @file useLinkedInAnalysis.ts
 * @description Manages LinkedIn PDF analysis state.
 * User uploads their LinkedIn profile PDF → AI analyzes it.
 */
import { useState, useCallback } from 'react'
import type { LinkedInAnalysis, VoiceAnswers } from '../types'
import { analyzeLinkedInPDF } from '../../../infrastructure/repositories/linkedinRepository'

export type LinkedInView = 'pdf' | 'results'

export interface LinkedInAnalysisState {
  view: LinkedInView
  analysis: LinkedInAnalysis | null
  loading: boolean
  handleAnalyzePDF: (file: File, voiceAnswers?: VoiceAnswers) => Promise<void>
  handleReset: () => void
}

interface Params {
  onError: (messageKey: string) => void
}

export function useLinkedInAnalysis({ onError }: Params): LinkedInAnalysisState {
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyzePDF = useCallback(
    async (file: File, voiceAnswers?: VoiceAnswers) => {
      setLoading(true)
      try {
        const result = await analyzeLinkedInPDF(file, voiceAnswers)
        setAnalysis(result)
      } catch {
        onError('tailoring.linkedinError')
      } finally {
        setLoading(false)
      }
    },
    [onError],
  )

  const handleReset = useCallback(() => {
    setAnalysis(null)
  }, [])

  return {
    view: analysis ? 'results' : 'pdf',
    analysis,
    loading,
    handleAnalyzePDF,
    handleReset,
  }
}
