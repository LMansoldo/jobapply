import { StateGraph, Annotation } from '@langchain/langgraph'
import type { AgentInput, MappedCV, PlatformScore, ATSReport, KeywordPhrase, RemoveSuggestion, CV } from '../types'
import { mapperNode } from './nodes/mapper'
import { jdKeywordExtractorNode } from './nodes/jdKeywordExtractor'
import { ruleScorerNode } from './nodes/ruleScorer'
import { semanticAnalyzerNode } from './nodes/semanticAnalyzer'
import { cvGeneratorNode } from './nodes/cvGenerator'
import { aggregatorNode } from './nodes/aggregator'
import { resumeGeneratorNode } from './nodes/resumeGenerator'

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
  platformScores: Annotation<PlatformScore[] | undefined>({
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
})

const graph = new StateGraph(GraphAnnotation)
  .addNode('mapper', mapperNode)
  .addNode('jdKeywordExtractor', jdKeywordExtractorNode)
  .addNode('ruleScorer', ruleScorerNode)
  .addNode('semanticAnalyzer', semanticAnalyzerNode)
  .addNode('cvGenerator', cvGeneratorNode)
  .addNode('aggregator', aggregatorNode)
  .addEdge('__start__', 'mapper')
  .addEdge('mapper', 'jdKeywordExtractor')
  .addEdge('jdKeywordExtractor', 'ruleScorer')
  .addEdge('ruleScorer', 'semanticAnalyzer')
  .addEdge('semanticAnalyzer', 'cvGenerator')
  .addEdge('cvGenerator', 'aggregator')
  .addEdge('aggregator', '__end__')
  .compile()

export { graph }
