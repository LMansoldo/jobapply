import { generate } from '../../lib/glm'
import { norm } from '../../db/chunks'
import type { BulletInsight, ComposedKeyword, MappedCV } from '../../types'

// ── Shared bullet heuristics (also used by scoreComposer's deterministic paths) ──

export const GENERIC_PHRASES = [
  'responsável por', 'auxiliava', 'atuava em', 'trabalhava com', 'participava de',
  'contribuía para', 'ajudava', 'suportava', 'apoiava', 'colaborava',
  'fazia parte', 'desenvolvia atividades', 'executava tarefas',
  'responsible for', 'worked with', 'assisted in',
]

export const METRICS_PATTERN = /\d+\s*(%|R\$|\$|reais|mil|milhão|k\b|x\b|vezes|usuários|users|requests|deploys|horas|dias|ms|s\b)/i

export function isGenericPhrase(text: string): boolean {
  const lower = text.toLowerCase()
  return GENERIC_PHRASES.some((p) => lower.includes(p))
}

export function hasMetric(text: string): boolean {
  return METRICS_PATTERN.test(text)
}

// ── Bullet flattening ─────────────────────────────────────────────────────────

export interface FlatBullet {
  positionIndex: number
  bulletIndex: number
  role: string
  text: string
}

const MAX_PROMPT_BULLETS = 30

export function flattenBullets(mapped: MappedCV): FlatBullet[] {
  const bullets: FlatBullet[] = []
  const positions = mapped.raw.experience ?? []
  positions.forEach((e, positionIndex) => {
    const highlights = e.highlights ?? []
    highlights.forEach((text, bulletIndex) => {
      if (text.trim().length > 0) {
        bullets.push({ positionIndex, bulletIndex, role: e.role ?? '', text: text.trim() })
      }
    })
  })
  return bullets
}

// ── Deterministic fallback ────────────────────────────────────────────────────

function clampScore(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)))
}

// Literal keyword presence in the bullet — proxy for JD relevance when the LLM
// is unavailable. Keywords never credit the score; this only feeds the advisory path.
function keywordHitRatio(text: string, keywords: ComposedKeyword[]): number {
  if (keywords.length === 0) return 0.5
  const textNorm = norm(text)
  let hits = 0
  for (const kw of keywords) {
    const surfaces = [kw.term, ...kw.variants].map(norm)
    if (surfaces.some((s) => s.length > 0 && textNorm.includes(s))) hits++
  }
  return hits / keywords.length
}

export function heuristicInsight(bullet: FlatBullet, keywords: ComposedKeyword[]): BulletInsight {
  let clarity = 100
  if (isGenericPhrase(bullet.text)) clarity -= 45
  if (!hasMetric(bullet.text)) clarity -= 20
  const words = bullet.text.trim().split(/\s+/).length
  if (words < 6) clarity -= 15
  else if (words > 32) clarity -= 15
  if (/\b(i|me|my|we|our)\b/i.test(bullet.text)) clarity -= 10

  return {
    positionIndex: bullet.positionIndex,
    bulletIndex: bullet.bulletIndex,
    role: bullet.role,
    text: bullet.text,
    clarity: clampScore(clarity),
    jdRelevance: clampScore(keywordHitRatio(bullet.text, keywords) * 100),
  }
}

export function heuristicInsights(mapped: MappedCV, keywords: ComposedKeyword[]): BulletInsight[] {
  return flattenBullets(mapped).map((b) => heuristicInsight(b, keywords))
}

// ── LLM advisor ───────────────────────────────────────────────────────────────

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

interface RawBulletScore {
  positionIndex?: unknown
  bulletIndex?: unknown
  clarity?: unknown
  jdRelevance?: unknown
  issue?: unknown
  suggestion?: unknown
}

