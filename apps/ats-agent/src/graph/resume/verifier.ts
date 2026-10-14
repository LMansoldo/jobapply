import type { ResumeDraft, ResumeSource, VerificationViolation, VerificationReport } from '../../types'
import { sanitizeStyle } from './styleSanitizer'

// Thresholds — named for calibration
const JACCARD_THRESHOLD = 0.2

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'that', 'this', 'we', 'you', 'they', 'it', 'our', 'their',
  // Portuguese
  'e', 'o', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'em', 'na', 'no', 'para', 'por',
  'com', 'se', 'que', 'ao', 'ser', 'ter', 'seu', 'sua', 'seus', 'suas',
])

const METRIC_RE = /\d+(?:[.,]\d+)?\s*(?:%|R\$|\$|k|x|mil|milh[oõ]es?|pp)?/g
const YEAR_RE = /\b(19|20)\d{2}\b/g

function extractMetricTokens(text: string, yearPattern: RegExp): Set<string> {
  const tokens = new Set<string>()
  const matches = text.match(METRIC_RE) ?? []
  for (const m of matches) {
    const normalized = m.replace(',', '.').replace(/\s+/g, '')
    if (!yearPattern.test(normalized)) tokens.add(normalized)
  }
  return tokens
}

function getYearPattern(position: ResumeSource['positions'][number]): RegExp {
  const years: string[] = []
  const yearMatches = (position.header + ' ' + position.period).match(YEAR_RE) ?? []
  years.push(...yearMatches)
  return years.length > 0 ? new RegExp(`^(${years.join('|')})$`) : /^never$/
}

function contentWords(text: string): string[] {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(contentWords(a))
  const setB = new Set(contentWords(b))
  if (setA.size === 0 && setB.size === 0) return 1
  const intersection = new Set([...setA].filter((x) => setB.has(x)))
  const union = new Set([...setA, ...setB])
  return intersection.size / union.size
}

// Fidelity of a rewrite vs its original: metrics preserved both ways (years
// excluded), content overlap sane. Returns a violation detail or null.
export function rewriteFidelityViolation(original: string, rewrite: string, yearPattern: RegExp = /^never$/): string | null {
  if (jaccardSimilarity(rewrite, original) < JACCARD_THRESHOLD) {
    return `Jaccard similarity below ${JACCARD_THRESHOLD}`
  }
  const origMetrics = extractMetricTokens(original, yearPattern)
  const genMetrics = extractMetricTokens(rewrite, yearPattern)
  for (const m of origMetrics) {
    if (!genMetrics.has(m)) return `"${m}" present in original but missing in rewrite`
  }
  for (const m of genMetrics) {
    if (!origMetrics.has(m)) return `"${m}" appears in rewrite but not in original`
  }
  return null
}

function checkBullet(
  generated: string,
  original: string,
  locationPrefix: string,
  position: ResumeSource['positions'][number],
): VerificationViolation | null {
  // low-overlap first — if the rewrite is too different, no need to check metrics
  const overlap = jaccardSimilarity(generated, original)
  if (overlap < JACCARD_THRESHOLD) {
    return { location: locationPrefix, rule: 'low-overlap', detail: `Jaccard similarity below ${JACCARD_THRESHOLD}`, action: 'reverted' }
  }

  const fidelity = rewriteFidelityViolation(original, generated, getYearPattern(position))
  if (fidelity) {
    const dropped = fidelity.includes('missing in rewrite')
    return { location: locationPrefix, rule: dropped ? 'metric-dropped' : 'metric-invented', detail: fidelity, action: 'reverted' }
  }

  // generic-phrase: AI-smell / hollow impact language introduced by the rewrite
  const genericHits = sanitizeStyle(generated).genericPhraseHits
  if (genericHits.length > 0) {
    return { location: locationPrefix, rule: 'generic-phrase', detail: `generic phrasing: ${genericHits.join(', ')}`, action: 'reverted' }
  }

  // weak-clarity: a rewrite must stay a scannable, impersonal fact — same
  // thresholds the readability score penalizes; reverting to the original is a safe floor
  const words = generated.trim().split(/\s+/).length
  if (words < 6 || words > 32) {
    return { location: locationPrefix, rule: 'weak-clarity', detail: `${words} words (healthy range: 6-32)`, action: 'reverted' }
  }
  if (/\b(i|me|my|we|our)\b/i.test(generated)) {
    return { location: locationPrefix, rule: 'weak-clarity', detail: 'first-person pronoun', action: 'reverted' }
  }

  return null
}

