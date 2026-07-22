/**
 * @file tailoringUIHelpers.ts
 * @description Pure functions for UI logic in tailoring workspace components.
 */

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

/** Calculate total setup steps based on available locales */
export function calculateTotalSetupSteps(locales: string[]): number {
  return locales.length > 1 ? 2 : 1
}