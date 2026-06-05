import { genAI } from '../../lib/gemini'
import type { MappedCV, KeywordPhrase, RemoveSuggestion, CV } from '../../types'

// Use the stronger model — resume generation needs higher quality output
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

const EXPERIENCE_ALIASES = [
  'professional experience', 'experience', 'experiência profissional',
  'experiencia profissional', 'experiência', 'experiencia',
]

const EDUCATION_ALIASES = [
  'education', 'educação', 'educacao', 'formação', 'formacao', 'formação acadêmica',
]

interface ParsedPosition {
  header: string
  period: string
  context: string
  bullets: string[]
}

function extractRawMarkdownSection(md: string, aliases: string[]): string {
  const parts = md.split(/\n(?=## )/g)
  for (const part of parts) {
    const firstNewline = part.indexOf('\n')
    if (firstNewline === -1) continue
    const heading = part.slice(0, firstNewline).replace(/^##\s*/, '').trim().toLowerCase()
    if (aliases.includes(heading)) return part.slice(firstNewline + 1).trim()
  }
  return ''
}

function parseExperiencePositions(experienceRaw: string): ParsedPosition[] {
  const sections = experienceRaw.split(/\n(?=###\s)/g).filter(s => s.trim())
  return sections.map(section => {
    const lines = section.split('\n')
    const header = lines.find(l => l.startsWith('###')) ?? ''
    const periodLine = lines.find(l => /^\*\*[^*]+\*\*$/.test(l.trim())) ?? ''
    const period = periodLine.replace(/^\*\*|\*\*$/g, '').trim()

    const bullets: string[] = []
    const contextLines: string[] = []
    let inBullets = false

    for (const line of lines) {
      if (line.startsWith('###') || /^\*\*[^*]+\*\*$/.test(line.trim())) continue
      if (/^[-*]\s+/.test(line)) {
        inBullets = true
        bullets.push(line.replace(/^[-*]\s+/, '').trim())
      } else if (!inBullets && line.trim()) {
        contextLines.push(line.trim())
      }
    }

    return { header, period, context: contextLines.join(' '), bullets }
  }).filter(p => p.header)
}

function formatStructuredExperience(positions: ParsedPosition[]): string {
  return positions.map(pos => [
    pos.header,
    `**${pos.period}**`,
    ``,
    `CONTEXT_PARAGRAPH — output this as plain prose text, NOT a bullet (no leading dash):`,
    `"${pos.context}"`,
    ``,
    `SELECTABLE_BULLETS — pick up to 5, rewrite each to integrate ats_keywords; do NOT add bullets not in this list:`,
    ...pos.bullets.map((b, i) => `${i + 1}. ${b}`),
  ].join('\n')).join('\n\n---\n\n')
}

function buildEducationFromRawCV(cv: CV): string {
  if (!cv.education?.length) return ''
  return cv.education.map(edu => {
    const degreeField = [edu.degree, edu.field].filter(Boolean).join(' in ')
    const meta = [edu.institution, edu.location, edu.period].filter(Boolean).join(' | ')
    return `### ${degreeField}\n${meta}`
  }).join('\n\n')
}

function buildExperienceFromRawCV(cv: CV): string {
  if (!cv.experience?.length) return ''
  return cv.experience.map(exp => {
    const header = [exp.role, exp.company, exp.location].filter(Boolean).join(' | ')
    const lines = [`### ${header}`, `**${exp.period ?? ''}**`]
    if (exp.context) lines.push(exp.context)
    for (const h of exp.highlights ?? []) lines.push(`- ${h}`)
    return lines.join('\n')
  }).join('\n\n')
}

function buildPrompt(
  cv: MappedCV,
  cvMarkdown: string | undefined,
  rawCV: CV | undefined,
  jd: string,
  jdKeywords: string[],
  semanticGaps: string[],
  rephraseSuggestions: Array<{ from: string; to: string }>,
  keywordPhrases: KeywordPhrase[],
  removeSuggestions: RemoveSuggestion[],
  locale?: string
): { prompt: string; positions: ParsedPosition[] } {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  let experienceRaw: string
  let educationRaw: string

  if (cvMarkdown) {
    experienceRaw = extractRawMarkdownSection(cvMarkdown, EXPERIENCE_ALIASES)
    educationRaw = extractRawMarkdownSection(cvMarkdown, EDUCATION_ALIASES)
  } else if (rawCV) {
    experienceRaw = buildExperienceFromRawCV(rawCV)
    educationRaw = buildEducationFromRawCV(rawCV)
  } else {
    experienceRaw = cv.sections.experience
    educationRaw = cv.sections.education
  }

  // Parse experience into labeled structure so LLM sees explicit context + numbered bullets
  const positions = parseExperiencePositions(experienceRaw)
  const structuredExperience = formatStructuredExperience(positions)

  // Use the exact header lines from the parsed markdown as the fidelity reference.
  // Newline-separated to avoid the LLM confusing the PERIOD with part of the header.
  const lockedRoles = positions
    .map(pos => `  HEADER: "${pos.header.replace(/^###\s*/, '')}"\n  PERIOD: "${pos.period}"`)
    .join('\n\n')

  const rephraseMap = rephraseSuggestions
    .map(r => `  - Replace "${r.from}" with "${r.to}"`)
    .join('\n')

  const phrasesBlock = keywordPhrases
    .map(kp => `  ${kp.keyword}:\n${kp.phrases.map(p => `    • ${p}`).join('\n')}`)
    .join('\n')

  const removeBlock = removeSuggestions
    .map(r => `  - [${r.section}] ${r.item} — ${r.reason}`)
    .join('\n')

  return { positions, prompt: `<system>
You are a professional resume writer specializing in ATS optimization.
Generate an ATS-optimized resume in Markdown that includes ONLY the experiences and skills relevant to the target role.

Output ONLY the resume in Markdown. No explanation, no preamble, no commentary.
All text MUST be in ${lang}.
</system>

<locked_fidelity_data>
IMMUTABLE — copy these character-for-character. Never rename, abbreviate, reorder, or paraphrase:
${lockedRoles || '(none)'}

Education data in cv_education is also immutable.
</locked_fidelity_data>

<cv_summary>
${cv.sections.summary}
</cv_summary>

<cv_skills>
${cv.sections.skills}
</cv_skills>

<cv_experience>
Each position is labeled with its CONTEXT line and numbered ORIGINAL BULLETS.
You must derive your output entirely from this data — nothing else.

${structuredExperience}
</cv_experience>

<cv_education>
${educationRaw}
</cv_education>

<job_description>
${jd}
</job_description>

<ats_keywords>
${jdKeywords.join(', ')}
</ats_keywords>

<semantic_gaps>
${semanticGaps.map(g => `- ${g}`).join('\n')}
</semantic_gaps>

<rephrase_suggestions>
${rephraseMap || '(none)'}
</rephrase_suggestions>

<keyword_phrases>
${phrasesBlock || '(none)'}
</keyword_phrases>

<items_to_omit>
${removeBlock || '(none)'}
</items_to_omit>

<instructions>
Generate an ATS-optimized resume following these rules exactly:

### OUTPUT STRUCTURE (use this exact Markdown format — blank lines are mandatory)
\`\`\`
## Objective
[Single line: the exact job title as written in job_description — nothing else]

## Summary
[2–3 sentences. Include 3+ keywords from ats_keywords. Tailored to this role.]

## Skills
**Category:** skill1, skill2, skill3

## Experience
### Job Title | Company | Location
**Period**

[Context paragraph: 1–2 sentences derived from the CONTEXT line. Rewrite to integrate ats_keywords — keep all facts. BLANK LINE before and after this paragraph is mandatory.]

- Bullet 1
- Bullet 2
...

## Education
### Degree in Field
Institution | Location | Period
\`\`\`

### RULES (in priority order)

**RULE 1 — OBJECTIVE**: Extract the exact job title from job_description. Output a single plain line. No sentences, no additional words.

**RULE 2 — FIDELITY (NON-NEGOTIABLE)**:
- Each experience header line must be: ### followed by the exact HEADER value from locked_fidelity_data — nothing added, nothing removed.
- The period line must be on its OWN line, formatted as bold text (e.g. **Jun 2025 - Present**). NEVER append the period to the header line.
- Education: copy EXACTLY from cv_education. Zero changes.
- Do NOT normalize dates (keep "Jun 2025 - Present" not "06/2025").

**RULE 3 — EXPERIENCE SELECTION**: Include only positions with direct relevance to this JD (technologies, domain, responsibilities). Be strict — omit roles where the overlap is weak or incidental.

**RULE 4 — CONTEXT PARAGRAPH (MANDATORY)**: Every included position MUST have a context paragraph immediately after **Period**, separated by a blank line, before the bullets. Derive it from the CONTEXT_PARAGRAPH field in cv_experience. Rewrite it to integrate ats_keywords naturally — keep the core facts. Output it as plain prose text — NO leading dash, NO bullet marker. It must be followed by a blank line before the first bullet.

**RULE 5 — BULLETS (STRICT SOURCING)**: Select up to 5 bullets per position. Each output bullet must trace back to one of the ORIGINAL BULLETS in cv_experience (by number). You may rewrite, sharpen, merge, or restructure them to integrate keywords. You may NOT create bullets that have no corresponding original bullet.

**RULE 6 — METRICS**: Keep existing metrics exactly as written. You may NOT invent new numbers or percentages.

**RULE 7 — SKILLS**: Keep only categories and skills relevant to this JD. Reorder so the most JD-relevant category appears first.

**RULE 8 — OMIT**: Remove any item listed in items_to_omit.

**RULE 9 — HONESTY**: Never add skills, experiences, or claims not present in the original CV.
</instructions>` }
}

export async function resumeGeneratorNode(state: {
  input: { jobDescription: string; cvMarkdown?: string; locale?: string }
  mapped?: MappedCV
  jdKeywords?: string[]
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
}): Promise<{ resume: string }> {
  const cv = state.mapped
  if (!cv) throw new Error('resumeGeneratorNode: mapped CV is missing from state')

  const rawCV = state.input.cvMarkdown ? undefined : (Object.keys(cv.raw).length > 0 ? cv.raw : undefined)

  const { prompt, positions } = buildPrompt(
    cv,
    state.input.cvMarkdown,
    rawCV,
    state.input.jobDescription,
    state.jdKeywords ?? [],
    state.semanticGaps ?? [],
    state.rephraseSuggestions ?? [],
    state.keywordPhrases ?? [],
    state.removeSuggestions ?? [],
    state.input.locale
  )

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  const stripped = raw
    .replace(/^```(?:markdown)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()

  // Post-process: ensure every experience entry has a context paragraph.
  // The LLM often skips the prose paragraph and goes straight to bullets.
  // Strategy: for each parsed position, if **Period** is immediately followed
  // by a bullet (no prose in between), inject the original context paragraph.
  let resume = stripped
  for (const pos of positions) {
    if (!pos.context) continue
    // Look for the period line followed immediately by a bullet (no paragraph in between)
    const periodFollowedByBullet = new RegExp(
      `(\\*\\*${pos.period.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*)\\n+(- )`,
      'g'
    )
    resume = resume.replace(periodFollowedByBullet, `$1\n\n${pos.context}\n\n$2`)
  }

  // Ensure blank lines around context paragraph (catches cases where LLM wrote it without spacing)
  resume = resume
    .replace(/(\*\*[A-Za-z][^*\n]+\*\*)\n([^\n*#\-\s])/g, '$1\n\n$2')
    .replace(/([^\n-*#])\n(- )/g, '$1\n\n$2')

  if (!resume || resume.length < 100) {
    throw new Error('resumeGeneratorNode: LLM returned an empty or malformed resume')
  }

  return { resume }
}
