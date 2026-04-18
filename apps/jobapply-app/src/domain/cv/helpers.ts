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
import { Colors } from '../../styles/theme/colors'
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

export function localeVersionToMarkdown(v: CVLocaleVersion, _languages?: Array<{ language: string; level: string } | string>): string {
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

/**
 * Downloads a markdown string as a .md file.
 * @param content The markdown content to download
 * @param filename Optional filename (without extension). Defaults to 'tailored-cv'.
 */
export function downloadMarkdownText(content: string, filename = 'tailored-cv'): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.md`
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
    h2 { font-size: 12pt; font-weight: 700; border-bottom: 1.5px solid #7c3aed; padding-bottom: 3px; margin: 18px 0 8px; color: #111; text-transform: uppercase; letter-spacing: .5px; }
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

// ─── PDF Export using pdfMake directly ──────────────────────────────────────

import * as pdfMake from 'pdfmake/build/pdfmake'

// Initialize pdfMake with fonts
async function initializePdfMake(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    // Load pdfMake and vfs_fonts (contains Roboto fonts)
    const pdfMakeModule = await import('pdfmake/build/pdfmake')
    const vfsFonts = await import('pdfmake/build/vfs_fonts')

    // Assign vfs to pdfMake
    ;(pdfMakeModule.default as any).vfs = vfsFonts.default

    // Register Roboto fonts from vfs_fonts (available fonts)
    ;(pdfMakeModule.default as any).fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    }
  } catch (error) {
    console.warn('Failed to initialize pdfMake:', error)
  }
}


/**
 * Downloads markdown content as a styled PDF using pdfMake directly
 * @param markdownContent The markdown content to convert to PDF
 * @param fullName The full name for the filename
 * @param locale The locale for the filename
 * @param jobTitle The job title for the filename
 */
export async function downloadMarkdownAsPdf(
  markdownContent: string,
  cv: CV,
  locale: string,
  jobTitle: string
): Promise<void> {
  try {
    // Try to initialize pdfMake
    await initializePdfMake()

    // Create filename with format: full_name_locale_job_title
    const safeFullName = cv.fullName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    const safeLocale = locale.replace(/[^a-zA-Z0-9-]/g, '')
    const safeJobTitle = jobTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    const filename = `${safeFullName}_${safeLocale}_${safeJobTitle}.pdf`

    // Convert markdown to pdfMake content with CV contact info
    const content = convertMarkdownToPdfMake(markdownContent, cv, jobTitle)

    const docDefinition: any = {
      pageSize: 'A4' as const,
      pageMargins: [36, 28, 36, 28] as [number, number, number, number],
      defaultStyle: {
        fontSize: 10,
        lineHeight: 1.25,
        color: '#1a1a1a',
      },
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 3],
        },
        subheader: {
          fontSize: 12,
          bold: true,
          color: '#222',
          margin: [0, 4, 0, 1],
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          color: Colors.primaryDeeper,
          margin: [0, 6, 0, 1],
        },
        jobTitle: {
          fontSize: 11,
          color: '#555',
          margin: [0, 0, 0, 4],
        },
        normal: {
          fontSize: 10,
          margin: [0, 0, 0, 0],
        },
        list: {
          margin: [0, 0, 0, 2],
        },
        listItem: {
          fontSize: 10,
        },
      },
      content: content,
    }
    

    // Use Roboto fonts registered in initializePdfMake()
    docDefinition.defaultStyle.font = 'Roboto'

    // Create and download PDF
    const pdfDoc = pdfMake.createPdf(docDefinition)
    pdfDoc.download(filename)

  } catch (error) {
    console.error('Error generating PDF with pdfMake:', error)
    // Fallback to browser print if library fails
    await downloadMarkdownAsPdfFallback(markdownContent, cv, locale, jobTitle)
  }
}

// SVG paths for contact icons (Material Design, 24×24 viewBox)
const ICON_LOCATION = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
const ICON_EMAIL    = 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
const ICON_PHONE    = 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'
const ICON_LINKEDIN = 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z'
const ICON_GITHUB   = 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z'
const ICON_GLOBE    = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'

function makeContactItem(iconPath: string, label: string, link?: string): any {
  const color = link ? Colors.primaryDeeper : '#444'
  return {
    columns: [
      {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${Colors.primaryDeeper}"><path d="${iconPath}"/></svg>`,
        width: 9,
        height: 9,
        margin: [0, 1.5, 3, 0],
      },
      { text: label, link: link ?? undefined, color, fontSize: 9, width: 'auto', decoration: link ? 'underline' : undefined },
    ],
    columnGap: 0,
    width: 'auto',
  }
}

