import type { GraphState, SEOReport, ActionItem, SectionScore } from '../../types'

export function buildActionItems(params: {
  missingKeywords: string[]
  completenessGaps: string[]
  genericPhrases: { phrase: string }[]
  completenessScore: number
  keywordDensityScore: number
  authorityScore: number
}): ActionItem[] {
  const items: ActionItem[] = []

  // High priority
  if (params.missingKeywords.length > 0) {
    items.push({
      action: `Add missing keywords to your profile: ${params.missingKeywords.slice(0, 5).join(', ')}`,
      reason: 'Required keywords absent from profile reduce recruiter search visibility significantly',
      priority: 'high',
    })
  }
  if (params.completenessGaps.some(g => g.toLowerCase().includes('about'))) {
    items.push({
      action: 'Write or expand your About section to at least 200 words',
      reason: 'About section is the highest-weight field for LinkedIn SEO and recruiter conversion',
      priority: 'high',
    })
  }
  if (params.authorityScore < 40) {
    items.push({
      action: 'Add quantitative metrics to your experience bullets (numbers, percentages, timeframes)',
      reason: 'Experience descriptions lack measurable impact, which reduces perceived authority',
      priority: 'high',
    })
  }

  // Medium priority
  if (params.genericPhrases.length > 0) {
    items.push({
      action: `Replace generic phrases: "${params.genericPhrases[0].phrase}"`,
      reason: 'Clichés and generic language reduce credibility and get filtered by recruiters',
      priority: 'medium',
    })
  }
  if (params.completenessGaps.some(g => g.toLowerCase().includes('skill'))) {
    items.push({
      action: 'Add more skills to reach 10+ in your Skills section',
      reason: 'Skills section is a primary recruiter filter — fewer skills means fewer search hits',
      priority: 'medium',
    })
  }
  if (params.keywordDensityScore < 50 && params.missingKeywords.length === 0) {
    items.push({
      action: 'Distribute job-relevant keywords more prominently across headline and about sections',
      reason: 'Keywords present in profile but not in high-weight sections (headline, about)',
      priority: 'medium',
    })
  }

  // Low priority
  for (const gap of params.completenessGaps.filter(g => !g.toLowerCase().includes('about') && !g.toLowerCase().includes('skill'))) {
    items.push({
      action: `Complete missing profile field: ${gap}`,
      reason: 'Profile completeness affects LinkedIn search ranking',
      priority: 'low',
    })
  }

  return items
}

export function reportCompilerNode(
  state: Pick<
    GraphState,
    | 'keywordDensityScore'
    | 'completenessScore'
    | 'roleAlignmentScore'
    | 'authorityScore'
    | 'specificityScore'
    | 'missingKeywords'
    | 'genericPhrases'
    | 'completenessGaps'
    | 'normalizedProfile'
  >
): Pick<GraphState, 'seoBefore'> {
  const {
    keywordDensityScore,
    completenessScore,
    roleAlignmentScore,
    authorityScore,
    specificityScore,
    missingKeywords,
    genericPhrases,
    completenessGaps,
    normalizedProfile,
  } = state

  // Weighted average: keyword 25%, completeness 25%, specificity 20%, role_alignment 15%, authority 15%
  const overall_score = Math.round(
    keywordDensityScore * 0.25 +
    completenessScore * 0.25 +
    specificityScore * 0.20 +
    roleAlignmentScore * 0.15 +
    authorityScore * 0.15
  )

  const sections: Record<string, SectionScore> = {
    headline: {
      label: 'Headline',
      score: normalizedProfile.headline.trim().length > 20 ? 70 : 20,
    },
    about: {
      label: 'About',
      score: Math.min(100, Math.round((normalizedProfile.about.trim().split(/\s+/).filter(Boolean).length / 300) * 100)),
    },
    experience: {
      label: 'Experience',
      score: authorityScore,
    },
    skills: {
      label: 'Skills',
      score: Math.min(100, normalizedProfile.skills.split(',').filter(s => s.trim()).length * 7),
    },
  }

  const action_items = buildActionItems({
    missingKeywords,
    completenessGaps,
    genericPhrases,
    completenessScore,
    keywordDensityScore,
    authorityScore,
  })

  const seoBefore: SEOReport = {
    overall_score,
    keyword_density_score: keywordDensityScore,
    completeness_score: completenessScore,
    specificity_score: specificityScore,
    role_alignment_score: roleAlignmentScore,
    authority_score: authorityScore,
    missing_keywords: missingKeywords,
    generic_phrases: genericPhrases,
    completeness_gaps: completenessGaps,
    action_items,
    sections,
  }

  return { seoBefore }
}
