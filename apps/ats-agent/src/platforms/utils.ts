import type { MappedCV } from '../types'

// ── Stop words ────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'shall', 'that', 'this', 'these', 'those', 'we', 'you', 'they',
  'it', 'he', 'she', 'our', 'your', 'their', 'its', 'my', 'his', 'her', 'as',
  'if', 'so', 'yet', 'not', 'no', 'nor', 'than', 'then', 'when', 'while', 'also',
  'able', 'about', 'after', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'only', 'same', 'too', 'very', 'just', 'must', 'work',
  'working', 'new', 'using', 'use', 'used', 'within', 'across', 'well', 'strong',
  // Portuguese stop words
  'e', 'o', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos', 'em', 'na',
  'no', 'nas', 'nos', 'para', 'por', 'com', 'se', 'que', 'uma', 'ser', 'ter',
  'seu', 'sua', 'seus', 'suas', 'esta', 'este', 'estes', 'estas', 'isso', 'aqui',
])

// ── Keyword extraction ────────────────────────────────────────────────────────

export function extractJDKeywords(jd: string): string[] {
  const tokens = jd
    .toLowerCase()
    .split(/[\s,;.:!()\[\]{}"'\/\\@#$%^&*+=<>|?]+/)
    .filter(t => t.length >= 3 && !STOP_WORDS.has(t) && !/^\d+$/.test(t))
  return Array.from(new Set(tokens))
}

// ── Section-weighted scoring ──────────────────────────────────────────────────

const SECTION_WEIGHTS: Record<string, number> = {
  experience: 1.5,
  skills: 1.4,
  expertise: 0.9,
  summary: 0.8,
  objective: 0.6,
  education: 0.7,
  languages: 0.3,
  contact: 0.1,
}

export interface ScoringResult {
  baseScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
}

export function scoreKeywords(cv: MappedCV, jd: string, synonymMap?: Record<string, string[]>): ScoringResult {
  const keywords = extractJDKeywords(jd)
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
      if (allTerms.some(term => lower.includes(term))) {
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

  // Normalize against max possible (all keywords matching in highest-weight section)
  const maxScore = keywords.length * 1.5
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
