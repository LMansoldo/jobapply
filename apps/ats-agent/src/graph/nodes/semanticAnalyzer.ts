import { genAI } from '../../lib/gemini'
import type { MappedCV, KeywordPhrase, RemoveSuggestion, ScoreBreakdown } from '../../types'
import { parseJobDescription } from '../../lib/jd'

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

function buildPrompt(cv: MappedCV, jd: string, scoreBreakdown: ScoreBreakdown, missingKeywords: string[], locale?: string): string {
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
- Occasionally start a sentence with "And" or "But" where it reads naturally
- Allow one slightly informal aside per section where it fits
</rhythm_rules>

<human_markers>
Inject subtle markers of human writing without making the text unprofessional:
- One sentence per section slightly more conversational than the rest
- Occasionally lead a bullet with context instead of a power verb
- Use specific, slightly unusual word choices — prefer words from the candidate's original text
- Include one oddly specific detail per role that sounds too precise to be invented
</human_markers>

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

<ats_analysis>
keywordCoverage: ${scoreBreakdown.keywordCoverage}
contentQuality: ${scoreBreakdown.contentQuality}
format: ${scoreBreakdown.format}
missingKeywords: ${missingKeywords.slice(0, 20).join(', ')}
</ats_analysis>

<edge_context>
${!jd || jd.trim().length < 200 ? "WARNING: JD is vague or incomplete. Infer likely requirements from job title and industry norms. Flag assumptions explicitly." : ""}
${missingKeywords.length === 0 ? "NOTE: No required keywords missing. Focus semantic analysis on seniority signals, domain fit, and soft skills." : ""}
${!cv.sections.experience || cv.sections.experience.trim().length < 100 ? "NOTE: CV experience is sparse. Prioritize suggestions that help candidate build credible bullet points from scratch." : ""}
</edge_context>

<instructions>
Analyze the CV against the JD and ATS analysis. Think step by step before producing each field.

### voiceProfile (do this first)
Extract 3 signals of the candidate's authentic writing voice from their existing CV.

### proofreading
Scan the full CV for: spelling errors, punctuation inconsistencies, capitalization issues, grammar errors, inconsistent date formats, inconsistent verb tense.

### semanticGaps
Identify gaps that keyword matching cannot detect. Consider: skills implied by JD context but absent from CV, seniority mismatch signals, domain/industry context mismatches, soft skills in JD missing from CV, vague descriptions lacking metrics.
Be specific — not "lacks leadership" but "JD requires cross-functional team leadership; CV only shows IC roles."

### rephraseSuggestions
Suggest rephrasing of existing CV phrases. Limit to 5 highest-impact suggestions.

### keywordPhrases
Identify 6–8 most important missing concepts. For each, 3 ready-to-use CV bullet points.

### removeSuggestions
Identify content irrelevant or counterproductive for this specific role.

### overallAssessment
One concise paragraph: fit level (strong/moderate/weak), top 2 strengths, top 2 blockers.

### self_check (internal only — do not include in output)
Before finalizing, verify every rewritten string. Apply fixes silently.
</instructions>

Respond with this exact JSON shape:
{
  "voiceProfile": { "tone": "direct | narrative | technical | conversational", "signaturePatterns": ["string"], "avoidedPatterns": ["string"] },
  "proofreading": [{ "section": "string", "original": "string", "fix": "string", "type": "spelling | punctuation | capitalization | grammar | date_format | verb_tense" }],
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
  scoreBreakdown?: ScoreBreakdown
  missingKeywords?: string[]
}): Promise<{
  semanticGaps: string[]
  rephraseSuggestions: Array<{ from: string; to: string }>
  keywordPhrases: KeywordPhrase[]
  removeSuggestions: RemoveSuggestion[]
}> {
  const cv = state.mapped
  if (!cv) throw new Error('semanticAnalyzerNode: mapped CV is missing from state')

  const breakdown = state.scoreBreakdown ?? { keywordCoverage: 0, contentQuality: 0, format: 0 }
  const prompt = buildPrompt(cv, parseJobDescription(state.input.jobDescription), breakdown, state.missingKeywords ?? [], state.input.locale)

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
