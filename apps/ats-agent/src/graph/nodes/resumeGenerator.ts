import type { BulletInsight, ComposedKeyword, GapAnalysis, MappedCV, ResumeDraft, VerificationReport } from '../../types'
import { buildResumeSource } from '../resume/source'
import { generateResumeDraft } from '../resume/generator'
import { verifyResumeDraft } from '../resume/verifier'
import { renderResume } from '../resume/renderer'
import { sanitizeStyle } from '../resume/styleSanitizer'
import { mapFromMarkdown } from './mapper'
import { booleanMatcherNode } from './booleanMatcher'
import { scoreComposerNode, bulletStrength } from './scoreComposer'
import { heuristicInsight } from './bulletAdvisor'
import { rewriteDraftAiSmell } from './aiSmellValidator'

// Re-score a generated resume deterministically: literal keyword matchmaking only.
function scoreResumeMarkdown(markdown: string, keywords: ComposedKeyword[]): number {
  const mapped = mapFromMarkdown(markdown)
  const { keywordMatches } = booleanMatcherNode({ mapped, keywords })
  const { universalScore } = scoreComposerNode({ mapped, keywords, keywordMatches })
  return universalScore
}

// Strongest facts where the eyes land first: order each position's bullets by the
// same heuristic strength the scorer uses — deterministic, no LLM, no fabrication.
export function applyProminenceOrder(draft: ResumeDraft, keywords: ComposedKeyword[]): ResumeDraft {
  return {
    ...draft,
    experience: draft.experience.map((entry) => {
      const ranked = entry.bullets.map((b, i) => ({
        bullet: b,
        strength: bulletStrength(heuristicInsight({ positionIndex: entry.positionIndex, bulletIndex: b.sourceIndex, role: '', text: b.text }, keywords)),
        order: i,
      }))
      ranked.sort((a, b) => b.strength - a.strength || a.order - b.order)
      return { ...entry, bullets: ranked.map((r) => r.bullet) }
    }),
  }
}

export async function resumeGeneratorNode(state: {
  input: { cvMarkdown?: string; locale?: string }
  mapped: MappedCV
  jobTitle?: string
  keywords: ComposedKeyword[]
  gapAnalysis: GapAnalysis
  scoreBefore: number
  bulletInsights?: BulletInsight[]
}): Promise<{ resume: string; resumeVerification: VerificationReport; scoreBefore: number; scoreAfter: number }> {
  const cv = state.mapped
  const keywords = state.keywords
  if (!cv || keywords.length === 0) throw new Error('resumeGeneratorNode: mapped CV and keywords are required')

  const rawCV = state.input.cvMarkdown ? undefined : (Object.keys(cv.raw).length > 0 ? cv.raw : undefined)
  const source = buildResumeSource(cv, state.input.cvMarkdown, rawCV)

  async function generateOnce(): Promise<{ resume: string; report: VerificationReport }> {
    const draft = await generateResumeDraft(source, state.jobTitle ?? '', keywords, state.gapAnalysis, state.input.locale, state.bulletInsights)
    const { draft: verifiedDraft, report } = verifyResumeDraft(draft, source)
    // AI smell out — gated by the deterministic detector; re-verify keeps facts intact
    const cleaned = await rewriteDraftAiSmell(verifiedDraft)
    const { draft: verifiedClean } = verifyResumeDraft(cleaned, source)
    const ordered = applyProminenceOrder(verifiedClean, keywords)
    const rendered = renderResume(ordered, source, state.jobTitle ?? '', state.input.locale)
    const resume = sanitizeStyle(rendered).text
    if (!resume || resume.length < 100) throw new Error('resumeGeneratorNode: rendered resume is too short')
    return { resume, report }
  }

  const scoreBefore = state.scoreBefore

  // First attempt
  let best = await generateOnce()
  let bestScore = scoreResumeMarkdown(best.resume, keywords)

  // Close the loop: if the rewrite didn't beat the original, try once more and keep the better one.
  if (bestScore < scoreBefore) {
    const second = await generateOnce()
    const secondScore = scoreResumeMarkdown(second.resume, keywords)
    if (secondScore > bestScore) {
      best = second
      bestScore = secondScore
    }
  }

  return { resume: best.resume, resumeVerification: best.report, scoreBefore, scoreAfter: bestScore }
}
