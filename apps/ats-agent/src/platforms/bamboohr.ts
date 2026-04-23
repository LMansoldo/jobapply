import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords, wordCount } from './utils'

// BambooHR is common in SMBs where HR generalists (not technical recruiters) review CVs.
// It weights completeness and clean structure heavily. Keyword scoring is lenient —
// a 50% match is often enough to pass initial filtering.

const COMPLETENESS_SECTIONS = ['contact', 'summary', 'experience', 'education', 'skills'] as const

export function scoreBambooHR(cv: MappedCV, jd: string, jdKeywords?: string[]): PlatformScore {
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd, undefined, jdKeywords)

  const flags: string[] = []
  const notes: string[] = [
    'BambooHR is common in SMBs — completeness and clear structure outweigh keyword density',
    `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords`,
  ]

  // Completeness check
  const emptySections: string[] = []
  for (const section of COMPLETENESS_SECTIONS) {
    const text = cv.sections[section] ?? ''
    if (text.trim().length < 20) emptySections.push(section)
  }

  if (emptySections.length > 0) {
    flags.push(`Missing or nearly empty sections: ${emptySections.join(', ')} — BambooHR reviewers expect all standard sections to be filled`)
  }

  // Contact completeness (HR managers need to reach candidates)
  const contactText = cv.sections.contact.toLowerCase()
  const hasEmail = contactText.includes('@') || cv.entities.urls.some(u => u.includes('@'))
  if (!hasEmail) {
    flags.push('No email address detected in contact section')
  }

  // Experience descriptions — HR reviewers prefer narrative context over bullet dumps
  const experienceWords = wordCount(cv.sections.experience)
  if (experienceWords < 80) {
    flags.push('Experience section is very sparse — add context and achievements for each role')
  } else if (experienceWords > 700) {
    notes.push('Experience section is detailed — consider trimming for HR readability')
  }

  // BambooHR has lenient keyword thresholds — apply less penalty for missing keywords
  let score = baseScore * 0.7 + (emptySections.length === 0 ? 30 : Math.max(0, 30 - emptySections.length * 8))

  if (!hasEmail) score -= 10

  score = Math.max(0, Math.min(100, Math.round(score)))

  return {
    platform: 'BambooHR',
    score,
    passed: score >= 50,
    missingRequired: [],
    missingPreferred: missingKeywords.slice(0, 8),
    flags,
    notes,
  }
}
