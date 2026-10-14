import { generate } from '../../lib/glm'
import { norm } from '../../db/chunks'
import type { ChunkTier, ComposedKeyword, CvChunkInput, JdChunkInput } from '../../types'

const VALID_TIERS = new Set<ChunkTier>(['must-have', 'important', 'nice-to-have'])

const TIER_RANK: Record<ChunkTier, number> = { 'must-have': 0, important: 1, 'nice-to-have': 2 }

function chunkListLabel(chunks: Array<JdChunkInput | CvChunkInput>, withTier: boolean): string {
  return chunks
    .map((c) => {
      const tier = withTier && 'tier' in c ? ` [${c.tier}]` : ''
      return `- (${c.type})${tier} ${c.attr}`
    })
    .join('\n')
}

function buildPrompt(jdChunks: JdChunkInput[], cvChunks: CvChunkInput[]): string {
  return `<system>
You are a keyword composer for an ATS keyword matcher. You group indexed job-description atoms into matchable keywords. Respond ONLY with valid JSON — no markdown, no explanation.
</system>

<inputs>
<jd_atoms>
Atoms extracted from the job description. (type) [tier] attr.
${chunkListLabel(jdChunks, true) || '(none)'}
</jd_atoms>

<cv_atoms>
Atoms extracted from the CV. Context only — they never become keywords themselves.
${chunkListLabel(cvChunks, false) || '(none)'}
</cv_atoms>
</inputs>

<rules>
- Group jd_atoms that refer to the SAME underlying requirement into one keyword. Do not merge related-but-distinct requirements ("react" and "react native" are different keywords).
- EITHER-OR atoms ("jest or vitest", "rest or graphql"): term = the first alternative, the other alternatives become variants — matching ANY of them satisfies the requirement. Do not create one keyword per alternative.
- term: the JD's own canonical surface form, lowercase.
- tier: the strongest tier among the grouped atoms (must-have > important > nice-to-have).
- variants: alternative LITERAL surface forms of the same term, drawn from the JD or CV atoms plus obvious forms — abbreviations ("k8s" for "kubernetes"), spelling/casing variants ("nodejs", "node.js"), common plurals ("apis" for "api"). NEVER conceptual synonyms or related terms ("js" is a variant of "javascript", but "frontend" is NOT a variant of "react"; "cloud" is NOT a variant of "aws").
- Every jd_atom must be covered by exactly one keyword. Cover all of them — do not invent requirements, do not drop any.
- Include the term itself in the matching set implicitly; variants list only the OTHER surface forms.
- Return 5-30 keywords.
</rules>

Respond with this exact JSON shape:
{ "keywords": [{ "term": "string", "tier": "must-have" | "important" | "nice-to-have", "variants": ["string"] }] }`
}

export function parseComposedKeywordsResponse(raw: string): ComposedKeyword[] {
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean) as {
    keywords?: Array<{ term?: string; tier?: string; variants?: unknown }>
  }
  const byTerm = new Map<string, ComposedKeyword>()
  for (const k of parsed.keywords ?? []) {
    if (typeof k.term !== 'string') continue
    const term = norm(k.term)
    if (term.length === 0 || term.length > 80 || !VALID_TIERS.has(k.tier as ChunkTier)) continue
    const variants = Array.isArray(k.variants)
      ? [...new Set(
          k.variants
            .filter((v): v is string => typeof v === 'string' && v.length > 0 && v.length <= 80)
            .map((v) => norm(v))
            .filter((v) => isPlausibleVariant(v, term)),
        )]
      : []
    const existing = byTerm.get(term)
    if (existing) {
      existing.variants.push(...variants.filter((v) => !existing.variants.includes(v)))
    } else {
      byTerm.set(term, { term, tier: k.tier as ChunkTier, variants })
    }
  }
  return [...byTerm.values()]
}

// short tokens that are real words in JD/CV language, never abbreviations
const GENERIC_SHORT = new Set(['web', 'app', 'dev', 'and', 'for', 'the'])

// Deterministic variant guard: a variant is only credited when it is a literal
// surface form of the term — shared token, abbreviation/initialism, concatenation
// or small suffix. Loose conceptual words never pass, so a match is always
// traceable back to the term's own wording.
function isPlausibleVariant(variant: string, term: string): boolean {
  if (variant === term) return false // term matches implicitly; variants list only others
  const tv = term.split(' ')
  const vv = variant.split(' ')
  if (vv.length > tv.length) return false

  // concatenation of all term tokens ("nodejs" for "node js")
  if (vv.length === 1 && variant === tv.join('')) return true

  // shared tokens + short abbreviation tokens ("ci cd" for "continuous integration",
  // "d3" for "data visualization platforms", "api" for "api integration")
  const sharedOrAbbrev = vv.every((v) => (tv.includes(v) && v.length >= 4) || (v.length <= 3 && !GENERIC_SHORT.has(v)))
  if (sharedOrAbbrev) return true

  // single-token term + small suffix ("reactjs" for "react", "apis" for "api")
  const stem = tv[tv.length - 1]
  if (vv.length === 1 && variant.startsWith(stem) && variant.length - stem.length <= 3) return true

  return false
}

export async function keywordComposerNode(state: {
  jdChunks: JdChunkInput[]
  cvChunks: CvChunkInput[]
}): Promise<{ keywords: ComposedKeyword[] }> {
  const { jdChunks, cvChunks } = state
  if (jdChunks.length === 0) return { keywords: [] }

  const raw = await generate(buildPrompt(jdChunks, cvChunks))

  let keywords: ComposedKeyword[]
  try {
    keywords = parseComposedKeywordsResponse(raw)
  } catch {
    // deterministic fallback: one keyword per jd chunk, no variants
    keywords = jdChunks.map((c) => ({ term: norm(c.attr), tier: c.tier, variants: [] }))
  }
  return { keywords }
}
