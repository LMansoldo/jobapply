import type { ATSTip, KeywordPhrase, RemoveSuggestion } from './ats'

export interface EditorKeywords {
  toAdd: string[]
  toRephrase: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  semanticGaps?: string[]
  tips?: ATSTip[]
  removeSuggestions?: RemoveSuggestion[]
}
