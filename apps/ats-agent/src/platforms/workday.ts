import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords, isValidPeriodFormat } from './utils'

const JOB_FAMILIES: Record<string, string[]> = {
  frontend: ['react', 'vue', 'angular', 'svelte', 'html', 'css', 'sass', 'tailwind', 'next', 'nuxt', 'javascript', 'typescript', 'webpack', 'vite'],
  backend: ['node', 'python', 'java', 'golang', 'rust', 'c#', 'php', 'ruby', 'express', 'fastify', 'django', 'spring', 'rest', 'graphql', 'grpc'],
  data: ['sql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'spark', 'hadoop', 'airflow', 'data pipeline', 'etl', 'dbt', 'bigquery', 'snowflake'],
  devops: ['docker', 'kubernetes', 'terraform', 'aws', 'gcp', 'azure', 'ci/cd', 'jenkins', 'ansible', 'linux', 'bash', 'monitoring', 'prometheus', 'grafana'],
  mobile: ['ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'objective-c'],
  ml: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit', 'nlp', 'computer vision', 'neural network', 'llm'],
}

function detectDominantFamily(jd: string): string {
  const lower = jd.toLowerCase()
  let bestFamily = 'backend'
  let bestCount = 0

  for (const [family, terms] of Object.entries(JOB_FAMILIES)) {
    const count = terms.filter(t => lower.includes(t)).length
    if (count > bestCount) {
      bestCount = count
      bestFamily = family
    }
  }
  return bestFamily
}

export function scoreWorkday(cv: MappedCV, jd: string): PlatformScore {
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd)

  const flags: string[] = []
  const notes: string[] = []

  // Strict date format check
  const malformattedPeriods = cv.entities.dates.filter(d => d && !isValidPeriodFormat(d))
  if (malformattedPeriods.length > 0) {
    flags.push(`Malformatted period(s): ${malformattedPeriods.join(', ')} — expected "MMM YYYY - MMM YYYY"`)
  }

  // Job family matching
  const dominantFamily = detectDominantFamily(jd)
  const familyTerms = JOB_FAMILIES[dominantFamily] ?? []
  const techLower = cv.entities.techStack.map(t => t.toLowerCase())
  const familyMatches = familyTerms.filter(t => techLower.some(s => s.includes(t)))
  const familyMatchPct = familyTerms.length > 0 ? (familyMatches.length / familyTerms.length) * 100 : 0
  notes.push(`Dominant job family: ${dominantFamily} (${Math.round(familyMatchPct)}% stack match)`)

  let score = baseScore
  if (malformattedPeriods.length > 0) {
    score = Math.min(score, 70)
    notes.push('Score capped at 70 due to malformatted period dates')
  }
  score = Math.round(Math.min(100, score))

  return {
    platform: 'Workday',
    score,
    passed: score >= 70 && malformattedPeriods.length === 0,
    missingRequired: [],
    missingPreferred: missingKeywords.slice(0, 10),
    flags,
    notes: [
      `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords`,
      ...notes,
    ],
  }
}
