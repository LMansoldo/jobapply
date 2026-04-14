/**
 * @file helpers.ts
 * @description CV domain helper functions: markdown parsing, serialization, and export utilities.
 *
 * Markdown format follows the standard CV template:
 *   ## Summary        — plain text paragraph
 *   ## Skills          — **Label:** comma-separated items
 *   ## Experience      — ### Role | Company | Location  +  **Period**  +  context  +  bullets
 *   ## Education       — ### Degree  +  **Institution** | Location | **Period**
 *   ## Certifications  — bullet list: Name — Org — Date
 *   ## Languages       — bullet list: Language: Level
 */
import type { CV, CVLocalePayload, CVLocaleVersion } from './types'

// ─── Parse Result ────────────────────────────────────────────────────────────

export interface ParseResult {
  data: CVLocalePayload | null
  errors: string[]
  languages?: string[]
}

// ─── Low-level helpers ───────────────────────────────────────────────────────

/**
 * Splits markdown into sections keyed by H2 headings.
 */
export function splitH2Sections(md: string): Map<string, string> {
  const map = new Map<string, string>()
  const lines = md.split('\n')
  let heading = ''
  let body: string[] = []

  for (const line of lines) {
    if (/^## [^#]/.test(line)) {
      if (heading) map.set(heading.toLowerCase().trim(), body.join('\n').trim())
      heading = line.slice(3).trim()
      body = []
    } else {
      body.push(line)
    }
  }
  if (heading) map.set(heading.toLowerCase().trim(), body.join('\n').trim())
  return map
}

/** Backward compat — also split on H1 if present */
export function splitSections(md: string): Map<string, string> {
  const h2 = splitH2Sections(md)
  if (h2.size > 0) return h2
  // fallback: try H1
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

export function findSection(sections: Map<string, string>, ...keys: string[]): string | null {
  for (const key of keys) {
    for (const [k, v] of sections) {
      if (k.includes(key.toLowerCase())) return v
    }
  }
  return null
}

// ─── Skills parser  (**Label:** items, items) ────────────────────────────────

function parseSkillsSection(body: string): { label: string; items: string[] }[] {
  const result: { label: string; items: string[] }[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/^\*\*([^*]+)\*\*:?\s*(.+)/)
    if (m) {
      result.push({
        label: m[1].trim().replace(/:$/, ''),
        items: m[2].split(',').map((s) => s.trim()).filter(Boolean),
      })
    }
  }
  return result
}

// ─── Experience parser (### Role | Company | Location) ───────────────────────

function parseExperiences(body: string): CVLocalePayload['experience'] {
  const result: CVLocalePayload['experience'] = []
  const lines = body.split('\n')
  let current: CVLocalePayload['experience'][0] | null = null

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (current) result.push(current)
      const header = line.slice(4).trim()
      const parts = header.split('|').map((s) => s.trim())
      current = {
        role: parts[0] ?? '',
        company: parts[1] ?? '',
        location: parts[2] ?? '',
        period: '',
        highlights: [],
      }
    } else if (current && /^\*\*(.+)\*\*\s*$/.test(line)) {
      // **04/2022 – 04/2025**
      current.period = line.replace(/\*\*/g, '').trim()
    } else if (current && /^[\s]*[-*]\s/.test(line)) {
      current.highlights.push(line.replace(/^[\s]*[-*]\s/, '').trim())
    } else if (current && line.trim() && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('---')) {
      // Context line (plain text paragraph after period)
      if (!current.context && current.period) {
        current.context = line.trim()
      }
    }
  }
  if (current) result.push(current)
  return result
}

// ─── Education parser (### Degree  /  **Institution** | Location | **Period**) ─

function parseEducation(body: string): CVLocalePayload['education'] {
  const result: NonNullable<CVLocalePayload['education']> = []
  const lines = body.split('\n')
  let degree = ''

  for (const line of lines) {
    if (line.startsWith('### ')) {
      degree = line.slice(4).trim()
    } else if (degree && /^\*\*/.test(line)) {
      // **University** | Location | **Period**
      const clean = line.replace(/\*\*/g, '').trim()
      const parts = clean.split('|').map((s) => s.trim())
      result.push({
        degree,
        institution: parts[0] ?? '',
        location: parts[1],
        period: parts[2],
      })
      degree = ''
    }
  }
  return result
}

// ─── Certifications parser (- Name — Org — Date) ────────────────────────────