function ensureHttps(url: string): string {
  return /^https?:\/\//.test(url) ? url : `https://${url}`
}

/**
 * Convert markdown to pdfMake content array
 */
function convertMarkdownToPdfMake(
  markdownContent: string,
  cv: CV,
  jobTitle: string
): any[] {
  const content: any[] = []

  // ── Header ────────────────────────────────────────────────────────────────
  content.push({ text: cv.fullName, style: 'header' })
  if (jobTitle) content.push({ text: jobTitle, style: 'jobTitle' })

  // ── Contact row 1: location · email · phone ───────────────────────────────
  const row1: any[] = []
  if (cv.location) row1.push(makeContactItem(ICON_LOCATION, cv.location))
  if (cv.email)    row1.push(makeContactItem(ICON_EMAIL, cv.email, `mailto:${cv.email}`))
  if (cv.phone)    row1.push(makeContactItem(ICON_PHONE, cv.phone))
  if (row1.length) content.push({ columns: row1, columnGap: 14, margin: [0, 3, 0, 2] })

  // ── Contact row 2: linkedin · github · portfolio ──────────────────────────
  const row2: any[] = []
  if (cv.linkedin) row2.push(makeContactItem(ICON_LINKEDIN, cv.linkedin.replace(/^https?:\/\//, ''), ensureHttps(cv.linkedin)))
  if (cv.github)   row2.push(makeContactItem(ICON_GITHUB, cv.github.replace(/^https?:\/\//, ''), ensureHttps(cv.github)))
  const site = cv.portfolio ?? cv.website
  if (site) row2.push(makeContactItem(ICON_GLOBE, site.replace(/^https?:\/\//, ''), ensureHttps(site)))
  if (row2.length) content.push({ columns: row2, columnGap: 14, margin: [0, 0, 0, 4] })

  // ── Divider ───────────────────────────────────────────────────────────────
  content.push({
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 1.5, lineColor: Colors.primaryDark }],
    margin: [0, 2, 0, 8],
  })

  // Parse markdown lines
  const lines = markdownContent.split('\n')
  let inList = false
  let listItems: any[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      // Empty line - close list if open
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }
      content.push({ text: '', margin: [0, 0, 0, 0] })
      continue
    }

    // Check for headers
    if (trimmed.startsWith('# ')) {
      // H1 - already handled in header
      continue
    } else if (trimmed.startsWith('## ')) {
      // H2 - section title with underline
      if (inList && listItems.length > 0) {
        content.push({ ul: listItems, style: 'list' })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(3).trim()
      content.push({ text: title, style: 'sectionTitle' })
      content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 1.5, lineColor: Colors.primaryDeeper }],
        margin: [0, 1, 0, 3],
      })
    } else if (trimmed.startsWith('### ')) {
      // H3 - subsection
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(4).trim()
      content.push({ text: title, style: 'subheader' })
    } else if (trimmed.match(/^[-*+]\s/)) {
      // List item
      inList = true
      const itemText = trimmed.substring(2).trim()
      // Parse bold/italic in list items
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else if (trimmed.match(/^\d+\.\s/)) {
      // Ordered list item
      inList = true
      const itemText = trimmed.replace(/^\d+\.\s/, '').trim()
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else {
      // Regular paragraph
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }

      // Parse inline formatting (bold, italic, etc.)
      const parsedText = parseInlineFormatting(trimmed)
      content.push({ text: parsedText, style: 'normal' })
    }
  }

  // Close any open list
  if (inList && listItems.length > 0) {
    content.push({
      ul: listItems,
      style: 'list',
    })
  }

  return content
}

/**
 * Parse inline markdown formatting (bold, italic) for pdfMake
 */
function parseInlineFormatting(text: string): any {
  // Simple parsing for **bold** and *italic*
  const parts: any[] = []
  let currentText = ''
  let i = 0

  while (i < text.length) {
    if (text.substring(i, i + 3) === '***') {
      // Bold and italic
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 3
      let end = text.indexOf('***', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, bold: true, italics: true })
      i = end + 3
    } else if (text.substring(i, i + 2) === '**') {
      // Bold
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 2
      let end = text.indexOf('**', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, bold: true })
      i = end + 2
    } else if (text[i] === '*') {
      // Italic
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 1
      let end = text.indexOf('*', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, italics: true })
      i = end + 1
    } else if (text.substring(i, i + 2) === '__') {
      // Alternative bold syntax
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 2
      let end = text.indexOf('__', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, bold: true })
      i = end + 2
    } else if (text[i] === '_') {
      // Alternative italic syntax
      if (currentText) {
        parts.push({ text: currentText })
        currentText = ''
      }
      i += 1
      let end = text.indexOf('_', i)
      if (end === -1) end = text.length
      const content = text.substring(i, end)
      parts.push({ text: content, italics: true })
      i = end + 1
    } else {
      currentText += text[i]
      i += 1
    }
  }

  if (currentText) {
    parts.push({ text: currentText })
  }

  // If only one part with no formatting, return as plain text
  if (parts.length === 1 && !parts[0].bold && !parts[0].italics) {
    return parts[0].text
  }

  return parts
}

