import type { ToneKey, ToneOption } from '../../../design-system/ats/ToneChips/ToneChips.types'

export interface CoverLetterWorkspaceProps {
  /** Current cover letter content */
  coverContent: string
  /** Whether cover letter generation is loading */
  coverLoading: boolean
  /** Current selected tone */
  tone: ToneKey
  /** Available tone options */
  toneOptions: ToneOption[]
  /** Callback when cover content changes */
  onCoverContentChange: (content: string) => void
  /** Callback when tone changes */
  onToneChange: (tone: ToneKey) => void
  /** Callback to generate cover letter */
  onGenerateCoverLetter: () => void
}

export interface CoverLetterWorkspaceProps {
  /** Current cover letter content */
  coverContent: string
  /** Whether cover letter generation is loading */
  coverLoading: boolean
  /** Current selected tone */
  tone: ToneKey
  /** Available tone options */
  toneOptions: ToneOption[]
  /** Callback when cover content changes */
  onCoverContentChange: (content: string) => void
  /** Callback when tone changes */
  onToneChange: (tone: ToneKey) => void
  /** Callback to generate cover letter */
  onGenerateCoverLetter: () => void
}