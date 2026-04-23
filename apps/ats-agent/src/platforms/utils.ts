import type { MappedCV } from '../types'

// ── Job description parser ────────────────────────────────────────────────────

// Headers that signal job-relevant content (requirements, responsibilities, etc.)
const CONTENT_HEADER_RE = /^(responsabilidades?(\s+e\s+atribuições?)?|requisitos?(\s+e\s+qualificações?)?|qualifications?(\s+(and\s+job\s+)?requirements?)?|requirements?|diferencial|nice\s+to\s+have|missão\s+do\s+cargo|job\s+summary|responsibilities|é\s+um\s+diferencial|o\s+que\s+(buscamos|esperamos|precis\w*)|competências?|habilidades?|skills?\s+required|gestão\s+(técnica|da\s+entrega|de\s+impedimentos)|interface\s+com\s+produto|para\s+participar)/i

// Headers that signal noise: company info, culture, benefits
const NOISE_HEADER_RE = /^(informações\s+adicionais|benefícios?|benefits?|what\s+we\s+offer|why\s+(you'?ll|work|us)|por\s+que\s+(trabalhar|se\s+juntar|ama)|sobre\s+(a?\s*)?(empresa|nós|nos)|about\s+\w|quem\s+somos|who\s+we\s+are|e\s+aí,?\s+curti|apply\s+now)/i

// Inline benefit markers: lines that are clearly perks/benefits (no tech keywords)
const BENEFIT_LINE_RE = /^(vale\s+(refeição|alimentação|transporte)|plano\s+(de\s+)?(saúde|odontológico)|gympass|wellhub|totalpass|auxílio\s+(home|creche|posto)|seguro\s+de\s+vida|day\s+off|folga\s+de\s+aniversário|semana\s+relax|participação\s+nos\s+lucros|great\s+place\s+to\s+work)/i

export function parseJobDescription(jd: string): string {
  const lines = jd.split('\n')
  const contentLines: string[] = []

  // 'before' = before first content header (skip intro/presentation)
  // 'content' = inside a content section (collect)
  // 'noise'   = inside a noise section (skip)
  let state: 'before' | 'content' | 'noise' = 'before'
  let hasContentHeaders = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (CONTENT_HEADER_RE.test(trimmed)) {
      state = 'content'
      hasContentHeaders = true
      contentLines.push(line)
      continue
    }

    if (NOISE_HEADER_RE.test(trimmed)) {
      state = 'noise'
      continue
    }

    if (state === 'content' && !BENEFIT_LINE_RE.test(trimmed)) {
      contentLines.push(line)
    }
  }

  // If no recognizable content headers were found, return original JD unchanged
  return hasContentHeaders && contentLines.length > 0 ? contentLines.join('\n') : jd
}

// ── Stop words ────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  // English function words
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'shall', 'that', 'this', 'these', 'those', 'we', 'you', 'they',
  'it', 'he', 'she', 'our', 'your', 'their', 'its', 'my', 'his', 'her', 'as',
  'if', 'so', 'yet', 'not', 'no', 'nor', 'than', 'then', 'when', 'while', 'also',
  'able', 'about', 'after', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'only', 'same', 'too', 'very', 'just', 'must', 'work',
  'working', 'new', 'using', 'use', 'used', 'within', 'across', 'well', 'strong',
  // English JD filler — nouns and adjectives
  'skills', 'experience', 'requirements', 'knowledge', 'ability', 'level',
  'minimum', 'preferred', 'required', 'including', 'related', 'similar',
  'good', 'great', 'nice', 'plus', 'bonus', 'role', 'team', 'company',
  'candidate', 'candidates', 'looking', 'position', 'opportunity', 'responsibilities',
  'mandatory', 'mindset', 'fully', 'relevant', 'interactive', 'strategic',
  'scalable', 'proven', 'thousands', 'budgets', 'budget', 'soft', 'high',
  'deep', 'broad', 'latest', 'modern', 'best', 'practices', 'practice',
  'solutions', 'patterns', 'pattern', 'modules', 'features', 'tasks', 'activities',
  'specifications', 'spec', 'environment', 'environments', 'tools', 'track', 'record',
  // English JD filler — action verbs (JD uses them, CV uses past tense — they never match anyway)
  'build', 'builds', 'building', 'implement', 'implementing', 'develop', 'developing',
  'maintain', 'maintaining', 'manage', 'managing', 'create', 'creating',
  'ensure', 'ensuring', 'enforce', 'enforcing', 'integrate', 'integrating',
  'mentor', 'mentoring', 'support', 'supporting', 'deliver', 'delivering',
  'drive', 'driving', 'reduce', 'reducing', 'boost', 'boosting', 'increase',
  'increasing', 'accelerate', 'accelerating', 'achieve', 'achieving',
  'lead', 'leading', 'define', 'defining', 'cutting', 'feed',
  // Portuguese function words
  'e', 'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos',
  'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'se', 'que', 'ao',
  'aos', 'ser', 'ter', 'seu', 'sua', 'seus', 'suas', 'esta', 'este', 'estes',
  'estas', 'isso', 'aqui', 'mais', 'mas', 'são', 'foi', 'era', 'vai',
  'como', 'bem', 'seu', 'sua', 'nós', 'eles', 'elas', 'quem', 'onde',
  // Portuguese JD filler
  'requisitos', 'experiência', 'conhecimento', 'habilidades', 'competências',
  'nível', 'mínimo', 'obrigatório', 'desejável', 'diferencial', 'incluindo',
  'relacionado', 'similar', 'similares', 'cargo', 'vaga', 'empresa', 'equipe',
  'time', 'candidato', 'candidatos', 'buscamos', 'procuramos', 'oferecemos',
  'técnicas', 'técnico', 'técnicos', 'profissional', 'área', 'anos',
  'entendimento', 'compreensão', 'sólido', 'sólida', 'avançado', 'avançada',
  'profundo', 'profunda', 'proficiência', 'domínio', 'básico', 'intermediário',
  'implementar', 'desenvolver', 'garantir', 'gerenciar', 'criar', 'manter',
  'otimizar', 'liderar', 'definir', 'entregar', 'forte', 'específico', 'específicos',
])

