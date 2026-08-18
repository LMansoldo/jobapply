import { StateGraph, Annotation } from '@langchain/langgraph'
import type {
  AgentInput, MappedCV, ATSReport, KeywordPhrase, RemoveSuggestion,
  JDRequirement, JDIntentSignal, RequirementMatch, RecruiterReview, ScoreBreakdown,
} from '../types'
import { mapperNode } from './nodes/mapper'
import { requirementExtractorNode } from './nodes/requirementExtractor'
import { literalScorerNode } from './nodes/literalScorer'
import { semanticMatcherNode } from './nodes/semanticMatcher'
import { recruiterReviewerNode } from './nodes/recruiterReviewer'
import { scoreComposerNode } from './nodes/scoreComposer'
import { semanticAnalyzerNode } from './nodes/semanticAnalyzer'
import { aggregatorNode } from './nodes/aggregator'

const last = <T>(_: T, update: T): T => update

const GraphAnnotation = Annotation.Root({
  input: Annotation<AgentInput>({ reducer: last, default: () => ({ cv: {}, jobDescription: '' }) }),
  mapped: Annotation<MappedCV | undefined>({ reducer: last, default: () => undefined }),
  requirements: Annotation<JDRequirement[] | undefined>({ reducer: last, default: () => undefined }),
  intentSignals: Annotation<JDIntentSignal[] | undefined>({ reducer: last, default: () => undefined }),
  jobTitle: Annotation<string | undefined>({ reducer: last, default: () => undefined }),
  literalCoverage: Annotation<number | undefined>({ reducer: last, default: () => undefined }),
  matched: Annotation<RequirementMatch[] | undefined>({ reducer: last, default: () => undefined }),
  unmatched: Annotation<JDRequirement[] | undefined>({ reducer: last, default: () => undefined }),
  semanticMatches: Annotation<RequirementMatch[] | undefined>({ reducer: last, default: () => undefined }),
  recruiterReview: Annotation<RecruiterReview | undefined>({ reducer: last, default: () => undefined }),
  universalScore: Annotation<number | undefined>({ reducer: last, default: () => undefined }),
  scoreBreakdown: Annotation<ScoreBreakdown | undefined>({ reducer: last, default: () => undefined }),
  requirementMatches: Annotation<RequirementMatch[] | undefined>({ reducer: last, default: () => undefined }),
  matchedKeywords: Annotation<string[] | undefined>({ reducer: last, default: () => undefined }),
  missingKeywords: Annotation<string[] | undefined>({ reducer: last, default: () => undefined }),
  semanticGaps: Annotation<string[] | undefined>({ reducer: last, default: () => undefined }),
  rephraseSuggestions: Annotation<Array<{ from: string; to: string }> | undefined>({ reducer: last, default: () => undefined }),
  keywordPhrases: Annotation<KeywordPhrase[] | undefined>({ reducer: last, default: () => undefined }),
  removeSuggestions: Annotation<RemoveSuggestion[] | undefined>({ reducer: last, default: () => undefined }),
  report: Annotation<ATSReport | undefined>({ reducer: last, default: () => undefined }),
})

const graph = new StateGraph(GraphAnnotation)
  .addNode('mapper', mapperNode)
  .addNode('requirementExtractor', requirementExtractorNode)
  .addNode('literalScorer', (s) => literalScorerNode({ mapped: s.mapped!, requirements: s.requirements ?? [] }))
  .addNode('semanticMatcher', (s) => semanticMatcherNode({ mapped: s.mapped!, unmatched: s.unmatched ?? [] }))
  .addNode('recruiterReviewer', (s) => recruiterReviewerNode({
    mapped: s.mapped!,
    jobDescription: s.input.jobDescription,
    intentSignals: s.intentSignals,
    locale: s.input.locale,
  }))
  .addNode('scoreComposer', (s) => scoreComposerNode({
    mapped: s.mapped!,
    requirements: s.requirements ?? [],
    matched: s.matched ?? [],
    semanticMatches: s.semanticMatches ?? [],
    literalCoverage: s.literalCoverage ?? 0,
    recruiterReview: s.recruiterReview!,
  }))
  // semanticAnalyzer only supplies optimalTemplate suggestions here; drop its semanticGaps
  // so scoreComposer's gaps (missing must-haves + recruiter notes) survive.
  .addNode('semanticAnalyzer', async (s) => {
    const r = await semanticAnalyzerNode({
      input: s.input,
      mapped: s.mapped!,
      scoreBreakdown: s.scoreBreakdown,
      missingKeywords: s.missingKeywords,
    })
    return {
      rephraseSuggestions: r.rephraseSuggestions,
      keywordPhrases: r.keywordPhrases,
      removeSuggestions: r.removeSuggestions,
    }
  })
  .addNode('aggregator', aggregatorNode)
  .addEdge('__start__', 'mapper')
  .addEdge('mapper', 'requirementExtractor')
  .addEdge('requirementExtractor', 'literalScorer')
  .addEdge('literalScorer', 'semanticMatcher')
  .addEdge('semanticMatcher', 'recruiterReviewer')
  .addEdge('recruiterReviewer', 'scoreComposer')
  .addEdge('scoreComposer', 'semanticAnalyzer')
  .addEdge('semanticAnalyzer', 'aggregator')
  .addEdge('aggregator', '__end__')
  .compile()

export { graph }
