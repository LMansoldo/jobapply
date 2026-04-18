import type { AgentInput, CV, CVLocaleVersion, MappedCV, SkillGroup } from '../../types'

const URL_PATTERN = /https?:\/\/[^\s"'<>]+/g

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
  const { cv, locale } = state.input

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
