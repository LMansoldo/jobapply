/**
 * @file types.ts
 * @description Types for the LinkedIn domain — profile input and analysis output.
 */
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

export type VoiceAnswers = VoiceAnswer[]

export interface AnalyzeLinkedInPayload {
  profile: LinkedInProfile
  voiceAnswers?: VoiceAnswers
  locale?: 'en' | 'pt-BR'
}

export interface LinkedInExperienceGap {
  role: string
  original: string
  rewrite: string
}

export interface LinkedInKeywordGaps {
  technical: string[]
  domain: string[]
  softSkills: string[]
  certifications: string[]
}

export interface VoiceProfile {
  signaturePatterns: string[]
  qualityNote: string
}

export interface LinkedInAnalysis {
  headlineAnalysis: {
    currentScore: 'weak' | 'moderate' | 'strong'
    alternatives: string[]
  }
  aboutAudit: {
    issues: string[]
    rewrite: string
  }
  experienceGaps: LinkedInExperienceGap[]
  keywordGaps: LinkedInKeywordGaps
  quickWins: string[]
  overallScore: {
    score: number
    strengths: string[]
    blockers: string[]
    priorityAction: string
  }
  voiceProfile?: VoiceProfile
  locale: 'en' | 'pt-BR'
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

export interface ActionItem {
  action: string
  reason: string
  priority: 'high' | 'medium' | 'low'
}

export interface SectionScore {
  score: number
  label: 'headline' | 'about' | 'experience' | 'skills'
}

export interface SEOReport {
  overall_score: number
  keyword_density_score: number
  completeness_score: number
  specificity_score: number
  role_alignment_score: number
  authority_score: number
  missing_keywords: string[]
  generic_phrases: Array<{ phrase: string; reason: string; suggestion: string }>
  completeness_gaps: string[]
  action_items: ActionItem[]
  sections: Record<string, SectionScore>
}

export interface GenerationOutput {
  headlineAnalysis: { currentScore: 'weak' | 'moderate' | 'strong'; alternatives: string[] }
  aboutAudit: { issues: string[]; rewrite: string | null }
  experienceGaps: Array<{ role: string; original: string; rewrite: string }>
  keywordGaps: { technical: string[]; domain: string[]; softSkills: string[]; certifications: string[] }
  quickWins: string[]
  overallScore: { score: number; strengths: string[]; blockers: string[]; priorityAction: string }
  voiceProfile: { tone: string; signaturePatterns: string[]; rawInputMissing: boolean; qualityNote: string }
}

export interface LinkedInResult {
  seo: {
    before: SEOReport
    after: SEOReport
    delta: number
  }
  generation: GenerationOutput
  locale: 'en' | 'pt-BR'
}

/** Raw user info returned by LinkedIn OpenID Connect after OAuth. */
export interface LinkedInOAuthProfile {
  sub: string
  name: string
  given_name: string
  family_name: string
  email: string
  picture?: string | null
}
