import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords, wordCount } from './utils'

// Generic fallback scorer for unknown or unlisted ATS platforms.
// Uses a broad, lenient keyword match without platform-specific rules.
// Pass threshold is low — this represents a "should get through basic filtering" baseline.

export function scoreGeneric(cv: MappedCV, jd: string, jdKeywords?: string[]): PlatformScore {
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd, undefined, jdKeywords)

  const flags: string[] = []
  const notes: string[] = [
    'Generic ATS scorer — broad keyword match without platform-specific rules',
    `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords`,
  ]

  const allCvText = Object.values(cv.sections).join(' ')

  // Basic completeness warnings (not penalties)
  if (!cv.sections.summary || cv.sections.summary.trim().length < 30) {
    flags.push('Summary section is missing or very short — most ATS platforms surface the summary to reviewers')
  }

  if (wordCount(cv.sections.experience) < 50) {
    flags.push('Experience section is very short — add role descriptions and achievements')
  }

  if (cv.entities.urls.length === 0 && allCvText.length < 400) {
    flags.push('CV content is sparse — a short CV may score low on all ATS platforms')
  }

  // Lenient score: close to base, no hard caps
  const score = Math.max(0, Math.min(100, Math.round(baseScore)))

  return {
    platform: 'Generic',
    score,
    passed: score >= 45,
    missingRequired: [],
    missingPreferred: missingKeywords.slice(0, 10),
    flags,
    notes,
  }
}
