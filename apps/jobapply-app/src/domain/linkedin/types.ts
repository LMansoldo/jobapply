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

/** Raw user info returned by LinkedIn OpenID Connect after OAuth. */
export interface LinkedInOAuthProfile {
  sub: string
  name: string
  given_name: string
  family_name: string
  email: string
  picture?: string | null
}
