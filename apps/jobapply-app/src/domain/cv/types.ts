// ─── Legacy interfaces kept for PublishedCV compatibility ──────────────────────
export interface Experience {
  company: string
  role: string
  startDate: string
  endDate?: string
  description?: string
}

export interface Education {
  institution: string
  degree: string
  field?: string
  startDate?: string
  endDate?: string
  location?: string
  period?: string
}

// ─── Standalone domain types ─────────────────────────────────────────────────

export interface Language {
  language: string
  level: string
  score?: string
}

export interface Certification {
  name: string
  organization?: string
  date?: string
}

// ─── ATS Report types ────────────────────────────────────────────────────────

export interface RephraseEntry {
  from: string
  to: string
}

export interface ATSPlatformScore {
  platform: string
  score: number
  missingPreferred?: string[]
}

export interface ATSTip {
  tip: string
  priority: string
}

export interface ATSOptimalTemplate {
  keywordsToAdd: string[]
  keywordsToRephrase: RephraseEntry[]
  formatFixes: string[]
}

export interface ATSReport {
  universalScore: number
  platforms: ATSPlatformScore[]
  tips: ATSTip[]
  optimalTemplate: ATSOptimalTemplate
}

// ─── New locale version structure ─────────────────────────────────────────────

export interface CVLocaleSkillGroup {
  label: string
  items: string[]
}

export interface CVLocaleExperience {
  role: string
  company: string
  location: string
  period: string
  context?: string
  highlights: string[]
}

export interface CVLocaleEducation {
  degree: string
  institution: string
  location?: string
  period?: string
  details?: string
}

export interface CVLocaleProject {
  name: string
  url?: string
  description: string
  highlights?: string[]
}

export interface CVLocaleVersion {
  locale: 'en' | 'pt-BR'
  summary: string
  skills: CVLocaleSkillGroup[]
  experience: CVLocaleExperience[]
  education?: CVLocaleEducation[]
  certifications?: { name: string; org?: string; date?: string }[]
  projects?: CVLocaleProject[]
  languageLevels?: { name: string; level: string }[]
  skillPercentages?: { name: string; percent: number }[]
}

export type CVLocalePayload = Omit<CVLocaleVersion, 'locale'>

// ─── CV base (personal info only) ─────────────────────────────────────────────

export interface TailoredVersion {
  jobId: string
  tailoredContent: string
  createdAt: string
}

export interface CV {
  _id: string
  user: string
  fullName: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  title?: string
  github?: string
  website?: string
  portfolio?: string
  languages: string[]
  tailoredVersions: TailoredVersion[]
  localeVersions: CVLocaleVersion[]
  updatedAt: string
}

export interface CVCreatePayload {
  fullName: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  title?: string
  github?: string
  website?: string
  portfolio?: string
  languages?: string[]
}

// ─── Published CV ──────────────────────────────────────────────────────────────

export interface PublishedCV {
  _id: string
  user: string
  public_id: string
  fullName: string
  email: string
  phone?: string
  summary?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  languages: string[]
  published_at: string
}

export interface PublishCVPayload {
  fullName?: string
  email?: string
  phone?: string
  summary?: string
  skills?: string[]
  experience?: Experience[]
  education?: Education[]
  languages?: string[]
}

export interface PublishCVResponse {
  published: PublishedCV
  public_id: string
}

// ─── Tailor ───────────────────────────────────────────────────────────────────

export interface TailorCVResponse {
  tailoredCV: string
}
