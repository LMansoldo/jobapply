import * as fs from 'fs'
import * as path from 'path'

// ── Configuration ────────────────────────────────────────────────────────────

const JOBS_DIR = '/Users/lucasmansoldo/Projects/jobsearch/jobs_md'
const OUTPUT = path.resolve(__dirname, '..', 'src', 'platforms', 'keyword-constraints.ts')
const MIN_UNIGRAM_COUNT = 15    // Minimum occurrences to include a unigram
const MIN_BIGRAM_COUNT = 8      // Minimum occurrences to include a bigram
const MIN_UNIGRAM_LENGTH = 3    // Skip single/double chars

// ── Stop words (reuse from utils.ts philosophy) ──────────────────────────────

const STOP_WORDS = new Set([
  // English
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'shall', 'that', 'this', 'these', 'those', 'we', 'you', 'they',
  'it', 'he', 'she', 'our', 'your', 'their', 'its', 'my', 'his', 'her', 'as',
  'if', 'so', 'yet', 'not', 'no', 'nor', 'than', 'then', 'when', 'while', 'also',
  'able', 'about', 'after', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'only', 'same', 'too', 'very', 'just', 'must',
  'within', 'across', 'well', 'strong',
  // JD filler — nouns and adjectives
  'skills', 'experience', 'requirements', 'knowledge', 'ability', 'level',
  'minimum', 'preferred', 'required', 'including', 'related', 'similar',
  'good', 'great', 'nice', 'plus', 'bonus', 'role', 'team', 'company',
  'candidate', 'candidates', 'looking', 'position', 'opportunity', 'responsibilities',
  'mandatory', 'mindset', 'fully', 'relevant', 'interactive', 'strategic',
  'scalable', 'proven', 'thousands', 'budgets', 'budget', 'soft', 'high',
  'deep', 'broad', 'latest', 'modern', 'best', 'practices', 'practice',
  'solutions', 'patterns', 'pattern', 'modules', 'features', 'tasks', 'activities',
  'specifications', 'spec', 'environment', 'environments', 'tools', 'track', 'record',
  'work', 'working', 'new', 'using', 'use', 'used', 'build', 'builds', 'building',
  'implement', 'implementing', 'develop', 'developing',
  'maintain', 'maintaining', 'manage', 'managing', 'create', 'creating',
  'ensure', 'ensuring', 'enforce', 'enforcing', 'integrate', 'integrating',
  'mentor', 'mentoring', 'support', 'supporting', 'deliver', 'delivering',
  'drive', 'driving', 'reduce', 'reducing', 'boost', 'boosting', 'increase',
  'increasing', 'accelerate', 'accelerating', 'achieve', 'achieving',
  'lead', 'leading', 'define', 'defining', 'cutting', 'feed',
  // Portuguese
  'e', 'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos',
  'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'se', 'que', 'ao',
  'aos', 'ser', 'ter', 'seu', 'sua', 'seus', 'suas', 'esta', 'este', 'estes',
  'estas', 'isso', 'aqui', 'mais', 'mas', 'são', 'foi', 'era', 'vai',
  'como', 'bem', 'seu', 'sua', 'nós', 'eles', 'elas', 'quem', 'onde',
  'requisitos', 'experiência', 'conhecimento', 'habilidades', 'competências',
  'nível', 'mínimo', 'obrigatório', 'desejável', 'diferencial', 'incluindo',
  'relacionado', 'similar', 'similares', 'cargo', 'vaga', 'empresa', 'equipe',
  'time', 'candidato', 'candidatos', 'buscamos', 'procuramos', 'oferecemos',
  'técnicas', 'técnico', 'técnicos', 'profissional', 'área', 'anos',
  'entendimento', 'compreensão', 'sólido', 'sólida', 'avançado', 'avançada',
  'profundo', 'profunda', 'proficiência', 'domínio', 'básico', 'intermediário',
  'implementar', 'desenvolver', 'garantir', 'gerenciar', 'criar', 'manter',
  'otimizar', 'liderar', 'definir', 'entregar', 'forte', 'específico', 'específicos',
  // Section markers / metadata
  'descrição', 'description', 'vaga', 'job', 'responsabilidades', 'responsibilities',
  'qualificações', 'qualifications', 'atribuições', 'diferenciais',
])

