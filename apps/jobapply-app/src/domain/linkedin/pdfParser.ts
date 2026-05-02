/**
 * @file pdfParser.ts
 * @description Extracts LinkedIn profile sections from a LinkedIn PDF export.
 * Uses pdfjs-dist to read text content, then detects section boundaries
 * by matching known LinkedIn section headers (EN + PT-BR).
 */
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import type { LinkedInProfile } from './types'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href

type SectionKey = keyof LinkedInProfile

const SECTION_HEADERS: Record<SectionKey, string[]> = {
  headline: [],
  about: ['summary', 'resumo', 'sobre', 'about'],
  experience: ['experience', 'experiência', 'experiencia', 'work experience'],
  skills: ['skills', 'competências', 'competencias', 'habilidades', 'top skills'],
  education: [
    'education',
    'formação acadêmica',
    'formação',
    'formacao',
    'academic background',
  ],
  certifications: [
    'certifications',
    'licenses & certifications',
    'certificações',
    'certificados',
    'certificados e licenças',
  ],
}

/** Returns false for lines that are clearly not a professional headline. */
function isHeadlineLine(line: string): boolean {
  const trimmed = line.trim()
  if (trimmed.includes('@')) return false                          // email
  if (/^\+?\d[\d\s\-().]{6,}$/.test(trimmed)) return false       // phone number
  if (/https?:\/\/|linkedin\.com|github\.com/i.test(trimmed)) return false // URL
  if (/^(contact|contato|page \d|www\.)/i.test(trimmed)) return false
  return true
}

function detectSection(line: string): SectionKey | null {
  const lower = line.toLowerCase().trim()
  for (const [key, headers] of Object.entries(SECTION_HEADERS)) {
    if (headers.includes(lower)) return key as SectionKey
  }
  return null
}

async function extractLines(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: buffer }).promise
  const lines: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    for (const item of content.items) {
      if ('str' in item && item.str.trim()) {
        lines.push(item.str.trim())
      }
    }
  }
  return lines
}

export async function parsePDFToLinkedInProfile(file: File): Promise<LinkedInProfile> {
  const lines = await extractLines(file)

  const buckets: Record<SectionKey, string[]> = {
    headline: [],
    about: [],
    experience: [],
    skills: [],
    education: [],
    certifications: [],
  }

  let current: SectionKey = 'headline'

  for (const line of lines) {
    const detected = detectSection(line)
    if (detected) {
      current = detected
      continue
    }
    buckets[current].push(line)
  }

  // LinkedIn PDF sidebar can interleave contact info (email, phone, URL) before the headline.
  // Skip the first line (name) and any lines that look like contact/location data.
  const preSection = buckets.headline.slice(1) // drop name (index 0)
  const headlineText = preSection.find(isHeadlineLine) ?? preSection[0] ?? ''

  return {
    headline: headlineText,
    about: buckets.about.join('\n'),
    experience: buckets.experience.join('\n'),
    skills: buckets.skills.join(', '),
    education: buckets.education.join('\n'),
    certifications: buckets.certifications.length
      ? buckets.certifications.join('\n')
      : undefined,
  }
}
