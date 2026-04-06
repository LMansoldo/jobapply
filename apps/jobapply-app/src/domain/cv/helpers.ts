/**
 * @file helpers.ts
 * @description CV domain helper functions: markdown parsing, serialization, and export utilities.
 */
import type { CV, CVLocalePayload, CVLocaleVersion } from './types'

/** Result of parsing a markdown string into structured CV data */
export interface ParseResult {
  /** Parsed CV locale payload, or null if there were errors */
  data: CVLocalePayload | null
  /** List of validation error messages */
  errors: string[]
}

/**
 * Splits a markdown string into sections keyed by H1 headings.
 * @param md - The markdown string to parse
 * @returns A map from lowercased heading text to section body content
 */
export function splitH1Sections(md: string): Map<string, string> {
  const map = new Map<string, string>()
  const lines = md.split('\n')
  let heading = ''
  let body: string[] = []

  for (const line of lines) {
    if (/^# [^#]/.test(line)) {
      if (heading) map.set(heading.toLowerCase().trim(), body.join('\n').trim())
      heading = line.slice(2).trim()
      body = []
    } else {
      body.push(line)
    }
  }
  if (heading) map.set(heading.toLowerCase().trim(), body.join('\n').trim())
  return map
}

/**
 * Finds a section body by trying multiple key variations.
 * @param sections - Map of section headings to bodies
 * @param keys - One or more keys to search for (partial match)
 * @returns The section body string, or null if not found
 */
export function findSection(sections: Map<string, string>, ...keys: string[]): string | null {
  for (const key of keys) {
    for (const [k, v] of sections) {
      if (k.includes(key.toLowerCase())) return v
    }
  }
  return null
}

/**
 * Extracts a bold field value from a markdown body string.
 * @param body - The markdown body to search in
 * @param labels - One or more label names to try (e.g. 'Cargo', 'Role')
 * @returns The extracted field value, or empty string if not found
 */
export function extractBoldField(body: string, ...labels: string[]): string {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const m = body.match(new RegExp(`\\*\\*${escaped}[:\\*]*\\*?\\*?:?\\*?\\s*(.+)`, 'im'))
    if (m?.[1]?.trim()) return m[1].trim()
  }
  return ''
}

/**
 * Parses H2 subsections from a section body into label/items pairs.
 * @param body - The markdown section body to parse
 * @returns Array of subsection objects with label and items array
 */
export function parseSubSections(body: string): { label: string; items: string[] }[] {
  const result: { label: string; items: string[] }[] = []
  const lines = body.split('\n')
  let current: { label: string; items: string[] } | null = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) result.push(current)
      current = { label: line.slice(3).trim(), items: [] }
    } else if (current && line.trim() && !line.startsWith('#')) {
      const items = line.split(',').map((s) => s.trim()).filter(Boolean)
      current.items.push(...items)
    }
  }
  if (current) result.push(current)
  return result
}

/**
 * Parses bullet point lines from a markdown section body.
 * @param body - The markdown section body to parse
 * @returns Array of bullet point strings (without the leading dash/asterisk)
 */
export function parseBullets(body: string): string[] {
  return body
    .split('\n')
    .filter((line) => /^[\s]*[-*]\s/.test(line))
    .map((line) => line.replace(/^[\s]*[-*]\s/, '').trim())
    .filter(Boolean)
}

/**
 * Parses experience entries from a markdown experience section body.
 * @param body - The markdown section body containing experience entries
 * @returns Array of parsed experience objects matching CVLocalePayload['experience']
 */
export function parseExperiences(body: string): CVLocalePayload['experience'] {
  const result: CVLocalePayload['experience'] = []
  const lines = body.split('\n')
  let current: CVLocalePayload['experience'][0] | null = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) result.push(current)
      const header = line.slice(3).trim()
      const parts = header.split('|').map((s) => s.trim())
      current = {
        role: parts[0] ?? '',
        company: parts[1] ?? '',
        location: parts[2] ?? '',
        period: parts[3] ?? '',
        highlights: [],
      }
    } else if (current && /^[\s]*[-*]\s/.test(line)) {
      const item = line.replace(/^[\s]*[-*]\s/, '').trim()
      const catMatch = item.match(/^\[(\w+)\]\s*(.+)/)
      if (catMatch) {
        current.highlights.push({ category: catMatch[1], text: catMatch[2].trim() })
      } else {
        current.highlights.push({ category: 'general', text: item })
      }
    }
  }
  if (current) result.push(current)
  return result
}

