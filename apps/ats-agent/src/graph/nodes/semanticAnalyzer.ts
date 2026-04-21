import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MappedCV, PlatformScore, KeywordPhrase, RemoveSuggestion } from '../../types'
import { parseJobDescription } from '../../platforms/utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

interface SemanticResult {
  semanticGaps: string[]
  rephraseSuggestions: Array<{ from: string; to: string }>
  keywordPhrases: Array<{ keyword: string; phrases: string[] }>
  removeSuggestions: Array<{ section: string; item: string; reason: string }>
  overallAssessment: string
}

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

function buildPrompt(cv: MappedCV, jd: string, scores: PlatformScore[], locale?: string): string {
  const scoresSummary = scores.map(s => ({
    platform: s.platform,
    score: s.score,
    missingRequired: s.missingRequired,
    flags: s.flags,
  })) as any

  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  return `<system>
You are a senior ATS specialist and technical recruiter with a strong editorial eye. Respond ONLY with a valid JSON object — no markdown, no explanation, no preamble. All string values MUST be in ${lang}. This is non-negotiable.
</system>

<style_rules>
NEVER use these patterns — they signal AI-generated text and destroy credibility:

Hollow openers:
- "Responsável por", "Atuei em", "Trabalhei com", "Participei de"
- "Responsible for", "Worked with", "Assisted in"
- "Apaixonado por", "Entusiasta de", "Profissional dedicado"
- "Passionate about", "Results-driven", "Dynamic professional"

Banned vocabulary — find specific alternatives every time:
- leverage → use, apply, tap into
- utilize → use
- implement → build, ship, roll out, introduce
- deliver → ship, produce, finish, hand off
- drive → push, run, lead, move
- ensure → make sure, check that
- facilitate → help, run, make possible
- seamless → smooth, clean, without friction
- robust → solid, reliable, battle-tested
- innovative → [delete — describe what was actually new]
- dynamic → [delete — describe what actually changed]
- passionate → [delete — show it through the work described]

Vague metrics:
- "melhorou significativamente", "grande impacto", "aumento expressivo"
- "significantly improved", "high impact", "notable increase" — always attach a number
</style_rules>

<rhythm_rules>
Vary sentence length deliberately and unpredictably:
- Mix short sentences (under 8 words) with longer ones (20-30 words)
- Do not make all bullets the same grammatical structure
  BAD: five bullets all starting with past-tense verb + object + metric
  GOOD: mix structures — one leads with context, one with result, one with the action
- Occasionally start a sentence with "And" or "But" where it reads naturally
- Allow one slightly informal aside per section where it fits
</rhythm_rules>

<human_markers>
Inject subtle markers of human writing without making the text unprofessional:
- One sentence per section slightly more conversational than the rest
- Occasionally lead a bullet with context instead of a power verb
  ("After the fintech migration, built the audit trail that..." instead of "Built audit trail...")
- Use specific, slightly unusual word choices — prefer words from the candidate's original text
- Include one oddly specific detail per role that sounds too precise to be invented
  ("the 11-second load time on the checkout page" not "slow page load times")
</human_markers>

<tone_examples>
BAD bullet:
"Responsável pelo desenvolvimento de componentes reutilizáveis para o design system."

GOOD bullet:
"Construí do zero o design system usado por 4 squads — reduziu inconsistências visuais em 70% e acelerou implementação de features em ~3 semanas."

BAD bullet:
"Atuei na otimização de performance da aplicação, melhorando significativamente o tempo de carregamento."

GOOD bullet:
"Reduzi o LCP de 4.2s para 1.8s via lazy loading e code splitting — impacto direto na taxa de conversão do checkout."

BAD summary:
"Profissional apaixonado por tecnologia com mais de 6 anos de experiência, orientado a resultados."

GOOD summary:
"Seis anos construindo interfaces para produtos fintech onde performance e confiabilidade não são opcionais. Especializado em React, TypeScript e arquitetura de micro-frontends."
</tone_examples>

<cv>
  <contact>${cv.sections.contact}</contact>
  <summary>${cv.sections.summary}</summary>
  <skills>${cv.sections.skills}</skills>
  <experience>${cv.sections.experience}</experience>
  <education>${cv.sections.education}</education>
  <languages>${cv.sections.languages}</languages>
</cv>

<job_description>
${jd}
</job_description>

<ats_scores>
${JSON.stringify(scoresSummary, null, 2)}
</ats_scores>

<edge_context>
${!jd || jd.trim().length < 200 ? "WARNING: JD is vague or incomplete. Infer likely requirements from job title and industry norms. Flag assumptions explicitly." : ""}
${scoresSummary?.missingRequired?.length === 0 ? "NOTE: No required keywords missing per ATS. Focus semantic analysis on seniority signals, domain fit, and soft skills." : ""}
${!cv.sections.experience || cv.sections.experience.trim().length < 100 ? "NOTE: CV experience is sparse. Prioritize suggestions that help candidate build credible bullet points from scratch." : ""}
</edge_context>

<instructions>
Analyze the CV against the JD and ATS scores. Think step by step before producing each field.

### voiceProfile (do this first)
Extract 3 signals of the candidate's authentic writing voice from their existing CV.
Note any characteristic patterns — even imperfect ones — to preserve in all rewrites.
All rewrites must sound like a sharper version of the candidate, not a different person.

### proofreading
Scan the full CV for:
- Spelling errors and typos
- Punctuation inconsistencies (e.g., some bullets end with period, others don't)
- Capitalization issues (e.g., "react" vs "React", "typescript" vs "TypeScript")
- Grammar errors
- Inconsistent date formats (e.g., "Jan 2022" vs "01/2022")
- Inconsistent verb tense (current role present tense, past roles past tense)
Report each issue with original text, the fix, and the section it appears in.

### semanticGaps
Identify gaps that keyword matching cannot detect. Consider:
- Skills implied by JD context but absent from CV
- Seniority mismatch signals (e.g., JD says "lead" but CV shows only IC work)
- Domain/industry context mismatches
- Soft skills present in JD but missing from CV
- For Brazilian platforms (Gupy, Vagas.com.br): flag vague descriptions lacking metrics
Be specific — not "lacks leadership" but "JD requires cross-functional team leadership; CV only shows individual contributor roles with no mention of stakeholder management."

### rephraseSuggestions
Suggest rephrasing of existing CV phrases to better match JD language and tone.
Step 1 — extract 2-3 characteristic phrases from the candidate's original text to anchor the voice.
Step 2 — rewrite applying style_rules, rhythm_rules, and human_markers.
Step 3 — preserve at least one phrase from the original near-verbatim per suggestion.
If CV is sparse, suggest how to expand weak bullets into metric-oriented achievements.
Limit to the 5 highest-impact suggestions.
No two "to" rewrites may share the same grammatical structure.

### keywordPhrases
Using your semantic understanding of the JD, identify the 6–8 most important missing concepts
or skills the CV does not cover. Do NOT rely on the raw ATS keyword lists for this —
those are tokenized word-by-word and miss compound terms and contextual meaning.

Focus on role-specific concepts and compound terms (e.g. "design system ownership",
"cross-browser debugging", "technical standards evangelism", "frontend architecture"),
not single generic words ("consistency", "negotiate", "designers").

Cross-reference against the CV: only include concepts genuinely absent or underdeveloped.

For each concept, provide 3 ready-to-use CV bullet points the candidate can adapt.
Each phrase must: use a concrete verb + specific action + measurable outcome.
Each phrase must feel specific to this role and industry — not reusable boilerplate.
Apply rhythm_rules — vary grammatical structure across the 3 phrases for each keyword.
No two phrases across all keywords may share the same opening structure.

### removeSuggestions
Identify content irrelevant or counterproductive for this specific role.
Include: section name, specific item, concrete reason it hurts this application.

### overallAssessment
One concise paragraph: fit level (strong/moderate/weak), top 2 strengths, top 2 blockers.
Write this as a rough draft the candidate should edit —
leave one obvious gap for them to fill with personal context.

### self_check (internal only — do not include in output)
Before finalizing, verify every rewritten string:
- No word from banned_vocabulary — replace any found
- No 3+ consecutive bullets with identical grammatical structure — break the pattern
- No hollow opener ("Responsável por", "Atuei em", "Passionate about") — rewrite
- At least one short sentence (under 8 words) per block of text
- overallAssessment contains no banned_vocabulary words
Apply fixes silently. Do not include this field in the JSON output.
</instructions>

Respond with this exact JSON shape:
{
  "voiceProfile": {
    "tone": "direct | narrative | technical | conversational",
    "signaturePatterns": ["string"],
    "avoidedPatterns": ["string"]
  },
  "proofreading": [
    {
      "section": "string",
      "original": "string",
      "fix": "string",
      "type": "spelling | punctuation | capitalization | grammar | date_format | verb_tense"
    }
  ],
  "semanticGaps": ["string"],
  "rephraseSuggestions": [{ "from": "string", "to": "string" }],
  "keywordPhrases": [{ "keyword": "string", "phrases": ["string", "string", "string"] }],
  "removeSuggestions": [{ "section": "string", "item": "string", "reason": "string" }],
  "overallAssessment": "string"
}`
}

export async function semanticAnalyzerNode(state: {
  input: { jobDescription: string; locale?: string }
  mapped?: MappedCV
  platformScores?: PlatformScore[]
}): Promise<{
  semanticGaps: string[]
  rephraseSuggestions: Array<{ from: string; to: string }>
  keywordPhrases: KeywordPhrase[]
  removeSuggestions: RemoveSuggestion[]
}> {
  const cv = state.mapped
  if (!cv) throw new Error('semanticAnalyzerNode: mapped CV is missing from state')
  if (!state.platformScores) throw new Error('semanticAnalyzerNode: platformScores missing from state')

  const prompt = buildPrompt(cv, parseJobDescription(state.input.jobDescription), state.platformScores, state.input.locale)

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  let parsed: SemanticResult
  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    parsed = JSON.parse(clean) as SemanticResult
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${raw.slice(0, 200)}`)
  }

  return {
    semanticGaps: parsed.semanticGaps ?? [],
    rephraseSuggestions: parsed.rephraseSuggestions ?? [],
    keywordPhrases: parsed.keywordPhrases ?? [],
    removeSuggestions: parsed.removeSuggestions ?? [],
  }
}
