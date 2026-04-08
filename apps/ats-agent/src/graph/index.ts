import { StateGraph, Annotation } from '@langchain/langgraph'
import type { AgentInput, MappedCV, PlatformScore, ATSReport } from '../types'
import { mapperNode } from './nodes/mapper'
import { ruleScorerNode } from './nodes/ruleScorer'
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
  platformScores: Annotation<PlatformScore[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  semanticGaps: Annotation<string[] | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
  report: Annotation<ATSReport | undefined>({
    reducer: (_, update) => update,
    default: () => undefined,
  }),
})

const graph = new StateGraph(GraphAnnotation)
  .addNode('mapper', mapperNode)
  .addNode('ruleScorer', ruleScorerNode)
  .addNode('semanticAnalyzer', semanticAnalyzerNode)
  .addNode('aggregator', aggregatorNode)
  .addEdge('__start__', 'mapper')
  .addEdge('mapper', 'ruleScorer')
  .addEdge('ruleScorer', 'semanticAnalyzer')
  .addEdge('semanticAnalyzer', 'aggregator')
  .addEdge('aggregator', '__end__')
  .compile()

export { graph }
