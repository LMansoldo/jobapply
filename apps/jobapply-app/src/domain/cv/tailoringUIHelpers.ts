/**
 * @file tailoringUIHelpers.ts
 * @description Pure functions for UI logic in tailoring workspace components.
 */

import type { WorkspaceTab } from './types/tailoringUI'
import type { ToneKey, ToneOption } from '../../design-system/ats/ToneChips/ToneChips.types'
import { Colors } from '../../styles/theme/colors'

/** Build tone options for AI generation controls */
export function buildToneOptions(): ToneOption[] {
  return [
    { key: 'formal', label: 'Formal' },
    { key: 'direct', label: 'Direct' },
    { key: 'creative', label: 'Creative' },
    { key: 'confident', label: 'Confident' },
  ]
}

/** Analysis status information */
export interface AnalysisStatus {
  isRunning: boolean
  dotClass: string
  labelClass: string
  label: string
}

/** Get analysis status information for display */
export function getAnalysisStatus(
  isAnalysisRunning: boolean,
  t: (key: string) => string
): AnalysisStatus {
  return {
    isRunning: isAnalysisRunning,
    dotClass: isAnalysisRunning ? 'analysisDotRunning' : 'analysisDot',
    labelClass: isAnalysisRunning ? 'analysisLabelRunning' : 'analysisLabel',
    label: isAnalysisRunning ? t('tailoring.analysisRunning') : t('tailoring.analysisComplete'),
  }
}

/** Score metrics for ATS panel */
export interface ScoreMetrics {
  suggestionsCount: number
  currentScore: number
  projectedScore: number
  scoreDelta: number
}

/** Calculate score metrics from panel data */
export function calculateScoreMetrics(panelData: {
  suggestionsCount?: number
  score?: number
  projectedScore?: number
  scoreDelta?: number
} | null): ScoreMetrics {
  return {
    suggestionsCount: panelData?.suggestionsCount ?? 0,
    currentScore: panelData?.score ?? 0,
    projectedScore: panelData?.projectedScore ?? 0,
    scoreDelta: panelData?.scoreDelta ?? 0,
  }
}

/** Tab badge colors for different workspace tabs */
export interface TabBadgeColors {
  bg: string
  color: string
}

/** Get badge colors for workspace tabs */
export function getTabBadgeColors(tab: WorkspaceTab): TabBadgeColors {
  switch (tab) {
    case 'ats':
      return { bg: Colors.primaryLight, color: Colors.primaryDark }
    case 'cover':
      return { bg: Colors.successBg, color: Colors.success }
    case 'video':
      return { bg: Colors.orangeBg, color: Colors.orange }
    default:
      return { bg: Colors.surfaceBorder, color: Colors.textSub }
  }
}

/** Calculate total setup steps based on available locales */
export function calculateTotalSetupSteps(locales: string[]): number {
  return locales.length > 1 ? 2 : 1
}