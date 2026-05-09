// ── Input ─────────────────────────────────────────────────────────────────────

export interface LinkedInProfile {
  headline: string
  about: string
  experience: string
  skills: string
  education: string
  certifications?: string
}

export interface VoiceAnswer {
  label: string
  answer: string
}

export interface AnchorEvidence {
  metric: string
  timeframe: string
  action: string
}

export interface LinkedInInput {
  profile: LinkedInProfile
  targetRole?: string
  targetSector?: string[]
  positioning?: string[]
  tone?: string
  anchorEvidence?: AnchorEvidence
  jobDescription?: string
  locale?: 'en' | 'pt-BR'
  voiceAnswers?: VoiceAnswer[]
}

// ── SEO Report ────────────────────────────────────────────────────────────────

export interface GenericPhrase {
  phrase: string
  reason: string
  suggestion: string
}

export type ActionPriority = 'high' | 'medium' | 'low'

export interface ActionItem {
  action: string
  reason: string
  priority: ActionPriority
}

export interface SectionScore {
  label: string
  score: number
}

export interface SEOReport {
  overall_score: number
  keyword_density_score: number
  completeness_score: number
  specificity_score: number
  role_alignment_score: number
  authority_score: number
  missing_keywords: string[]
  generic_phrases: GenericPhrase[]
  completeness_gaps: string[]
  action_items: ActionItem[]
  sections: Record<string, SectionScore>
}

// ── Generation Output ─────────────────────────────────────────────────────────

export interface GenerationOutput {
  headlineAnalysis: {
    currentScore: 'weak' | 'moderate' | 'strong'
    alternatives: string[]
  }
  aboutAudit: {
    issues: string[]
    rewrite: string | null
  }
  experienceGaps: Array<{ role: string; original: string; rewrite: string }>
  keywordGaps: {
    technical: string[]
    domain: string[]
    softSkills: string[]
    certifications: string[]
  }
  quickWins: string[]
  overallScore: {
    score: number
    strengths: string[]
    blockers: string[]
    priorityAction: string
  }
  voiceProfile: {
    tone: string
    signaturePatterns: string[]
    avoidedPatterns: string[]
    rawInputMissing: boolean
    qualityNote: string
  }
}

// ── Final Result ──────────────────────────────────────────────────────────────

export interface LinkedInResult {
  seo: {
    before: SEOReport
    after: SEOReport
    delta: number
  }
  generation: GenerationOutput
  locale: 'en' | 'pt-BR'
}

// ── Graph State ───────────────────────────────────────────────────────────────

export interface GraphState {
  input: LinkedInInput
  // profileParser output
  normalizedProfile: LinkedInProfile
  // jdKeywordExtractor output
  jdKeywords: string[]
  // seoScorer output (partial scores)
  keywordDensityScore: number
  completenessScore: number
  roleAlignmentScore: number
  completenessGaps: string[]
  missingKeywords: string[]
  // authorityScorer output
  authorityScore: number
  // genericDetector output
  genericPhrases: GenericPhrase[]
  specificityScore: number
  // reportCompiler output
  seoBefore: SEOReport
  // profileGenerator output
  generation: GenerationOutput
  // deltaCalculator output
  seoAfter: SEOReport
  delta: number
}
