export interface RephraseEntry {
  from: string
  to: string
}

export interface ScoreBreakdown {
  factClarity: number
  jdAdherence: number
  humanReadability: number
  prominence: number
  /** informativo — cobertura booleana ponderada por tier; não entra no universalScore */
  keywordCoverage: number
}

export interface BulletInsight {
  positionIndex: number
  bulletIndex: number
  role: string
  text: string
  /** 0–100 — fato único, concreto e compreensível isolado */
  clarity: number
  /** 0–100 — quanto este fato prova algo que a JD exige */
  jdRelevance: number
  issue?: string
  suggestion?: string
}

/** Padrões de escrita de LLM detectados no texto do CV */
export interface AiSmellFix {
  /** 'summary' | 'p{positionIndex}.b{bulletIndex}' */
  location: string
  original: string
  /** reescrita validada (fidelidade de fatos); '' quando indisponível */
  rewrite: string
  issues: string[]
}

export interface ATSTip {
  tip: string
  priority: string
}

export interface KeywordPhrase {
  keyword: string
  phrases: string[]
}

export interface RemoveSuggestion {
  section: string
  item: string
  reason: string
}

export interface ATSOptimalTemplate {
  keywordsToAdd: string[]
  keywordPhrases: KeywordPhrase[]
  keywordsToRephrase: RephraseEntry[]
  formatFixes: string[]
}

export interface ATSReport {
  universalScore: number
  scoreBreakdown: ScoreBreakdown
  bulletInsights: BulletInsight[]
  aiSmellFixes: AiSmellFix[]
  matchedKeywords: string[]
  missingKeywords: string[]
  tips: ATSTip[]
  optimalTemplate: ATSOptimalTemplate
  removeSuggestions?: RemoveSuggestion[]
  semanticGaps?: string[]
}
