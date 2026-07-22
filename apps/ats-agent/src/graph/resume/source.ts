import type { MappedCV, ParsedPosition, ResumeSource, CV } from '../../types'

export const EXPERIENCE_ALIASES = [
  'professional experience', 'experience', 'experiência profissional',
  'experiencia profissional', 'experiência', 'experiencia',
]

export const EDUCATION_ALIASES = [
  'education', 'educação', 'educacao', 'formação', 'formacao', 'formação acadêmica',
]

function extractRawMarkdownSection(md: string, aliases: string[]): string {
  const parts = md.split(/\n(?=## )/g)
  for (const part of parts) {
    const firstNewline = part.indexOf('\n')
    if (firstNewline === -1) continue
    const heading = part.slice(0, firstNewline).replace(/^##\s*/, '').trim().toLowerCase()
    if (aliases.includes(heading)) return part.slice(firstNewline + 1).trim()
  }
  return ''
}

export function parseExperiencePositions(experienceRaw: string): ParsedPosition[] {
  const sections = experienceRaw.split(/\n(?=###\s)/g).filter((s) => s.trim())
  return sections.map((section) => {
    const lines = section.split('\n')
    const header = lines.find((l) => l.startsWith('###')) ?? ''
    const periodLine = lines.find((l) => /^\*\*[^*]+\*\*$/.test(l.trim())) ?? ''
    const period = periodLine.replace(/^\*\*|\*\*$/g, '').trim()

    const bullets: string[] = []
    const contextLines: string[] = []
    let inBullets = false

    for (const line of lines) {
      if (line.startsWith('###') || /^\*\*[^*]+\*\*$/.test(line.trim())) continue
      if (/^[-*]\s+/.test(line)) {
        inBullets = true
        bullets.push(line.replace(/^[-*]\s+/, '').trim())
      } else if (!inBullets && line.trim()) {
        contextLines.push(line.trim())
      }
    }

    return { header, period, context: contextLines.join(' '), bullets }
  }).filter((p) => p.header)
}

function buildExperienceFromRawCV(cv: CV): string {
  if (!cv.experience?.length) return ''
  return cv.experience.map((exp) => {
    const header = [exp.role, exp.company, exp.location].filter(Boolean).join(' | ')
    const lines = [`### ${header}`, `**${exp.period ?? ''}**`]
    if (exp.context) lines.push(exp.context)
    for (const h of exp.highlights ?? []) lines.push(`- ${h}`)
    return lines.join('\n')
  }).join('\n\n')
}

function buildEducationFromRawCV(cv: CV): string {
  if (!cv.education?.length) return ''
  return cv.education.map((edu) => {
    const degreeField = [edu.degree, edu.field].filter(Boolean).join(' in ')
    const meta = [edu.institution, edu.location, edu.period].filter(Boolean).join(' | ')
    return `### ${degreeField}\n${meta}`
  }).join('\n\n')
}

export function buildResumeSource(mapped: MappedCV, cvMarkdown?: string, rawCV?: CV): ResumeSource {
  let experienceRaw: string
  let educationRaw: string
  let summaryRaw: string
  let skillsRaw: string

  if (cvMarkdown) {
    experienceRaw = extractRawMarkdownSection(cvMarkdown, EXPERIENCE_ALIASES)
    educationRaw = extractRawMarkdownSection(cvMarkdown, EDUCATION_ALIASES)
    summaryRaw = mapped.sections.summary
    skillsRaw = mapped.sections.skills
  } else if (rawCV) {
    experienceRaw = buildExperienceFromRawCV(rawCV)
    educationRaw = buildEducationFromRawCV(rawCV)
    summaryRaw = mapped.sections.summary
    skillsRaw = mapped.sections.skills
  } else {
    experienceRaw = mapped.sections.experience
    educationRaw = mapped.sections.education
    summaryRaw = mapped.sections.summary
    skillsRaw = mapped.sections.skills
  }

  return {
    positions: parseExperiencePositions(experienceRaw),
    educationRaw,
    summaryRaw,
    skillsRaw,
  }
}
