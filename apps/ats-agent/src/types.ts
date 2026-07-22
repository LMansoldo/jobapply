// ── CV sub-types ─────────────────────────────────────────────────────────────

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Experience {
  role?: string
  company?: string
  location?: string
  period?: string   // "MM/YYYY - MM/YYYY" or "MM/YYYY - Present"
  context?: string
  highlights?: string[]
}

export interface Education {
  degree?: string
  field?: string
  institution?: string
  location?: string
  period?: string
  notes?: string
}

export interface Language {
  language: string
  level: string
  score?: string
}

export interface Certification {
  name: string
  organization: string
  date?: string
}

export interface Project {
  name: string
  url?: string
  description?: string
  highlights?: string[]
}

export interface CVLocaleVersion {
  locale: 'en' | 'pt-BR'
  summary?: string
  skills?: SkillGroup[]
  experience?: Experience[]
}

export interface CV {
  _id?: string
  user?: string
  fullName?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
  summary?: string
  skills?: SkillGroup[]
  experience?: Experience[]
  education?: Education[]
  languages?: Language[]
  certifications?: Certification[]
  projects?: Project[]
  localeVersions?: CVLocaleVersion[]
  updatedAt?: string
}

// ── Agent types ───────────────────────────────────────────────────────────────

export interface AgentInput {
  cv?: CV
  cvMarkdown?: string
  jobDescription: string
  locale?: 'en' | 'pt-BR'
  platform?: string
  jobUrl?: string
}

export interface MappedCV {
  sections: {
    contact: string
    summary: string
    skills: string
    experience: string
    education: string
    languages: string
  }
  entities: {
    jobTitles: string[]
    companies: string[]
    skills: string[]
    techStack: string[]
    softSkills: string[]
    dates: string[]
    degrees: string[]
    urls: string[]
    experiencePeriods: Array<{ role: string; company: string; period: string }>
  }
  raw: CV
}

export interface PlatformScore {
  platform: string
  score: number
  passed: boolean
  missingRequired: string[]
  missingPreferred: string[]
  flags: string[]
  notes: string[]
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

export interface InterviewStory {
  jdRequirement: string
  story: string
}

export interface InterviewPrep {
  stories: InterviewStory[]
  overallPositioning: string
}

export interface ATSReport {
  universalScore: number
  platforms: PlatformScore[]
  semanticGaps: string[]
  optimalTemplate: {
    sectionsOrder: string[]
    keywordsToAdd: string[]
    keywordPhrases: KeywordPhrase[]
    keywordsToRephrase: { from: string; to: string }[]
    formatFixes: string[]
  }
  tips: {
    priority: 'critical' | 'high' | 'medium'
    tip: string
    applicableTo: string[]
  }[]
  removeSuggestions: RemoveSuggestion[]
}

// ── v2 types — adicionados em A1, velhos removidos em B4 ──────────────────────

export interface ScoreBreakdown {
  keywordCoverage: number   // 0–100
  contentQuality: number    // 0–100
  format: number            // 0–100
}

export interface WeightedKeyword {
  term: string
  weight: 'required' | 'preferred'
}

export interface ResumeDraft {
  summary: string
  skills: Array<{ category: string; items: string[] }>
  experience: Array<{
    positionIndex: number
    include: boolean
    context: string
    bullets: Array<{ sourceIndex: number; text: string }>
  }>
}

export interface VerificationViolation {
  location: string
  rule: 'metric-dropped' | 'metric-invented' | 'low-overlap' | 'jd-contamination' | 'invalid-source'
  detail: string
  action: 'reverted'
}

export interface VerificationReport {
  violations: VerificationViolation[]
}

export interface ParsedPosition {
  header: string
  period: string
  context: string
  bullets: string[]
}

export interface ResumeSource {
  positions: ParsedPosition[]
  educationRaw: string
  summaryRaw: string
  skillsRaw: string
}

export interface GraphState {
  input: AgentInput
  mapped?: MappedCV
  jdKeywords?: string[]
  weightedKeywords?: WeightedKeyword[]    // novo
  jobTitle?: string                        // novo
  scoreBreakdown?: ScoreBreakdown         // novo
  matchedKeywords?: string[]              // novo
  missingKeywords?: string[]              // novo
  platformScores?: PlatformScore[]        // mantido até B4
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
  report?: ATSReport
  adaptedCV?: CV
  resume?: string
  resumeDraft?: ResumeDraft              // novo
  resumeVerification?: VerificationReport // novo
}