function parseCertifications(body: string): NonNullable<CVLocalePayload['certifications']> {
  return body
    .split('\n')
    .filter((l) => /^[\s]*[-*]\s/.test(l))
    .map((l) => {
      const text = l.replace(/^[\s]*[-*]\s/, '').trim()
      const parts = text.split(/\s*[—–-]\s*/)
      return {
        name: parts[0]?.trim() ?? text,
        org: parts[1]?.trim(),
        date: parts[2]?.trim(),
      }
    })
}

// ─── Languages parser (- Language: Level) ────────────────────────────────────

function parseLanguages(body: string): NonNullable<CVLocalePayload['languageLevels']> {
  return body
    .split('\n')
    .filter((l) => /^[\s]*[-*]\s/.test(l))
    .map((l) => {
      const text = l.replace(/^[\s]*[-*]\s/, '').trim()
      const [name, ...rest] = text.split(':')
      return { name: name.trim(), level: rest.join(':').trim() }
    })
    .filter((l) => l.name && l.level)
}

// ─── Main parser ─────────────────────────────────────────────────────────────

export function parseMarkdownToLocale(md: string, locale: 'en' | 'pt-BR'): ParseResult {
  const errors: string[] = []
  const sections = splitSections(md)
  const pt = locale === 'pt-BR'

  // Summary
  const sumBody = findSection(sections, pt ? 'resumo' : 'summary')
  if (!sumBody) errors.push(pt ? 'Seção "## Resumo" não encontrada' : 'Section "## Summary" not found')
  const summary = (sumBody ?? '').split('\n').filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('>')).join(' ').trim()

  // Skills
  const skillsBody = findSection(sections, 'skills')
  const skills = skillsBody ? parseSkillsSection(skillsBody) : []

  // Experience
  const expBody = findSection(sections, pt ? 'experiência' : 'experience')
  if (!expBody) errors.push(pt ? 'Seção "## Experiência" não encontrada' : 'Section "## Experience" not found')
  const experience = expBody ? parseExperiences(expBody) : []
  if (experience.length === 0) errors.push(pt ? 'Adicione ao menos uma experiência profissional' : 'Add at least one work experience')

  // Education (optional)
  const eduBody = findSection(sections, pt ? 'formação' : 'education')
  const education = eduBody ? parseEducation(eduBody) : undefined

  // Certifications (optional)
  const certBody = findSection(sections, pt ? 'certificações' : 'certifications')
  const certifications = certBody ? parseCertifications(certBody) : undefined

  // Languages (optional)
  const langBody = findSection(sections, pt ? 'idiomas' : 'languages')
  const languageLevels = langBody ? parseLanguages(langBody) : undefined

  if (errors.length > 0) return { data: null, errors }

  return {
    data: {
      summary,
      skills,
      experience,
      education: education?.length ? education : undefined,
      certifications: certifications?.length ? certifications : undefined,
      languageLevels: languageLevels?.length ? languageLevels : undefined,
    },
    errors: [],
  }
}

// ─── Serializer (API data → markdown) ────────────────────────────────────────