function buildPrompt(bullets: FlatBullet[], keywords: ComposedKeyword[], jobTitle: string, locale?: string): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  const requirements = keywords
    .filter((k) => k.tier !== 'nice-to-have')
    .map((k) => `- [${k.tier}] ${k.term}`)
    .join('\n')

  const bulletBlock = bullets
    .map((b) => `- [p${b.positionIndex}.b${b.bulletIndex}] (${b.role}) ${b.text}`)
    .join('\n')

  return `<system>
You are a CV bullet advisor. You judge each experience bullet of a CV against a target job. The reader scans a CV in seconds: concrete, self-contained facts catch the eye; vague responsibility claims do not. Respond ONLY with valid JSON — no markdown, no explanation. All advice strings MUST be in ${lang}.
</system>

<inputs>
<target_job>
${jobTitle || '(job title not available)'}
Requirements the job demands, strongest first:
${requirements || '(none extracted)'}
</target_job>

<bullets>
One per line, id = p{positionIndex}.b{bulletIndex}. positionIndex 0 is the most recent role; bulletIndex 0 is the first bullet the eye reads in that role.
${bulletBlock}
</bullets>
</inputs>

<rules>
- For each bullet, exactly one entry with its id and two scores:
  - clarity (0-100): does the bullet state ONE concrete, self-contained fact (action + result) that is understandable without the rest of the CV? 0 = vague responsibility claim or generic filler, 100 = specific achievement with scope or metric, understandable alone.
  - jdRelevance (0-100): how much this fact proves something the target job demands. 0 = irrelevant to this job, 100 = direct proof of a must-have requirement.
- issue: one sober sentence naming what weakens the bullet. Only when clarity < 70 or jdRelevance < 50; otherwise "".
- suggestion: a rewrite of the bullet that fixes the issue while keeping EVERY fact true — never invent numbers, tools or outcomes. Only when issue is non-empty; otherwise "".
- Cover EVERY bullet exactly once. Do not invent bullets, do not drop any.
</rules>

Respond with this exact JSON shape:
{ "bullets": [{ "positionIndex": 0, "bulletIndex": 0, "clarity": 80, "jdRelevance": 60, "issue": "string", "suggestion": "string" }] }`
}

export function parseBulletInsightsResponse(raw: string, bullets: FlatBullet[], keywords: ComposedKeyword[]): BulletInsight[] {
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean) as { bullets?: RawBulletScore[] }

  const byId = new Map<string, RawBulletScore>()
  for (const entry of parsed.bullets ?? []) {
    if (typeof entry.positionIndex !== 'number' || typeof entry.bulletIndex !== 'number') continue
    byId.set(`${entry.positionIndex}.${entry.bulletIndex}`, entry)
  }

  return bullets.map((b) => {
    const key = `${b.positionIndex}.${b.bulletIndex}`
    const entry = byId.get(key)
    const base = heuristicInsight(b, keywords) // role/text/ids come from source of truth
    if (!entry) return base

    const clarity = typeof entry.clarity === 'number' ? clampScore(entry.clarity) : base.clarity
    const jdRelevance = typeof entry.jdRelevance === 'number' ? clampScore(entry.jdRelevance) : base.jdRelevance
    const issue = typeof entry.issue === 'string' && entry.issue.trim().length > 0 ? entry.issue.trim().slice(0, 300) : undefined
    const suggestion = typeof entry.suggestion === 'string' && entry.suggestion.trim().length > 0 ? entry.suggestion.trim().slice(0, 300) : undefined
    return { ...base, clarity, jdRelevance, ...(issue && { issue }), ...(suggestion && { suggestion }) }
  })
}

export async function bulletAdvisorNode(state: {
  mapped: MappedCV
  keywords: ComposedKeyword[]
  jobTitle?: string
  locale?: string
}): Promise<{ bulletInsights: BulletInsight[] }> {
  const { mapped, keywords, jobTitle, locale } = state
  const bullets = flattenBullets(mapped)

  if (bullets.length === 0) return { bulletInsights: [] }

  const promptBullets = bullets.slice(0, MAX_PROMPT_BULLETS)

  try {
    const raw = await generate(buildPrompt(promptBullets, keywords, jobTitle ?? '', locale))
    const insights = parseBulletInsightsResponse(raw, promptBullets, keywords)
    // bullets beyond the prompt cap are scored deterministically so the score covers the whole CV
    const scored = new Set(insights.map((i) => `${i.positionIndex}.${i.bulletIndex}`))
    const tail = bullets
      .filter((b) => !scored.has(`${b.positionIndex}.${b.bulletIndex}`))
      .map((b) => heuristicInsight(b, keywords))
    return { bulletInsights: [...insights, ...tail] }
  } catch {
    return { bulletInsights: heuristicInsights(mapped, keywords) }
  }
}
