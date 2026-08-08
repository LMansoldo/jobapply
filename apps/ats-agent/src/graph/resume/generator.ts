import { genAI } from '../../lib/gemini'
import type { ResumeSource, ResumeDraft, WeightedKeyword, KeywordPhrase, RemoveSuggestion } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

function buildPrompt(
  source: ResumeSource,
  jobTitle: string,
  weightedKeywords: WeightedKeyword[],
  keywordPhrases: KeywordPhrase[],
  removeSuggestions: RemoveSuggestion[],
  rephraseSuggestions: Array<{ from: string; to: string }>,
  locale?: string,
): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  const requiredKw = weightedKeywords.filter((k) => k.weight === 'required').map((k) => k.term)
  const preferredKw = weightedKeywords.filter((k) => k.weight === 'preferred').map((k) => k.term)

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

  return `<system>
You are a professional resume writer. Generate an ATS-optimized resume as structured JSON.
All text MUST be in ${lang}. Output ONLY valid JSON — no markdown, no explanation.
</system>

<target_role>
${jobTitle || 'Not specified'}
</target_role>

<keywords>
Required (integrate ONLY where the source CV provides supporting evidence; if no evidence exists, omit the keyword): ${requiredKw.join(', ')}
Preferred (integrate if relevant and supported by the CV): ${preferredKw.join(', ')}
</keywords>

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
2. BULLETS: Each bullet must reference a sourceIndex from the position's bullet list above. You may rewrite to integrate keywords — keep all facts and numbers. Max 5 bullets per position.
3. METRICS: Never drop or invent numbers. If a bullet has "40%", keep "40%" in the rewrite.
4. SKILLS: Keep only categories relevant to the role. Reorder so most relevant appears first.
5. SUMMARY: 2-3 sentences integrating required keywords that are supported by the CV. Based on the existing summary.
6. CONTEXT: Rewrite the context paragraph to integrate keywords — keep all facts.
7. HONESTY: Never add skills, tools, or claims not present in the original CV. This rule overrides any keyword integration request — if a required keyword has no supporting evidence in the CV, leave it out.
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
  weightedKeywords: WeightedKeyword[],
  keywordPhrases: KeywordPhrase[],
  removeSuggestions: RemoveSuggestion[],
  rephraseSuggestions: Array<{ from: string; to: string }>,
  locale?: string,
): Promise<ResumeDraft> {
  const prompt = buildPrompt(source, jobTitle, weightedKeywords, keywordPhrases, removeSuggestions, rephraseSuggestions, locale)

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