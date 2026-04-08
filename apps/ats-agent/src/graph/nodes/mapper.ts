import type { AgentInput, CV, CVLocaleVersion, MappedCV, Experience, Skills } from '../../types'

const URL_PATTERN = /https?:\/\/[^\s"'<>]+/g

function mergeLocaleVersion(base: CV, locale: CVLocaleVersion): CV {
  return {
    ...base,
    objective: locale.objective ?? base.objective,
    summary: locale.summary ?? base.summary,
    skills: locale.skills ?? base.skills,
    expertise: locale.expertise ?? base.expertise,
    experience: locale.experience ?? base.experience,
    education: locale.education ?? base.education,
  }
}

function flattenSkills(skills: Skills | undefined): { all: string[]; tech: string[]; soft: string[] } {
  const tech: string[] = []
  const soft: string[] = skills?.soft_skills ?? []

  for (const group of skills?.tech ?? []) {
    tech.push(...group.items)
  }
  for (const group of skills?.competencies ?? []) {
    tech.push(...group.items)
  }

  return { all: [...tech, ...soft], tech, soft }
}

function extractUrlsFromExperience(experience: Experience[]): string[] {
  const urls: string[] = []
  for (const exp of experience) {
    for (const h of exp.highlights ?? []) {
      const found = h.text.match(URL_PATTERN) ?? []
      urls.push(...found)
    }
  }
  return urls
}

export function mapperNode(state: { input: AgentInput }): { mapped: MappedCV } {
  const { cv, locale } = state.input

  // Apply locale version if requested
  let merged = cv
  if (locale) {
    const localeVersion = cv.localeVersions?.find(v => v.locale === locale)
    if (localeVersion) {
      merged = mergeLocaleVersion(cv, localeVersion)
    }
  }

  const skills = flattenSkills(merged.skills)
  const experience = merged.experience ?? []
  const education = merged.education

  // ── Flat text sections ───────────────────────────────────────────────────────
  const contact = [
    merged.fullName,
    merged.email,
    merged.phone,
    merged.location,
    merged.linkedin,
  ].filter(Boolean).join(' ')

  const objective = [
    merged.objective?.role,
    ...(merged.objective?.main_stack ?? []),
  ].filter(Boolean).join(' ')

  const summary = [
    merged.summary?.headline,
    merged.summary?.tagline,
    ...(merged.summary?.focus_areas ?? []),
  ].filter(Boolean).join(' ')

  const skillsText = skills.all.join(' ')

  const expertiseText = (merged.expertise ?? []).join(' ')

  const experienceText = experience
    .flatMap(e => (e.highlights ?? []).map(h => h.text))
    .join(' ')

  const educationText = [
    education?.institution,
    education?.degree,
    education?.graduation,
  ].filter(Boolean).join(' ')

  const languagesText = (merged.languages ?? []).join(' ')

  // ── Structured entities ──────────────────────────────────────────────────────
  const jobTitles = experience.map(e => e.role).filter((r): r is string => Boolean(r))
  const companies = experience.map(e => e.company).filter((c): c is string => Boolean(c))
  const dates = experience.map(e => e.period).filter((p): p is string => Boolean(p))
  const degrees = education?.degree ? [education.degree] : []

  const urls: string[] = []
  if (merged.linkedin) urls.push(merged.linkedin)
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
        objective,
        summary,
        skills: skillsText,
        expertise: expertiseText,
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