export function localeVersionToMarkdown(v: CVLocaleVersion, _languages?: string[]): string {
  const pt = v.locale === 'pt-BR'
  const lines: string[] = []

  // Summary
  lines.push(pt ? '## Resumo' : '## Summary')
  lines.push('')
  lines.push(v.summary ?? '')
  lines.push('')

  // Skills
  lines.push('## Skills')
  lines.push('')
  for (const g of v.skills ?? []) {
    lines.push(`**${g.label}:** ${g.items.join(', ')}`)
  }
  lines.push('')

  // Experience
  lines.push(pt ? '## Experiência Profissional' : '## Professional Experience')
  lines.push('')
  for (const exp of v.experience ?? []) {
    const locationPart = exp.location ? ` | ${exp.location}` : ''
    lines.push(`### ${exp.role} | ${exp.company}${locationPart}`)
    if (exp.period) lines.push(`**${exp.period}**`)
    lines.push('')
    if (exp.context) {
      lines.push(exp.context)
      lines.push('')
    }
    for (const h of exp.highlights ?? []) lines.push(`- ${h}`)
    lines.push('')
  }

  // Education
  if (v.education?.length) {
    lines.push(pt ? '## Formação' : '## Education')
    lines.push('')
    for (const edu of v.education) {
      lines.push(`### ${edu.degree}`)
      const parts = [edu.institution, edu.location, edu.period].filter(Boolean)
      lines.push(`**${parts.join(' | ')}**`)
      if (edu.details) lines.push(edu.details)
      lines.push('')
    }
  }

  // Certifications
  if (v.certifications?.length) {
    lines.push(pt ? '## Certificações' : '## Certifications')
    lines.push('')
    for (const c of v.certifications) {
      const parts = [c.name, c.org, c.date].filter(Boolean)
      lines.push(`- ${parts.join(' — ')}`)
    }
    lines.push('')
  }

  // Projects
  if (v.projects?.length) {
    lines.push(pt ? '## Projetos' : '## Projects')
    lines.push('')
    for (const p of v.projects) {
      lines.push(`### ${p.name}`)
      if (p.url) lines.push(p.url)
      lines.push(p.description)
      for (const h of p.highlights ?? []) lines.push(`- ${h}`)
      lines.push('')
    }
  }

  // Languages
  if (v.languageLevels?.length) {
    lines.push(pt ? '## Idiomas' : '## Languages')
    lines.push('')
    for (const l of v.languageLevels) {
      lines.push(`- ${l.name}: ${l.level}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ─── Export utilities ────────────────────────────────────────────────────────

export function downloadMarkdown(cv: CV): void {
  const ptBrVersion = cv.localeVersions?.find((v) => v.locale === 'pt-BR')
  const enVersion = cv.localeVersions?.find((v) => v.locale === 'en')
  const parts: string[] = []

  // Header with personal info
  const header = `# ${cv.fullName}\n\n${[cv.location, cv.email, cv.phone].filter(Boolean).join(' | ')}\n${[cv.linkedin, cv.github, cv.portfolio ?? cv.website].filter(Boolean).join(' | ')}\n`
  parts.push(header)

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

export function exportPDF(cv: CV): void {
  const ptBrVersion = cv.localeVersions?.find((v) => v.locale === 'pt-BR')
  const enVersion = cv.localeVersions?.find((v) => v.locale === 'en')

  function versionToHtml(v: CVLocaleVersion): string {
    const pt = v.locale === 'pt-BR'
    const s: string[] = []

    if (v.summary) {
      s.push(`<h2>${pt ? 'Resumo' : 'Summary'}</h2>`)
      s.push(`<p>${v.summary}</p>`)
    }

    if (v.skills?.length) {
      s.push(`<h2>Skills</h2>`)
      for (const g of v.skills) {
        s.push(`<p><strong>${g.label}:</strong> ${g.items.join(', ')}</p>`)
      }
    }

    const jobExp = (v.experience ?? []).filter((e) => e.company && e.period)
    if (jobExp.length) {
      s.push(`<h2>${pt ? 'Experiência Profissional' : 'Professional Experience'}</h2>`)
      for (const exp of jobExp) {
        s.push(`<h3>${exp.role} | ${exp.company}${exp.location ? ` | ${exp.location}` : ''}</h3>`)
        s.push(`<p><strong>${exp.period}</strong></p>`)
        if (exp.context) s.push(`<p>${exp.context}</p>`)
        if (exp.highlights?.length) {
          s.push(`<ul>${exp.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>`)
        }
      }
    }

    if (v.education?.length) {
      s.push(`<h2>${pt ? 'Formação' : 'Education'}</h2>`)
      for (const edu of v.education) {
        s.push(`<h3>${edu.degree}</h3>`)
        s.push(`<p><strong>${[edu.institution, edu.location, edu.period].filter(Boolean).join(' | ')}</strong></p>`)
        if (edu.details) s.push(`<p>${edu.details}</p>`)
      }
    }

    if (v.certifications?.length) {
      s.push(`<h2>${pt ? 'Certificações' : 'Certifications'}</h2>`)
      s.push(`<ul>${v.certifications.map((c) => `<li>${[c.name, c.org, c.date].filter(Boolean).join(' — ')}</li>`).join('')}</ul>`)
    }

    if (v.languageLevels?.length) {
      s.push(`<h2>${pt ? 'Idiomas' : 'Languages'}</h2>`)
      s.push(`<ul>${v.languageLevels.map((l) => `<li>${l.name}: ${l.level}</li>`).join('')}</ul>`)
    }

    return s.join('\n')
  }

  const header = `
    <h1>${cv.fullName}</h1>
    <p>${[cv.location, cv.email, cv.phone].filter(Boolean).join(' | ')}</p>
    <p>${[cv.linkedin, cv.github, cv.portfolio ?? cv.website].filter(Boolean).join(' | ')}</p>
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

// ─── Legacy compat aliases ───────────────────────────────────────────────────
export const splitH1Sections = splitSections