// ── Keyword extraction ────────────────────────────────────────────────────────

// Normalize typographic dash variants to regular hyphen-minus (U+002D)
// Non-breaking hyphen (U+2011), en/em dashes, etc. are commonly used in JD copy
// and will fail substring matching against CVs that use standard hyphens.
const UNICODE_DASH_RE = /[\u00AD\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g

export function extractJDKeywords(jd: string): string[] {
  const cleaned = parseJobDescription(jd).replace(UNICODE_DASH_RE, '-')
  const tokens = cleaned
    .toLowerCase()
    .split(/[\s,;.:!()\[\]{}"'\/\\@#$%^&*+=<>|?]+/)
    .filter(t => t.length >= 3 && !STOP_WORDS.has(t) && !/^\d+$/.test(t))
  return Array.from(new Set(tokens))
}

// ── Section-weighted scoring ──────────────────────────────────────────────────

const SECTION_WEIGHTS: Record<string, number> = {
  experience: 1.5,
  skills: 1.4,
  summary: 0.8,
  education: 0.7,
  languages: 0.3,
  contact: 0.1,
}

export interface ScoringResult {
  baseScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
}

function termMatches(cvText: string, keyword: string): boolean {
  // Normalize typographic dashes in both sides before any comparison
  const normCv = cvText.replace(UNICODE_DASH_RE, '-')
  const normKw = keyword.replace(UNICODE_DASH_RE, '-')

  // Exact substring match
  if (normCv.includes(normKw)) return true

  // Plural/singular tolerance
  if (normKw.endsWith('s') && normCv.includes(normKw.slice(0, -1))) return true
  if (!normKw.endsWith('s') && normCv.includes(normKw + 's')) return true

  // Compound term: all words individually present (e.g. "design system" → "design" + "system")
  const words = normKw.split(' ')
  if (words.length > 1 && words.every(w => w.length > 2 && normCv.includes(w))) return true

  return false
}

export function scoreKeywords(cv: MappedCV, jd: string, synonymMap?: Record<string, string[]>, preExtractedKeywords?: string[]): ScoringResult {
  const keywords = preExtractedKeywords?.length ? preExtractedKeywords : extractJDKeywords(jd)
  if (keywords.length === 0) return { baseScore: 0, matchedKeywords: [], missingKeywords: [] }

  const matched = new Set<string>()
  const missing = new Set<string>()
  let totalWeightedScore = 0

  for (const keyword of keywords) {
    const lk = keyword.toLowerCase()
    let bestWeight = 0

    const allTerms = [lk]
    if (synonymMap) {
      for (const [canonical, syns] of Object.entries(synonymMap)) {
        if (canonical === lk || syns.includes(lk)) {
          allTerms.push(canonical, ...syns)
        }
      }
    }

    for (const [section, weight] of Object.entries(SECTION_WEIGHTS)) {
      const text = cv.sections[section as keyof typeof cv.sections] ?? ''
      const lower = text.toLowerCase()
      if (allTerms.some(term => termMatches(lower, term))) {
        bestWeight = Math.max(bestWeight, weight)
      }
    }

    if (bestWeight > 0) {
      matched.add(keyword)
      totalWeightedScore += bestWeight
    } else {
      missing.add(keyword)
    }
  }

  // Normalize against a softer baseline (1.3 instead of max weight 1.5).
  // Using the theoretical max (1.5) as divisor is too punishing — a handful of
  // minor JD-specific terms (version suffixes like "html5", synonyms, etc.) that
  // the CV legitimately covers under a different name would crater an otherwise
  // strong match. 1.3 lets a CV that matches ~85%+ of keywords in the right
  // sections still reach 90%+, while keeping a weak match (≤50%) clearly below 60%.
  const maxScore = keywords.length * 1.3
  const baseScore = Math.min(100, (totalWeightedScore / maxScore) * 100)

  return {
    baseScore,
    matchedKeywords: Array.from(matched),
    missingKeywords: Array.from(missing),
  }
}

// ── Period parsing ────────────────────────────────────────────────────────────

export function parsePeriod(period: string): { start: Date; end: Date | null } {
  const parts = period.split(/\s*[-–]\s*/)
  const parseDate = (s: string): Date | null => {
    const trimmed = s.trim()
    if (!trimmed) return null
    const lower = trimmed.toLowerCase()
    if (lower === 'present' || lower === 'atual' || lower === 'current') return new Date()
    const d = new Date(trimmed)
    return isNaN(d.getTime()) ? null : d
  }
  const start = parseDate(parts[0]) ?? new Date(0)
  const end = parts[1] ? parseDate(parts[1]) : null
  return { start, end }
}

// ── Gap detection ─────────────────────────────────────────────────────────────

export interface Gap {
  gapMonths: number
  after: string
}

export function detectGaps(periods: Array<{ role: string; company: string; period: string }>): Gap[] {
  const parsed = periods
    .filter(p => p.period)
    .map(p => ({ ...parsePeriod(p.period), label: `${p.role ?? 'Role'} at ${p.company ?? 'Company'}` }))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  const gaps: Gap[] = []
  for (let i = 1; i < parsed.length; i++) {
    const prev = parsed[i - 1]
    const curr = parsed[i]
    const prevEnd = prev.end ?? prev.start
    const gapMs = curr.start.getTime() - prevEnd.getTime()
    const gapMonths = gapMs / (1000 * 60 * 60 * 24 * 30.44)
    if (gapMonths > 6) {
      gaps.push({ gapMonths: Math.round(gapMonths), after: prev.label })
    }
  }
  return gaps
}

// ── Short tenure detection ────────────────────────────────────────────────────

export function detectShortTenures(periods: Array<{ role: string; company: string; period: string }>): string[] {
  return periods
    .filter(p => {
      if (!p.period) return false
      const { start, end } = parsePeriod(p.period)
      const endDate = end ?? new Date()
      const months = (endDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      return months < 6
    })
    .map(p => `${p.role ?? 'Role'} at ${p.company ?? 'Company'}`)
}

// ── Recency boost ─────────────────────────────────────────────────────────────

export function getRecentPeriods(periods: Array<{ role: string; company: string; period: string }>): string[] {
  const threeYearsAgo = new Date()
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)

  return periods
    .filter(p => {
      if (!p.period) return false
      const { end } = parsePeriod(p.period)
      const endDate = end ?? new Date()
      return endDate >= threeYearsAgo
    })
    .map(p => `${p.role ?? 'Role'} at ${p.company ?? 'Company'}`)
}

// ── Period format validation ──────────────────────────────────────────────────

const PERIOD_REGEX = /^[A-Z][a-z]{2}\s\d{4}\s*[-–]\s*([A-Z][a-z]{2}\s\d{4}|[Pp]resent|[Aa]tual|[Cc]urrent)$/

export function isValidPeriodFormat(period: string): boolean {
  return PERIOD_REGEX.test(period.trim())
}

// ── Career progression ────────────────────────────────────────────────────────

const SENIORITY_LEVELS: Record<string, number> = {
  trainee: 0, intern: 0, estagiário: 0,
  junior: 1, jr: 1, júnior: 1, entry: 1,
  pleno: 2, mid: 2, 'mid-level': 2, intermediate: 2,
  senior: 3, sr: 3, sênior: 3, lead: 3,
  staff: 4, principal: 4, architect: 4, arquiteto: 4,
  manager: 5, gerente: 5, director: 6, diretor: 6, vp: 7, head: 6,
}

export function detectCareerProgression(jobTitles: string[]): boolean {
  const levels = jobTitles
    .map(title => {
      const lower = title.toLowerCase()
      for (const [term, level] of Object.entries(SENIORITY_LEVELS)) {
        if (lower.includes(term)) return level
      }
      return -1
    })
    .filter(l => l >= 0)

  if (levels.length < 2) return false
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1]) return true
  }
  return false
}

// ── Word count ────────────────────────────────────────────────────────────────

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}
