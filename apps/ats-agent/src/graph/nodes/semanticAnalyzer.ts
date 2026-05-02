import type { PlatformScore, KeywordPhrase, RemoveSuggestion } from '../../types'
import { analyzeExperienceNode } from './analyzeExperience'
import { analyzeEducationNode } from './analyzeEducation'
import { analyzeSkillsNode } from './analyzeSkills'
import { analyzeFormatNode } from './analyzeFormat'

export async function semanticAnalyzerNode(state: {
  input: { jobDescription: string; locale?: string }
  mapped?: { sections: Record<string, string> }
  jdKeywords?: string[]
  platformScores?: PlatformScore[]
}): Promise<{
  semanticGaps: string[]
  rephraseSuggestions: Array<{ from: string; to: string }>
  keywordPhrases: KeywordPhrase[]
  removeSuggestions: RemoveSuggestion[]
}> {
  // Run all 4 section analyses in parallel
  const [experience, education, skills, format] = await Promise.all([
    analyzeExperienceNode(state),
    analyzeEducationNode(state),
    analyzeSkillsNode(state),
    analyzeFormatNode(state),
  ])

  // Aggregate keywordsMissing across all sections into semanticGaps
  const semanticGaps: string[] = [
    ...new Set([
      ...experience.analysisExperience.keywordsMissing,
      ...education.analysisEducation.keywordsMissing,
      ...skills.analysisSkills.keywordsMissing,
      ...format.analysisFormat.keywordsMissing,
    ]),
  ]

  // Aggregate phrasesToAlter into rephraseSuggestions (map original→from, suggestion→to)
  const rephraseSuggestions: Array<{ from: string; to: string }> = [
    ...experience.analysisExperience.phrasesToAlter,
    ...education.analysisEducation.phrasesToAlter,
    ...skills.analysisSkills.phrasesToAlter,
    ...format.analysisFormat.phrasesToAlter,
  ].map(p => ({ from: p.original, to: p.suggestion }))

  // Group suggestedPhrases by section to build keywordPhrases
  const sectionLabels: Record<string, string> = {
    analysisExperience: 'experience',
    analysisEducation: 'education',
    analysisSkills: 'skills',
    analysisFormat: 'format / ats readability',
  }
  const keywordPhrases: KeywordPhrase[] = [
    { keyword: sectionLabels.analysisExperience, phrases: experience.analysisExperience.suggestedPhrases },
    { keyword: sectionLabels.analysisEducation, phrases: education.analysisEducation.suggestedPhrases },
    { keyword: sectionLabels.analysisSkills, phrases: skills.analysisSkills.suggestedPhrases },
    { keyword: sectionLabels.analysisFormat, phrases: format.analysisFormat.suggestedPhrases },
  ].filter(kp => kp.phrases.length > 0)

  // Aggregate phrasesToRemove into removeSuggestions
  const removeSuggestions: RemoveSuggestion[] = [
    ...experience.analysisExperience.phrasesToRemove.map(text => ({
      section: 'experience',
      item: text,
      reason: 'identified as irrelevant or counterproductive for this role',
    })),
    ...education.analysisEducation.phrasesToRemove.map(text => ({
      section: 'education',
      item: text,
      reason: 'identified as irrelevant or counterproductive for this role',
    })),
    ...skills.analysisSkills.phrasesToRemove.map(text => ({
      section: 'skills',
      item: text,
      reason: 'identified as irrelevant or counterproductive for this role',
    })),
    ...format.analysisFormat.phrasesToRemove.map(text => ({
      section: 'format',
      item: text,
      reason: 'identified as harmful to ATS readability',
    })),
  ]

  return {
    semanticGaps,
    rephraseSuggestions,
    keywordPhrases,
    removeSuggestions,
  }
}
