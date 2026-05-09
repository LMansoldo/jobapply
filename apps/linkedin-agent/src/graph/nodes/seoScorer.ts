import { genAI } from '../../lib/gemini'
import type { GraphState } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

// ── Pure scoring functions ────────────────────────────────────────────────────

export function calcKeywordDensityScore(
  profile: { headline: string; about: string; experience: string; skills: string },
  keywords: string[]
): { score: number; missingKeywords: string[] } {
  if (keywords.length === 0) return { score: 0, missingKeywords: [] }

  const fields = {
    headline: profile.headline.toLowerCase(),
    about: profile.about.toLowerCase(),
    experience: profile.experience.toLowerCase(),
    skills: profile.skills.toLowerCase(),
  }

  const WEIGHTS = { headline: 3, about: 2, experience: 1, skills: 1 }
  const maxWeight = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)
  let totalScore = 0
  const missing: string[] = []

  for (const kw of keywords) {
    const lower = kw.toLowerCase()
    let kwWeight = 0
    for (const [field, weight] of Object.entries(WEIGHTS)) {
      if (fields[field as keyof typeof fields].includes(lower)) {
        kwWeight = Math.max(kwWeight, weight)
      }
    }
    if (kwWeight === 0) missing.push(kw)
    totalScore += kwWeight / maxWeight
  }

  return {
    score: Math.round((totalScore / keywords.length) * 100),
    missingKeywords: missing,
  }
}

export function calcCompletenessScore(profile: {
  headline: string
  about: string
  experience: string
  skills: string
  education: string
}): { score: number; gaps: string[] } {
  const gaps: string[] = []
  let score = 0

  if (profile.headline.trim().length > 0) {
    score += 25
  } else {
    gaps.push('Headline is empty')
  }

  const wordCount = profile.about.trim().split(/\s+/).filter(Boolean).length
  if (wordCount >= 200) {
    score += 20
  } else {
    gaps.push(`About section has ${wordCount} words (target: 200+)`)
  }

  const experienceBlocks = profile.experience.trim().split(/\n{2,}/).filter(b => b.trim().length > 20)
  if (experienceBlocks.length >= 3) {
    score += 20
  } else {
    gaps.push(`Only ${experienceBlocks.length} experience blocks with text (target: 3+)`)
  }

  const skillCount = profile.skills.split(',').map(s => s.trim()).filter(Boolean).length
  if (skillCount >= 10) {
    score += 20
  } else {
    gaps.push(`Only ${skillCount} skills listed (target: 10+)`)
  }

  if (profile.education.trim().length > 0) {
    score += 15
  } else {
    gaps.push('Education section is empty')
  }

  return { score, gaps }
}

async function calcRoleAlignmentScore(
  profile: { headline: string; experience: string },
  targetRole: string | undefined
): Promise<number> {
  if (!targetRole) return 0

  const prompt = `Rate how well this LinkedIn profile is aligned to the target role on a scale of 0-100.

Target role: ${targetRole}

Headline: ${profile.headline}

Most recent experience (first 500 chars):
${profile.experience.slice(0, 500)}

Consider: does the headline mention relevant skills/domain? Do recent experience descriptions match responsibilities typical for "${targetRole}"?

Respond ONLY with a single integer from 0 to 100. No explanation.`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const score = parseInt(raw, 10)
    return isNaN(score) ? 0 : Math.min(100, Math.max(0, score))
  } catch {
    return 0
  }
}

export async function seoScorerNode(
  state: Pick<GraphState, 'input' | 'normalizedProfile' | 'jdKeywords'>
): Promise<Pick<GraphState, 'keywordDensityScore' | 'completenessScore' | 'roleAlignmentScore' | 'completenessGaps' | 'missingKeywords'>> {
  const { normalizedProfile, jdKeywords, input } = state

  const { score: keywordDensityScore, missingKeywords } = calcKeywordDensityScore(normalizedProfile, jdKeywords)
  const { score: completenessScore, gaps: completenessGaps } = calcCompletenessScore(normalizedProfile)
  const roleAlignmentScore = await calcRoleAlignmentScore(normalizedProfile, input.targetRole)

  return { keywordDensityScore, completenessScore, roleAlignmentScore, completenessGaps, missingKeywords }
}