/**
 * Parses a full markdown string into a structured CV locale payload.
 * @param md - The markdown string to parse
 * @param locale - The target locale ('en' or 'pt-BR')
 * @returns ParseResult with data if successful, or null data and error messages
 */
export function parseMarkdownToLocale(md: string, locale: 'en' | 'pt-BR'): ParseResult {
  const errors: string[] = []
  const sections = splitH1Sections(md)
  const pt = locale === 'pt-BR'

  const objBody = findSection(sections, pt ? 'objetivo' : 'objective')
  if (!objBody) errors.push(pt ? 'Seção "# Objetivo" não encontrada' : 'Section "# Objective" not found')
  const objRole = extractBoldField(objBody ?? '', pt ? 'Cargo' : 'Role')
  const objStackRaw = extractBoldField(objBody ?? '', pt ? 'Stack principal' : 'Main stack')
  if (!objRole) errors.push(pt ? '# Objetivo: campo **Cargo** não encontrado' : '# Objective: field **Role** not found')
  if (!objStackRaw) errors.push(pt ? '# Objetivo: campo **Stack principal** não encontrado' : '# Objective: field **Main stack** not found')

  const sumBody = findSection(sections, pt ? 'resumo' : 'summary')
  if (!sumBody) errors.push(pt ? 'Seção "# Resumo" não encontrada' : 'Section "# Summary" not found')
  const headline = extractBoldField(sumBody ?? '', 'Headline')
  const focusRaw = extractBoldField(sumBody ?? '', pt ? 'Áreas de foco' : 'Focus areas')
  const tagline = extractBoldField(sumBody ?? '', 'Tagline')
  if (!headline) errors.push(pt ? '# Resumo: campo **Headline** não encontrado' : '# Summary: field **Headline** not found')

  const techBody = findSection(sections, pt ? 'skills técnicas' : 'technical skills')
  const compBody = findSection(sections, pt ? 'competências' : 'competencies')
  const softBody = findSection(sections, 'soft skills')
  const expBody = findSection(sections, 'expertise')

  const expSectionBody = findSection(sections, pt ? 'experiência' : 'experience')
  if (!expSectionBody) errors.push(pt ? 'Seção "# Experiência" não encontrada' : 'Section "# Experience" not found')
  const experience = expSectionBody ? parseExperiences(expSectionBody) : []
  if (experience.length === 0) errors.push(pt ? '# Experiência: adicione ao menos uma experiência profissional' : '# Experience: add at least one work experience')

  const eduBody = findSection(sections, pt ? 'formação' : 'education')
  if (!eduBody) errors.push(pt ? 'Seção "# Formação" não encontrada' : 'Section "# Education" not found')
  const degree = extractBoldField(eduBody ?? '', pt ? 'Grau' : 'Degree')
  const institution = extractBoldField(eduBody ?? '', pt ? 'Instituição' : 'Institution')
  const graduation = extractBoldField(eduBody ?? '', pt ? 'Conclusão' : 'Graduation')
  if (!degree) errors.push(pt ? '# Formação: campo **Grau** não encontrado' : '# Education: field **Degree** not found')
  if (!institution) errors.push(pt ? '# Formação: campo **Instituição** não encontrado' : '# Education: field **Institution** not found')

  if (errors.length > 0) return { data: null, errors }

  return {
    data: {
      objective: {
        role: objRole,
        main_stack: objStackRaw.split(',').map((s) => s.trim()).filter(Boolean),
      },
      summary: {
        headline,
        focus_areas: focusRaw.split(',').map((s) => s.trim()).filter(Boolean),
        tagline,
      },
      skills: {
        tech: techBody ? parseSubSections(techBody) : [],
        competencies: compBody ? parseSubSections(compBody) : [],
        soft_skills: softBody ? parseBullets(softBody) : [],
      },
      expertise: expBody ? parseBullets(expBody) : [],
      experience,
      education: { degree, institution, graduation },
    },
    errors: [],
  }
}

