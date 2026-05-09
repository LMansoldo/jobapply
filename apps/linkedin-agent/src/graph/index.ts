import { StateGraph, Annotation } from '@langchain/langgraph'
import type { GraphState, LinkedInInput, LinkedInProfile, GenerationOutput, SEOReport, GenericPhrase } from '../types'
import { profileParserNode } from './nodes/profileParser'
import { jdKeywordExtractorNode } from './nodes/jdKeywordExtractor'
import { seoScorerNode } from './nodes/seoScorer'
import { authorityScorerNode } from './nodes/authorityScorer'
import { genericDetectorNode } from './nodes/genericDetector'
import { reportCompilerNode } from './nodes/reportCompiler'
import { profileGeneratorNode } from './nodes/profileGenerator'
import { deltaCalculatorNode } from './nodes/deltaCalculator'

const arr = <T>() => Annotation<T[]>({ reducer: (_, u) => u, default: () => [] as T[] })
const num = (def = 0) => Annotation<number>({ reducer: (_, u) => u, default: () => def })
const opt = <T>(def: () => T) => Annotation<T>({ reducer: (_, u) => u, default: def })

const GraphAnnotation = Annotation.Root({
  input: Annotation<LinkedInInput>({
    reducer: (_, u) => u,
    default: () => ({ profile: { headline: '', about: '', experience: '', skills: '', education: '' } }),
  }),
  normalizedProfile: Annotation<LinkedInProfile>({
    reducer: (_, u) => u,
    default: () => ({ headline: '', about: '', experience: '', skills: '', education: '' }),
  }),
  jdKeywords: arr<string>(),
  keywordDensityScore: num(),
  completenessScore: num(),
  roleAlignmentScore: num(),
  completenessGaps: arr<string>(),
  missingKeywords: arr<string>(),
  authorityScore: num(),
  genericPhrases: arr<GenericPhrase>(),
  specificityScore: num(),
  seoBefore: opt<SEOReport>(() => ({
    overall_score: 0, keyword_density_score: 0, completeness_score: 0,
    specificity_score: 0, role_alignment_score: 0, authority_score: 0,
    missing_keywords: [], generic_phrases: [], completeness_gaps: [],
    action_items: [], sections: {},
  })),
  generation: opt<GenerationOutput>(() => ({
    headlineAnalysis: { currentScore: 'weak', alternatives: [] },
    aboutAudit: { issues: [], rewrite: null },
    experienceGaps: [],
    keywordGaps: { technical: [], domain: [], softSkills: [], certifications: [] },
    quickWins: [],
    overallScore: { score: 0, strengths: [], blockers: [], priorityAction: '' },
    voiceProfile: { tone: 'direct', signaturePatterns: [], avoidedPatterns: [], rawInputMissing: true, qualityNote: '' },
  })),
  seoAfter: opt<SEOReport>(() => ({
    overall_score: 0, keyword_density_score: 0, completeness_score: 0,
    specificity_score: 0, role_alignment_score: 0, authority_score: 0,
    missing_keywords: [], generic_phrases: [], completeness_gaps: [],
    action_items: [], sections: {},
  })),
  delta: num(),
})

const graph = new StateGraph(GraphAnnotation)
  .addNode('profileParser', profileParserNode)
  .addNode('jdKeywordExtractor', jdKeywordExtractorNode)
  .addNode('seoScorer', seoScorerNode)
  .addNode('authorityScorer', authorityScorerNode)
  .addNode('genericDetector', genericDetectorNode)
  .addNode('reportCompiler', reportCompilerNode)
  .addNode('profileGenerator', profileGeneratorNode)
  .addNode('deltaCalculator', deltaCalculatorNode)
  .addEdge('__start__', 'profileParser')
  .addConditionalEdges('profileParser', (state: typeof GraphAnnotation.State) =>
    state.input.jobDescription?.trim() ? 'jdKeywordExtractor' : 'seoScorer'
  )
  .addEdge('jdKeywordExtractor', 'seoScorer')
  .addEdge('seoScorer', 'authorityScorer')
  .addEdge('authorityScorer', 'genericDetector')
  .addEdge('genericDetector', 'reportCompiler')
  .addEdge('reportCompiler', 'profileGenerator')
  .addEdge('profileGenerator', 'deltaCalculator')
  .addEdge('deltaCalculator', '__end__')
  .compile()

export { graph }
