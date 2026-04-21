import type { AgentInput, CV, CVLocaleVersion, MappedCV, SkillGroup } from '../../types'

const URL_PATTERN = /https?:\/\/[^\s"'<>]+/g

// ── Markdown → MappedCV ───────────────────────────────────────────────────────

const SECTION_ALIASES: Record<keyof MappedCV['sections'], string[]> = {
  contact: ['contact', 'contato'],
  summary: ['summary', 'resumo', 'about', 'sobre'],
  skills: ['skills', 'habilidades', 'competências', 'competencias'],
  experience: ['professional experience', 'experiência profissional', 'experiencia profissional', 'experience', 'experiência', 'experiencia'],
  education: ['education', 'educação', 'educacao', 'formação', 'formacao', 'formação acadêmica'],
  languages: ['languages', 'idiomas'],
}

function extractMarkdownSections(md: string): Record<string, string> {
  const result: Record<string, string> = {}
  const parts = md.split(/\n(?=## )/g)
  for (const part of parts) {
    const firstNewline = part.indexOf('\n')
    if (firstNewline === -1) continue
    const heading = part.slice(0, firstNewline).replace(/^##\s*/, '').trim().toLowerCase()
    result[heading] = part.slice(firstNewline + 1).trim()
  }
  return result
}

function resolveSection(sections: Record<string, string>, aliases: string[]): string {
  for (const alias of aliases) {
    if (sections[alias]) return sections[alias]
  }
  return ''
}

export function mapFromMarkdown(cvMarkdown: string): MappedCV {
  const sections = extractMarkdownSections(cvMarkdown)

  const contact = resolveSection(sections, SECTION_ALIASES.contact)
  const summary = resolveSection(sections, SECTION_ALIASES.summary)
  const skillsRaw = resolveSection(sections, SECTION_ALIASES.skills)
  const experienceRaw = resolveSection(sections, SECTION_ALIASES.experience)
  const educationRaw = resolveSection(sections, SECTION_ALIASES.education)
  const languages = resolveSection(sections, SECTION_ALIASES.languages)

  // Extract skills text (strip bold labels)
  const skillsText = skillsRaw.replace(/\*\*[^*]+:\*\*/g, '').replace(/\n/g, ' ').trim()

  // Extract experience entities from markdown structure
  const jobTitles: string[] = []
  const companies: string[] = []
  const dates: string[] = []
  const experiencePeriods: Array<{ role: string; company: string; period: string }> = []

  for (const line of experienceRaw.split('\n')) {
    const roleMatch = line.match(/^###\s+(.+)/)
    if (roleMatch) {
      const parts = roleMatch[1].split('|').map(s => s.trim())
      if (parts[0]) jobTitles.push(parts[0])
      if (parts[1]) companies.push(parts[1])
    }
    const periodMatch = line.match(/^\*\*([^*]+)\*\*$/)
    if (periodMatch) {
      dates.push(periodMatch[1])
      const lastRole = jobTitles[jobTitles.length - 1] ?? ''
      const lastCompany = companies[companies.length - 1] ?? ''
      experiencePeriods.push({ role: lastRole, company: lastCompany, period: periodMatch[1] })
    }
  }

  const degrees: string[] = []
  for (const line of educationRaw.split('\n')) {
    const degMatch = line.match(/^###\s+(.+)/)
    if (degMatch) degrees.push(degMatch[1])
  }

  const urls = (cvMarkdown.match(URL_PATTERN) ?? [])

  // Flatten experience text: remove markdown structure markers
  const experienceText = experienceRaw
    .split('\n')
    .filter(l => !l.startsWith('###') && !l.match(/^\*\*[^*]+\*\*$/))
    .join(' ')
    .trim()

  const educationText = educationRaw
    .split('\n')
    .filter(l => !l.startsWith('###'))
    .join(' ')
    .trim()

  return {
    sections: { contact, summary, skills: skillsText, experience: experienceText, education: educationText, languages },
    entities: {
      jobTitles,
      companies,
      skills: [],
      techStack: [],
      softSkills: [],
      dates,
      degrees,
      urls: [...new Set(urls)],
      experiencePeriods,
    },
    raw: {} as CV,
  }
}

const SOFT_SKILL_LABELS = ['soft', 'interpersonal', 'communication', 'leadership', 'behavior']

function mergeLocaleVersion(base: CV, locale: CVLocaleVersion): CV {
  return {
    ...base,
    ...(locale.summary !== undefined && { summary: locale.summary }),
    ...(locale.skills?.length && { skills: locale.skills }),
    ...(locale.experience?.length && { experience: locale.experience }),
  }
}

function flattenSkills(skills: SkillGroup[] | undefined): { all: string[]; tech: string[]; soft: string[] } {
  const tech: string[] = []
  const soft: string[] = []

  for (const group of skills ?? []) {
    const isSoft = SOFT_SKILL_LABELS.some(s => group.label.toLowerCase().includes(s))
    if (isSoft) {
      soft.push(...group.items)
    } else {
      tech.push(...group.items)
    }
  }

  return { all: [...tech, ...soft], tech, soft }
}

function extractUrlsFromExperience(experience: CV['experience']): string[] {
  const urls: string[] = []
  for (const exp of experience ?? []) {
    for (const h of exp.highlights ?? []) {
      const found = h.match(URL_PATTERN) ?? []
      urls.push(...found)
    }
  }
  return urls
}

export function mapperNode(state: { input: AgentInput }): { mapped: MappedCV } {
  if (state.input.cvMarkdown) {
    return { mapped: mapFromMarkdown(state.input.cvMarkdown) }
  }

  const { cv, locale } = state.input
  if (!cv) throw new Error('mapperNode: cv or cvMarkdown is required')

  let merged = cv
  if (locale) {
    const localeVersion = cv.localeVersions?.find(v => v.locale === locale)
    if (localeVersion) {
      merged = mergeLocaleVersion(cv, localeVersion)
    }
  }

  const skills = flattenSkills(merged.skills)
  const experience = merged.experience ?? []
  const education = merged.education ?? []

  // ── Flat text sections ────────────────────────────────────────────────────────
  const contact = [
    merged.fullName,
    merged.email,
    merged.phone,
    merged.location,
    merged.linkedin,
    merged.github,
    merged.portfolio,
  ].filter(Boolean).join(' ')

  const summary = merged.summary ?? ''

  const skillsText = skills.all.join(' ')

  const experienceText = experience
    .flatMap(e => [e.context, ...(e.highlights ?? [])].filter(Boolean))
    .join(' ')

  const educationText = education
    .flatMap(e => [e.degree, e.field, e.institution, e.period].filter(Boolean))
    .join(' ')

  const languagesText = (merged.languages ?? [])
    .map(l => `${l.language} ${l.level}`)
    .join(' ')

  // ── Structured entities ───────────────────────────────────────────────────────
  const jobTitles = experience.map(e => e.role).filter((r): r is string => Boolean(r))
  const companies = experience.map(e => e.company).filter((c): c is string => Boolean(c))
  const dates = experience.map(e => e.period).filter((p): p is string => Boolean(p))
  const degrees = education.map(e => e.degree).filter((d): d is string => Boolean(d))

  const urls: string[] = []
  if (merged.linkedin) urls.push(merged.linkedin)
  if (merged.github) urls.push(merged.github)
  if (merged.portfolio) urls.push(merged.portfolio)
  urls.push(...extractUrlsFromExperience(experience))

  const experiencePeriods = experience
    .filter(e => e.period)
    .map(e => ({
      role: e.role ?? '',
      company: e.company ?? '',
      period: e.period as string,
    }))

  return {
    mapped: {
      sections: {
        contact,
        summary,
        skills: skillsText,
        experience: experienceText,
        education: educationText,
        languages: languagesText,
      },
      entities: {
        jobTitles,
        companies,
        skills: skills.all,
        techStack: skills.tech,
        softSkills: skills.soft,
        dates,
        degrees,
        urls: [...new Set(urls)],
        experiencePeriods,
      },
      raw: merged,
    },
  }
}
