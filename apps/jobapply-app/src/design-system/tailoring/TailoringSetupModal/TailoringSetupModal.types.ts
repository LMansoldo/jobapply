import type { WorkspaceSetupResult } from '../../../domain/cv/hooks/useTailoringWorkspace'

export interface TailoringSetupModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Current step (1 = locale, 2 = job description) */
  step: 1 | 2
  /** Available locales */
  locales: ('en' | 'pt-BR')[]
  /** Selected locale */
  selectedLocale: 'en' | 'pt-BR'
  /** Job description text */
  jobDescription: string
  /** Callback when locale changes */
  onLocaleChange: (locale: 'en' | 'pt-BR') => void
  /** Callback when job description changes */
  onJobDescriptionChange: (description: string) => void
  /** Callback when step changes */
  onStepChange: (step: 1 | 2) => void
  /** Callback when setup is confirmed */
  onConfirm: (result: WorkspaceSetupResult) => void
  /** Callback when setup is cancelled */
  onCancel: (result: WorkspaceSetupResult) => void
}