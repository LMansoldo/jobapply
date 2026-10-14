import type { CV } from '@jobapply/contracts'

export interface ExtensionCV extends CV {
  markdown?: string
}

const PT_BR_SIGNALS = [
  'você',
  'empresa',
  'vaga',
  'cargo',
  'equipe',
  'requisitos',
  'experiência',
  'habilidades',
  'responsabilidades',
  'profissional',
  'oportunidade',
  'candidato',
  'benefícios',
  'remuneração',
  'atuação',
  'salário'
]

export function detectLocale(text: string): 'pt-BR' | 'en' {
  const lower = text.toLowerCase()
  const ptMatches = PT_BR_SIGNALS.filter((w) => lower.includes(w)).length
  const hasAccents = /[ãçêáéíóúàâêîôûõ]/i.test(text)
  return ptMatches >= 2 || (ptMatches >= 1 && hasAccents) ? 'pt-BR' : 'en'
}

export function cvToMarkdown(cv: ExtensionCV): string {
  const lines: string[] = [`# ${cv.fullName || 'CV'}`, '']
  const locale = cv.localeVersions?.find((version) => version.locale === 'en') ?? cv.localeVersions?.[0]
  const contacts = [cv.email, cv.phone, cv.location, cv.linkedin, cv.github, cv.portfolio].filter(Boolean) as string[]

  if (cv.objective || locale?.objective) lines.push('## Objective', '', locale?.objective ?? cv.objective ?? '', '')
  if (contacts.length > 0) lines.push('## Contact', '', contacts.join(' · '), '')
  if (locale?.summary) lines.push('## Summary', '', locale.summary, '')

  if (locale?.skills?.length) {
    lines.push('## Skills', '')
    for (const group of locale.skills) {
      if (group.items.length > 0) lines.push(`**${group.label}:** ${group.items.join(', ')}`)
    }
    lines.push('')
  }

  if (locale?.experience?.length) {
    lines.push('## Experience', '')
    for (const experience of locale.experience) {
      const heading = [experience.role, experience.company, experience.location].filter(Boolean).join(' | ')
      if (heading) lines.push(`### ${heading}`)
      if (experience.period) lines.push(`**${experience.period}**`)
      if (experience.context) lines.push('', experience.context)
      for (const highlight of experience.highlights ?? []) lines.push(`- ${highlight}`)
      lines.push('')
    }
  }

  if (locale?.education?.length) {
    lines.push('## Education', '')
    for (const education of locale.education) {
      const heading = education.degree
      if (heading) lines.push(`### ${heading}`)
      const details = [education.institution, education.location, education.period].filter(Boolean)
      if (details.length) lines.push(details.join(' | '))
      if (education.details) lines.push('', education.details)
      lines.push('')
    }
  }

  const languageLevels = locale?.languageLevels ?? cv.languages?.map((language) => ({ name: language.language, level: language.level }))
  if (languageLevels?.length) {
    lines.push('## Languages', '', ...languageLevels.map((language) => `${language.name}: ${language.level}`), '')
  }

  if (locale?.certifications?.length) {
    lines.push('## Certifications', '')
    for (const certification of locale.certifications) {
      lines.push(`- ${certification.name}${certification.org ? ` — ${certification.org}` : ''}${certification.date ? ` (${certification.date})` : ''}`)
    }
    lines.push('')
  }

  if (locale?.projects?.length) {
    lines.push('## Projects', '')
    for (const project of locale.projects) {
      lines.push(`### ${project.name}`)
      if (project.url) lines.push(project.url)
      if (project.description) lines.push('', project.description)
      for (const highlight of project.highlights ?? []) lines.push(`- ${highlight}`)
      lines.push('')
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
