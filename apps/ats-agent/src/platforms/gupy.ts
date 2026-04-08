import type { MappedCV, PlatformScore } from '../types'
import { extractJDKeywords } from './utils'

const GENERIC_PHRASES = [
  'responsável por', 'auxiliava', 'atuava em', 'trabalhava com', 'participava de',
  'contribuía para', 'ajudava', 'suportava', 'apoiava', 'colaborava',
  'fazia parte', 'desenvolvia atividades', 'executava tarefas',
]

const METRICS_PATTERN = /\d+\s*(%|R\$|reais|mil|milhão|x\b|vezes|usuários|requests|deploys|horas|dias)/i

function hasGenericLanguage(text: string): boolean {
  const lower = text.toLowerCase()
  return GENERIC_PHRASES.some(phrase => lower.includes(phrase))
}

function hasMetrics(text: string): boolean {
  return METRICS_PATTERN.test(text)
}

// Gupy scores only on experience + skills sections (simulates form fields)
function scoreGupySection(sectionText: string, keywords: string[], weight: number): number {
  if (keywords.length === 0) return 0
  const lower = sectionText.toLowerCase()
  const matched = keywords.filter(k => lower.includes(k)).length
  return (matched / keywords.length) * 100 * weight
}

export function scoreGupy(cv: MappedCV, jd: string): PlatformScore {
  const keywords = extractJDKeywords(jd)
  const flags: string[] = []
  const notes: string[] = [
    'Gupy (Gaia) scores based on form fields — only experience and skills sections are used for ranking',
  ]

  const experienceScore = scoreGupySection(cv.sections.experience, keywords, 2.0)
  const skillsScore = scoreGupySection(cv.sections.skills, keywords, 1.8)
  const maxPossible = keywords.length * 2.0 * 100 / keywords.length

  const rawScore = (experienceScore + skillsScore) / (2.0 + 1.8)

  // Check for generic language in highlights
  const allHighlights = (cv.raw.experience ?? []).flatMap(e => e.highlights ?? [])
  const genericHighlights = allHighlights.filter(h => hasGenericLanguage(h.text))
  const metricsHighlights = allHighlights.filter(h => hasMetrics(h.text))

  if (genericHighlights.length > 0) {
    flags.push(
      `${genericHighlights.length} highlight(s) use vague language (e.g. "responsável por", "auxiliava") — replace with results`
    )
  }

  let score = rawScore
  if (metricsHighlights.length > 0) {
    const boost = Math.min(10, metricsHighlights.length * 2)
    score += boost
    notes.push(`Metrics/numbers detected in ${metricsHighlights.length} highlight(s): +${boost} boost`)
  }

  const matchedExp = keywords.filter(k => cv.sections.experience.toLowerCase().includes(k))
  const matchedSkills = keywords.filter(k => cv.sections.skills.toLowerCase().includes(k))

  score = Math.round(Math.min(100, score))

  return {
    platform: 'Gupy',
    score,
    passed: score >= 65 && genericHighlights.length === 0,
    missingRequired: [],
    missingPreferred: keywords.filter(k =>
      !cv.sections.experience.toLowerCase().includes(k) &&
      !cv.sections.skills.toLowerCase().includes(k)
    ).slice(0, 10),
    flags,
    notes: [
      `Experience section matched ${matchedExp.length} of ${keywords.length} keywords`,
      `Skills section matched ${matchedSkills.length} of ${keywords.length} keywords`,
      ...notes,
    ],
  }
}
