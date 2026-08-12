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
import type { CV, CVCreatePayload, CVLocalePayload, CVLocaleVersion } from './types'

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
  const header = `# ${cv.fullName}\n\n${[cv.location, cv.email, cv.phone].filter(Boolean).join(' | ')}\n${[cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(' | ')}\n`
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
    <p>${[cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(' | ')}</p>
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

// Initialize pdfMake with the embedded Arimo font (ATS-safe, Arial-metric-compatible)
async function initializePdfMake(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const pdfMakeModule = await import('pdfmake/build/pdfmake')
    const { arimoVfs } = await import('./pdfFonts/arimoVfs.generated')

    ;(pdfMakeModule.default as any).vfs = arimoVfs
    ;(pdfMakeModule.default as any).fonts = {
      Arimo: {
        normal: 'Arimo-Regular.ttf',
        bold: 'Arimo-Bold.ttf',
        italics: 'Arimo-Italic.ttf',
        bolditalics: 'Arimo-BoldItalic.ttf',
      },
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
      pageMargins: [54, 36, 54, 36] as [number, number, number, number],
      defaultStyle: {
        font: 'Arimo',
        fontSize: 10.5,
        lineHeight: 1.25,
        color: PdfColors.textBody,
      },
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: PdfColors.headerBlue,
          margin: [0, 0, 0, 2],
        },
        contact: {
          fontSize: 10,
          color: PdfColors.textMuted,
          margin: [0, 1, 0, 1],
        },
        subheader: {
          fontSize: 11,
          bold: true,
          color: PdfColors.textBase,
          margin: [0, 8, 0, 1],
        },
        sectionTitle: {
          fontSize: 12,
          bold: true,
          color: PdfColors.headerBlue,
          margin: [0, 10, 0, 0],
        },
        normal: {
          fontSize: 10.5,
          color: PdfColors.textBody,
          margin: [0, 1, 0, 1],
        },
        list: {
          margin: [0, 0, 0, 2],
        },
        listItem: {
          fontSize: 10.5,
          color: PdfColors.textBody,
        },
      },
      content: content,
    }

    // Create and download PDF
    const pdfDoc = pdfMake.createPdf(docDefinition)
    pdfDoc.download(filename)

  } catch (error) {
    console.error('Error generating PDF with pdfMake:', error)
    // Fallback to browser print if library fails
    await downloadMarkdownAsPdfFallback(markdownContent, cv, locale, jobTitle)
  }
}

// Colors matching the ATS reference template (independent of the app's UI theme).
const PdfColors = {
  headerBlue: '#2B579A',
  textBody: '#333333',
  textMuted: '#555555',
  textBase: '#000000',
}

function ensureHttps(url: string): string {
  return /^https?:\/\//.test(url) ? url : `https://${url}`
}

