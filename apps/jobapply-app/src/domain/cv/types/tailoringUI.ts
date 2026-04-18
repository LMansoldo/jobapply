/**
 * @file tailoringUI.ts
 * @description TypeScript interfaces/types for tailoring UI components.
 */

/** Workspace tab types */
export type WorkspaceTab = 'ats' | 'cover' | 'video' | 'interview'

/** Setup modal result */
export interface WorkspaceSetupResult {
  locale: 'en' | 'pt-BR'
  jobDescription: string
}