/**
 * Fallback PDF generation using browser print
 */
async function downloadMarkdownAsPdfFallback(
  markdownContent: string,
  cv: CV,
  locale: string,
  jobTitle: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Simple markdown to HTML conversion
      let htmlContent = markdownContent
        // Headers
        .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
        .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Code
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

      // Handle lists - convert list items and wrap in ul/ol
      const lines = htmlContent.split('\n')
      const processedLines: string[] = []
      let inList = false
      let listItems: string[] = []

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.match(/^[-*+]\s/)) {
          // List item
          if (!inList) {
            inList = true
          }
          const content = trimmed.substring(2)
          listItems.push(`<li>${content}</li>`)
        } else if (trimmed.match(/^\d+\.\s/)) {
          // Ordered list item
          if (!inList) {
            inList = true
          }
          const content = trimmed.replace(/^\d+\.\s/, '')
          listItems.push(`<li>${content}</li>`)
        } else {
          // Not a list item
          if (inList && listItems.length > 0) {
            processedLines.push(`<ul>${listItems.join('')}</ul>`)
            listItems = []
            inList = false
          }
          processedLines.push(line)
        }
      }

      // Handle any remaining list items
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul>${listItems.join('')}</ul>`)
      }

      htmlContent = processedLines.join('\n')

      // Handle paragraphs (double newlines)
      htmlContent = htmlContent.replace(/\n\n/g, '</p><p>')
      htmlContent = `<p>${htmlContent}</p>`

      // Clean up empty paragraphs
      htmlContent = htmlContent.replace(/<p><\/p>/g, '')
      htmlContent = htmlContent.replace(/<p>\s*<\/p>/g, '')

      const wrappedHtml = htmlContent

      // Add contact info (same format as downloadMarkdown function)
      const contactLine1 = [cv.location, cv.email, cv.phone].filter(Boolean).join(' | ')
      const contactLine2 = [cv.linkedin, cv.github, cv.portfolio ?? cv.website].filter(Boolean).join(' | ')

      const htmlDoc = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <title>CV – ${cv.fullName}</title>
  <style>
    @page { size: A4; margin: 18mm 20mm; }
    * { box-sizing: border-box; }
    body { font-family: Verdana, Arial, sans-serif; font-size: 12pt; color: #1a1a1a; max-width: 170mm; margin: 0 auto; line-height: 1.55; }
    h1 { font-size: 22pt; margin: 0 0 4px; }
    h2 { font-size: 14pt; font-weight: 700; border-bottom: 1.5px solid #7c3aed; padding-bottom: 3px; margin: 18px 0 8px; color: #111; text-transform: uppercase; letter-spacing: .5px; }
    h3 { font-size: 13pt; font-weight: 600; margin: 10px 0 2px; }
    p, div { margin: 3px 0; }
    ul { margin: 4px 0; padding-left: 18px; }
    li { margin: 2px 0; }
    em { color: #555; }
    hr { border: none; border-top: 1px solid #ddd; margin: 14px 0; }
    strong { font-weight: 600; }
    br { margin-bottom: 8px; }
    .contact-info { font-size: 10.5pt; color: #555; margin: 4px 0; }
  </style>
</head>
<body>
  <h1>${cv.fullName}</h1>
  <p>${jobTitle}</p>
  ${contactLine1 ? `<div class="contact-info">${contactLine1}</div>` : ''}
  ${contactLine2 ? `<div class="contact-info">${contactLine2}</div>` : ''}
  <hr/>
  ${wrappedHtml}
</body>
</html>`

      const win = window.open('', '_blank')
      if (!win) {
        reject(new Error('Could not open print window'))
        return
      }

      win.document.write(htmlDoc)
      win.document.close()

      let printed = false
      const printTimeout = setTimeout(() => {
        if (!printed) {
          win.print()
          printed = true
          setTimeout(() => {
            win.close()
            resolve()
          }, 1000)
        }
      }, 500)

      // Also try to detect when print dialog closes
      win.onbeforeunload = () => {
        clearTimeout(printTimeout)
        if (!printed) {
          printed = true
          resolve()
        }
      }

    } catch (error) {
      reject(error)
    }
  })
}

// ─── Legacy compat aliases ───────────────────────────────────────────────────
export const splitH1Sections = splitSections
