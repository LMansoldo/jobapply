import { generate } from '../../lib/glm'
import type { AiSmellFix, MappedCV, ResumeDraft } from '../../types'
import { flattenBullets } from './bulletAdvisor'
import { rewriteFidelityViolation } from '../resume/verifier'

// ── Deterministic detector — regras do prompt de base, verbose o bastante para dicas ──

const INTENSIFIERS = /\b(revolutionary|crucial|game-changing|transformative)\b/gi
const BANNED = /\b(delve|tapestry|landscape|leverag\w*|robust|seamless|unlock\w*|foster\w*|elevat\w*)\b/gi
const NOT_JUST_BUT = /\bnot just\b[^.!?]*\bbut\b|\bit'?s not\b[^.!?]*\bit'?s\b/i
const PREAMBLE = /\bin today'?s\b|\bin conclusion\b|\bin an era of\b/i
const META_SENTENCE = /\bit'?s important to note\b|\bit is worth noting\b|\bnote that\b/i
const TRIAD = /,\s+[^,]+,\s+(and|e)\s+/i
const EM_DASH = /[—–]/
const LEADING_BOLD = /^\*\*[^*]+\*\*/
const RHETORICAL_QUESTION = /\?/

export function detectAiSmell(text: string): string[] {
  const issues: string[] = []
  if (EM_DASH.test(text)) issues.push('em-dash')
  if (TRIAD.test(text)) issues.push('triad')
  const intensifiers = text.match(INTENSIFIERS) ?? []
  for (const w of new Set(intensifiers.map((w) => w.toLowerCase()))) issues.push(`intensifier:${w}`)
  if (NOT_JUST_BUT.test(text)) issues.push('not-just-but')
  if (PREAMBLE.test(text)) issues.push('preamble')
  if (RHETORICAL_QUESTION.test(text)) issues.push('rhetorical-question')
  const banned = text.match(BANNED) ?? []
  for (const w of new Set(banned.map((w) => w.toLowerCase()))) issues.push(`banned:${w}`)
  if (LEADING_BOLD.test(text)) issues.push('leading-bold')
  if (META_SENTENCE.test(text)) issues.push('meta-sentence')
  return issues
}

// ── Units ─────────────────────────────────────────────────────────────────────

const MAX_UNITS = 40

interface SmellUnit {
  id: string
  text: string
  location: string
}

function unitsOfCv(mapped: MappedCV): SmellUnit[] {
  const units: SmellUnit[] = []
  const summary = mapped.sections.summary?.trim()
  if (summary) units.push({ id: 'u:summary', text: summary, location: 'summary' })
  for (const b of flattenBullets(mapped)) {
    units.push({ id: `u:p${b.positionIndex}.b${b.bulletIndex}`, text: b.text, location: `p${b.positionIndex}.b${b.bulletIndex}` })
  }
  return units.slice(0, MAX_UNITS)
}

function unitsOfDraft(draft: ResumeDraft): SmellUnit[] {
  const units: SmellUnit[] = []
  if (draft.summary.trim()) units.push({ id: 'u:summary', text: draft.summary.trim(), location: 'summary' })
  for (const entry of draft.experience) {
    if (entry.context.trim()) {
      units.push({ id: `u:c${entry.positionIndex}`, text: entry.context.trim(), location: `c${entry.positionIndex}` })
    }
    entry.bullets.forEach((b, bi) => {
      if (b.text.trim()) units.push({ id: `u:b${entry.positionIndex}.${bi}`, text: b.text.trim(), location: `b${entry.positionIndex}.${bi}` })
    })
  }
  return units.slice(0, MAX_UNITS)
}

// ── LLM rewrite (prompt de base) ──────────────────────────────────────────────

const BASE_RULES = `1. Max 1 em-dash per 500 words
2. No grouping of exactly 3 parallel items
3. Delete unsupported intensifiers (revolutionary, crucial, game-changing, transformative)
4. Ban "not just X, but Y" / "it's not X, it's Y"
5. No generic preamble or conclusion ("in today's world", "in conclusion")
6. No rhetorical questions to the reader
7. Banned words: delve, tapestry, landscape, leverage, robust, seamless, unlock, foster, elevate
8. Vary sentence length (alternate short ones under 8 words with long ones)
9. Bullets only for real lists, no standardized leading bold term
10. Delete meta-sentences ("it's important to note") and excess hedging
11. Never use em-dashes at all`