// Words that indicate a line is part of the JD description (not noise)
const DESCRIPTION_MARKERS = [
  'descrição da vaga', 'job description', 'descrição',
  'responsabilidades e atribuições', 'responsibilities and duties',
  'requisitos e qualificações', 'qualifications',
  'o que você vai fazer', 'what you will do',
  'o que esperamos de você', 'what we expect',
  'será um diferencial', 'nice to have', 'essential skills',
  'highly desirable', 'responsabilidades',
]

const NOISE_MARKERS = [
  'sobre a empresa', 'sobre nós', 'about us', 'about the company',
  'benefícios', 'benefits', 'informações adicionais', 'additional information',
  'candidatura', 'como se candidatar', 'how to apply',
  'quem somos', 'who we are', 'por que trabalhar',
  'apply now', 'candidate-se',
]

// ── Text extraction ──────────────────────────────────────────────────────────

function extractDescription(text: string): string {
  const lines = text.split('\n')
  let inDescription = false
  let inNoise = false
  const descLines: string[] = []

  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    const lower = line.toLowerCase()

    // Skip metadata lines (before description)
    if (lower.startsWith('# ') || lower.startsWith('**empresa:**') || lower.startsWith('**localização:**') ||
        lower.startsWith('**busca:**') || lower.startsWith('**data de coleta:**') ||
        lower.startsWith('**fonte:**') || lower.startsWith('## candidatura') ||
        lower.startsWith('- **tipo:**') || lower.startsWith('- **url') ||
        lower.startsWith('- **url de inscrição**') || lower.startsWith('- **url da vaga**')) {
      continue
    }

    // Check for description start
    if (DESCRIPTION_MARKERS.some(m => lower.includes(m))) {
      inDescription = true
      inNoise = false
      continue
    }

    // Check for noise sections
    if (NOISE_MARKERS.some(m => lower.includes(m))) {
      inNoise = true
      continue
    }

    // Skip markdown headers, links, lists
    if (line.startsWith('---') || line.startsWith('```')) continue

    if (inDescription && !inNoise) {
      descLines.push(line)
    }
  }

  return descLines.join(' ')
}

