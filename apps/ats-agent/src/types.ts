// ── CV sub-types ─────────────────────────────────────────────────────────────

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Experience {
  role?: string
  company?: string
  location?: string
  period?: string   // "MM/YYYY - MM/YYYY" or "MM/YYYY - Present"
  context?: string
  highlights?: string[]
}

export interface Education {
  degree?: string
  field?: string
  institution?: string
  location?: string
  period?: string
  notes?: string
}

export interface Language {
  language: string
  level: string
  score?: string
}

export interface Certification {
  name: string
  organization: string
  date?: string
}

export interface Project {
  name: string
  url?: string
  description?: string
  highlights?: string[]
}

export interface CVLocaleVersion {
  locale: 'en' | 'pt-BR'
  summary?: string
  skills?: SkillGroup[]
  experience?: Experience[]
}

export interface CV {
  _id?: string
  user?: string
  fullName?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
  summary?: string
  skills?: SkillGroup[]
  experience?: Experience[]
  education?: Education[]
  languages?: Language[]
  certifications?: Certification[]
  projects?: Project[]
  localeVersions?: CVLocaleVersion[]
  updatedAt?: string
}

// ── Agent types ───────────────────────────────────────────────────────────────

export interface AgentInput {
  cv?: CV
  cvMarkdown?: string
  jobDescription: string
  locale?: 'en' | 'pt-BR'
}

export interface MappedCV {
  sections: {
    contact: string
    summary: string
    skills: string
    experience: string
    education: string
    languages: string
  }
  entities: {
    jobTitles: string[]
    companies: string[]
    skills: string[]
    techStack: string[]
    softSkills: string[]
    dates: string[]
    degrees: string[]
    urls: string[]
    experiencePeriods: Array<{ role: string; company: string; period: string }>
  }
  raw: CV
}

export interface KeywordPhrase {
  keyword: string
  phrases: string[]
}

export interface RemoveSuggestion {
  section: string
  item: string
  reason: string
}

export interface InterviewStory {
  jdRequirement: string
  story: string
}

export interface InterviewPrep {
  stories: InterviewStory[]
  overallPositioning: string
}

export interface ATSReport {
  universalScore: number
  scoreBreakdown: ScoreBreakdown
  bulletInsights: BulletInsight[]
  aiSmellFixes: AiSmellFix[]
  matchedKeywords: string[]
  missingKeywords: string[]
  semanticGaps: string[]
  optimalTemplate: {
    sectionsOrder: string[]
    keywordsToAdd: string[]
    keywordPhrases: KeywordPhrase[]
    keywordsToRephrase: { from: string; to: string }[]
    formatFixes: string[]
  }
  tips: { priority: 'critical' | 'high' | 'medium'; tip: string }[]
  removeSuggestions: RemoveSuggestion[]
}

export interface ScoreBreakdown {
  factClarity: number       // 0–100 — bullets expressam fatos concretos e compreensíveis isolados
  jdAdherence: number       // 0–100 — aderência dos bullets ao que a JD pede
  humanReadability: number  // 0–100 — escaneabilidade humana (comprimento, densidade, estrutura)
  prominence: number        // 0–100 — feitos mais fortes posicionados onde os olhos batem primeiro
  keywordCoverage: number   // 0–100 — cobertura booleana ponderada por tier; INFORMATIVO, não entra no score
}

// ── Bullet advisor — análise por bullet (clareza, aderência à JD) ─────────────

export interface BulletInsight {
  positionIndex: number     // índice da experiência em mapped.raw.experience (0 = mais recente)
  bulletIndex: number       // índice do highlight dentro da posição
  role: string              // cargo da posição a que o bullet pertence
  text: string              // texto do bullet
  clarity: number           // 0–100 — fato único, concreto e compreensível isolado
  jdRelevance: number       // 0–100 — quanto este fato prova algo que a JD exige
  issue?: string            // o que enfraquece o bullet (locale do request)
  suggestion?: string       // reescrita fiel ao fato original (nada inventado)
}

// ── AI smell — padrões de escrita de LLM detectados no texto do CV ───────────

