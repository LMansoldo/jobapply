import type { MappedCV, PlatformScore } from '../types'
import { scoreKeywords, extractJDKeywords, detectShortTenures } from './utils'

const SYNONYMS: Record<string, string[]> = {
  react: ['react.js', 'reactjs'],
  vue: ['vue.js', 'vuejs'],
  angular: ['angularjs', 'angular.js'],
  node: ['node.js', 'nodejs'],
  javascript: ['js'],
  typescript: ['ts'],
  kubernetes: ['k8s'],
  postgresql: ['postgres', 'psql', 'pg'],
  mongodb: ['mongo'],
  elasticsearch: ['elastic', 'opensearch'],
  graphql: ['gql'],
  docker: ['dockerfile', 'containerization'],
  python: ['py'],
  golang: ['go lang'],
  java: ['jvm', 'spring boot'],
  aws: ['amazon web services', 'amazon cloud'],
  gcp: ['google cloud', 'google cloud platform'],
  azure: ['microsoft azure', 'ms azure'],
  'ci/cd': ['continuous integration', 'continuous deployment', 'github actions', 'jenkins', 'gitlab ci'],
  rest: ['rest api', 'restful', 'http api'],
  sql: ['mysql', 'mariadb', 'relational database'],
  nosql: ['non-relational', 'document database'],
  sass: ['scss'],
  tailwind: ['tailwindcss', 'tailwind css'],
  jest: ['vitest', 'testing library'],
  redux: ['zustand', 'mobx', 'state management'],
  next: ['next.js', 'nextjs'],
  svelte: ['sveltekit', 'svelte kit'],
  terraform: ['iac', 'infrastructure as code', 'pulumi'],
  linux: ['unix', 'bash', 'shell scripting'],
}

export function scoreLever(cv: MappedCV, jd: string): PlatformScore {
  const { baseScore, matchedKeywords, missingKeywords } = scoreKeywords(cv, jd, SYNONYMS)

  const flags: string[] = []
  const notes: string[] = [
    `Matched ${matchedKeywords.length} of ${extractJDKeywords(jd).length} JD keywords (synonym-expanded)`,
    'Lever applies synonym tolerance — React/React.js, JS/JavaScript, k8s/Kubernetes treated as equivalent',
  ]

  const shortTenures = detectShortTenures(cv.entities.experiencePeriods)
  for (const t of shortTenures) {
    flags.push(`Short tenure (< 6 months): ${t}`)
  }

  const score = Math.round(Math.min(100, baseScore))

  return {
    platform: 'Lever',
    score,
    passed: score >= 65,
    missingRequired: [],
    missingPreferred: missingKeywords.slice(0, 10),
    flags,
    notes,
  }
}
