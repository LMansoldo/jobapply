import { genAI } from '../../lib/gemini'
import type { ResumeSource, ResumeDraft, JDRequirement, KeywordPhrase, RemoveSuggestion } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

function buildPrompt(
  source: ResumeSource,
  jobTitle: string,
  requirements: JDRequirement[],
  keywordPhrases: KeywordPhrase[],
  removeSuggestions: RemoveSuggestion[],
  rephraseSuggestions: Array<{ from: string; to: string }>,
  recruiterNotes: string[],
  locale?: string,
): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  const mustKw = requirements.filter((r) => r.tier === 'must-have').map((r) => r.term)
  const importantKw = requirements.filter((r) => r.tier === 'important').map((r) => r.term)
  const niceKw = requirements.filter((r) => r.tier === 'nice-to-have').map((r) => r.term)

  const experienceBlock = source.positions.map((pos, i) => [
    `Position ${i} — header: "${pos.header.replace(/^###\s*/, '')}", period: "${pos.period}"`,
    `context: "${pos.context}"`,
    `bullets:`,
    ...pos.bullets.map((b, j) => `  [${j}] ${b}`),
  ].join('\n')).join('\n\n')

  const phrasesBlock = keywordPhrases
    .map((kp) => `  ${kp.keyword}:\n${kp.phrases.map((p) => `    • ${p}`).join('\n')}`)
    .join('\n')

  const removeBlock = removeSuggestions
    .map((r) => `  - [${r.section}] ${r.item}`)
    .join('\n')

  const rephraseBlock = rephraseSuggestions
    .map((r) => `  Replace "${r.from}" → "${r.to}"`)
    .join('\n')

  const recruiterBlock = recruiterNotes.length ? recruiterNotes.map((n) => `  - ${n}`).join('\n') : '  (none)'

  return `<system>
You are a professional resume writer. Generate an ATS-optimized resume as structured JSON.
All text MUST be in ${lang}. Output ONLY valid JSON — no markdown, no explanation.
</system>

<voice>
Write in a sober, serious, professional tone. Plain and factual. You are describing what a senior engineer actually did — not selling. A recruiter should believe every line because it is specific, not because it is loud.
</voice>

<style_rules>
Hard constraints on every string you produce:
- NO em-dashes or en-dashes ("—", "–"). Use a period or a comma instead.
- NO serial/Oxford comma: write "React, Node and Python", never "React, Node, and Python".
- NO generic impact phrases or AI-smell language: "results-driven", "passionate about", "significantly improved", "high impact", "seamless", "cutting-edge", "leveraged", "spearheaded", "world-class", "state-of-the-art", "responsible for", "worked with". Say the concrete thing instead.
- Every claim of impact carries a specific number or a concrete outcome. If there is no number, describe the result plainly.
- Vary sentence length. Do not make every bullet the same shape.
</style_rules>

<target_role>
${jobTitle || 'Not specified'}
</target_role>

<keywords>
Must-have (integrate ONLY where the source CV provides supporting evidence; if no evidence exists, omit): ${mustKw.join(', ') || '(none)'}
Important (integrate where supported): ${importantKw.join(', ') || '(none)'}
Nice-to-have (integrate only if genuinely present in the CV): ${niceKw.join(', ') || '(none)'}
</keywords>

<recruiter_notes>
A senior recruiter reviewed the source CV and flagged these. Use them to strengthen storytelling — turn task statements into outcomes, surface ownership and scope — WITHOUT inventing facts:
${recruiterBlock}
</recruiter_notes>

<keyword_phrases>
${phrasesBlock || '(none)'}
</keyword_phrases>

<rephrase_suggestions>
${rephraseBlock || '(none)'}
</rephrase_suggestions>

<items_to_omit>
${removeBlock || '(none)'}
</items_to_omit>

<cv_experience>
${experienceBlock}
</cv_experience>

<cv_summary>
${source.summaryRaw}
</cv_summary>

<cv_skills>
${source.skillsRaw}
</cv_skills>

<instructions>
Generate the JSON output following these rules:

1. SELECTION: Include only positions with direct relevance to the target role. Set include: false for irrelevant positions.
2. BULLETS: Each bullet must reference a sourceIndex from the position's bullet list above. You may rewrite to integrate keywords and sharpen the story — keep all facts and numbers. Max 5 bullets per position.
3. METRICS: Never drop or invent numbers. If a bullet has "40%", keep "40%" in the rewrite.
4. SKILLS: Keep only categories relevant to the role. Reorder so most relevant appears first. Never add a skill not present in the source CV.
5. SUMMARY: 2-3 sentences integrating must-have keywords that are supported by the CV. Based on the existing summary. Sober tone.
6. CONTEXT: Rewrite the context paragraph to sharpen the story and integrate keywords — keep all facts.
7. HONESTY: Never add skills, tools, or claims not present in the original CV. This rule overrides any keyword integration request — if a keyword has no supporting evidence in the CV, leave it out.
8. OMIT: Remove items from items_to_omit.
</instructions>

Output this exact JSON shape:
{
  "summary": "string",
  "skills": [{ "category": "string", "items": ["string"] }],
  "experience": [{
    "positionIndex": 0,
    "include": true,
    "context": "string",
    "bullets": [{ "sourceIndex": 0, "text": "string" }]
  }]
}`
}

export async function generateResumeDraft(
  source: ResumeSource,
  jobTitle: string,
  requirements: JDRequirement[],
  keywordPhrases: KeywordPhrase[],
  removeSuggestions: RemoveSuggestion[],
  rephraseSuggestions: Array<{ from: string; to: string }>,
  recruiterNotes: string[],
  locale?: string,
): Promise<ResumeDraft> {
  const prompt = buildPrompt(source, jobTitle, requirements, keywordPhrases, removeSuggestions, rephraseSuggestions, recruiterNotes, locale)

  async function attempt(): Promise<ResumeDraft> {
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean) as ResumeDraft
    if (!Array.isArray(parsed.experience) || !Array.isArray(parsed.skills)) throw new Error('Invalid ResumeDraft shape')
    return parsed
  }

  try {
    return await attempt()
  } catch {
    return await attempt() // 1 retry on JSON parse error
  }
}
