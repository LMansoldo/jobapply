import type { GraphState, LinkedInProfile } from '../../types'
import { calcKeywordDensityScore, calcCompletenessScore } from './seoScorer'
import { buildActionItems } from './reportCompiler'

function buildGeneratedProfile(state: Pick<GraphState, 'generation' | 'normalizedProfile'>): LinkedInProfile {
  const { generation, normalizedProfile } = state
  return {
    headline: generation.headlineAnalysis.alternatives[0] ?? normalizedProfile.headline,
    about: generation.aboutAudit.rewrite ?? normalizedProfile.about,
    // Build a merged experience: start with original, then append all rewrites
    // This ensures no roles are dropped when only partial rewrites exist
    experience: (() => {
      const experienceRewrites = generation.experienceGaps.map(g => g.rewrite).join('\n\n')
      return experienceRewrites.length > 0
        ? `${normalizedProfile.experience}\n\n${experienceRewrites}`
        : normalizedProfile.experience
    })(),
    skills: [
      ...normalizedProfile.skills.split(',').map(s => s.trim()),
      ...generation.keywordGaps.technical.slice(0, 5),
    ].join(', '),
    education: normalizedProfile.education,
    certifications: normalizedProfile.certifications,
  }
}

export function deltaCalculatorNode(
  state: Pick<GraphState, 'generation' | 'normalizedProfile' | 'jdKeywords' | 'seoBefore' | 'input' | 'keywordDensityScore' | 'completenessScore' | 'roleAlignmentScore' | 'authorityScore' | 'specificityScore'>
): Pick<GraphState, 'seoAfter' | 'delta'> {
  const generatedProfile = buildGeneratedProfile(state)

  const { score: keywordDensityScore, missingKeywords } = calcKeywordDensityScore(generatedProfile, state.jdKeywords)
  const { score: completenessScore, gaps: completenessGaps } = calcCompletenessScore(generatedProfile)

  // Carry forward LLM-based scores with conservative improvements
  const roleAlignmentScore = state.seoBefore.role_alignment_score
  const authorityScore = Math.min(100, state.seoBefore.authority_score + 10)
  const specificityScore = Math.min(100, state.seoBefore.specificity_score + 15)

  const overall_score = Math.round(
    keywordDensityScore * 0.25 +
    completenessScore * 0.25 +
    specificityScore * 0.20 +
    roleAlignmentScore * 0.15 +
    authorityScore * 0.15
  )

  const seoAfter = {
    overall_score,
    keyword_density_score: keywordDensityScore,
    completeness_score: completenessScore,
    specificity_score: specificityScore,
    role_alignment_score: roleAlignmentScore,
    authority_score: authorityScore,
    missing_keywords: missingKeywords,
    generic_phrases: [],
    completeness_gaps: completenessGaps,
    action_items: buildActionItems({
      missingKeywords,
      completenessGaps,
      genericPhrases: [],
      completenessScore,
      keywordDensityScore,
      authorityScore,
    }),
    sections: state.seoBefore.sections,
  }

  return { seoAfter, delta: overall_score - state.seoBefore.overall_score }
}