/**
 * Converts a CVLocaleVersion back into a markdown string.
 * @param v - The CVLocaleVersion to serialize
 * @returns The markdown string representation
 */
export function localeVersionToMarkdown(v: CVLocaleVersion): string {
  const pt = v.locale === 'pt-BR'
  const lines: string[] = []

  lines.push(pt ? '# Objetivo' : '# Objective')
  lines.push(`**${pt ? 'Cargo' : 'Role'}:** ${v.objective?.role ?? ''}`)
  lines.push(`**${pt ? 'Stack principal' : 'Main stack'}:** ${v.objective?.main_stack?.join(', ') ?? ''}`)
  lines.push('')

  lines.push(pt ? '# Resumo' : '# Summary')
  lines.push(`**Headline:** ${v.summary?.headline ?? ''}`)
  lines.push(`**${pt ? 'Áreas de foco' : 'Focus areas'}:** ${v.summary?.focus_areas?.join(', ') ?? ''}`)
  lines.push(`**Tagline:** ${v.summary?.tagline ?? ''}`)
  lines.push('')

  lines.push(pt ? '# Skills Técnicas' : '# Technical Skills')
  for (const g of v.skills?.tech ?? []) {
    lines.push(`## ${g.label}`)
    lines.push(g.items.join(', '))
    lines.push('')
  }

  lines.push(pt ? '# Competências' : '# Competencies')
  for (const g of v.skills?.competencies ?? []) {
    lines.push(`## ${g.label}`)
    lines.push(g.items.join(', '))
    lines.push('')
  }

  lines.push('# Soft Skills')
  for (const s of v.skills?.soft_skills ?? []) lines.push(`- ${s}`)
  lines.push('')

  lines.push('# Expertise')
  for (const e of v.expertise ?? []) lines.push(`- ${e}`)
  lines.push('')

  lines.push(pt ? '# Experiência' : '# Experience')
  lines.push('')
  for (const exp of v.experience ?? []) {
    lines.push(`## ${exp.role} | ${exp.company} | ${exp.location} | ${exp.period}`)
    for (const h of exp.highlights ?? []) lines.push(`- [${h.category}] ${h.text}`)
    lines.push('')
  }

  lines.push(pt ? '# Formação' : '# Education')
  lines.push(`**${pt ? 'Grau' : 'Degree'}:** ${v.education?.degree ?? ''}`)
  lines.push(`**${pt ? 'Instituição' : 'Institution'}:** ${v.education?.institution ?? ''}`)
  lines.push(`**${pt ? 'Conclusão' : 'Graduation'}:** ${v.education?.graduation ?? ''}`)
  lines.push('')

  return lines.join('\n')
}

/**
 * Downloads the CV content as a Markdown file.
 * @param cv - The CV object to export
 */
