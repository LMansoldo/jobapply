import { genAI } from '../../lib/gemini'
import type { GraphState } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

export async function authorityScorerNode(
  state: Pick<GraphState, 'normalizedProfile' | 'input'>
): Promise<Pick<GraphState, 'authorityScore'>> {
  const { experience } = state.normalizedProfile

  if (!experience.trim()) return { authorityScore: 0 }

  const prompt = `Analyze this LinkedIn experience section. Rate the overall credibility and authority signals on a scale of 0-100.

Score higher for:
- Quantitative metrics with context ("reduced churn from 18% to 9% in 14 months")
- Specific impact vs generic responsibility ("led migration that cut build time by 70%" vs "responsible for migrations")
- Clear career progression (increasing seniority)
- Named technologies, methodologies, company context

Score lower for:
- No metrics or numbers at all
- Generic responsibility language ("responsible for", "worked on")
- Flat career trajectory with no progression
- Vague impact claims

Experience section:
${experience.slice(0, 2000)}

Respond ONLY with a single integer from 0 to 100.`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const score = parseInt(raw, 10)
    return { authorityScore: isNaN(score) ? 0 : Math.min(100, Math.max(0, score)) }
  } catch {
    return { authorityScore: 0 }
  }
}