// Interleaves "  |  " separators between pdfMake text runs (used for the header contact rows).
function withPipes(runs: any[]): any[] {
  return runs.flatMap((run, i) => (i === 0 ? [run] : [{ text: '   |   ', color: PdfColors.textMuted }, run]))
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
  content.push({ text: cv.fullName, style: 'header', alignment: 'center' })

  // ── Contact row 1: location · email · phone ───────────────────────────────
  const row1Values = [cv.location, cv.email, cv.phone].filter((v): v is string => !!v)
  if (row1Values.length) {
    content.push({
      text: withPipes(row1Values.map((v) => (v === cv.email ? { text: v, link: `mailto:${v}` } : { text: v }))),
      style: 'contact',
      alignment: 'center',
    })
  }

  // ── Contact row 2: linkedin · github · portfolio ──────────────────────────
  const row2Values = [cv.linkedin, cv.github, cv.portfolio].filter((v): v is string => !!v)
  if (row2Values.length) {
    content.push({
      text: withPipes(row2Values.map((v) => ({ text: v.replace(/^https?:\/\//, ''), link: ensureHttps(v) }))),
      style: 'contact',
      alignment: 'center',
    })
  }

  // Parse markdown lines
  const lines = markdownContent.split('\n')
  let inList = false
  let listItems: any[] = []
  let lastWasHeading = false
  let justAfterSectionTitle = false
  // Holds a role/company title line while we wait to see whether the next line is its
  // "**Period**" line — if so, both are merged onto one row (title left, date right).
  let pendingTitleRuns: any[] | null = null
  let pendingTitleJustAfterSectionTitle = false

  function flushPendingTitle() {
    if (!pendingTitleRuns) return
    const props: any = { text: pendingTitleRuns, style: 'subheader' }
    if (pendingTitleJustAfterSectionTitle) props.margin = [0, 0, 0, 1]
    content.push(props)
    pendingTitleRuns = null
    pendingTitleJustAfterSectionTitle = false
  }

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
      flushPendingTitle()
      content.push({ text: '', fontSize: 4, margin: [0, 0, 0, 0] })
      lastWasHeading = false
      continue
    }

    // Check for headers
    if (trimmed.startsWith('# ')) {
      // H1 - already handled in header
      flushPendingTitle()
      lastWasHeading = false
      continue
    } else if (trimmed.startsWith('## ')) {
      // H2 - section title, uppercase
      flushPendingTitle()
      if (inList && listItems.length > 0) {
        content.push({ ul: listItems, style: 'list' })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(3).trim().toUpperCase()
      content.push({ text: title, style: 'sectionTitle' })
      lastWasHeading = false
      justAfterSectionTitle = true
    } else if (trimmed.startsWith('### ')) {
      // H3 - subsection (experience/education role line). Split "Role | Company ..." so the
      // role reads bold black and the rest (company/location) reads regular gray, matching
      // the reference template. Held pending: if the next line is a "**Period**" line, it's
      // merged onto this same row instead of being pushed now.
      flushPendingTitle()
      if (inList && listItems.length > 0) {
        content.push({
          ul: listItems,
          style: 'list',
        })
        listItems = []
        inList = false
      }
      const title = trimmed.substring(4).trim()
      const sepIdx = title.indexOf(' | ')
      // "Role | Company | Location" -> role stays split off by " | "; any further " | "
      // (company/location separator) reads as " – " instead, matching "Role | Company – Location".
      const titleRuns =
        sepIdx === -1
          ? [{ text: title, bold: true, color: PdfColors.textBase }]
          : [
              { text: title.slice(0, sepIdx), bold: true, color: PdfColors.textBase },
              { text: ' | ' + title.slice(sepIdx + 3).replace(/ \| /g, ' – '), bold: false, color: PdfColors.textMuted },
            ]
      pendingTitleRuns = titleRuns
      // The subheader style's top margin separates one experience/education entry from the
      // next. Skip it when this is the first entry right after a section title — the section
      // title's own spacing already provides that separation.
      pendingTitleJustAfterSectionTitle = justAfterSectionTitle
      lastWasHeading = true
      justAfterSectionTitle = false
    } else if (trimmed.match(/^[-*+]\s/)) {
      // List item
      flushPendingTitle()
      lastWasHeading = false
      justAfterSectionTitle = false
      inList = true
      const itemText = trimmed.substring(2).trim()
      // Parse bold/italic in list items
      const parsedText = parseInlineFormatting(itemText)
      listItems.push({ text: parsedText, style: 'listItem' })
    } else if (trimmed.match(/^\d+\.\s/)) {
      // Ordered list item
      flushPendingTitle()
      lastWasHeading = false
      justAfterSectionTitle = false
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

      // The line right after an experience/education H3 is the "**Period**" (or
      // "**Location | Period**") line. Merge it onto the pending title's row, right-aligned,
      // italic-gray — matching the reference template's "role ... date" single-line layout.
      const isPeriodLine = lastWasHeading && /^\*\*(.+)\*\*$/.test(trimmed)
      if (isPeriodLine && pendingTitleRuns) {
        const inner = trimmed.slice(2, -2)
        const props: any = {
          columns: [
            { text: pendingTitleRuns, width: '*' },
            { text: inner, italics: true, color: PdfColors.textMuted, bold: false, alignment: 'right', width: 130 },
          ],
          columnGap: 8,
          style: 'subheader',
        }
        if (pendingTitleJustAfterSectionTitle) props.margin = [0, 0, 0, 1]
        content.push(props)
        pendingTitleRuns = null
        pendingTitleJustAfterSectionTitle = false
      } else {
        flushPendingTitle()
        // Parse inline formatting (bold, italic, etc.)
        const parsedText = parseInlineFormatting(trimmed)
        content.push({ text: parsedText, style: 'normal' })
      }
      lastWasHeading = false
      justAfterSectionTitle = false
    }
  }
  flushPendingTitle()

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
      const contactLine2 = [cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(' | ')

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

// ─── Transformation functions for frontend-API data mapping ──────────────────

/**
 * Creates a complete CV structure from personal data and locale content.
 * Used when submitting to API which expects complete CV with localeVersions.
 */
export function createCVFromPersonalDataAndLocale(
  personalData: CVCreatePayload,
  localePTBRContent: CVLocalePayload,
  cvId?: string,
  userId?: string
): CV {
  const now = new Date().toISOString()

  return {
    _id: cvId || `cv-${Date.now()}`,
    user: userId || 'unknown',
    fullName: personalData.fullName,
    email: personalData.email,
    phone: personalData.phone,
    location: personalData.location,
    linkedin: personalData.linkedin,
    objective: personalData.objective,
    github: personalData.github,
    portfolio: personalData.portfolio,
    languages: personalData.languages || [],
    tailoredVersions: [],
    localeVersions: [
      {
        locale: 'pt-BR',
        ...localePTBRContent
      }
    ],
    updatedAt: now
  }
}

/**
 * Extracts personal data from a complete CV structure.
 * Used when loading existing CV to populate personal info form.
 */
export function extractPersonalDataFromCV(cv: CV): CVCreatePayload {
  return {
    fullName: cv.fullName,
    email: cv.email,
    phone: cv.phone,
    location: cv.location,
    linkedin: cv.linkedin,
    objective: cv.objective,
    github: cv.github,
    portfolio: cv.portfolio,
    languages: cv.languages
  }
}

/**
 * Extracts locale content from a complete CV structure.
 * Used when loading existing CV to populate locale-specific content.
 */
export function extractLocaleContentFromCV(cv: CV, locale: 'en' | 'pt-BR'): CVLocalePayload | null {
  const localeVersion = cv.localeVersions.find(v => v.locale === locale)
  if (!localeVersion) return null

  // Return all fields except locale
  const { locale: _, ...content } = localeVersion
  return content
}

/**
 * Updates a CV with new locale content.
 * Used when submitting updates to locale-specific content.
 */
export function updateCVWithLocaleContent(
  cv: CV,
  locale: 'en' | 'pt-BR',
  localeContent: CVLocalePayload
): CV {
  const updatedAt = new Date().toISOString()
  const localeIndex = cv.localeVersions.findIndex(v => v.locale === locale)

  const updatedLocaleVersion = {
    locale,
    ...localeContent
  }

  const updatedLocaleVersions = [...cv.localeVersions]

  if (localeIndex >= 0) {
    // Update existing locale version
    updatedLocaleVersions[localeIndex] = updatedLocaleVersion
  } else {
    // Add new locale version
    updatedLocaleVersions.push(updatedLocaleVersion)
  }

  return {
    ...cv,
    localeVersions: updatedLocaleVersions,
    updatedAt
  }
}

/**
 * Creates initial PT-BR locale content from mock data.
 * Used when new user registers and needs initial CV content to edit.
 */
export function createInitialPTBRContent(): CVLocalePayload {
  return {
    summary: 'Engenheiro Front-End Sênior com 5+ anos construindo aplicações web escaláveis. Especializado em React e TypeScript — código limpo e orientado a resultado.',
    skills: [
      { label: 'Frontend', items: ['React', 'TypeScript', 'Ant Design', 'Next.js'] },
      { label: 'Backend', items: ['Node.js', 'MongoDB', 'REST APIs'] },
      { label: 'Processos', items: ['Git', 'Code Review', 'CI/CD'] },
    ],
    experience: [
      {
        role: 'Senior Frontend Developer',
        company: 'Tech Corp',
        location: 'Brasília, Brasil',
        period: 'Mar 2021 - Presente',
        context: 'Liderança técnica do produto SaaS principal.',
        highlights: [
          'Liderou o desenvolvimento frontend do produto SaaS principal com React e Ant Design.',
          'Mentorou desenvolvedores júnior em boas práticas de React e TypeScript.',
        ],
      },
      {
        role: 'Full Stack Developer',
        company: 'Startup XYZ',
        location: 'Remoto',
        period: 'Jun 2019 - Fev 2021',
        highlights: [
          'Desenvolveu features full-stack com React e Node.js consumidas por clientes web e mobile.',
          'Implementou APIs RESTful com Node.js e MongoDB.',
        ],
      },
    ],
    education: [
      {
        degree: 'Bacharel em Ciência da Computação',
        institution: 'Universidade Federal de Minas Gerais',
        location: 'Belo Horizonte, Brasil',
        period: '2015 – 2019',
      },
    ],
    certifications: [
      { name: 'AWS Cloud Practitioner', org: 'Amazon Web Services', date: '2023' },
      { name: 'Meta Front-End Developer', org: 'Meta', date: '2022' },
    ],
  }
}

// ─── Legacy compat aliases ───────────────────────────────────────────────────
export const splitH1Sections = splitSections
