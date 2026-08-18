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
  scoreBreakdown: ScoreBreakdown
  matchedKeywords: string[]
  missingKeywords: string[]
  semanticGaps: string[]
  optimalTemplate: {
    sectionsOrder: string[]
    keywordsToAdd: string[]
    keywordPhrases: KeywordPhrase[]
    keywordsToRephrase: { from: string; to: string }[]
    formatFixes: string[]
  }
  tips: { priority: 'critical' | 'high' | 'medium'; tip: string }[]
  removeSuggestions: RemoveSuggestion[]
  // v3 (aditivo)
  requirementMatches?: RequirementMatch[]
  recruiterReview?: RecruiterReview
}

// ── v2 types — adicionados em A1, velhos removidos em B4 ──────────────────────

export interface ScoreBreakdown {
  keywordCoverage: number   // 0–100 (legado; = literalCoverage após migração)
  contentQuality: number    // 0–100
  format: number            // 0–100
  // v3 — redesign semântico (aditivo; ver specs SPEC-0..5)
  literalCoverage?: number   // 0–100 cobertura literal (deflação corrigida)
  semanticCoverage?: number  // 0–100 cobertura considerando matches semânticos
  niceToHaveBonus?: number   // 0–100 só soma, nunca penaliza
  recruiterScore?: number    // 0–100 média ponderada do RecruiterReview
}

// ── v3 — redesign análise semântica + recruiter (SPEC-0) ─────────────────────

export interface JDRequirement {
  term: string
  tier: 'must-have' | 'important' | 'nice-to-have'
  category: 'skill' | 'tool' | 'domain' | 'credential' | 'soft'
  aliases: string[]          // termos equivalentes p/ match literal
}

export interface JDIntentSignal {
  text: string               // frase que repondera um requisito/área
  effect: 'downweight' | 'upweight'
  target: string             // requisito/área afetada
}

export type MatchKind = 'exact' | 'semantic' | 'transferable' | 'missing'

export interface RequirementMatch {
  term: string
  tier: JDRequirement['tier']
  kind: MatchKind
  confidence: number         // 0–1
  evidence: string           // trecho do CV que sustenta; '' se missing
}

export interface RecruiterReview {
  narrativeScore: number     // 0–100 storytelling/coerência dos bullets
  seniorityScore: number     // 0–100 sinal de senioridade vs JD
  domainFitScore: number     // 0–100 aderência de domínio/indústria
  notes: string[]            // observações qualitativas acionáveis, tom sóbrio
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
  rule: 'metric-dropped' | 'metric-invented' | 'low-overlap' | 'jd-contamination' | 'invalid-source' | 'unverified-skill' | 'generic-phrase'
  detail: string
  action: 'reverted' | 'removed'
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
  requirements?: JDRequirement[]
  intentSignals?: JDIntentSignal[]
  jobTitle?: string
  literalCoverage?: number
  matched?: RequirementMatch[]
  unmatched?: JDRequirement[]
  semanticMatches?: RequirementMatch[]
  recruiterReview?: RecruiterReview
  universalScore?: number
  scoreBreakdown?: ScoreBreakdown
  requirementMatches?: RequirementMatch[]
  matchedKeywords?: string[]
  missingKeywords?: string[]
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
  report?: ATSReport
  resumeDraft?: ResumeDraft
  resumeVerification?: VerificationReport
}
