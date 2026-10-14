import { generate } from '../../lib/glm'
import { parseJobDescription } from '../../lib/jd'
import { chunkId, contentHash, getJdChunks, getJdMeta, saveJdChunks, saveJdMeta } from '../../db/chunks'
import type { ChunkTier, ChunkType, JdChunkInput } from '../../types'

const VALID_TYPES = new Set<ChunkType>(['skill', 'tool', 'domain', 'credential', 'soft', 'req'])
const VALID_TIERS = new Set<ChunkTier>(['must-have', 'important', 'nice-to-have'])

function buildPrompt(jd: string): string {
  return `<system>
You are a requirements indexer. Break the job description below into the smallest independently meaningful requirement atoms. Respond ONLY with valid JSON — no markdown, no explanation.
</system>

<rules>
- Each chunk is ONE concrete requirement as a short noun phrase (max 8 words). No full sentences, no duplicates, no filler.
- Plain enumerations: split ("React, Node or Svelte" as separate technologies → one chunk per item).
- EITHER-OR alternatives (only one needs to hold: "using Jest or Vitest", "REST or GraphQL"): ONE single chunk, attr written as "jest or vitest".
- type:
  - "tool": specific named software, library or platform (React, Kubernetes, Figma)
  - "skill": named ability or practice (unit testing, system design, REST APIs)
  - "domain": industry or subject-matter area (fintech, e-commerce, healthtech)
  - "credential": degree, certification, language proficiency, work authorization
  - "soft": interpersonal or behavioral trait (communication, ownership)
  - "req": hard condition — years of experience, seniority level, availability, location
- tier:
  - "must-have": appears in a required/mandatory section or stated as a hiring condition ("must", "required", years of experience)
  - "important": emphasized or repeated, but not mandatory
  - "nice-to-have": introduced by "plus", "bonus", "diferencial", "ideally", or optional lists
- Skip company pitch, benefits, salary and culture prose.
- jobTitle: copy the job title EXACTLY as written in the job description. NEVER return an empty string.
- Return 15-40 chunks.
</rules>

<job_description>
${jd}
</job_description>

Respond with this exact JSON shape:
{ "jobTitle": "exact job title as written in the job description", "chunks": [{ "type": "skill" | "tool" | "domain" | "credential" | "soft" | "req", "attr": "string", "tier": "must-have" | "important" | "nice-to-have" }] }`
}

export function parseJdChunksResponse(raw: string): { jobTitle: string; chunks: JdChunkInput[] } {
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean) as { jobTitle?: string; chunks?: Array<{ type?: string; attr?: string; tier?: string }> }
  const seen = new Set<string>()
  const chunks: JdChunkInput[] = []
  for (const c of parsed.chunks ?? []) {
    if (typeof c.attr !== 'string' || c.attr.length === 0 || c.attr.length > 80) continue
    if (!VALID_TYPES.has(c.type as ChunkType) || !VALID_TIERS.has(c.tier as ChunkTier)) continue
    const id = chunkId(c.type as ChunkType, c.attr)
    if (seen.has(id)) continue
    seen.add(id)
    chunks.push({ type: c.type as ChunkType, attr: c.attr, tier: c.tier as ChunkTier })
  }
  return { jobTitle: typeof parsed.jobTitle === 'string' ? parsed.jobTitle.slice(0, 80).trim() : '', chunks }
}

// deterministic fallback: the first non-empty JD line is usually the job title
function inferJobTitle(jd: string): string {
  const line = jd.split('\n').find((l) => l.trim().length > 0)
  return line ? line.trim().slice(0, 80) : ''
}

export async function jdExtractorNode(state: {
  input: { jobDescription: string }
}): Promise<{ jdId: string; jdChunks: JdChunkInput[]; jobTitle: string }> {
  const jd = parseJobDescription(state.input.jobDescription)
  const jdId = contentHash('jd', jd)

  const cached = getJdChunks(jdId)
  if (cached.length > 0) {
    return {
      jdId,
      jdChunks: cached.map(({ type, attr, tier }) => ({ type, attr, tier })),
      jobTitle: getJdMeta(jdId)?.jobTitle ?? '',
    }
  }

  const raw = await generate(buildPrompt(jd))
  let jobTitle = ''
  let chunks: JdChunkInput[]
  try {
    const parsed = parseJdChunksResponse(raw)
    chunks = parsed.chunks
    jobTitle = parsed.jobTitle || inferJobTitle(jd)
  } catch {
    return { jdId, jdChunks: [], jobTitle: inferJobTitle(jd) }
  }

  if (chunks.length > 0) {
    saveJdChunks(jdId, chunks)
    if (jobTitle) saveJdMeta(jdId, jobTitle)
  }
  return { jdId, jdChunks: chunks, jobTitle }
}
