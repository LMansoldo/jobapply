import type { KeywordPhrase } from '@jobapply/contracts'

export interface KeywordPhrasesPanelProps {
  phrases: KeywordPhrase[]
  onCopyPhrase: (phrase: string) => void
}
