import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords } from './utils'

const CANONICAL_SKILLS: string[] = [
  'javascript', 'typescript', 'python', 'java', 'golang', 'rust', 'c#', 'c++', 'ruby', 'php',
  'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'node.js', 'express', 'fastify',
  'django', 'flask', 'spring', 'laravel',
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb',
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ansible',
  'git', 'github', 'gitlab', 'bitbucket', 'ci/cd', 'jenkins', 'github actions',
  'rest', 'graphql', 'grpc', 'websocket',
  'html', 'css', 'sass', 'tailwind', 'webpack', 'vite',
  'machine learning', 'data science', 'sql', 'spark', 'kafka', 'airflow',
  'microservices', 'devops', 'agile', 'scrum', 'kanban', 'jest', 'cypress',
  'react native', 'flutter', 'swift', 'kotlin',
]

function mapToCanonical(skills: string[]): string[] {
  const lower = skills.map(s => s.toLowerCase())
  return CANONICAL_SKILLS.filter(canonical =>
    lower.some(s => s.includes(canonical) || canonical.includes(s))
  )
}

function extractCitiesFromJD(jd: string): string[] {
  // Common city patterns: capitalized words followed by common location indicators
  const cityPattern = /\b([A-Z][a-záàâãéèêíìîóòôõúùûçñ]+(?:\s[A-Z][a-záàâãéèêíìîóòôõúùûçñ]+)*)\s*(?:,\s*[A-Z]{2})?\b/g
  const cities: string[] = []
  let match: RegExpExecArray | null
  while ((match = cityPattern.exec(jd)) !== null) {
    const candidate = match[1]
    // Filter out common non-city capitalized words
    if (!['We', 'You', 'The', 'Our', 'This', 'Must', 'Will', 'Candidate'].includes(candidate)) {
      cities.push(candidate.toLowerCase())
    }
  }
  return [...new Set(cities)]
}

export function scoreICIMS(cv: MappedCV, jd: string): PlatformScore {
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd)

  const flags: string[] = []
  const notes: string[] = []

  // Skills taxonomy mapping
  const canonicalMatches = mapToCanonical(cv.entities.skills)
  notes.push(`Skills mapped to ${canonicalMatches.length} canonical taxonomy entries: ${canonicalMatches.slice(0, 5).join(', ')}${canonicalMatches.length > 5 ? '...' : ''}`)

  // Location check
  const jdCities = extractCitiesFromJD(jd)
  const cvLocation = (cv.raw.location ?? '').toLowerCase()
  if (jdCities.length > 0) {
    const locationMatch = jdCities.some(city => cvLocation.includes(city))
    if (!locationMatch) {
      flags.push(`Location mismatch: JD references ${jdCities.slice(0, 3).join(', ')} but CV location is "${cv.raw.location ?? 'not set'}"`)
    } else {
      notes.push('Location match confirmed')
    }
  }

  const score = Math.round(Math.min(100, baseScore))

  return {
    platform: 'iCIMS',
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
