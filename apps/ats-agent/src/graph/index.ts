import { StateGraph, Annotation } from '@langchain/langgraph'
import type {
  AgentInput, ATSReport, AiSmellFix, BulletInsight, ComposedKeyword, CvChunkInput, GapAnalysis, JdChunkInput, KeywordMatch, MappedCV, ScoreBreakdown,
} from '../types'
import { mapperNode } from './nodes/mapper'
import { jdExtractorNode } from './nodes/jdExtractor'
import { cvExtractorNode, buildCvText } from './nodes/cvExtractor'
import { keywordComposerNode } from './nodes/keywordComposer'
import { keywordClassifierNode } from './nodes/keywordClassifier'
import { booleanMatcherNode } from './nodes/booleanMatcher'
import { bulletAdvisorNode } from './nodes/bulletAdvisor'
import { aiSmellValidatorNode } from './nodes/aiSmellValidator'
import { scoreComposerNode } from './nodes/scoreComposer'
import { gapAdvisorNode } from './nodes/gapAdvisor'
import { aggregatorNode } from './nodes/aggregator'

const last = <T>(_: T, update: T): T => update

const GraphAnnotation = Annotation.Root({
  input: Annotation<AgentInput>({ reducer: last, default: () => ({ cv: {}, jobDescription: '' }) }),
  mapped: Annotation<MappedCV | undefined>({ reducer: last, default: () => undefined }),
  jdId: Annotation<string | undefined>({ reducer: last, default: () => undefined }),
  jdChunks: Annotation<JdChunkInput[] | undefined>({ reducer: last, default: () => undefined }),
  jobTitle: Annotation<string | undefined>({ reducer: last, default: () => undefined }),
  cvId: Annotation<string | undefined>({ reducer: last, default: () => undefined }),
  cvChunks: Annotation<CvChunkInput[] | undefined>({ reducer: last, default: () => undefined }),
  keywords: Annotation<ComposedKeyword[] | undefined>({ reducer: last, default: () => undefined }),
  keywordMatches: Annotation<KeywordMatch[] | undefined>({ reducer: last, default: () => undefined }),
  bulletInsights: Annotation<BulletInsight[] | undefined>({ reducer: last, default: () => undefined }),
  aiSmellFixes: Annotation<AiSmellFix[] | undefined>({ reducer: last, default: () => undefined }),
  gapAnalysis: Annotation<GapAnalysis | undefined>({ reducer: last, default: () => undefined }),
  universalScore: Annotation<number | undefined>({ reducer: last, default: () => undefined }),
  scoreBreakdown: Annotation<ScoreBreakdown | undefined>({ reducer: last, default: () => undefined }),
  matchedKeywords: Annotation<string[] | undefined>({ reducer: last, default: () => undefined }),
  missingKeywords: Annotation<string[] | undefined>({ reducer: last, default: () => undefined }),
  report: Annotation<ATSReport | undefined>({ reducer: last, default: () => undefined }),
})

function missingOf(keywords: ComposedKeyword[], matches: KeywordMatch[]): ComposedKeyword[] {
  const matchedTerms = new Set(matches.filter((m) => m.matched).map((m) => m.term))
  return keywords.filter((k) => !matchedTerms.has(k.term))
}

const graph = new StateGraph(GraphAnnotation)
  .addNode('mapper', mapperNode)
  .addNode('jdExtractor', (s) => jdExtractorNode({ input: s.input }))
  .addNode('cvExtractor', (s) => cvExtractorNode({ cvText: buildCvText(s.mapped!) }))
  .addNode('keywordComposer', (s) => keywordComposerNode({ jdChunks: s.jdChunks ?? [], cvChunks: s.cvChunks ?? [] }))
  .addNode('keywordClassifier', (s) => keywordClassifierNode({ keywords: s.keywords ?? [], jdChunks: s.jdChunks ?? [] }))
  .addNode('booleanMatcher', (s) => booleanMatcherNode({ mapped: s.mapped!, keywords: s.keywords ?? [] }))
  .addNode('bulletAdvisor', (s) => bulletAdvisorNode({ mapped: s.mapped!, keywords: s.keywords ?? [], jobTitle: s.jobTitle, locale: s.input.locale }))
  .addNode('aiSmellValidator', (s) => aiSmellValidatorNode({ mapped: s.mapped! }))
  .addNode('scoreComposer', (s) => scoreComposerNode({ mapped: s.mapped!, keywords: s.keywords ?? [], keywordMatches: s.keywordMatches ?? [], bulletInsights: s.bulletInsights }))
  .addNode('gapAdvisor', (s) => gapAdvisorNode({
    missingKeywords: missingOf(s.keywords ?? [], s.keywordMatches ?? []),
    cvChunks: s.cvChunks ?? [],
    locale: s.input.locale,
  }))
  .addNode('aggregator', aggregatorNode)
  .addEdge('__start__', 'mapper')
  .addEdge('mapper', 'jdExtractor')
  .addEdge('jdExtractor', 'cvExtractor')
  .addEdge('cvExtractor', 'keywordComposer')
  .addEdge('keywordComposer', 'keywordClassifier')
  .addEdge('keywordClassifier', 'booleanMatcher')
  .addEdge('booleanMatcher', 'bulletAdvisor')
  .addEdge('bulletAdvisor', 'aiSmellValidator')
  .addEdge('aiSmellValidator', 'scoreComposer')
  .addEdge('scoreComposer', 'gapAdvisor')
  .addEdge('gapAdvisor', 'aggregator')
  .addEdge('aggregator', '__end__')
  .compile()

export { graph, missingOf }
