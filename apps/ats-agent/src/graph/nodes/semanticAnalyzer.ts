import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MappedCV, PlatformScore, KeywordPhrase, RemoveSuggestion } from '../../types'
import { parseJobDescription } from '../../platforms/utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

interface SemanticResult {
  semanticGaps: string[]
  rephraseSuggestions: Array<{ from: string; to: string }>
  keywordPhrases: Array<{ keyword: string; phrase: string }>
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
  }))

  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  return `You are an expert technical recruiter and ATS specialist.

You will receive:
1. A CV in structured sections (contact, summary, skills, experience, education)
2. A job description
3. Rule-based ATS scores summary (JSON)

The CV experience is composed of bullet-point highlights per role. Skills are grouped into tech stacks, competencies, and soft skills.

## CV Sections

**Contact:** ${cv.sections.contact}

**Summary:** ${cv.sections.summary}

**Skills:** ${cv.sections.skills}

**Experience:** ${cv.sections.experience}

**Education:** ${cv.sections.education}

**Languages:** ${cv.sections.languages}

## Job Description

${jd}

## Rule-based ATS Scores

${JSON.stringify(scoresSummary, null, 2)}

## Your tasks

### 1. semanticGaps
Identify semantic gaps that rule-based keyword matching cannot detect:
- Skills implied by JD but missing from CV
- Seniority signals mismatches
- Industry/domain context mismatches
- Soft skills mentioned in JD absent in CV
- Brazilian platforms (Gupy, Vagas): check for vague language instead of results with metrics

### 2. rephraseSuggestions
Suggest rephrasing of existing CV phrases to better match JD language.

### 3. keywordPhrases
For each of the top missing keywords/skills from the JD (use missingRequired and missingPreferred from the ATS scores), provide exactly 10 ready-to-use CV bullet point phrases that naturally incorporate the keyword. Each phrase should be a concrete, metrics-oriented achievement sentence that the candidate could adapt and add to their CV.

### 4. removeSuggestions
Identify content in the CV that is irrelevant or counterproductive for this specific role and should be removed or de-emphasized. Include the section name, the specific item (role, skill, bullet point, etc.), and a clear reason why it hurts more than it helps for this JD.

Respond ONLY with a valid JSON object, no markdown, no preamble.
All string values MUST be written in ${lang}.
{
  "semanticGaps": ["gap 1", "gap 2"],
  "rephraseSuggestions": [{ "from": "original phrase", "to": "suggested phrase" }],
  "keywordPhrases": [{ "keyword": "keyword name", "phrase": "ready-to-use CV bullet point" }],
  "removeSuggestions": [{ "section": "section name", "item": "specific item to remove", "reason": "why it hurts this application" }],
  "overallAssessment": "one paragraph"
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