// ── N-gram extraction ────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[\[\]{}()"'\/\\@#$%^&*+=<>|?]/g, ' ')
    .replace(/[–—\-]/g, ' ')
    .split(/[\s,;:.!]+/)
    .filter(t => t.length >= MIN_UNIGRAM_LENGTH && !/^\d+$/.test(t) && !STOP_WORDS.has(t))
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(JOBS_DIR).filter(f => f.endsWith('.md'))
  console.log(`Scanning ${files.length} job descriptions...`)

  const unigramCounts = new Map<string, number>()
  const bigramCounts = new Map<string, number>()
  let totalChars = 0
  let parsedCount = 0

  for (const file of files) {
    const content = fs.readFileSync(path.join(JOBS_DIR, file), 'utf-8')
    const desc = extractDescription(content)
    if (desc.length < 50) continue // skip metadata-only files

    parsedCount++
    totalChars += desc.length

    const tokens = tokenize(desc)

    // Count unigrams
    for (const token of tokens) {
      unigramCounts.set(token, (unigramCounts.get(token) ?? 0) + 1)
    }

    // Count bigrams (sliding window, both words pass stop-word / length check)
    for (let i = 0; i < tokens.length - 1; i++) {
      const bigram = `${tokens[i]} ${tokens[i + 1]}`
      bigramCounts.set(bigram, (bigramCounts.get(bigram) ?? 0) + 1)
    }
  }

  console.log(`Parsed ${parsedCount} descriptions (${(totalChars / 1024 / 1024).toFixed(1)} MB)`)

  // Sort by frequency
  const sortedUnigrams = [...unigramCounts.entries()]
    .filter(([, count]) => count >= MIN_UNIGRAM_COUNT)
    .sort((a, b) => b[1] - a[1])

  const sortedBigrams = [...bigramCounts.entries()]
    .filter(([, count]) => count >= MIN_BIGRAM_COUNT)
    .sort((a, b) => b[1] - a[1])

  console.log(`\nTop 50 unigrams:`)
  sortedUnigrams.slice(0, 50).forEach(([word, count]) => {
    console.log(`  ${word} (${count})`)
  })

  console.log(`\nTop 50 bigrams:`)
  sortedBigrams.slice(0, 50).forEach(([bigram, count]) => {
    console.log(`  ${bigram} (${count})`)
  })

  // Prepare the output file: compound terms, tech categories
  const compoundTerms = sortedBigrams
    .filter(([bigram]) => {
      const [a, b] = bigram.split(' ')
      // Skip bigrams where either part looks like a non-tech generic word
      const generics = new Set(['experience', 'knowledge', 'skills', 'development', 'engineering',
        'system', 'systems', 'application', 'applications', 'platform', 'design',
        'management', 'testing', 'framework', 'language', 'technologies', 'technology',
        'technical', 'based', 'driven', 'oriented', 'focused', 'level', 'using',
        'including', 'related', 'various', 'multiple', 'complex', 'different',
        'real', 'data', 'time', 'end', 'front', 'back', 'full', 'stack',
        'web', 'mobile', 'cloud', 'native', 'digital', 'agile', 'large', 'scale',
        'best', 'class', 'high', 'performance', 'critical', 'business', 'customer',
        'user', 'product', 'code', 'source', 'quality', 'secure', 'security',
        'continuous', 'integration', 'delivery', 'development', 'lifecycle',
        'team', 'cross', 'functional', 'self', 'service', 'micro', 'services',
        'software', 'computer', 'science', 'information', 'communication',
        'problem', 'solving', 'decision', 'making', 'stakeholder',
        'gerenciamento', 'desenvolvimento', 'experiência', 'conhecimento',
        'habilidades', 'técnicas', 'engenharia', 'qualidade', 'segurança',
        'negócio', 'produto', 'usuário', 'código', 'aplicações', 'aplicativos',
        'sistemas', 'plataforma', 'projeto', 'projetos', 'times', 'pessoas',
        'trabalho', 'remoto', 'híbrido', 'presencial', 'flexível',
        'análise', 'análises', 'solução', 'soluções',
        'novas', 'novos', 'diferentes', 'principais', 'principais',
        'dentro', 'fora', 'entre', 'sobre', 'através',
      ])
      return !generics.has(a) && !generics.has(b)
    })
    .map(([bigram, count]) => `    "${bigram}"`)
    .slice(0, 200)

  // Build tech keyword categories based on frequency analysis
  const techKeywords = {
    frontend: extractTechCategory(sortedUnigrams, [
      'react', 'angular', 'vue', 'nextjs', 'nuxt', 'svelte',
      'typescript', 'javascript', 'html5', 'css3', 'html', 'css',
      'tailwind', 'sass', 'less', 'styled-components', 'emotion',
      'redux', 'zustand', 'mobx', 'graphql', 'apollo',
      'webpack', 'vite', 'rollup', 'esbuild', 'babel',
      'jest', 'cypress', 'playwright', 'testing-library', 'vitest',
      'storybook', 'chromatic',
    ]),
    backend: extractTechCategory(sortedUnigrams, [
      'nodejs', 'node', 'express', 'nestjs', 'fastify', 'koa',
      'python', 'django', 'flask', 'fastapi',
      'java', 'spring', 'kotlin', 'go', 'golang', 'rust',
      'ruby', 'rails', 'php', 'laravel',
      'c#', 'dotnet', '.net', 'c++',
      'graphql', 'rest', 'grpc', 'soap',
      'postgresql', 'postgres', 'mysql', 'mongodb', 'redis',
      'kafka', 'rabbitmq', 'sqs', 'nats',
    ]),
    devops: extractTechCategory(sortedUnigrams, [
      'aws', 'azure', 'gcp', 'google-cloud',
      'docker', 'kubernetes', 'k8s', 'terraform', 'pulumi',
      'jenkins', 'github-actions', 'gitlab-ci', 'circleci', 'argo',
      'prometheus', 'grafana', 'datadog', 'newrelic', 'elastic',
      'helm', 'istio', 'linkerd', 'envoy',
      'linux', 'unix', 'bash', 'shell',
      'nginx', 'apache', 'caddy',
    ]),
    data: extractTechCategory(sortedUnigrams, [
      'python', 'sql', 'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow',
      'spark', 'hadoop', 'airflow', 'dbt', 'snowflake', 'bigquery', 'redshift',
      'databricks', 'mlflow', 'kubeflow',
      'tableau', 'powerbi', 'looker', 'metabase',
      'lake', 'warehouse', 'pipeline', 'etl', 'elt',
    ]),
    mobile: extractTechCategory(sortedUnigrams, [
      'swift', 'kotlin', 'flutter', 'dart', 'react-native', 'expo',
      'android', 'ios', 'xcode', 'jetpack',
    ]),
  }

  function extractTechCategory(
    sorted: Array<[string, number]>,
    candidates: string[]
  ): Record<string, string> {
    const result: Record<string, string> = {}
    const found = new Set(sorted.map(([w]) => w))
    for (const c of candidates) {
      // Normalize: strip dots, hyphens for matching
      const normalized = c.replace(/[.\-]/g, '').toLowerCase()
      const match = sorted.find(([w]) => w.replace(/[.\-]/g, '').toLowerCase() === normalized)
      // Also check if the candidate exists as a bigram component
      const asBigram = sortedBigrams.find(([b]) => {
        const parts = b.split(' ')
        return parts.includes(c) || parts.includes(c.replace(/[.\-]/g, ''))
      })
      if (match || asBigram || c === 'react' || c === 'nodejs' || c === 'python' || c === 'aws' || c === 'docker' || c === 'kubernetes' || c === 'typescript' || c === 'sql' || c === 'javascript') {
        // Use the original candidate as canonical
        result[c] = c
      }
    }
    return result
  }

  // Generate the output file
  const output = `// Auto-generated by scripts/build-keyword-constraints.ts
// Generated on ${new Date().toISOString().split('T')[0]}
// Source: ${parsedCount} job descriptions from ${JOBS_DIR}
// Do not edit manually — re-run the build script to update.

/**
 * Compound terms (bigrams) that should be treated as single keywords
 * rather than split into individual words during extraction.
 */
export const COMPOUND_TERMS: string[] = [
${compoundTerms.join(',\n')},
]

/**
 * Canonical tech keywords organized by domain category.
 * These represent common technologies, frameworks, and tools.
 */
export const TECH_KEYWORDS: Record<string, Record<string, string>> = {
  frontend: ${JSON.stringify(techKeywords.frontend, null, 2).replace(/\n/g, '\n  ')},
  backend: ${JSON.stringify(techKeywords.backend, null, 2).replace(/\n/g, '\n  ')},
  devops: ${JSON.stringify(techKeywords.devops, null, 2).replace(/\n/g, '\n  ')},
  data: ${JSON.stringify(techKeywords.data, null, 2).replace(/\n/g, '\n  ')},
  mobile: ${JSON.stringify(techKeywords.mobile, null, 2).replace(/\n/g, '\n  ')},
}

/**
 * All known tech keywords as a flat set for fast lookup.
 */
export const ALL_TECH_KEYWORDS: Set<string> = new Set(
  Object.values(TECH_KEYWORDS).flatMap(cat => Object.values(cat))
)

/**
 * Map of synonym groups for flexible matching.
 * Key = canonical term, Value = array of common variants.
 */
export const SYNONYM_MAP: Record<string, string[]> = {
  react: ['reactjs', 'react.js', 'react-js'],
  nodejs: ['node.js', 'node-js', 'node'],
  typescript: ['ts'],
  javascript: ['js', 'ecmascript'],
  nextjs: ['next.js', 'next-js'],
  kubernetes: ['k8s'],
  docker: ['dockerize', 'dockerized'],
  aws: ['amazon-web-services', 'amazon'],
  graphql: ['gql'],
  python: ['python3'],
  mongodb: ['mongo', 'mongo-db'],
  postgresql: ['postgres', 'postgre'],
}
`

  fs.writeFileSync(OUTPUT, output, 'utf-8')
  console.log(`\n✅ Generated ${OUTPUT}`)
  console.log(`   - ${compoundTerms.length} compound terms`)
  console.log(`   - ${Object.keys(techKeywords).length} tech categories`)
  const totalTech = Object.values(techKeywords).reduce((s, c) => s + Object.keys(c).length, 0)
  console.log(`   - ${totalTech} total tech keywords`)
  console.log(`   - ${Object.keys(output).length} synonym groups`)
}

main()