export interface AiSmellFix {
  location: string          // 'summary' | 'p{positionIndex}.b{bulletIndex}'
  original: string          // texto original
  rewrite: string           // reescrita validada (fidelidade de fatos); '' quando o LLM falhou
  issues: string[]          // detectores que marcaram (em-dash, banned:delve, triad, ...)
}

export interface ResumeDraft {
  summary: string
  skills: Array<{ category: string; items: string[] }>
  experience: Array<{
    positionIndex: number
    include: boolean
    context: string
    bullets: Array<{ sourceIndex: number; text: string }>
  }>
}

export interface VerificationViolation {
  location: string
  rule: 'metric-dropped' | 'metric-invented' | 'low-overlap' | 'invalid-source' | 'generic-phrase' | 'weak-clarity'
  detail: string
  action: 'reverted' | 'removed'
}

export interface VerificationReport {
  violations: VerificationViolation[]
}

export interface ParsedPosition {
  header: string
  period: string
  context: string
  bullets: string[]
}

export interface ResumeSource {
  positions: ParsedPosition[]
  educationRaw: string
  summaryRaw: string
  skillsRaw: string
}

// ── Chunk index (SQLite; ver src/db/chunks.ts) ────────────────────────────────

export type ChunkType = 'skill' | 'tool' | 'domain' | 'credential' | 'soft' | 'req'
export type ChunkTier = 'must-have' | 'important' | 'nice-to-have'
export type CvSection =
  | 'summary' | 'skills' | 'experience' | 'education'
  | 'languages' | 'projects' | 'certifications'

export interface JdChunkInput {
  type: ChunkType
  attr: string
  tier: ChunkTier
}

export interface JdChunk extends JdChunkInput {
  id: string
  jdId: string
  createdAt: number
}

export interface CvChunkInput {
  type: ChunkType
  attr: string
  section: CvSection
}

export interface CvChunk extends CvChunkInput {
  id: string
  cvId: string
  createdAt: number
}

// ── Keyword composition (jd_chunks × cv_chunks) ──────────────────────────────

export type KeywordClass = 'skill' | 'eligibility' | 'credential' | 'seniority'

export interface ComposedKeyword {
  term: string              // forma canônica, wording da JD, lowercase
  tier: ChunkTier           // tier mais forte entre os chunks agrupados
  variants: string[]        // superfícies literais equivalentes (ortografia, abreviação, plural)
  keywordClass?: KeywordClass // atribuída pelo keywordClassifier
}

export interface KeywordVerdict {
  term: string
  action: 'keep' | 'merge_into' | 'strip_variant' | 'reclassify'
  mergeInto?: string        // action=merge_into: term alvo da fusão
  stripVariants?: string[]  // action=strip_variant: variantes a remover
  keywordClass?: KeywordClass
}

export interface KeywordMatch {
  term: string
  tier: ChunkTier
  matched: boolean
  section: string           // seção do CV onde casou; '' quando não casou
  evidence: string          // trecho normalizado do CV que sustenta o match; '' quando não casou
}

// ── Gap advisor — "mesma coisa, palavras diferentes" ──────────────────────────

export interface RephraseGap {
  keyword: string           // keyword da JD que não casou literalmente
  cvPhrase: string          // wording atual do CV que expressa o mesmo conceito
  suggestedRewrite: string  // como reescrever usando o termo exato da JD
}

export interface GapAnalysis {
  rephraseGaps: RephraseGap[]
  absentKeywords: string[]              // sem evidência no CV
  keywordPhrases: KeywordPhrase[]       // frases prontas só p/ absent com evidência parcial
  removeSuggestions: RemoveSuggestion[]
}

export interface GraphState {
  input: AgentInput
  jdId?: string
  jdChunks?: JdChunkInput[]
  jobTitle?: string
  cvId?: string
  cvChunks?: CvChunkInput[]
  keywords?: ComposedKeyword[]
  keywordMatches?: KeywordMatch[]
  bulletInsights?: BulletInsight[]
  aiSmellFixes?: AiSmellFix[]
  gapAnalysis?: GapAnalysis
  mapped?: MappedCV
  universalScore?: number
  scoreBreakdown?: ScoreBreakdown
  matchedKeywords?: string[]
  missingKeywords?: string[]
  report?: ATSReport
  resumeVerification?: VerificationReport
}
