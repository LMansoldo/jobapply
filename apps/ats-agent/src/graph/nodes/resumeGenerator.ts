import type {
  MappedCV, KeywordPhrase, RemoveSuggestion, JDRequirement, JDIntentSignal,
  RecruiterReview, VerificationReport,
} from '../../types'
import { buildResumeSource } from '../resume/source'
import { generateResumeDraft } from '../resume/generator'
import { verifyResumeDraft } from '../resume/verifier'
import { renderResume } from '../resume/renderer'
import { sanitizeStyle } from '../resume/styleSanitizer'
import { mapFromMarkdown } from './mapper'
import { literalScorerNode } from './literalScorer'
import { semanticMatcherNode } from './semanticMatcher'
import { recruiterReviewerNode } from './recruiterReviewer'
import { scoreComposerNode } from './scoreComposer'

// Re-score a generated resume markdown end-to-end (literal + semantic + recruiter).
async function scoreResumeMarkdown(
  markdown: string,
  requirements: JDRequirement[],
  jobDescription: string,
  intentSignals: JDIntentSignal[],
  locale?: string,
): Promise<number> {
  const mapped = mapFromMarkdown(markdown)
  const { literalCoverage, matched, unmatched } = literalScorerNode({ mapped, requirements })
  const { semanticMatches } = await semanticMatcherNode({ mapped, unmatched })
  const { recruiterReview } = await recruiterReviewerNode({ mapped, jobDescription, intentSignals, locale })
  const { universalScore } = scoreComposerNode({ mapped, requirements, matched, semanticMatches, literalCoverage, recruiterReview })
  return universalScore
}

export async function resumeGeneratorNode(state: {
  input: { jobDescription: string; cvMarkdown?: string; locale?: string }
  mapped?: MappedCV
  requirements?: JDRequirement[]
  intentSignals?: JDIntentSignal[]
  jobTitle?: string
  scoreBefore?: number
  recruiterReview?: RecruiterReview
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
}): Promise<{ resume: string; resumeVerification: VerificationReport; scoreBefore: number; scoreAfter: number }> {
  const cv = state.mapped
  if (!cv) throw new Error('resumeGeneratorNode: mapped CV is missing from state')

  const requirements = state.requirements ?? []
  const intentSignals = state.intentSignals ?? []
  const recruiterNotes = state.recruiterReview?.notes ?? []
  // verifier's jd-contamination guard treats these terms as allowed keywords
  const jdKeywords = requirements.flatMap((r) => [r.term, ...r.aliases])

  const rawCV = state.input.cvMarkdown ? undefined : (Object.keys(cv.raw).length > 0 ? cv.raw : undefined)
  const source = buildResumeSource(cv, state.input.cvMarkdown, rawCV)

  async function generateOnce(): Promise<{ resume: string; report: VerificationReport }> {
    const draft = await generateResumeDraft(
      source,
      state.jobTitle ?? '',
      requirements,
      state.keywordPhrases ?? [],
      state.removeSuggestions ?? [],
      state.rephraseSuggestions ?? [],
      recruiterNotes,
      state.input.locale,
    )
    const { draft: verifiedDraft, report } = verifyResumeDraft(draft, source, state.input.jobDescription, jdKeywords)
    const rendered = renderResume(verifiedDraft, source, state.jobTitle ?? '', state.input.locale)
    const resume = sanitizeStyle(rendered).text
    if (!resume || resume.length < 100) throw new Error('resumeGeneratorNode: rendered resume is too short')
    return { resume, report }
  }

  const scoreBefore = state.scoreBefore ?? 0

  // First attempt
  let best = await generateOnce()
  let bestScore = await scoreResumeMarkdown(best.resume, requirements, state.input.jobDescription, intentSignals, state.input.locale)

  // Close the loop: if the rewrite didn't beat the original, try once more and keep the better one.
  if (bestScore < scoreBefore) {
    const second = await generateOnce()
    const secondScore = await scoreResumeMarkdown(second.resume, requirements, state.input.jobDescription, intentSignals, state.input.locale)
    if (secondScore > bestScore) {
      best = second
      bestScore = secondScore
    }
  }

  return { resume: best.resume, resumeVerification: best.report, scoreBefore, scoreAfter: bestScore }
}
