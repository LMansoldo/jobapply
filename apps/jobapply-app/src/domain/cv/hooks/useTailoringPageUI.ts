/**
 * @file useTailoringPageUI.ts
 * @description Manages pure UI state for the tailoring workspace page:
 * suggestion navigation.
 */
import { useState, useEffect } from 'react'
import type { ATSReport } from '../types'

interface UseTailoringPageUIParams {
  atsReport: ATSReport | null
}

export interface UseTailoringPageUIReturn {
  currentSuggestion: number
  setCurrentSuggestion: (n: number) => void
}

export function useTailoringPageUI({ atsReport }: UseTailoringPageUIParams): UseTailoringPageUIReturn {
  const [currentSuggestion, setCurrentSuggestion] = useState(1)

  useEffect(() => {
    if (atsReport) setCurrentSuggestion(1)
  }, [atsReport])

  return {
    currentSuggestion,
    setCurrentSuggestion,
  }
}
