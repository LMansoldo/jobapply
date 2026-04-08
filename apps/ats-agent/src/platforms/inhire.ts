import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords } from './utils'

const URL_PATTERN = /https?:\/\/[^\s"'<>]+/gi

function extractTechKeywordsFromJD(jd: string): string[] {
  const TECH_INDICATORS = [
    'javascript', 'typescript', 'python', 'java', 'golang', 'rust', 'c#', 'c++', 'ruby', 'php',
    'react', 'angular', 'vue', 'svelte', 'next', 'nuxt', 'node', 'express', 'fastify', 'django',
    'spring', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'docker',
    'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'graphql', 'rest', 'grpc', 'git',
    'html', 'css', 'sass', 'tailwind', 'webpack', 'vite', 'jest', 'cypress', 'react native',
    'flutter', 'swift', 'kotlin', 'android', 'ios', 'sql', 'nosql', 'microservices', 'linux',
  ]
  const lower = jd.toLowerCase()
  return TECH_INDICATORS.filter(t => lower.includes(t))
}

function isTechRole(jd: string): boolean {
  const techSignals = ['engineer', 'developer', 'dev', 'programm', 'software', 'frontend', 'backend',
    'fullstack', 'full-stack', 'full stack', 'engenheiro', 'desenvolvedor', 'tech lead']
  const lower = jd.toLowerCase()
  return techSignals.some(s => lower.includes(s))
}

export function scoreInhire(cv: MappedCV, jd: string): PlatformScore {
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd)

  const flags: string[] = []
  const notes: string[] = [
    'Inhire is tech-focused — stack match percentage is a primary ranking signal',
  ]

  // Tech stack match
  const jdTechStack = extractTechKeywordsFromJD(jd)
  const cvTechLower = cv.entities.techStack.map(t => t.toLowerCase())
  const stackMatches = jdTechStack.filter(t =>
    cvTechLower.some(s => s.includes(t) || t.includes(s))
  )
  const stackMatchPct = jdTechStack.length > 0
    ? Math.round((stackMatches.length / jdTechStack.length) * 100)
    : 0
  notes.push(`Tech stack match: ${stackMatches.length}/${jdTechStack.length} (${stackMatchPct}%)`)

  // URL / portfolio check
  const hasUrls = cv.entities.urls.length > 0
  const techRole = isTechRole(jd)

  let score = baseScore
  if (hasUrls) {
    score += 5
    notes.push(`Portfolio/GitHub URL found (${cv.entities.urls[0]}): +5 boost`)
  } else if (techRole) {
    flags.push('No GitHub or portfolio URL detected — strongly recommended for tech roles on Inhire')
  }

  // Boost stack match into score
  score = score * 0.6 + stackMatchPct * 0.4

  score = Math.round(Math.min(100, score))

  return {
    platform: 'Inhire',
    score,
    passed: score >= 65 && hasUrls,
    missingRequired: [],
    missingPreferred: missingKeywords.slice(0, 10),
    flags,
    notes: [
      `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords`,
      ...notes,
    ],
  }
}
