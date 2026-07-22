/**
 * @file useTailoringPageUI.ts
 * @description Manages pure UI state for the tailoring workspace page:
 * suggestion navigation and drawer visibility.
 */
import { useState, useEffect } from 'react'
import type { ATSReport } from '../types'

interface UseTailoringPageUIParams {
  atsReport: ATSReport | null
}

export interface UseTailoringPageUIReturn {
  currentSuggestion: number
  setCurrentSuggestion: (n: number) => void
  drawerVisible: boolean
  setDrawerVisible: (v: boolean) => void
}

export function useTailoringPageUI({ atsReport }: UseTailoringPageUIParams): UseTailoringPageUIReturn {
  const [currentSuggestion, setCurrentSuggestion] = useState(1)
  const [drawerVisible, setDrawerVisible] = useState(false)

  useEffect(() => {
    if (atsReport) setCurrentSuggestion(1)
  }, [atsReport])

  return {
    currentSuggestion,
    setCurrentSuggestion,
    drawerVisible,
    setDrawerVisible,
  }
}
