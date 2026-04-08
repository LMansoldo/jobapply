import Anthropic from '@anthropic-ai/sdk'
import type { MappedCV, PlatformScore } from '../../types'

const client = new Anthropic()

interface SemanticResult {
  semanticGaps: string[]
  rephraseSuggestions: Array<{ from: string; to: string }>
  overallAssessment: string
}

function buildPrompt(cv: MappedCV, jd: string, scores: PlatformScore[]): string {
  const scoresSummary = scores.map(s => ({
    platform: s.platform,
    score: s.score,
    missingRequired: s.missingRequired,
    flags: s.flags,
  }))

  return `You are an expert technical recruiter and ATS specialist.

You will receive:
1. A CV in structured sections (contact, summary, skills, expertise, experience, education)
2. A job description
3. Rule-based ATS scores summary (JSON)

The CV experience is composed of bullet-point highlights per role. Skills are grouped into tech stacks, competencies, and soft skills.

Your task: identify semantic gaps that rule-based keyword matching cannot detect.

Focus on:
- Skills implied by JD but missing from CV (e.g., JD implies team leadership but CV never mentions it)
- Seniority signals: does the CV experience level match the JD seniority?
- Industry/domain context mismatches
- Soft skills mentioned in JD that are absent in CV
- Highlights in experience that should be reworded to match JD language
- Brazilian platforms (Gupy, Vagas): also check if experience highlights use vague language instead of results with metrics

## CV Sections

**Contact:** ${cv.sections.contact}

**Objective:** ${cv.sections.objective}

**Summary:** ${cv.sections.summary}

**Skills:** ${cv.sections.skills}

**Expertise:** ${cv.sections.expertise}

**Experience:** ${cv.sections.experience}

**Education:** ${cv.sections.education}

**Languages:** ${cv.sections.languages}

## Job Description

${jd}

## Rule-based ATS Scores

${JSON.stringify(scoresSummary, null, 2)}

Respond ONLY with a valid JSON object, no markdown, no preamble:
{
  "semanticGaps": ["gap 1", "gap 2"],
  "rephraseSuggestions": [{ "from": "original phrase", "to": "suggested phrase" }],
  "overallAssessment": "one paragraph"
}`
}

export async function semanticAnalyzerNode(state: {
  input: { jobDescription: string }
  mapped?: MappedCV
  platformScores?: PlatformScore[]
}): Promise<{ semanticGaps: string[] }> {
  const cv = state.mapped
  if (!cv) throw new Error('semanticAnalyzerNode: mapped CV is missing from state')
  if (!state.platformScores) throw new Error('semanticAnalyzerNode: platformScores missing from state')

  const prompt = buildPrompt(cv, state.input.jobDescription, state.platformScores)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0]
  if (raw.type !== 'text') throw new Error('Unexpected response type from Claude')

  let parsed: SemanticResult
  try {
    parsed = JSON.parse(raw.text) as SemanticResult
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${raw.text.slice(0, 200)}`)
  }

  return { semanticGaps: parsed.semanticGaps ?? [] }
}