function buildPrompt(units: SmellUnit[]): string {
  const unitBlock = units.map((u) => `[${u.id}] ${u.text}`).join('\n')
  return `<system>
You rewrite text to remove AI writing patterns. Keep every fact, number and the original meaning; add nothing new; keep the original language. Respond ONLY with valid JSON — no markdown, no explanation.
</system>

<rules>
${BASE_RULES}
</rules>

Rewrite the text below removing AI writing patterns. Keep all facts, numbers, and the original meaning. Add no new information. Return only the rewritten texts.

<units>
${unitBlock}
</units>

Respond with this exact JSON shape:
{ "rewrites": [{ "id": "${units[0]?.id ?? 'u:0'}", "text": "string" }] }`
}

export function parseAiSmellRewrites(raw: string, units: SmellUnit[]): Map<string, string> {
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean) as { rewrites?: Array<{ id?: unknown; text?: unknown }> }
  const byId = new Map<string, string>()
  const validIds = new Set(units.map((u) => u.id))
  for (const r of parsed.rewrites ?? []) {
    if (typeof r.id !== 'string' || typeof r.text !== 'string') continue
    if (!validIds.has(r.id)) continue
    const text = r.text.trim().slice(0, 600)
    if (text.length > 0) byId.set(r.id, text)
  }
  return byId
}

// ── Nodes ─────────────────────────────────────────────────────────────────────

function toFixes(units: SmellUnit[], rewrites: Map<string, string> | null): AiSmellFix[] {
  const fixes: AiSmellFix[] = []
  for (const u of units) {
    const issues = detectAiSmell(u.text)
    if (issues.length === 0) continue
    let rewrite = ''
    if (rewrites) {
      const candidate = rewrites.get(u.id)
      // fidelidade: nada de métrica perdida/inventada nem rewrite irreconhecível
      if (candidate && rewriteFidelityViolation(u.text, candidate) === null) rewrite = candidate
    }
    fixes.push({ location: u.location, original: u.text, rewrite, issues })
  }
  return fixes
}

export async function aiSmellValidatorNode(state: {
  mapped: MappedCV
}): Promise<{ aiSmellFixes: AiSmellFix[] }> {
  const units = unitsOfCv(state.mapped)
  const smelling = units.filter((u) => detectAiSmell(u.text).length > 0)
  if (smelling.length === 0) return { aiSmellFixes: [] }

  try {
    const raw = await generate(buildPrompt(smelling))
    const rewrites = parseAiSmellRewrites(raw, smelling)
    return { aiSmellFixes: toFixes(smelling, rewrites) }
  } catch {
    // best-effort: falha do LLM mantém a detecção (rewrite vazio), nunca bloqueia
    return { aiSmellFixes: toFixes(smelling, null) }
  }
}

// Fluxo /generate-resume: limpa o draft pós-verificação. O chamador re-verifica.
export async function rewriteDraftAiSmell(draft: ResumeDraft): Promise<ResumeDraft> {
  const units = unitsOfDraft(draft)
  const smelling = units.filter((u) => detectAiSmell(u.text).length > 0)
  if (smelling.length === 0) return draft

  let rewrites: Map<string, string>
  try {
    const raw = await generate(buildPrompt(smelling))
    rewrites = parseAiSmellRewrites(raw, smelling)
  } catch {
    return draft
  }

  const textOf = (id: string, fallback: string): string => rewrites.get(id) ?? fallback
  return {
    ...draft,
    summary: textOf('u:summary', draft.summary),
    experience: draft.experience.map((entry) => ({
      ...entry,
      context: textOf(`u:c${entry.positionIndex}`, entry.context),
      bullets: entry.bullets.map((b, bi) => ({
        ...b,
        text: textOf(`u:b${entry.positionIndex}.${bi}`, b.text),
      })),
    })),
  }
}
