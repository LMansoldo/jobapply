import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords, wordCount } from './utils'

const EXPERIENCE_YEARS_PATTERN = /(\d+)\s*(?:\+)?\s*anos?\s+de\s+experi[eê]ncia/i

function extractDeclaredYears(text: string): number | null {
  const match = EXPERIENCE_YEARS_PATTERN.exec(text)
  return match ? parseInt(match[1], 10) : null
}

function estimateYearsFromPeriods(periods: Array<{ role: string; company: string; period: string }>): number {
  if (periods.length === 0) return 0
  const sorted = [...periods].sort((a, b) => {
    const aDate = new Date(a.period.split(/\s*[-–]\s*/)[0])
    const bDate = new Date(b.period.split(/\s*[-–]\s*/)[0])
    return aDate.getTime() - bDate.getTime()
  })
  const earliest = new Date(sorted[0].period.split(/\s*[-–]\s*/)[0])
  if (isNaN(earliest.getTime())) return 0
  return Math.round((Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365))
}

export function scoreCatho(cv: MappedCV, jd: string): PlatformScore {
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd)

  const flags: string[] = []
  const notes: string[] = []

  // Experience word count check
  const expWords = wordCount(cv.sections.experience)
  if (expWords < 50) {
    flags.push(`Experience section is too short (${expWords} words) — Catho requires at least 50 words for proper ranking`)
  }

  // Declared experience years
  const declaredYears =
    extractDeclaredYears(cv.sections.summary) ??
    extractDeclaredYears(cv.sections.expertise)
  const estimatedYears = estimateYearsFromPeriods(cv.entities.experiencePeriods)

  if (declaredYears !== null) {
    notes.push(`Declared experience: ${declaredYears} years`)
  } else {
    notes.push(`Estimated experience from periods: ~${estimatedYears} years (no explicit declaration found)`)
  }

  // Location presence
  if (!cv.raw.location || cv.raw.location.trim() === '') {
    flags.push('No location set — Catho ranking is influenced by candidate location')
  } else {
    notes.push(`Location: ${cv.raw.location}`)
  }

  notes.push('Note: salary expectation and full profile data influence Catho score but cannot be simulated')

  let score = baseScore
  if (expWords < 50) score = Math.min(score, 60)

  score = Math.round(Math.min(100, score))

  return {
    platform: 'Catho',
    score,
    passed: score >= 65 && expWords >= 50,
    missingRequired: [],
    missingPreferred: missingKeywords.slice(0, 10),
    flags,
    notes: [
      `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords`,
      ...notes,
    ],
  }
}