export function downloadMarkdown(cv: CV): void {
  const ptBrVersion = cv.localeVersions?.find((v) => v.locale === 'pt-BR')
  const enVersion = cv.localeVersions?.find((v) => v.locale === 'en')
  const parts: string[] = []
  if (ptBrVersion) parts.push(`<!-- PT-BR -->\n${localeVersionToMarkdown(ptBrVersion)}`)
  if (enVersion) parts.push(`<!-- EN -->\n${localeVersionToMarkdown(enVersion)}`)
  const content = parts.join('\n\n---\n\n')
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cv-${cv.fullName.replace(/\s+/g, '-').toLowerCase()}.md`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Opens a print window with the CV formatted as HTML for PDF export.
 * @param cv - The CV object to export
 */
export function exportPDF(cv: CV): void {
  const ptBrVersion = cv.localeVersions?.find((v) => v.locale === 'pt-BR')
  const enVersion = cv.localeVersions?.find((v) => v.locale === 'en')

  function versionToHtml(v: CVLocaleVersion): string {
    const pt = v.locale === 'pt-BR'
    const sections: string[] = []

    sections.push(`<h2>${pt ? 'Objetivo' : 'Objective'}</h2>`)
    sections.push(`<p><strong>${pt ? 'Cargo' : 'Role'}:</strong> ${v.objective?.role ?? ''}</p>`)
    sections.push(`<p><strong>${pt ? 'Stack principal' : 'Main stack'}:</strong> ${v.objective?.main_stack?.join(', ') ?? ''}</p>`)

    sections.push(`<h2>${pt ? 'Resumo' : 'Summary'}</h2>`)
    sections.push(`<p>${v.summary?.headline ?? ''}</p>`)
    if (v.summary?.tagline) sections.push(`<p><em>${v.summary.tagline}</em></p>`)

    if (v.skills?.tech?.length) {
      sections.push(`<h2>${pt ? 'Skills Técnicas' : 'Technical Skills'}</h2>`)
      for (const g of v.skills.tech) {
        sections.push(`<p><strong>${g.label}:</strong> ${g.items.join(', ')}</p>`)
      }
    }
    if (v.skills?.competencies?.length) {
      sections.push(`<h2>${pt ? 'Competências' : 'Competencies'}</h2>`)
      for (const g of v.skills.competencies) {
        sections.push(`<p><strong>${g.label}:</strong> ${g.items.join(', ')}</p>`)
      }
    }
    if (v.skills?.soft_skills?.length) {
      sections.push(`<h2>Soft Skills</h2><ul>${v.skills.soft_skills.map((s) => `<li>${s}</li>`).join('')}</ul>`)
    }
    if (v.expertise?.length) {
      sections.push(`<h2>Expertise</h2><ul>${v.expertise.map((e) => `<li>${e}</li>`).join('')}</ul>`)
    }
    if (v.experience?.length) {
      sections.push(`<h2>${pt ? 'Experiência' : 'Experience'}</h2>`)
      for (const exp of v.experience) {
        sections.push(`<h3>${exp.role} — ${exp.company}</h3>`)
        sections.push(`<p><em>${exp.location} · ${exp.period}</em></p>`)
        if (exp.highlights?.length) {
          sections.push(`<ul>${exp.highlights.map((h) => `<li><strong>[${h.category}]</strong> ${h.text}</li>`).join('')}</ul>`)
        }
      }
    }
    if (v.education) {
      sections.push(`<h2>${pt ? 'Formação' : 'Education'}</h2>`)
      sections.push(`<p><strong>${v.education.degree}</strong> — ${v.education.institution} (${v.education.graduation})</p>`)
    }
    return sections.join('\n')
  }

  const header = `
    <h1>${cv.fullName}</h1>
    <p>${[cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).join(' · ')}</p>
    ${cv.languages?.length ? `<p><strong>${cv.localeVersions?.[0]?.locale === 'pt-BR' ? 'Idiomas' : 'Languages'}:</strong> ${cv.languages.join(', ')}</p>` : ''}
    <hr/>
  `

  const bodies: string[] = []
  if (ptBrVersion) bodies.push(versionToHtml(ptBrVersion))
  if (enVersion) {
    if (ptBrVersion) bodies.push('<hr style="page-break-before:always"/>')
    bodies.push(versionToHtml(enVersion))
  }

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>CV – ${cv.fullName}</title>
  <style>
    @page { size: A4; margin: 18mm 20mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1a1a1a; max-width: 170mm; margin: 0 auto; line-height: 1.55; }
    h1 { font-size: 22pt; margin: 0 0 4px; }
    h2 { font-size: 12pt; font-weight: 700; border-bottom: 1.5px solid #1677ff; padding-bottom: 3px; margin: 18px 0 8px; color: #111; text-transform: uppercase; letter-spacing: .5px; }
    h3 { font-size: 11pt; font-weight: 600; margin: 10px 0 2px; }
    p { margin: 3px 0; }
    ul { margin: 4px 0; padding-left: 18px; }
    li { margin: 2px 0; }
    em { color: #555; }
    hr { border: none; border-top: 1px solid #ddd; margin: 14px 0; }
    strong { font-weight: 600; }
  </style>
</head>
<body>${header}${bodies.join('\n')}</body>
</html>`)
  win.document.close()
  setTimeout(() => { win.print() }, 300)
}
