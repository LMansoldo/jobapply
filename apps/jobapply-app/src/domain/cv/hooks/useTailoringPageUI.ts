/**
 * @file useTailoringPageUI.ts
 * @description Manages pure UI state for the tailoring workspace page.
 * Covers active tab, tone selection, suggestion navigation, and drawer visibility.
 */
import { useState, useEffect } from 'react'
import type { ATSReport } from '../types'
import type { WorkspaceTab } from '../types/tailoringUI'
import type { ToneKey } from '../../../design-system/ats/ToneChips/ToneChips.types'

interface UseTailoringPageUIParams {
  atsReport: ATSReport | null
}

export interface UseTailoringPageUIReturn {
  activeTab: WorkspaceTab
  setActiveTab: (tab: WorkspaceTab) => void
  tone: ToneKey
  setTone: (tone: ToneKey) => void
  currentSuggestion: number
  setCurrentSuggestion: (n: number) => void
  drawerVisible: boolean
  setDrawerVisible: (v: boolean) => void
}

export function useTailoringPageUI({ atsReport }: UseTailoringPageUIParams): UseTailoringPageUIReturn {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('ats')
  const [tone, setTone] = useState<ToneKey>('direct')
  const [currentSuggestion, setCurrentSuggestion] = useState(1)
  const [drawerVisible, setDrawerVisible] = useState(false)

  useEffect(() => {
    if (atsReport) setCurrentSuggestion(1)
  }, [atsReport])

  return {
    activeTab,
    setActiveTab,
    tone,
    setTone,
    currentSuggestion,
    setCurrentSuggestion,
    drawerVisible,
    setDrawerVisible,
  }
}
