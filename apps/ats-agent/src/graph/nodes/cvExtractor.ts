import { generate } from '../../lib/glm'
import { chunkId, contentHash, getCvChunks, saveCvChunks } from '../../db/chunks'
import type { ChunkType, CvChunkInput, CvSection, MappedCV } from '../../types'

const VALID_TYPES = new Set<ChunkType>(['skill', 'tool', 'domain', 'credential', 'soft', 'req'])
const VALID_SECTIONS = new Set<CvSection>([
  'summary', 'skills', 'experience', 'education', 'languages', 'projects', 'certifications',
])

export function buildCvText(cv: MappedCV): string {
  return [
    `## Summary\n${cv.sections.summary}`,
    `## Skills\n${cv.sections.skills}`,
    `## Experience\n${cv.sections.experience}`,
    `## Education\n${cv.sections.education}`,
    `## Languages\n${cv.sections.languages}`,
  ].join('\n\n')
}

function buildPrompt(cvText: string): string {
  return `<system>
You are a CV indexer. Break the CV below into the smallest independently meaningful evidence atoms. Respond ONLY with valid JSON — no markdown, no explanation.
</system>

<rules>
- Each chunk is ONE concrete skill, tool, domain, credential, trait or condition the CV provides evidence for, as a short noun phrase (max 8 words).
- Extract BOTH explicit items (listed skills, degrees) and implicit ones demonstrated in experience bullets or the summary (a bullet about "reduced AWS costs" proves the "AWS" tool).
- Use the CV's own wording; do not translate, normalize or invent.
- type:
  - "tool": specific named software, library or platform (React, Kubernetes, Figma)
  - "skill": named ability or practice (unit testing, system design, REST APIs)
  - "domain": industry or subject-matter area (fintech, e-commerce, healthtech)
  - "credential": degree, certification, language proficiency, work authorization
  - "soft": interpersonal or behavioral trait (communication, ownership)
  - "req": hard condition — years of experience, seniority level, availability
- section: the CV section the evidence comes from — "summary" | "skills" | "experience" | "education" | "languages" | "projects" | "certifications"
- Skip contact data (name, email, phone, URLs).
- No duplicates; return 20-60 chunks.
</rules>

<cv>
${cvText}
</cv>

Respond with this exact JSON shape:
{ "chunks": [{ "type": "skill" | "tool" | "domain" | "credential" | "soft" | "req", "attr": "string", "section": "summary" | "skills" | "experience" | "education" | "languages" | "projects" | "certifications" }] }`
}

export function parseCvChunksResponse(raw: string): CvChunkInput[] {
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean) as { chunks?: Array<{ type?: string; attr?: string; section?: string }> }
  const seen = new Set<string>()
  const chunks: CvChunkInput[] = []
  for (const c of parsed.chunks ?? []) {
    if (typeof c.attr !== 'string' || c.attr.length === 0 || c.attr.length > 80) continue
    if (!VALID_TYPES.has(c.type as ChunkType) || !VALID_SECTIONS.has(c.section as CvSection)) continue
    const id = chunkId(c.type as ChunkType, c.attr)
    if (seen.has(id)) continue
    seen.add(id)
    chunks.push({ type: c.type as ChunkType, attr: c.attr, section: c.section as CvSection })
  }
  return chunks
}

export async function cvExtractorNode(state: {
  cvText: string
}): Promise<{ cvId: string; cvChunks: CvChunkInput[] }> {
  const cvId = contentHash('cv', state.cvText)

  const cached = getCvChunks(cvId)
  if (cached.length > 0) {
    return { cvId, cvChunks: cached.map(({ type, attr, section }) => ({ type, attr, section })) }
  }

  const raw = await generate(buildPrompt(state.cvText))
  let chunks: CvChunkInput[]
  try {
    chunks = parseCvChunksResponse(raw)
  } catch {
    return { cvId, cvChunks: [] }
  }

  if (chunks.length > 0) saveCvChunks(cvId, chunks)
  return { cvId, cvChunks: chunks }
}
