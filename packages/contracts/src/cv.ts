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
  objective?: string
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
  objective?: string
  github?: string
  portfolio?: string
  languages: Language[]
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
  objective?: string
  github?: string
  portfolio?: string
  languages?: Language[]
}

export interface PublishedCV {
  _id: string
  user: string
  public_id: string
  fullName: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
  objective?: string
  summary?: string
  skills: CVLocaleSkillGroup[]
  experience: CVLocaleExperience[]
  education: CVLocaleEducation[]
  languages: Language[]
  certifications?: Certification[]
  projects?: CVLocaleProject[]
  published_at: string
}

export interface PublishCVPayload {
  locale?: 'en' | 'pt-BR'
  fullName?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
  objective?: string
  summary?: string
  skills?: CVLocaleSkillGroup[]
  experience?: CVLocaleExperience[]
  education?: CVLocaleEducation[]
  languages?: Language[]
  certifications?: Certification[]
  projects?: CVLocaleProject[]
}

export interface PublishCVResponse {
  published: PublishedCV
  public_id: string
}
