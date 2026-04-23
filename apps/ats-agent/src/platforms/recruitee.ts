import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords, detectCareerProgression } from './utils'

// Recruitee (Tellent) is popular with European scale-ups and tech companies.
// It surfaces structured CV data and applies keyword ranking with culture-fit signals.

const CULTURE_SIGNALS = [
  'agile', 'scrum', 'kanban', 'startup', 'scale-up', 'cross-functional', 'remote',
  'hybrid', 'autonomous', 'ownership', 'impact', 'growth', 'fast-paced', 'collaborative',
  'self-starter', 'initiative', 'proactive',
]

const SYNONYMS: Record<string, string[]> = {
  react: ['react.js', 'reactjs'],
  vue: ['vue.js', 'vuejs'],
  node: ['node.js', 'nodejs'],
  javascript: ['js'],
  typescript: ['ts'],
  kubernetes: ['k8s'],
  postgresql: ['postgres', 'pg'],
  mongodb: ['mongo'],
  docker: ['containerization', 'dockerfile'],
  golang: ['go lang', 'go programming'],
  'ci/cd': ['continuous integration', 'continuous deployment', 'github actions', 'gitlab ci'],
  aws: ['amazon web services', 'amazon cloud'],
  gcp: ['google cloud'],
  azure: ['microsoft azure'],
}

export function scoreRecruitee(cv: MappedCV, jd: string, jdKeywords?: string[]): PlatformScore {
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd, SYNONYMS, jdKeywords)

  const flags: string[] = []
  const notes: string[] = [
    'Recruitee (Tellent) is common in European scale-ups — culture fit signals and structured experience matter',
    `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords`,
  ]

  // Culture-fit signal check
  const allCvText = Object.values(cv.sections).join(' ').toLowerCase()
  const jdLower = jd.toLowerCase()
  const jdCultureSignals = CULTURE_SIGNALS.filter(s => jdLower.includes(s))
  const cvCultureSignals = jdCultureSignals.filter(s => allCvText.includes(s))

  if (jdCultureSignals.length > 0) {
    const culturePct = Math.round((cvCultureSignals.length / jdCultureSignals.length) * 100)
    notes.push(`Culture-fit signal match: ${cvCultureSignals.length}/${jdCultureSignals.length} (${culturePct}%)`)
    if (cvCultureSignals.length === 0) {
      flags.push('No culture-fit signals detected (e.g. agile, ownership, cross-functional) — add them to summary or experience if genuine')
    }
  }

  // Career progression is valued at scale-ups
  const hasProgression = detectCareerProgression(cv.entities.jobTitles)
  let score = baseScore

  if (hasProgression) {
    score += 5
    notes.push('Career progression detected: +5 bonus')
  }

  // Summary is important for Recruitee's recruiter-facing card
  if (!cv.sections.summary || cv.sections.summary.trim().length < 80) {
    flags.push('Summary is missing or very short — Recruitee shows the summary prominently to recruiters')
    score -= 5
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  return {
    platform: 'Recruitee',
    score,
    passed: score >= 65,
    missingRequired: [],
    missingPreferred: missingKeywords.slice(0, 10),
    flags,
    notes,
  }
}
