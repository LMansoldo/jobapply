import type { MappedCV, KeywordPhrase, RemoveSuggestion, WeightedKeyword, VerificationReport } from '../../types'
import { buildResumeSource } from '../resume/source'
import { generateResumeDraft } from '../resume/generator'
import { verifyResumeDraft } from '../resume/verifier'
import { renderResume } from '../resume/renderer'

export async function resumeGeneratorNode(state: {
  input: { jobDescription: string; cvMarkdown?: string; locale?: string }
  mapped?: MappedCV
  jdKeywords?: string[]
  weightedKeywords?: WeightedKeyword[]
  jobTitle?: string
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
}): Promise<{ resume: string; resumeVerification: VerificationReport }> {
  const cv = state.mapped
  if (!cv) throw new Error('resumeGeneratorNode: mapped CV is missing from state')

  const rawCV = state.input.cvMarkdown ? undefined : (Object.keys(cv.raw).length > 0 ? cv.raw : undefined)
  const source = buildResumeSource(cv, state.input.cvMarkdown, rawCV)

  const draft = await generateResumeDraft(
    source,
    state.jobTitle ?? '',
    state.weightedKeywords ?? [],
    state.keywordPhrases ?? [],
    state.removeSuggestions ?? [],
    state.rephraseSuggestions ?? [],
    state.input.locale,
  )

  const { draft: verifiedDraft, report } = verifyResumeDraft(
    draft,
    source,
    state.input.jobDescription,
    state.jdKeywords ?? [],
  )

  const resume = renderResume(verifiedDraft, source, state.jobTitle ?? '', state.input.locale)

  if (!resume || resume.length < 100) {
    throw new Error('resumeGeneratorNode: rendered resume is too short')
  }

  return { resume, resumeVerification: report }
}
