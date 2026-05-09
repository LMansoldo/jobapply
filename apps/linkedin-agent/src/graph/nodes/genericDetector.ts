import { genAI } from '../../lib/gemini'
import type { GraphState, GenericPhrase } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

const CLICHE_REGEX = new RegExp(
  [
    'apaixonado por', 'passionate about', 'results[- ]driven', 'dynamic professional',
    'profissional dedicado', 'foco em resultados', 'visão estratégica', 'trabalho em equipe',
    'comunicação eficaz', 'responsável por', 'responsible for', 'team player',
    'pensamento inovador', 'profissional com sólida experiência', 'leverage', 'utilize',
    'synergy', 'proativo', 'proactive', 'hands[- ]on', 'innovative', 'passionate',
  ].join('|'),
  'gi'
)

export function detectRegexClichés(text: string): string[] {
  const matches = text.match(CLICHE_REGEX)
  return matches ? [...new Set(matches.map(m => m.toLowerCase()))] : []
}

export function calcSpecificityScore(genericsCount: number): number {
  return Math.max(0, 100 - genericsCount * 10)
}

async function detectSemanticGenerics(
  profile: { headline: string; about: string },
  context: { targetRole?: string; anchorEvidence?: { metric: string; timeframe: string; action: string } }
): Promise<GenericPhrase[]> {
  const text = `Headline: ${profile.headline}\n\nAbout:\n${profile.about}`.slice(0, 2000)

  const contextStr = context.anchorEvidence
    ? `Candidate context — evidence: "${context.anchorEvidence.metric} in ${context.anchorEvidence.timeframe} via ${context.anchorEvidence.action}", target role: "${context.targetRole ?? 'not provided'}"`
    : `Target role: "${context.targetRole ?? 'not provided'}"`

  const prompt = `Identify phrases in this LinkedIn text that are generic and could belong to any professional in the field.

${contextStr}

LinkedIn text:
${text}

For each generic phrase found, provide a specific rewrite using the candidate context above.

Respond ONLY with valid JSON array (max 5 items):
[{"phrase": "string", "reason": "string", "suggestion": "string"}]

If no generics found, respond with: []`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p): p is GenericPhrase =>
        typeof p.phrase === 'string' && typeof p.reason === 'string' && typeof p.suggestion === 'string'
    )
  } catch {
    return []
  }
}

export async function genericDetectorNode(
  state: Pick<GraphState, 'normalizedProfile' | 'input'>
): Promise<Pick<GraphState, 'genericPhrases' | 'specificityScore'>> {
  const { normalizedProfile, input } = state

  const fullText = [normalizedProfile.headline, normalizedProfile.about, normalizedProfile.experience].join('\n')
  const regexClichés = detectRegexClichés(fullText)

  const semanticGenerics = await detectSemanticGenerics(normalizedProfile, {
    targetRole: input.targetRole,
    anchorEvidence: input.anchorEvidence,
  })

  const allPhrases: GenericPhrase[] = [
    ...regexClichés.map(phrase => ({
      phrase,
      reason: 'Common cliché — signals AI-generated or generic text',
      suggestion: 'Replace with a specific achievement, skill, or context from your actual experience',
    })),
    ...semanticGenerics,
  ]

  const specificityScore = calcSpecificityScore(allPhrases.length)

  return { genericPhrases: allPhrases, specificityScore }
}
