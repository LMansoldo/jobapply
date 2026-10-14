import { generate } from '../../lib/glm'
import type { ResumeSource, ResumeDraft, BulletInsight, ComposedKeyword, GapAnalysis } from '../../types'

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

function buildPrompt(
  source: ResumeSource,
  jobTitle: string,
  keywords: ComposedKeyword[],
  gapAnalysis: GapAnalysis,
  locale?: string,
  insights: BulletInsight[] = [],
): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  const byTier = (tier: ComposedKeyword['tier']) => keywords.filter((k) => k.tier === tier).map((k) => k.term)

  const experienceBlock = source.positions.map((pos, i) => [
    `Position ${i} — header: "${pos.header.replace(/^###\s*/, '')}", period: "${pos.period}"`,
    `context: "${pos.context}"`,
    `bullets:`,
    ...pos.bullets.map((b, j) => `  [${j}] ${b}`),
  ].join('\n')).join('\n\n')

  const diagnosisBlock = insights.length > 0
    ? insights.map((i) => {
        const issue = i.issue ? ` — issue: ${i.issue}` : ''
        const suggestion = i.suggestion ? ` — suggestion: ${i.suggestion}` : ''
        return `  Position ${i.positionIndex}, bullet [${i.bulletIndex}]: clarity ${i.clarity}/100, jdRelevance ${i.jdRelevance}/100${issue}${suggestion}`
      }).join('\n')
    : ''

  const rephraseBlock = gapAnalysis.rephraseGaps
    .map((g) => `  The CV says "${g.cvPhrase}" — rewrite it using the JD's exact term "${g.keyword}": ${g.suggestedRewrite}`)
    .join('\n')

  const phrasesBlock = gapAnalysis.keywordPhrases
    .map((kp) => `  ${kp.keyword}:\n${kp.phrases.map((p) => `    • ${p}`).join('\n')}`)
    .join('\n')

  const removeBlock = gapAnalysis.removeSuggestions
    .map((r) => `  - [${r.section}] ${r.item}`)
    .join('\n')

  return `<system>
You are a professional resume writer. Generate a resume as structured JSON that maximizes four things a recruiter sees in a first pass: facts stated clearly (action + concrete result), facts that prove what THIS job demands, readable scannable bullets, and the strongest facts first. All text MUST be in ${lang}. Output ONLY valid JSON — no markdown, no explanation.
</system>

<voice>
Write in a sober, serious, professional tone. Plain and factual. You are describing what a senior engineer actually did — not selling. A recruiter should believe every line because it is specific, not because it is loud.
</voice>

<style_rules>
Hard constraints on every string you produce:
- NO em-dashes or en-dashes ("—", "–"). Use a period or a comma instead.
- NO serial/Oxford comma: write "React, Node and Python", never "React, Node, and Python".
- NO generic impact phrases or AI-smell language: "results-driven", "passionate about", "significantly improved", "high impact", "seamless", "cutting-edge", "leveraged", "spearheaded", "world-class", "state-of-the-art", "responsible for", "worked with". Say the concrete thing instead.
- NO first-person pronouns ("I", "we", "my", "our"). Bullets start with an action verb.
- Every claim of impact carries a specific number or a concrete outcome. If there is no number, describe the result plainly.
- Keep each bullet between 6 and 32 words: long enough to be a fact, short enough to scan.
- Vary sentence length. Do not make every bullet the same shape.
</style_rules>

<target_role>
${jobTitle || 'Not specified'}
</target_role>

<jd_requirements>
The keywords below are the job's core requirements — the adherence signal. Weave each one into a bullet, the summary or an existing skill category wherever the candidate's real experience supports it, using the exact wording. A keyword with no supporting evidence stays out (the honesty rule wins).

Must-have (integrate ONLY where the source CV provides supporting evidence; if no evidence exists, omit): ${byTier('must-have').join(', ') || '(none)'}
Important (integrate where supported): ${byTier('important').join(', ') || '(none)'}
Nice-to-have (integrate only if genuinely present in the CV): ${byTier('nice-to-have').join(', ') || '(none)'}
</jd_requirements>

<bullet_diagnosis>
Per-bullet scores from the analyzer of the source CV. clarity: the bullet states one concrete, self-contained fact. jdRelevance: how much it proves for THIS job. issue/suggestion are faithful to the original facts — use the suggestion as the rewrite seed for weak bullets.
${diagnosisBlock || '(no diagnosis available)'}
</bullet_diagnosis>

<rephrase_map>
Places where the CV expresses a required concept in different words. Fix them:
${rephraseBlock || '(none)'}
</rephrase_map>

<keyword_phrases>
Ready-to-use fragments for requirements with no CV evidence. Use ONLY if a truthful anchor exists in the source CV:
${phrasesBlock || '(none)'}
</keyword_phrases>

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

1. SELECTION: Include the positions whose facts prove this job's demands. A position whose bullets all score low jdRelevance gets include: false.
2. BULLETS: Each bullet must reference a sourceIndex from the position's bullet list above. Rewrite weak bullets (clarity below 60) into ONE concrete fact (action + result), seeding from the diagnosis suggestion when given — keep all facts and numbers. Max 5 bullets per position.
3. ORDER: Within each position, put the strongest facts first — the bullets that best prove must-have requirements lead.
4. METRICS: Never drop or invent numbers. If a bullet has "40%", keep "40%" in the rewrite.
5. SKILLS: Keep only categories relevant to the role. Reorder so most relevant appears first. Never add a skill not present in the source CV.
6. KEYWORD INTEGRATION (HIGH PRIORITY):
   - Weave must-have and important keywords into the summary, experience bullets and EXISTING skill categories — using each keyword's exact wording wherever the candidate's real experience supports it
   - NEVER create a skill category for keywords themselves (e.g. "Targeted Keywords", "Palavras-chave"). This is heavily penalized by ATS parsers.
   BAD (forbidden): { "category": "Targeted Keywords", "items": ["figma", "web3", "5+ years building customer-facing web products"] }
   GOOD: "Figma" appended to the relevant existing category; "5+ years building customer-facing web products" expressed inside a summary sentence or a real experience bullet
7. SUMMARY: 2-3 sentences integrating must-have keywords that are supported by the CV. Based on the existing summary. Sober tone.
8. CONTEXT: Rewrite the context paragraph to sharpen the story and integrate keywords — keep all facts.
9. HONESTY: Never add skills, tools, or claims not present in the original CV. This rule overrides any keyword integration request — if a keyword has no supporting evidence in the CV, leave it out.
10. OMIT: Remove items from items_to_omit.
11. LANGUAGE: Rewrite bullets, context and summary mirroring the jd_requirements vocabulary above. Never copy phrases you were not given as evidence.
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

const KEYWORD_CATEGORY_PATTERN = /keyword|palavra/i

export async function generateResumeDraft(
  source: ResumeSource,
  jobTitle: string,
  keywords: ComposedKeyword[],
  gapAnalysis: GapAnalysis,
  locale?: string,
  insights: BulletInsight[] = [],
): Promise<ResumeDraft> {
  const prompt = buildPrompt(source, jobTitle, keywords, gapAnalysis, locale, insights)

  async function attempt(): Promise<ResumeDraft> {
    const raw = await generate(prompt)
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean) as ResumeDraft
    if (!Array.isArray(parsed.experience) || !Array.isArray(parsed.skills)) throw new Error('Invalid ResumeDraft shape')
    return {
      ...parsed,
      // safety net: a dedicated keyword category is ATS-penalized; drop it
      skills: parsed.skills.filter((g) => !KEYWORD_CATEGORY_PATTERN.test(g.category)),
    }
  }

  try {
    return await attempt()
  } catch {
    return await attempt() // 1 retry on JSON parse error
  }
}
