import type { KeywordPhrase } from '../../../domain/cv/types'

export interface KeywordPhrasesPanelProps {
  phrases: KeywordPhrase[]
  onCopyPhrase: (phrase: string) => void
}
