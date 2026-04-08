import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords } from './utils'

function extractJDTitle(jd: string): string {
  // Try to extract the job title from the first 3 lines
  const firstLines = jd.split('\n').slice(0, 3).join(' ')
  return firstLines.trim().toLowerCase()
}

function titleMatches(cvTitle: string, jdTitle: string): boolean {
  if (!cvTitle || !jdTitle) return false
  const cvLower = cvTitle.toLowerCase()
  const jdLower = jdTitle.toLowerCase()
  // Check if significant words from CV title appear in JD title area
  const cvWords = cvLower.split(/\s+/).filter(w => w.length > 3)
  return cvWords.some(w => jdLower.includes(w))
}

export function scoreVagas(cv: MappedCV, jd: string): PlatformScore {
  // Vagas.com: strict keyword matching, no synonym tolerance
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd)

  const flags: string[] = []
  const notes: string[] = [
    'Vagas.com uses traditional keyword matching — no semantic tolerance applied',
  ]

  // Flag if no dates are found
  const validDates = cv.entities.dates.filter(d => d && d.trim().length > 0)
  if (validDates.length === 0) {
    flags.push('No experience periods found — Vagas.com requires structured dates for ranking')
  }

  // Title match bonus
  const latestTitle = cv.entities.jobTitles[0] ?? ''
  const jdTitleArea = extractJDTitle(jd)
  let score = baseScore

  if (titleMatches(latestTitle, jdTitleArea)) {
    score += 15
    notes.push(`Current job title "${latestTitle}" matches JD title: +15 bonus`)
  } else if (latestTitle) {
    notes.push(`Current job title "${latestTitle}" does not match JD title area`)
  }

  score = Math.round(Math.min(100, score))

  return {
    platform: 'Vagas.com',
    score,
    passed: score >= 65,
    missingRequired: [],
    missingPreferred: missingKeywords.slice(0, 10),
    flags,
    notes: [
      `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords`,
      ...notes,
    ],
  }
}
