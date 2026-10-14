import { generate } from '../../lib/glm'
import { norm } from '../../db/chunks'
import type { ComposedKeyword, JdChunkInput, KeywordClass, KeywordVerdict } from '../../types'

const VALID_ACTIONS = new Set<KeywordVerdict['action']>(['keep', 'merge_into', 'strip_variant', 'reclassify'])
const VALID_CLASSES = new Set<KeywordClass>(['skill', 'eligibility', 'credential', 'seniority'])

function keywordsBlock(keywords: ComposedKeyword[]): string {
  return keywords
    .map((k) => `- (must-have|important|nice-to-have: ${k.tier}) ${k.term} — variants: [${k.variants.join(', ')}]`)
    .join('\n')
}

function jdChunksBlock(chunks: JdChunkInput[]): string {
  return chunks.map((c) => `- (${c.type} / ${c.tier}) ${c.attr}`).join('\n')
}

function buildPrompt(keywords: ComposedKeyword[], jdChunks: JdChunkInput[]): string {
  return `<system>
You are a keyword validator for an ATS boolean matcher. You audit composed keywords against the job description atoms and return structural corrections. Respond ONLY with valid JSON — no markdown, no explanation.
</system>

<keywords>
${keywordsBlock(keywords) || '(none)'}
</keywords>

<jd_atoms>
Source atoms from the job description, for context.
${jdChunksBlock(jdChunks) || '(none)'}
</jd_atoms>

<rules>
Return one entry ONLY per keyword that needs a correction. Keywords that are fine get NO entry.
- merge_into: EITHER-OR requirement lists that were wrongly split into separate keywords ("React, Next.js, Angular, or Vue" became react, next js, angular, vue as independent must-haves). Merging fixes it: matching ANY alternative satisfies the requirement. mergeInto = the FIRST alternative as written in the JD; the merged keyword's term and variants become variants of the target.
- strip_variant: a variant that DROPS the term's differentiating token ("ci cd pipelines" as a variant of "gitlab ci cd pipelines" hides the GitLab requirement and would falsely credit the keyword). List the variants to remove.
- reclassify: assign keywordClass when the keyword is not really a skill:
  - "eligibility": location, residency, work authorization, timezone overlap, availability
  - "credential": degree, certification, language proficiency level
  - "seniority": years of experience, seniority level
  - "skill": default; only worth an entry when correcting a wrong prior class
- NEVER invent terms, never drop keywords, never change tiers.
</rules>

Respond with this exact JSON shape:
{ "verdicts": [{ "term": "string", "action": "keep" | "merge_into" | "strip_variant" | "reclassify", "mergeInto": "string", "stripVariants": ["string"], "keywordClass": "skill" | "eligibility" | "credential" | "seniority" }] }`
}

export function parseKeywordVerdictsResponse(raw: string): KeywordVerdict[] {
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean) as {
    verdicts?: Array<{ term?: string; action?: string; mergeInto?: string; stripVariants?: unknown; keywordClass?: string }>
  }
  const verdicts: KeywordVerdict[] = []
  for (const v of parsed.verdicts ?? []) {
    if (typeof v.term !== 'string' || v.term.length === 0) continue
    if (!VALID_ACTIONS.has(v.action as KeywordVerdict['action'])) continue
    verdicts.push({
      term: v.term,
      action: v.action as KeywordVerdict['action'],
      mergeInto: typeof v.mergeInto === 'string' ? v.mergeInto : undefined,
      stripVariants: Array.isArray(v.stripVariants)
        ? v.stripVariants.filter((s): s is string => typeof s === 'string' && s.length > 0)
        : undefined,
      keywordClass: VALID_CLASSES.has(v.keywordClass as KeywordClass) ? (v.keywordClass as KeywordClass) : undefined,
    })
  }
  return verdicts
}

export function applyKeywordVerdicts(keywords: ComposedKeyword[], verdicts: KeywordVerdict[]): ComposedKeyword[] {
  const byTerm = new Map(keywords.map((k) => [norm(k.term), { ...k }]))

  for (const v of verdicts) {
    const kw = byTerm.get(norm(v.term))
    if (!kw) continue

    if (v.keywordClass) kw.keywordClass = v.keywordClass

    if (v.action === 'strip_variant' && v.stripVariants?.length) {
      const strip = new Set(v.stripVariants.map(norm))
      kw.variants = kw.variants.filter((x) => !strip.has(norm(x)))
    }

    if (v.action === 'merge_into' && v.mergeInto) {
      const target = byTerm.get(norm(v.mergeInto))
      if (target && target !== kw) {
        const incoming = [kw.term, ...kw.variants]
          .map(norm)
          .filter((x) => x !== target.term && !target.variants.includes(x))
        target.variants.push(...incoming)
        byTerm.delete(norm(v.term))
      }
    }
  }

  return [...byTerm.values()]
}

// Deterministic OR-group merge: when the extractor emitted an either-or atom
// ("react next js angular or vue"), keywords contained in that atom are
// alternatives of one requirement — merge them into the first (JD order).
// Runs before the LLM classifier, which then handles what atoms could not.
export function mergeOrGroups(keywords: ComposedKeyword[], jdChunks: JdChunkInput[]): ComposedKeyword[] {
  const result = [...keywords]
  for (const chunk of jdChunks) {
    const attr = norm(chunk.attr)
    if (!/\bor\b/.test(attr)) continue

    const members = result
      .filter((k) => attr.includes(k.term))
      .sort((a, b) => attr.indexOf(a.term) - attr.indexOf(b.term))
    if (members.length < 2) continue

    const [head, ...rest] = members
    for (const m of rest) {
      const incoming = [m.term, ...m.variants].filter((x) => x !== head.term && !head.variants.includes(x))
      head.variants.push(...incoming)
      result.splice(result.indexOf(m), 1)
    }
  }
  return result
}

export async function keywordClassifierNode(state: {
  keywords: ComposedKeyword[]
  jdChunks: JdChunkInput[]
}): Promise<{ keywords: ComposedKeyword[] }> {
  const { jdChunks } = state
  const merged = mergeOrGroups(state.keywords, jdChunks)
  if (merged.length === 0) return { keywords: merged }

  const raw = await generate(buildPrompt(merged, jdChunks))

  try {
    return { keywords: applyKeywordVerdicts(merged, parseKeywordVerdictsResponse(raw)) }
  } catch {
    return { keywords: merged } // classifier failure never blocks the pipeline
  }
}
