import { generate } from '../../lib/glm'
import type { ChunkTier, ComposedKeyword, CvChunkInput, GapAnalysis, KeywordPhrase, RemoveSuggestion, RephraseGap } from '../../types'

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

const MAX_PHRASES_PER_KEYWORD = 3

interface RawGapEntry {
  keyword?: string
  verdict?: string
  cvPhrase?: string
  suggestedRewrite?: string
  phrases?: unknown
}

interface RawGapResult {
  entries?: RawGapEntry[]
  removeSuggestions?: Array<{ section?: string; item?: string; reason?: string }>
}

function cvChunksBlock(cvChunks: CvChunkInput[]): string {
  return cvChunks
    .map((c) => `- (${c.type} / ${c.section}) ${c.attr}`)
    .join('\n')
}

function buildPrompt(missing: ComposedKeyword[], cvChunks: CvChunkInput[], locale?: string): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  const missingBlock = missing
    .map((k) => `- (${k.tier}${k.keywordClass ? ` / ${k.keywordClass}` : ''}) ${k.term}`)
    .join('\n')

  return `<system>
You are a CV gap advisor for an ATS keyword matcher. The CV was matched against the job description using strict literal keyword matching, and the keywords below did NOT appear anywhere in the CV. Your job: find where the CV expresses the same concept with different words. Respond ONLY with valid JSON — no markdown, no explanation. All advice strings MUST be in ${lang}.
</system>

<missing_keywords>
One per line, (tier) term.
${missingBlock}
</missing_keywords>

<cv_atoms>
Indexed CV evidence. This is the ONLY CV information available — if the concept is not reflected here, the verdict is "absent".
${cvChunksBlock(cvChunks) || '(none)'}
</cv_atoms>

<rules>
- For each missing keyword, exactly one entry with verdict:
  - "rephrase": some cv_atom expresses the same concept in different words. cvPhrase = the cv_atom's own wording, copied as-is. suggestedRewrite = one CV-style sentence using the keyword's exact wording while staying true to that cv_atom (never invent facts, numbers or tools).
  - "absent": no cv_atom expresses the concept. Leave cvPhrase and suggestedRewrite as "".
- For "absent" entries, optionally add "phrases" (max ${MAX_PHRASES_PER_KEYWORD}) — ready-to-use CV lines for the keyword, phrased conditionally ("worked with X", "familiar with Y"). Only for plausible, honest additions. Phrase style by keyword class:
  - skill: short experience-bullet fragments
  - eligibility (location, residency, authorization, timezone, availability): short profile/header lines ("based in Latin America", "available for MST-overlap hours")
  - credential (degree, certification, language level): education/certification-style lines ("BS in Computer Science", "English proficiency at C1 level")
  - seniority (years of experience, seniority level): summary-style lines ("6+ years of fullstack frontend engineering")
- removeSuggestions: cv_atoms that are clearly irrelevant or counterproductive for this specific job. section = the atom's section, item = the atom's wording, reason = one sober sentence. Max 5. Empty array if none.
- Cover EVERY missing keyword exactly once. Do not add keywords that are not in the list.
</rules>

Respond with this exact JSON shape:
{
  "entries": [{ "keyword": "string", "verdict": "rephrase" | "absent", "cvPhrase": "string", "suggestedRewrite": "string", "phrases": ["string"] }],
  "removeSuggestions": [{ "section": "string", "item": "string", "reason": "string" }]
}`
}

export function parseGapAnalysisResponse(raw: string, missing: ComposedKeyword[]): GapAnalysis {
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean) as RawGapResult

  const missingByTerm = new Map(missing.map((k) => [normTerm(k.term), k]))
  const rephraseGaps: RephraseGap[] = []
  const absentKeywords: string[] = []
  const keywordPhrases: KeywordPhrase[] = []
  const covered = new Set<string>()

  for (const entry of parsed.entries ?? []) {
    if (typeof entry.keyword !== 'string') continue
    const term = normTerm(entry.keyword)
    const kw = missingByTerm.get(term)
    if (!kw || covered.has(term)) continue
    covered.add(term)

    if (entry.verdict === 'rephrase' && entry.cvPhrase && entry.suggestedRewrite && !looksFabricated(kw.term, entry.cvPhrase)) {
      rephraseGaps.push({
        keyword: kw.term,
        cvPhrase: entry.cvPhrase.slice(0, 200),
        suggestedRewrite: entry.suggestedRewrite.slice(0, 300),
      })
    } else {
      absentKeywords.push(kw.term)
      const phrases = Array.isArray(entry.phrases)
        ? entry.phrases.filter((p): p is string => typeof p === 'string' && p.trim().length > 0).slice(0, MAX_PHRASES_PER_KEYWORD)
        : []
      if (phrases.length > 0) keywordPhrases.push({ keyword: kw.term, phrases })
    }
  }

  // keywords the model failed to cover count as absent
  for (const k of missing) {
    if (!covered.has(normTerm(k.term))) absentKeywords.push(k.term)
  }

  const removeSuggestions: RemoveSuggestion[] = (parsed.removeSuggestions ?? [])
    .filter((r): r is { section: string; item: string; reason: string } =>
      typeof r.section === 'string' && typeof r.item === 'string' && typeof r.reason === 'string')
    .slice(0, 5)

  return { rephraseGaps, absentKeywords, keywordPhrases, removeSuggestions }
}

function normTerm(s: string): string {
  return s.trim().toLowerCase()
}

// Anti-fabrication guard: when the model claims a rephrase but the keyword adds a
// content qualifier absent from the claimed CV phrase while sharing its head
// ("visual regression testing" ← "automated regression testing"), the CV would
// have to gain a specialty it does not have. Downgrade to absent.
function looksFabricated(keyword: string, cvPhrase: string): boolean {
  const content = (s: string) => normTerm(s).split(/[^a-z0-9]+/).filter((t) => t.length >= 4)
  const kt = content(keyword)
  const pt = content(cvPhrase)
  if (kt.length === 0 || pt.length === 0) return false
  const shared = kt.filter((t) => pt.includes(t))
  const extra = kt.filter((t) => !pt.includes(t))
  return shared.length >= 2 && extra.length >= 1
}

export async function gapAdvisorNode(state: {
  missingKeywords: ComposedKeyword[]
  cvChunks: CvChunkInput[]
  locale?: string
}): Promise<{ gapAnalysis: GapAnalysis }> {
  const { missingKeywords, cvChunks, locale } = state

  if (missingKeywords.length === 0) {
    return { gapAnalysis: { rephraseGaps: [], absentKeywords: [], keywordPhrases: [], removeSuggestions: [] } }
  }

  const raw = await generate(buildPrompt(missingKeywords, cvChunks, locale))

  try {
    return { gapAnalysis: parseGapAnalysisResponse(raw, missingKeywords) }
  } catch {
    return {
      gapAnalysis: {
        rephraseGaps: [],
        absentKeywords: missingKeywords.map((k) => k.term),
        keywordPhrases: [],
        removeSuggestions: [],
      },
    }
  }
}
