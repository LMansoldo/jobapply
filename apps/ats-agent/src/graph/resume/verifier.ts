import type { ResumeDraft, ResumeSource, VerificationViolation, VerificationReport } from '../../types'

// Thresholds — named for calibration
const JACCARD_THRESHOLD = 0.2
const MIN_NGRAM_SIZE = 2

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

function norm(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

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
  return norm(text).split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w))
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(contentWords(a))
  const setB = new Set(contentWords(b))
  if (setA.size === 0 && setB.size === 0) return 1
  const intersection = new Set([...setA].filter((x) => setB.has(x)))
  const union = new Set([...setA, ...setB])
  return intersection.size / union.size
}

function getNgrams(text: string, n: number): Set<string> {
  const words = contentWords(text)
  const ngrams = new Set<string>()
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.add(words.slice(i, i + n).join(' '))
  }
  return ngrams
}

function isNgramContaminated(ngram: string, jdKeywordSet: Set<string>, cvNorm: string, jdNorm: string): boolean {
  if (!jdNorm.includes(ngram)) return false
  // An n-gram is contamination only if at least one non-keyword content word is absent from the CV.
  // If all non-keyword words exist in the CV individually, the n-gram is legitimate keyword integration.
  const ngramWords = ngram.split(' ')
  for (const w of ngramWords) {
    if (jdKeywordSet.has(w)) continue // keyword — always allowed
    if (!cvNorm.includes(w)) return true // non-keyword word absent from CV → contamination
  }
  return false
}

function checkBullet(
  generated: string,
  original: string,
  locationPrefix: string,
  position: ResumeSource['positions'][number],
  fullCvText: string,
  jd: string,
  jdKeywords: string[],
): VerificationViolation | null {
  // low-overlap first — if the rewrite is too different, no need to check metrics
  if (jaccardSimilarity(generated, original) < JACCARD_THRESHOLD) {
    return { location: locationPrefix, rule: 'low-overlap', detail: `Jaccard similarity below ${JACCARD_THRESHOLD}`, action: 'reverted' }
  }

  const yearPat = getYearPattern(position)
  const origMetrics = extractMetricTokens(original, yearPat)
  const genMetrics = extractMetricTokens(generated, yearPat)

  // metric-dropped
  for (const m of origMetrics) {
    if (!genMetrics.has(m)) {
      return { location: locationPrefix, rule: 'metric-dropped', detail: `"${m}" present in original but missing in rewrite`, action: 'reverted' }
    }
  }

  // metric-invented
  for (const m of genMetrics) {
    if (!origMetrics.has(m)) {
      return { location: locationPrefix, rule: 'metric-invented', detail: `"${m}" appears in rewrite but not in original`, action: 'reverted' }
    }
  }

  // jd-contamination: flag n-grams from JD whose non-keyword words are absent from the full CV
  const jdKeywordSet = new Set(jdKeywords.map(norm))
  const cvNorm = norm(fullCvText)
  const jdNorm = norm(jd)
  const genNorm = norm(generated)

  for (const n of [MIN_NGRAM_SIZE, 3]) {
    const genNgrams = getNgrams(genNorm, n)
    for (const ngram of genNgrams) {
      if (isNgramContaminated(ngram, jdKeywordSet, cvNorm, jdNorm)) {
        return { location: locationPrefix, rule: 'jd-contamination', detail: `n-gram "${ngram}" from JD not anchored in original CV`, action: 'reverted' }
      }
    }
  }

  return null
}

export function verifyResumeDraft(
  draft: ResumeDraft,
  source: ResumeSource,
  jd: string,
  jdKeywords: string[],
): { draft: ResumeDraft; report: VerificationReport } {
  const violations: VerificationViolation[] = []
  const fullCvText = [
    source.summaryRaw,
    source.skillsRaw,
    ...source.positions.flatMap((p) => [p.context, ...p.bullets]),
    source.educationRaw,
  ].join(' ')

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
      const violation = checkBullet(bullet.text, original, loc, pos, fullCvText, jd, jdKeywords)

      if (violation) {
        violations.push(violation)
        verifiedBullets.push({ sourceIndex: bullet.sourceIndex, text: original })
      } else {
        verifiedBullets.push(bullet)
      }
    }

    // Check context
    const contextLoc = `experience[${entry.positionIndex}].context`
    const ctxViolation = checkBullet(entry.context, pos.context, contextLoc, pos, fullCvText, jd, jdKeywords)
    const verifiedContext = ctxViolation ? (violations.push(ctxViolation), pos.context) : entry.context

    return { ...entry, context: verifiedContext, bullets: verifiedBullets }
  })

  // Check summary (metric and contamination checks only)
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
  const jdKeywordSet = new Set(jdKeywords.map(norm))
  const cvNorm = norm(fullCvText)
  const jdNorm = norm(jd)
  const sumNorm = norm(draft.summary)
  outer: for (const n of [MIN_NGRAM_SIZE, 3]) {
    const sumNgrams = getNgrams(sumNorm, n)
    for (const ngram of sumNgrams) {
      if (isNgramContaminated(ngram, jdKeywordSet, cvNorm, jdNorm)) {
        summaryViolations.push({ location: 'summary', rule: 'jd-contamination', detail: `n-gram "${ngram}" from JD`, action: 'reverted' })
        break outer
      }
    }
  }
  const verifiedSummary = summaryViolations.length > 0 ? source.summaryRaw : draft.summary
  violations.push(...summaryViolations)

  return {
    draft: { ...draft, summary: verifiedSummary, experience: verifiedExperience },
    report: { violations },
  }
}