export function verifyResumeDraft(
  draft: ResumeDraft,
  source: ResumeSource,
): { draft: ResumeDraft; report: VerificationReport } {
  const violations: VerificationViolation[] = []

  const verifiedExperience = draft.experience.map((entry) => {
    const pos = source.positions[entry.positionIndex]
    if (!pos) {
      violations.push({
        location: `experience[${entry.positionIndex}]`,
        rule: 'invalid-source',
        detail: `positionIndex ${entry.positionIndex} out of range`,
        action: 'reverted',
      })
      return { ...entry, include: false, bullets: [] }
    }

    const seenSourceIndices = new Set<number>()
    const verifiedBullets: Array<{ sourceIndex: number; text: string }> = []

    for (let bi = 0; bi < entry.bullets.length; bi++) {
      const bullet = entry.bullets[bi]
      const loc = `experience[${entry.positionIndex}].bullets[${bi}]`

      // invalid-source: out of range
      if (bullet.sourceIndex < 0 || bullet.sourceIndex >= pos.bullets.length) {
        violations.push({ location: loc, rule: 'invalid-source', detail: `sourceIndex ${bullet.sourceIndex} out of range`, action: 'reverted' })
        continue
      }

      // invalid-source: duplicate
      if (seenSourceIndices.has(bullet.sourceIndex)) {
        violations.push({ location: loc, rule: 'invalid-source', detail: `sourceIndex ${bullet.sourceIndex} already used`, action: 'reverted' })
        continue
      }
      seenSourceIndices.add(bullet.sourceIndex)

      const original = pos.bullets[bullet.sourceIndex]
      const violation = checkBullet(bullet.text, original, loc, pos)

      if (violation) {
        violations.push(violation)
        verifiedBullets.push({ sourceIndex: bullet.sourceIndex, text: original })
      } else {
        verifiedBullets.push(bullet)
      }
    }

    // Check context
    const contextLoc = `experience[${entry.positionIndex}].context`
    const ctxViolation = checkBullet(entry.context, pos.context, contextLoc, pos)
    const verifiedContext = ctxViolation ? (violations.push(ctxViolation), pos.context) : entry.context

    return { ...entry, context: verifiedContext, bullets: verifiedBullets }
  })

  // Check summary (metric checks only)
  const summaryViolations: VerificationViolation[] = []
  const yearPat = /^never$/
  const origMetrics = extractMetricTokens(source.summaryRaw, yearPat)
  const genMetrics = extractMetricTokens(draft.summary, yearPat)
  for (const m of origMetrics) {
    if (!genMetrics.has(m)) summaryViolations.push({ location: 'summary', rule: 'metric-dropped', detail: `"${m}" dropped`, action: 'reverted' })
  }
  for (const m of genMetrics) {
    if (!origMetrics.has(m)) summaryViolations.push({ location: 'summary', rule: 'metric-invented', detail: `"${m}" invented`, action: 'reverted' })
  }
  if (sanitizeStyle(draft.summary).genericPhraseHits.length > 0) {
    summaryViolations.push({ location: 'summary', rule: 'generic-phrase', detail: 'generic phrasing in summary', action: 'reverted' })
  }
  const verifiedSummary = summaryViolations.length > 0 ? source.summaryRaw : draft.summary
  violations.push(...summaryViolations)

  // Skills are intentionally NOT anchored to the source CV: the resume generator
  // injects JD keywords here on purpose (this is a score-conference tool). Bullet
  // integrity (metrics, overlap) is still enforced above.
  return {
    draft: { ...draft, summary: verifiedSummary, experience: verifiedExperience },
    report: { violations },
  }
}
