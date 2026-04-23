import { genAI } from '../../lib/gemini'
import type { MappedCV, KeywordPhrase, RemoveSuggestion } from '../../types'

// Use the stronger model — resume generation needs higher quality output
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' })

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

function buildPrompt(
  cv: MappedCV,
  jd: string,
  jdKeywords: string[],
  semanticGaps: string[],
  rephraseSuggestions: Array<{ from: string; to: string }>,
  keywordPhrases: KeywordPhrase[],
  removeSuggestions: RemoveSuggestion[],
  locale?: string
): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  const rephraseMap = rephraseSuggestions
    .map(r => `  - Replace "${r.from}" with "${r.to}"`)
    .join('\n')

  const phrasesBlock = keywordPhrases
    .map(kp => `  ${kp.keyword}:\n${kp.phrases.map(p => `    • ${p}`).join('\n')}`)
    .join('\n')

  const removeBlock = removeSuggestions
    .map(r => `  - [${r.section}] ${r.item} — ${r.reason}`)
    .join('\n')

  return `<system>
You are a professional resume writer specializing in ATS optimization.
Your task: generate a TIGHT, 1-page resume in Markdown that maximizes ATS scores for the target role.

Output ONLY the resume in Markdown. No explanation, no preamble, no commentary.
All text MUST be in ${lang}.
</system>

<cv_sections>
CONTACT:
${cv.sections.contact}

SUMMARY:
${cv.sections.summary}

SKILLS:
${cv.sections.skills}

EXPERIENCE:
${cv.sections.experience}

EDUCATION:
${cv.sections.education}

LANGUAGES:
${cv.sections.languages}
</cv_sections>

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
Generate a complete, ATS-optimized resume following these rules exactly:

### STRUCTURE (use this exact Markdown format)
\`\`\`
# Full Name
Location · Email · Phone · LinkedIn · GitHub

## Summary
2–3 sentences. Must open with role/seniority. Must include 3+ keywords from ats_keywords.

## Skills
Group by category. Reorder groups so the most JD-relevant appears first.
Include every skill from ats_keywords that the candidate genuinely has.
Use the exact spelling from ats_keywords (e.g. "Svelte" not "SvelteJS").

## Experience
Select the 2–3 most JD-relevant positions only.
For each:
### Job Title | Company | Location
**Period**
Context sentence (optional, max 1 line).
- Bullet 1
- Bullet 2
...

## Education
### Degree – Field
Institution | Location | Period

## Languages (omit if not relevant)
- Language: Level
\`\`\`

### CONTENT RULES
1. KEYWORDS: Every experience bullet must contain at least one term from ats_keywords.
   Integrate them naturally — do NOT keyword-stuff.
2. REPHRASE: Apply every rephrase_suggestion where the original phrase appears in the CV.
3. KEYWORD PHRASES: Weave keyword_phrases into bullets or the summary where they fit
   naturally. Do not copy them verbatim if they sound awkward.
4. OMIT: Remove any item listed in items_to_omit.
5. SEMANTIC GAPS: Address each gap — either add a skill, rewrite a bullet, or add a
   context sentence that shows the candidate covers that area.
6. LENGTH: Target 450–600 words total. If the candidate has many positions, abbreviate
   or omit less relevant ones. Never truncate the most recent role.
7. METRICS: Preserve all specific numbers (%, time saved, team size) from the original CV.
8. CONTACT: Copy name, email, location, LinkedIn, GitHub exactly from the CV — do not invent or modify.
9. HONESTY: Never add skills or experiences not present in the original CV.
</instructions>`
}

export async function resumeGeneratorNode(state: {
  input: { jobDescription: string; locale?: string }
  mapped?: MappedCV
  jdKeywords?: string[]
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
}): Promise<{ resume: string }> {
  const cv = state.mapped
  if (!cv) throw new Error('resumeGeneratorNode: mapped CV is missing from state')

  const prompt = buildPrompt(
    cv,
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

  // Strip any accidental code fence wrapper
  const resume = raw
    .replace(/^```(?:markdown)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()

  if (!resume || resume.length < 100) {
    throw new Error('resumeGeneratorNode: LLM returned an empty or malformed resume')
  }

  return { resume }
}
