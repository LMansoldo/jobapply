import type { LinkedInAnalysis, VoiceAnswers } from '../../../domain/linkedin/types'
import type { LinkedInView } from '../../../domain/linkedin/hooks/useLinkedInAnalysis'

export interface LinkedInWorkspaceProps {
  view: LinkedInView
  analysis: LinkedInAnalysis | null
  loading: boolean
  locale?: 'en' | 'pt-BR'
  onAnalyzePDF: (file: File, voiceAnswers?: VoiceAnswers) => Promise<void>
  onReset: () => void
}
