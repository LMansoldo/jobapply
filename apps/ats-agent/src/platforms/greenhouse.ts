import type { MappedCV, PlatformScore } from '../types'
import {
  scoreKeywords,
  extractJDKeywords,
  detectGaps,
  detectShortTenures,
  detectCareerProgression,
} from './utils'

function splitJDBlocks(jd: string): { required: string; preferred: string; hasExplicitRequired: boolean } {
  const lower = jd.toLowerCase()
  const reqIdx = lower.search(/\brequired\b|\bmust\s+have\b|\bobrigatório\b|\brequisitos\b/)
  const prefIdx = lower.search(/\bpreferred\b|\bnice\s+to\s+have\b|\bdesirable\b|\bdiferencial\b|\bdesejável\b/)

  // No section markers found — cannot distinguish required vs preferred.
  // Return full JD as context but mark it as NOT having an explicit required section
  // so the score cap is not applied.
  if (reqIdx === -1 && prefIdx === -1) {
    return { required: jd, preferred: '', hasExplicitRequired: false }
  }

  let required = ''
  let preferred = ''

  if (reqIdx !== -1 && prefIdx !== -1) {
    if (reqIdx < prefIdx) {
      required = jd.slice(reqIdx, prefIdx)
      preferred = jd.slice(prefIdx)
    } else {
      preferred = jd.slice(prefIdx, reqIdx)
      required = jd.slice(reqIdx)
    }
  } else if (reqIdx !== -1) {
    required = jd.slice(reqIdx)
  } else {
    preferred = jd.slice(prefIdx)
    required = jd.slice(0, prefIdx)
  }

  return { required: required || jd, preferred, hasExplicitRequired: reqIdx !== -1 }
}

export function scoreGreenhouse(cv: MappedCV, jd: string, jdKeywords?: string[]): PlatformScore {
  const { required, preferred, hasExplicitRequired } = splitJDBlocks(jd)

  const requiredKeywords = hasExplicitRequired ? extractJDKeywords(required) : []
  const preferredKeywords = extractJDKeywords(preferred)

  const { baseScore, matchedKeywords } = scoreKeywords(cv, jd, undefined, jdKeywords)

  const allSections = Object.values(cv.sections).join(' ').toLowerCase()

  const missingRequired = requiredKeywords.filter(k => !allSections.includes(k))
  const missingPreferred = preferredKeywords.filter(k => !allSections.includes(k))

  const flags: string[] = []
  const notes: string[] = []

  if (!hasExplicitRequired) {
    notes.push('No explicit "Required" section found — scoring against full JD without cap')
  }

  const gaps = detectGaps(cv.entities.experiencePeriods)
  for (const gap of gaps) {
    flags.push(`Employment gap of ${gap.gapMonths} months after "${gap.after}"`)
  }

  const shortTenures = detectShortTenures(cv.entities.experiencePeriods)
  for (const t of shortTenures) {
    flags.push(`Short tenure (< 6 months): ${t}`)
  }

  let score = baseScore
  let scoreCapped = false

  // Only apply the cap when the JD actually has an explicit "Required" section
  if (hasExplicitRequired && missingRequired.length > 0) {
    score = Math.min(score, 60)
    scoreCapped = true
    notes.push(`Score capped at 60 — missing ${missingRequired.length} required keyword(s)`)
  }

  score -= gaps.length * 10
  if (gaps.length > 0) notes.push(`Gap penalty: -${gaps.length * 10} points`)

  const hasProgression = detectCareerProgression(cv.entities.jobTitles)
  if (hasProgression) {
    score += 5
    notes.push('Career progression detected: +5 bonus')
  }

  score = Math.max(0, Math.min(100, score))

  return {
    platform: 'Greenhouse',
    score: Math.round(score),
    passed: score >= 70 && !scoreCapped,
    missingRequired,
    missingPreferred,
    flags,
    notes: [
      `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords`,
      ...notes,
    ],
  }
}
