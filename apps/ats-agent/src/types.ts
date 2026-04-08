// ── CV sub-types (from jobapply-api swagger) ─────────────────────────────────

export interface Highlight {
  text: string
  category?: string
}

export interface Experience {
  company?: string
  role?: string
  location?: string
  period?: string   // "Jan 2022 - Dec 2024" or "Jan 2022 - Present"
  highlights?: Highlight[]
}

export interface Education {
  institution?: string
  degree?: string
  graduation?: string   // "Dec 2022"
}

export interface Summary {
  headline?: string
  focus_areas?: string[]
  tagline?: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Skills {
  tech?: SkillGroup[]
  competencies?: SkillGroup[]
  soft_skills?: string[]
}

export interface Objective {
  role?: string
  main_stack?: string[]
}

export interface CVLocaleVersion {
  locale: 'en' | 'pt-BR'
  objective?: Objective
  summary?: Summary
  skills?: Skills
  expertise?: string[]
  experience?: Experience[]
  education?: Education
}

export interface CV {
  _id?: string
  user?: string
  fullName?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  objective?: Objective
  summary?: Summary
  skills?: Skills
  expertise?: string[]
  experience?: Experience[]
  education?: Education
  languages?: string[]
  localeVersions?: CVLocaleVersion[]
  updatedAt?: string
}

// ── Agent types ───────────────────────────────────────────────────────────────

export interface AgentInput {
  cv: CV
  jobDescription: string
  locale?: 'en' | 'pt-BR'
}

export interface MappedCV {
  sections: {
    contact: string
    objective: string
    summary: string
    skills: string
    expertise: string
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

export interface ATSReport {
  universalScore: number
  platforms: PlatformScore[]
  semanticGaps: string[]
  optimalTemplate: {
    sectionsOrder: string[]
    keywordsToAdd: string[]
    keywordsToRephrase: { from: string; to: string }[]
    formatFixes: string[]
  }
  tips: {
    priority: 'critical' | 'high' | 'medium'
    tip: string
    applicableTo: string[]
  }[]
}

export interface GraphState {
  input: AgentInput
  mapped?: MappedCV
  platformScores?: PlatformScore[]
  semanticGaps?: string[]
  report?: ATSReport
}
