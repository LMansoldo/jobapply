import { StateGraph, Annotation } from '@langchain/langgraph'
import type {
  AgentInput, MappedCV, ATSReport, KeywordPhrase, RemoveSuggestion, CV,
  WeightedKeyword, ScoreBreakdown, ResumeDraft, VerificationReport,
} from '../types'
import { mapperNode } from './nodes/mapper'
import { jdKeywordExtractorNode } from './nodes/jdKeywordExtractor'
import { universalScorerNode } from './nodes/universalScorer'
import { semanticAnalyzerNode } from './nodes/semanticAnalyzer'
import { aggregatorNode } from './nodes/aggregator'

const GraphAnnotation = Annotation.Root({
  input: Annotation<AgentInput>({
    reducer: (_, update) => update,
    default: () => ({ cv: {}, jobDescription: '' }),
  }),
  mapped: Annotation<MappedCV | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  jdKeywords: Annotation<string[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  weightedKeywords: Annotation<WeightedKeyword[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  jobTitle: Annotation<string | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  scoreBreakdown: Annotation<ScoreBreakdown | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  matchedKeywords: Annotation<string[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  missingKeywords: Annotation<string[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  semanticGaps: Annotation<string[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  rephraseSuggestions: Annotation<Array<{ from: string; to: string }> | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  keywordPhrases: Annotation<KeywordPhrase[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  removeSuggestions: Annotation<RemoveSuggestion[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  report: Annotation<ATSReport | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  adaptedCV: Annotation<CV | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  resume: Annotation<string | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  resumeDraft: Annotation<ResumeDraft | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  resumeVerification: Annotation<VerificationReport | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
})

const graph = new StateGraph(GraphAnnotation)
  .addNode('mapper', mapperNode)
  .addNode('jdKeywordExtractor', jdKeywordExtractorNode)
  .addNode('universalScorer', (state) => universalScorerNode({
    mapped: state.mapped!,
    weightedKeywords: state.weightedKeywords ?? [],
  }))
  .addNode('semanticAnalyzer', semanticAnalyzerNode)
  .addNode('aggregator', aggregatorNode)
  .addEdge('__start__', 'mapper')
  .addEdge('mapper', 'jdKeywordExtractor')
  .addEdge('jdKeywordExtractor', 'universalScorer')
  .addEdge('universalScorer', 'semanticAnalyzer')
  .addEdge('semanticAnalyzer', 'aggregator')
  .addEdge('aggregator', '__end__')
  .compile()

export { graph }
