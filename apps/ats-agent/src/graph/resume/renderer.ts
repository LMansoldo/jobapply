import type { ResumeDraft, ResumeSource } from '../../types'

const SECTION_LABELS: Record<string, Record<string, string>> = {
  'pt-BR': { objective: 'Objetivo', summary: 'Resumo', skills: 'Habilidades', experience: 'Experiência Profissional', education: 'Educação' },
  'en': { objective: 'Objective', summary: 'Summary', skills: 'Skills', experience: 'Experience', education: 'Education' },
}

function labels(locale?: string) {
  return SECTION_LABELS[locale ?? 'en'] ?? SECTION_LABELS['en']
}

export function renderResume(
  draft: ResumeDraft,
  source: ResumeSource,
  jobTitle: string,
  locale?: string,
): string {
  const L = labels(locale)
  const lines: string[] = []

  // Objective
  if (jobTitle) {
    lines.push(`## ${L.objective}`, '', jobTitle, '')
  }

  // Summary
  lines.push(`## ${L.summary}`, '', draft.summary, '')

  // Skills
  if (draft.skills.length > 0) {
    lines.push(`## ${L.skills}`)
    for (const group of draft.skills) {
      lines.push(`**${group.category}:** ${group.items.join(', ')}`)
    }
    lines.push('')
  }

  // Experience
  const includedPositions = draft.experience.filter((e) => e.include)
  if (includedPositions.length > 0) {
    lines.push(`## ${L.experience}`)
    for (const entry of includedPositions) {
      const pos = source.positions[entry.positionIndex]
      if (!pos) continue

      const header = pos.header.startsWith('###') ? pos.header : `### ${pos.header}`
      lines.push(header)
      lines.push(`**${pos.period}**`)
      lines.push('')
      lines.push(entry.context)
      lines.push('')
      for (const bullet of entry.bullets) {
        lines.push(`- ${bullet.text}`)
      }
      lines.push('')
    }
  }

  // Education
  if (source.educationRaw) {
    lines.push(`## ${L.education}`, '', source.educationRaw, '')
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
