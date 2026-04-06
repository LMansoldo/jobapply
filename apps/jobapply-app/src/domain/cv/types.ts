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
  field: string
  startDate: string
  endDate?: string
}

// ─── New locale version structure ─────────────────────────────────────────────

export interface CVLocaleObjective {
  role: string
  main_stack: string[]
}

export interface CVLocaleSummary {
  headline: string
  focus_areas: string[]
  tagline: string
}

export interface CVLocaleSkillGroup {
  label: string
  items: string[]
}

export interface CVLocaleSkills {
  tech: CVLocaleSkillGroup[]
  competencies: CVLocaleSkillGroup[]
  soft_skills: string[]
}

export interface CVLocaleExperienceHighlight {
  text: string
  category: string
}

export interface CVLocaleExperience {
  role: string
  company: string
  location: string
  period: string
  highlights: CVLocaleExperienceHighlight[]
}

export interface CVLocaleEducation {
  degree: string
  institution: string
  graduation: string
}

export interface CVLocaleVersion {
  locale: 'en' | 'pt-BR'
  objective: CVLocaleObjective
  summary: CVLocaleSummary
  skills: CVLocaleSkills
  expertise: string[]
  experience: CVLocaleExperience[]
  education: CVLocaleEducation
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
