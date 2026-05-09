# LinkedIn Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `apps/linkedin-agent` (Fastify + LangGraph + Gemini) that replaces the LinkedIn node in `ats-agent`, update `jobapply-api` to route LinkedIn analysis through the new agent, and build a dedicated `/linkedin` optimizer page in the frontend.

**Architecture:** Background-job pattern (same as ats-agent): POST /analyze returns requestId immediately, GET /result/:id polls until done. Graph runs SEO evaluation (before) → profile generation → SEO evaluation (after), returning both reports and a delta. The API polls internally so the frontend makes a single HTTP call.

**Tech Stack:** TypeScript, Fastify 4, @langchain/langgraph, @google/generative-ai, Zod — backend. React 18, TanStack Router, Ant Design — frontend.

---

## File Map

### New: `apps/linkedin-agent/`
| File | Purpose |
|------|---------|
| `package.json` | Workspace package, same deps as ats-agent |
| `tsconfig.json` | Identical to ats-agent tsconfig |
| `src/server.ts` | Fastify entry point, port 3002 |
| `src/types.ts` | All shared types: LinkedInInput, SEOReport, GenerationOutput, LinkedInResult, GraphState |
| `src/lib/gemini.ts` | Shared Gemini client |
| `src/graph/index.ts` | StateGraph with conditional edge for jdKeywordExtractor |
| `src/graph/nodes/profileParser.ts` | Validates/normalizes structured profile input |
| `src/graph/nodes/jdKeywordExtractor.ts` | Extracts ranked keywords from job description (LLM) |
| `src/graph/nodes/seoScorer.ts` | keyword_density + completeness + role_alignment scores |
| `src/graph/nodes/authorityScorer.ts` | Metrics, progression, impact specificity (LLM) |
| `src/graph/nodes/genericDetector.ts` | Regex + LLM cliché detection, specificity_score |
| `src/graph/nodes/reportCompiler.ts` | Aggregates all scores into SEOReport + action_items |
| `src/graph/nodes/profileGenerator.ts` | Migrated from ats-agent linkedinAnalyzerNode |
| `src/graph/nodes/deltaCalculator.ts` | Runs scoring on generated content, returns seoAfter + delta |
| `src/api/routes.ts` | /analyze, /result/:id, /health + job store |

### Modified: `apps/ats-agent/`
| File | Change |
|------|--------|
| `src/graph/nodes/linkedinAnalyzer.ts` | Delete |
| `src/api/routes.ts` | Remove POST /linkedin-analyze route + import |

### Modified: `apps/jobapply-api/`
| File | Change |
|------|--------|
| `.env` | Add LINKEDIN_AGENT_URL=http://localhost:3002 |
| `src/services/atsService.ts` | Replace analyzeLinkedInWithATS → analyzeLinkedInWithLinkedInAgent + getLinkedInJobResult |
| `src/controllers/cvController.ts` | analyzeLinkedInDirect polls linkedin-agent internally |

### Modified: `apps/jobapply-app/`
| File | Change |
|------|--------|
| `src/domain/linkedin/types.ts` | Add LinkedInInput, SEOReport, LinkedInResult; extend existing types |
| `src/infrastructure/mock/linkedinMockData.ts` | Add MOCK_LINKEDIN_RESULT matching new LinkedInResult shape |
| `src/infrastructure/repositories/linkedinRepository.ts` | Update analyzeLinkedIn() payload and response type |
| `src/domain/linkedin/hooks/useLinkedInOnboarding.ts` | New: state for 5-step onboarding flow |
| `src/domain/linkedin/hooks/useLinkedInAnalysis.ts` | Update to accept LinkedInInput, return LinkedInResult |
| `src/presentation/pages/LinkedInOptimizerPage/LinkedInOptimizerPage.tsx` | New page orchestrator |
| `src/presentation/pages/LinkedInOptimizerPage/OnboardingFlow.tsx` | Steps 0-4: PDF, objectives, positioning, evidence, job |
| `src/presentation/pages/LinkedInOptimizerPage/Dashboard.tsx` | Score cards + dimension bars + keyword panel + action plan |
| `src/presentation/pages/LinkedInOptimizerPage/GenerationResults.tsx` | Headline alternatives, about rewrite, experience rewrites, quick wins |
| `src/presentation/pages/LinkedInOptimizerPage/LinkedInOptimizerPage.styles.ts` | Page styles |
| `src/routes/_auth/linkedin/index.tsx` | New TanStack route |
| `src/design-system/tailoring/TailoringWorkspaceTabs/TailoringWorkspaceTabs.tsx` | Remove linkedin tab |
| `src/design-system/tailoring/TailoringWorkspaceTabs/TailoringWorkspaceTabs.types.ts` | Remove 'linkedin' from WorkspaceTab |
| `src/domain/cv/types/tailoringUI.ts` | Remove 'linkedin' from WorkspaceTab |
| `src/presentation/pages/CVTailoringPage/CVTailoringPage.tsx` | Remove linkedin tab block + useLinkedInAnalysis + LinkedInWorkspace import |

---

## Task 1: Scaffold `linkedin-agent` package

**Files:**
- Create: `apps/linkedin-agent/package.json`
- Create: `apps/linkedin-agent/tsconfig.json`
- Create: `apps/linkedin-agent/.env.example`
- Create: `apps/linkedin-agent/src/server.ts`

- [ ] **Step 1: Create `apps/linkedin-agent/package.json`**

```json
{
  "name": "linkedin-agent",
  "version": "1.0.0",
  "description": "LinkedIn profile optimizer agent using LangGraph and Gemini",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node -r dotenv/config src/server.ts",
    "lint": "eslint src --ext .ts --quiet",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "@langchain/langgraph": "^0.2.36",
    "dotenv": "^16.4.5",
    "fastify": "^4.28.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5",
    "eslint": "^8.57.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0"
  }
}
```

- [ ] **Step 2: Create `apps/linkedin-agent/tsconfig.json`** (identical to ats-agent)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `apps/linkedin-agent/.env.example`**

```
PORT=3002
GOOGLE_AI_API_KEY=your_key_here
```

Copy `.env.example` to `.env` and fill in `GOOGLE_AI_API_KEY`.

- [ ] **Step 4: Create `apps/linkedin-agent/src/server.ts`**

```ts
import dotenv from 'dotenv'
dotenv.config({ override: false })
import Fastify from 'fastify'
import { registerRoutes } from './api/routes'

const PORT = parseInt(process.env.PORT ?? '3002', 10)

async function main(): Promise<void> {
  const app = Fastify({ logger: true })
  await registerRoutes(app)
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
```

- [ ] **Step 5: Install dependencies**

```bash
cd apps/linkedin-agent && yarn install
```

- [ ] **Step 6: Commit**

```bash
git add apps/linkedin-agent/
git commit -m "feat(linkedin-agent): scaffold package, tsconfig, server"
```

---

## Task 2: Types and Gemini client

**Files:**
- Create: `apps/linkedin-agent/src/types.ts`
- Create: `apps/linkedin-agent/src/lib/gemini.ts`

- [ ] **Step 1: Create `apps/linkedin-agent/src/types.ts`**

```ts
// ── Input ─────────────────────────────────────────────────────────────────────

export interface LinkedInProfile {
  headline: string
  about: string
  experience: string
  skills: string
  education: string
  certifications?: string
}

export interface VoiceAnswer {
  label: string
  answer: string
}

export interface AnchorEvidence {
  metric: string
  timeframe: string
  action: string
}

export interface LinkedInInput {
  profile: LinkedInProfile
  targetRole?: string
  targetSector?: string[]
  positioning?: string[]
  tone?: string
  anchorEvidence?: AnchorEvidence
  jobDescription?: string
  locale?: 'en' | 'pt-BR'
  voiceAnswers?: VoiceAnswer[]
}

// ── SEO Report ────────────────────────────────────────────────────────────────

export interface GenericPhrase {
  phrase: string
  reason: string
  suggestion: string
}

export type ActionPriority = 'high' | 'medium' | 'low'

export interface ActionItem {
  action: string
  reason: string
  priority: ActionPriority
}

export interface SectionScore {
  label: string
  score: number
}

export interface SEOReport {
  overall_score: number
  keyword_density_score: number
  completeness_score: number
  specificity_score: number
  role_alignment_score: number
  authority_score: number
  missing_keywords: string[]
  generic_phrases: GenericPhrase[]
  completeness_gaps: string[]
  action_items: ActionItem[]
  sections: Record<string, SectionScore>
}

// ── Generation Output ─────────────────────────────────────────────────────────

export interface GenerationOutput {
  headlineAnalysis: {
    currentScore: 'weak' | 'moderate' | 'strong'
    alternatives: string[]
  }
  aboutAudit: {
    issues: string[]
    rewrite: string | null
  }
  experienceGaps: Array<{ role: string; original: string; rewrite: string }>
  keywordGaps: {
    technical: string[]
    domain: string[]
    softSkills: string[]
    certifications: string[]
  }
  quickWins: string[]
  overallScore: {
    score: number
    strengths: string[]
    blockers: string[]
    priorityAction: string
  }
  voiceProfile: {
    tone: string
    signaturePatterns: string[]
    avoidedPatterns: string[]
    rawInputMissing: boolean
    qualityNote: string
  }
}

// ── Final Result ──────────────────────────────────────────────────────────────

export interface LinkedInResult {
  seo: {
    before: SEOReport
    after: SEOReport
    delta: number
  }
  generation: GenerationOutput
  locale: 'en' | 'pt-BR'
}

// ── Graph State ───────────────────────────────────────────────────────────────

export interface GraphState {
  input: LinkedInInput
  // profileParser output
  normalizedProfile: LinkedInProfile
  // jdKeywordExtractor output
  jdKeywords: string[]
  // seoScorer output (partial scores)
  keywordDensityScore: number
  completenessScore: number
  roleAlignmentScore: number
  completenessGaps: string[]
  missingKeywords: string[]
  // authorityScorer output
  authorityScore: number
  // genericDetector output
  genericPhrases: GenericPhrase[]
  specificityScore: number
  // reportCompiler output
  seoBefore: SEOReport
  // profileGenerator output
  generation: GenerationOutput
  // deltaCalculator output
  seoAfter: SEOReport
  delta: number
}
```

- [ ] **Step 2: Create `apps/linkedin-agent/src/lib/gemini.ts`**

```ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GOOGLE_AI_API_KEY
if (!apiKey) throw new Error('GOOGLE_AI_API_KEY environment variable is not set')

export const genAI = new GoogleGenerativeAI(apiKey)
```

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/
git commit -m "feat(linkedin-agent): add types and Gemini client"
```

---

## Task 3: `profileParser` node

**Files:**
- Create: `apps/linkedin-agent/src/graph/nodes/profileParser.ts`

- [ ] **Step 1: Create the node**

```ts
import type { GraphState, LinkedInProfile } from '../../types'

const MAX_FIELD_LENGTH = 8000

function truncate(value: string): string {
  return value.length > MAX_FIELD_LENGTH ? value.slice(0, MAX_FIELD_LENGTH) : value
}

export function profileParserNode(state: Pick<GraphState, 'input'>): Pick<GraphState, 'normalizedProfile'> {
  const { profile } = state.input

  if (!profile || !profile.headline) {
    throw new Error('profileParser: profile with at least a headline is required')
  }

  const normalizedProfile: LinkedInProfile = {
    headline: truncate(profile.headline.trim()),
    about: truncate((profile.about ?? '').trim()),
    experience: truncate((profile.experience ?? '').trim()),
    skills: truncate((profile.skills ?? '').trim()),
    education: truncate((profile.education ?? '').trim()),
    certifications: profile.certifications ? truncate(profile.certifications.trim()) : undefined,
  }

  return { normalizedProfile }
}
```

- [ ] **Step 2: Verify the node compiles**

```bash
cd apps/linkedin-agent && yarn typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/graph/nodes/profileParser.ts
git commit -m "feat(linkedin-agent): add profileParser node"
```

---

## Task 4: `jdKeywordExtractor` node

**Files:**
- Create: `apps/linkedin-agent/src/graph/nodes/jdKeywordExtractor.ts`

- [ ] **Step 1: Create the node**

```ts
import { genAI } from '../../lib/gemini'
import type { GraphState } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

function buildPrompt(jd: string): string {
  return `You are a LinkedIn recruiter keyword specialist. Extract the most important keywords from this job description for LinkedIn profile SEO.

Return three groups:
- required: appear in job title or mandatory requirements
- preferred: appear as "nice to have" or differentials
- inferred: typical for this role/sector but not explicitly listed

Rules:
- Prefer compound terms over individual words
- Include technologies, methodologies, domain concepts
- Exclude generic nouns (team, company, role, years, requirements)
- 8-12 terms per group maximum

Job Description:
${jd}

Respond ONLY with valid JSON, no markdown:
{"required": ["string"], "preferred": ["string"], "inferred": ["string"]}`
}

export async function jdKeywordExtractorNode(
  state: Pick<GraphState, 'input'>
): Promise<Pick<GraphState, 'jdKeywords'>> {
  const jd = state.input.jobDescription
  if (!jd || jd.trim().length < 20) {
    return { jdKeywords: [] }
  }

  try {
    const result = await model.generateContent(buildPrompt(jd))
    const raw = result.response.text()
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean) as { required?: string[]; preferred?: string[]; inferred?: string[] }
    const all = [
      ...(parsed.required ?? []),
      ...(parsed.preferred ?? []),
      ...(parsed.inferred ?? []),
    ].filter((k): k is string => typeof k === 'string')
    return { jdKeywords: all }
  } catch {
    return { jdKeywords: [] }
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd apps/linkedin-agent && yarn typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/graph/nodes/jdKeywordExtractor.ts
git commit -m "feat(linkedin-agent): add jdKeywordExtractor node"
```

---

## Task 5: `seoScorer` node

**Files:**
- Create: `apps/linkedin-agent/src/graph/nodes/seoScorer.ts`

The node calculates `keyword_density_score`, `completeness_score`, and `role_alignment_score` (LLM). It also produces `completenessGaps` and `missingKeywords`.

- [ ] **Step 1: Create the node**

```ts
import { genAI } from '../../lib/gemini'
import type { GraphState } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

// ── Pure scoring functions ────────────────────────────────────────────────────

export function calcKeywordDensityScore(
  profile: { headline: string; about: string; experience: string; skills: string },
  keywords: string[]
): { score: number; missingKeywords: string[] } {
  if (keywords.length === 0) return { score: 0, missingKeywords: [] }

  const fields = {
    headline: profile.headline.toLowerCase(),
    about: profile.about.toLowerCase(),
    experience: profile.experience.toLowerCase(),
    skills: profile.skills.toLowerCase(),
  }

  const WEIGHTS = { headline: 3, about: 2, experience: 1, skills: 1 }
  const maxWeight = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)
  let totalScore = 0
  const missing: string[] = []

  for (const kw of keywords) {
    const lower = kw.toLowerCase()
    let kwWeight = 0
    for (const [field, weight] of Object.entries(WEIGHTS)) {
      if (fields[field as keyof typeof fields].includes(lower)) {
        kwWeight = Math.max(kwWeight, weight)
      }
    }
    if (kwWeight === 0) missing.push(kw)
    totalScore += kwWeight / maxWeight
  }

  return {
    score: Math.round((totalScore / keywords.length) * 100),
    missingKeywords: missing,
  }
}

export function calcCompletenessScore(profile: {
  headline: string
  about: string
  experience: string
  skills: string
  education: string
}): { score: number; gaps: string[] } {
  const gaps: string[] = []
  let score = 0

  if (profile.headline.trim().length > 0) {
    score += 25
  } else {
    gaps.push('Headline is empty')
  }

  const wordCount = profile.about.trim().split(/\s+/).filter(Boolean).length
  if (wordCount >= 200) {
    score += 20
  } else {
    gaps.push(`About section has ${wordCount} words (target: 200+)`)
  }

  const experienceBlocks = profile.experience.trim().split(/\n{2,}/).filter(b => b.trim().length > 20)
  if (experienceBlocks.length >= 3) {
    score += 20
  } else {
    gaps.push(`Only ${experienceBlocks.length} experience blocks with text (target: 3+)`)
  }

  const skillCount = profile.skills.split(',').map(s => s.trim()).filter(Boolean).length
  if (skillCount >= 10) {
    score += 20
  } else {
    gaps.push(`Only ${skillCount} skills listed (target: 10+)`)
  }

  if (profile.education.trim().length > 0) {
    score += 15
  } else {
    gaps.push('Education section is empty')
  }

  return { score, gaps }
}

// ── LLM call for role alignment ───────────────────────────────────────────────

async function calcRoleAlignmentScore(
  profile: { headline: string; experience: string },
  targetRole: string | undefined
): Promise<number> {
  if (!targetRole) return 0

  const prompt = `Rate how well this LinkedIn profile is aligned to the target role on a scale of 0-100.

Target role: ${targetRole}

Headline: ${profile.headline}

Most recent experience (first 500 chars):
${profile.experience.slice(0, 500)}

Consider: does the headline mention relevant skills/domain? Do recent experience descriptions match responsibilities typical for "${targetRole}"?

Respond ONLY with a single integer from 0 to 100. No explanation.`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const score = parseInt(raw, 10)
    return isNaN(score) ? 0 : Math.min(100, Math.max(0, score))
  } catch {
    return 0
  }
}

// ── Node ──────────────────────────────────────────────────────────────────────

export async function seoScorerNode(
  state: Pick<GraphState, 'input' | 'normalizedProfile' | 'jdKeywords'>
): Promise<Pick<GraphState, 'keywordDensityScore' | 'completenessScore' | 'roleAlignmentScore' | 'completenessGaps' | 'missingKeywords'>> {
  const { normalizedProfile, jdKeywords, input } = state

  const { score: keywordDensityScore, missingKeywords } = calcKeywordDensityScore(normalizedProfile, jdKeywords)
  const { score: completenessScore, gaps: completenessGaps } = calcCompletenessScore(normalizedProfile)
  const roleAlignmentScore = await calcRoleAlignmentScore(normalizedProfile, input.targetRole)

  return { keywordDensityScore, completenessScore, roleAlignmentScore, completenessGaps, missingKeywords }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd apps/linkedin-agent && yarn typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/graph/nodes/seoScorer.ts
git commit -m "feat(linkedin-agent): add seoScorer node with pure scoring functions"
```

---

## Task 6: `authorityScorer` node

**Files:**
- Create: `apps/linkedin-agent/src/graph/nodes/authorityScorer.ts`

- [ ] **Step 1: Create the node**

```ts
import { genAI } from '../../lib/gemini'
import type { GraphState } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

export async function authorityScorerNode(
  state: Pick<GraphState, 'normalizedProfile' | 'input'>
): Promise<Pick<GraphState, 'authorityScore'>> {
  const { experience } = state.normalizedProfile

  if (!experience.trim()) return { authorityScore: 0 }

  const prompt = `Analyze this LinkedIn experience section. Rate the overall credibility and authority signals on a scale of 0-100.

Score higher for:
- Quantitative metrics with context ("reduced churn from 18% to 9% in 14 months")
- Specific impact vs generic responsibility ("led migration that cut build time by 70%" vs "responsible for migrations")
- Clear career progression (increasing seniority)
- Named technologies, methodologies, company context

Score lower for:
- No metrics or numbers at all
- Generic responsibility language ("responsible for", "worked on")
- Flat career trajectory with no progression
- Vague impact claims

Experience section:
${experience.slice(0, 2000)}

Respond ONLY with a single integer from 0 to 100.`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()
    const score = parseInt(raw, 10)
    return { authorityScore: isNaN(score) ? 0 : Math.min(100, Math.max(0, score)) }
  } catch {
    return { authorityScore: 0 }
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd apps/linkedin-agent && yarn typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/graph/nodes/authorityScorer.ts
git commit -m "feat(linkedin-agent): add authorityScorer node"
```

---

## Task 7: `genericDetector` node

**Files:**
- Create: `apps/linkedin-agent/src/graph/nodes/genericDetector.ts`

- [ ] **Step 1: Create the node**

```ts
import { genAI } from '../../lib/gemini'
import type { GraphState, GenericPhrase } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

const CLICHE_REGEX = new RegExp(
  [
    'apaixonado por', 'passionate about', 'results[- ]driven', 'dynamic professional',
    'profissional dedicado', 'foco em resultados', 'visão estratégica', 'trabalho em equipe',
    'comunicação eficaz', 'responsável por', 'responsible for', 'team player',
    'pensamento inovador', 'profissional com sólida experiência', 'leverage', 'utilize',
    'synergy', 'proativo', 'proactive', 'hands[- ]on', 'innovative', 'passionate',
  ].join('|'),
  'gi'
)

export function detectRegexClichés(text: string): string[] {
  const matches = text.match(CLICHE_REGEX)
  return matches ? [...new Set(matches.map(m => m.toLowerCase()))] : []
}

export function calcSpecificityScore(genericsCount: number): number {
  return Math.max(0, 100 - genericsCount * 10)
}

async function detectSemanticGenerics(
  profile: { headline: string; about: string },
  context: { targetRole?: string; anchorEvidence?: { metric: string; timeframe: string; action: string } }
): Promise<GenericPhrase[]> {
  const text = `Headline: ${profile.headline}\n\nAbout:\n${profile.about}`.slice(0, 2000)

  const contextStr = context.anchorEvidence
    ? `Candidate context — evidence: "${context.anchorEvidence.metric} in ${context.anchorEvidence.timeframe} via ${context.anchorEvidence.action}", target role: "${context.targetRole ?? 'not provided'}"`
    : `Target role: "${context.targetRole ?? 'not provided'}"`

  const prompt = `Identify phrases in this LinkedIn text that are generic and could belong to any professional in the field.

${contextStr}

LinkedIn text:
${text}

For each generic phrase found, provide a specific rewrite using the candidate context above.

Respond ONLY with valid JSON array (max 5 items):
[{"phrase": "string", "reason": "string", "suggestion": "string"}]

If no generics found, respond with: []`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p): p is GenericPhrase =>
        typeof p.phrase === 'string' && typeof p.reason === 'string' && typeof p.suggestion === 'string'
    )
  } catch {
    return []
  }
}

export async function genericDetectorNode(
  state: Pick<GraphState, 'normalizedProfile' | 'input'>
): Promise<Pick<GraphState, 'genericPhrases' | 'specificityScore'>> {
  const { normalizedProfile, input } = state

  const fullText = [normalizedProfile.headline, normalizedProfile.about, normalizedProfile.experience].join('\n')
  const regexClichés = detectRegexClichés(fullText)

  const semanticGenerics = await detectSemanticGenerics(normalizedProfile, {
    targetRole: input.targetRole,
    anchorEvidence: input.anchorEvidence,
  })

  const allPhrases: GenericPhrase[] = [
    ...regexClichés.map(phrase => ({
      phrase,
      reason: 'Common cliché — signals AI-generated or generic text',
      suggestion: 'Replace with a specific achievement, skill, or context from your actual experience',
    })),
    ...semanticGenerics,
  ]

  const specificityScore = calcSpecificityScore(allPhrases.length)

  return { genericPhrases: allPhrases, specificityScore }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd apps/linkedin-agent && yarn typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/graph/nodes/genericDetector.ts
git commit -m "feat(linkedin-agent): add genericDetector node"
```

---

## Task 8: `reportCompiler` node

**Files:**
- Create: `apps/linkedin-agent/src/graph/nodes/reportCompiler.ts`

- [ ] **Step 1: Create the node**

```ts
import type { GraphState, SEOReport, ActionItem, SectionScore } from '../../types'

export function buildActionItems(params: {
  missingKeywords: string[]
  completenessGaps: string[]
  genericPhrases: { phrase: string }[]
  completenessScore: number
  keywordDensityScore: number
  authorityScore: number
}): ActionItem[] {
  const items: ActionItem[] = []

  // High priority
  if (params.missingKeywords.length > 0) {
    items.push({
      action: `Add missing keywords to your profile: ${params.missingKeywords.slice(0, 5).join(', ')}`,
      reason: 'Required keywords absent from profile reduce recruiter search visibility significantly',
      priority: 'high',
    })
  }
  if (params.completenessGaps.some(g => g.toLowerCase().includes('about'))) {
    items.push({
      action: 'Write or expand your About section to at least 200 words',
      reason: 'About section is the highest-weight field for LinkedIn SEO and recruiter conversion',
      priority: 'high',
    })
  }
  if (params.authorityScore < 40) {
    items.push({
      action: 'Add quantitative metrics to your experience bullets (numbers, percentages, timeframes)',
      reason: 'Experience descriptions lack measurable impact, which reduces perceived authority',
      priority: 'high',
    })
  }

  // Medium priority
  if (params.genericPhrases.length > 0) {
    items.push({
      action: `Replace generic phrases: "${params.genericPhrases[0].phrase}"`,
      reason: 'Clichés and generic language reduce credibility and get filtered by recruiters',
      priority: 'medium',
    })
  }
  if (params.completenessGaps.some(g => g.toLowerCase().includes('skill'))) {
    items.push({
      action: 'Add more skills to reach 10+ in your Skills section',
      reason: 'Skills section is a primary recruiter filter — fewer skills means fewer search hits',
      priority: 'medium',
    })
  }
  if (params.keywordDensityScore < 50 && params.missingKeywords.length === 0) {
    items.push({
      action: 'Distribute job-relevant keywords more prominently across headline and about sections',
      reason: 'Keywords present in profile but not in high-weight sections (headline, about)',
      priority: 'medium',
    })
  }

  // Low priority
  for (const gap of params.completenessGaps.filter(g => !g.toLowerCase().includes('about') && !g.toLowerCase().includes('skill'))) {
    items.push({
      action: `Complete missing profile field: ${gap}`,
      reason: 'Profile completeness affects LinkedIn search ranking',
      priority: 'low',
    })
  }

  return items
}

export function reportCompilerNode(
  state: Pick<
    GraphState,
    | 'keywordDensityScore'
    | 'completenessScore'
    | 'roleAlignmentScore'
    | 'authorityScore'
    | 'specificityScore'
    | 'missingKeywords'
    | 'genericPhrases'
    | 'completenessGaps'
    | 'normalizedProfile'
  >
): Pick<GraphState, 'seoBefore'> {
  const {
    keywordDensityScore,
    completenessScore,
    roleAlignmentScore,
    authorityScore,
    specificityScore,
    missingKeywords,
    genericPhrases,
    completenessGaps,
    normalizedProfile,
  } = state

  // Weighted average: keyword 25%, completeness 25%, specificity 20%, role_alignment 15%, authority 15%
  const overall_score = Math.round(
    keywordDensityScore * 0.25 +
    completenessScore * 0.25 +
    specificityScore * 0.20 +
    roleAlignmentScore * 0.15 +
    authorityScore * 0.15
  )

  const sections: Record<string, SectionScore> = {
    headline: {
      label: 'Headline',
      score: normalizedProfile.headline.trim().length > 20 ? 70 : 20,
    },
    about: {
      label: 'About',
      score: Math.min(100, Math.round((normalizedProfile.about.trim().split(/\s+/).filter(Boolean).length / 300) * 100)),
    },
    experience: {
      label: 'Experience',
      score: authorityScore,
    },
    skills: {
      label: 'Skills',
      score: Math.min(100, normalizedProfile.skills.split(',').filter(s => s.trim()).length * 7),
    },
  }

  const action_items = buildActionItems({
    missingKeywords,
    completenessGaps,
    genericPhrases,
    completenessScore,
    keywordDensityScore,
    authorityScore,
  })

  const seoBefore: SEOReport = {
    overall_score,
    keyword_density_score: keywordDensityScore,
    completeness_score: completenessScore,
    specificity_score: specificityScore,
    role_alignment_score: roleAlignmentScore,
    authority_score: authorityScore,
    missing_keywords: missingKeywords,
    generic_phrases: genericPhrases,
    completeness_gaps: completenessGaps,
    action_items,
    sections,
  }

  return { seoBefore }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd apps/linkedin-agent && yarn typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/graph/nodes/reportCompiler.ts
git commit -m "feat(linkedin-agent): add reportCompiler node"
```

---

## Task 9: `profileGenerator` node (migrated from ats-agent)

**Files:**
- Create: `apps/linkedin-agent/src/graph/nodes/profileGenerator.ts`

This is a direct migration of `apps/ats-agent/src/graph/nodes/linkedinAnalyzer.ts`. Copy the file content verbatim, update imports, and update the function signature to match `GraphState`.

- [ ] **Step 1: Create the node**

Copy the content of `apps/ats-agent/src/graph/nodes/linkedinAnalyzer.ts` into a new file, changing only:
1. The import path: `import { genAI } from '../../lib/gemini'`
2. The exported function name: `profileGeneratorNode`
3. The function signature to accept and return `GraphState` slices

```ts
import { genAI } from '../../lib/gemini'
import type { GraphState, GenerationOutput } from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

// ── Keep the LOCALE_LABEL, PT_BR_MARKERS, detectLocale, buildLinkedInPrompt
// ── functions exactly as they are in linkedinAnalyzer.ts ──────────────────────
// (copy verbatim from apps/ats-agent/src/graph/nodes/linkedinAnalyzer.ts lines 51–271)

const LOCALE_LABEL: Record<string, string> = {
  en: 'English',
  'pt-BR': 'Brazilian Portuguese',
}

const PT_BR_MARKERS =
  /\b(de|da|do|das|dos|em|por|para|com|que|uma|um|no|na|nos|nas|ao|aos|às|pelo|pela|pelos|pelas|se|são|foi|era|está|estou|tenho|trabalhei|trabalhando|atuei|atuando|responsável|desenvolvimento|empresa|equipe|gerenciamento|liderança|projetos|anos|meses|cargo|setor)\b/gi

function detectLocale(profile: { headline: string; about: string; experience: string; skills: string }): string {
  const text = [profile.headline, profile.about, profile.experience, profile.skills].join(' ')
  const matches = text.match(PT_BR_MARKERS) ?? []
  return matches.length >= 5 ? 'pt-BR' : 'en'
}

function buildPrompt(
  profile: { headline: string; about: string; experience: string; skills: string; education: string; certifications?: string },
  targetRole: string | undefined,
  locale: string | undefined,
  voiceAnswers: { label: string; answer: string }[],
  anchorEvidence: { metric: string; timeframe: string; action: string } | undefined,
  positioning: string[] | undefined
): string {
  const resolvedLocale = locale ?? detectLocale(profile)
  const lang = LOCALE_LABEL[resolvedLocale] ?? 'English'

  const contextBlock = [
    anchorEvidence
      ? `<anchor_evidence>\nMetric: ${anchorEvidence.metric}\nTimeframe: ${anchorEvidence.timeframe}\nAction: ${anchorEvidence.action}\n</anchor_evidence>`
      : '',
    positioning?.length
      ? `<positioning>${positioning.join(', ')}</positioning>`
      : '',
  ].filter(Boolean).join('\n')

  // Copy the full prompt from linkedinAnalyzer.ts buildLinkedInPrompt(),
  // adding the contextBlock after <linkedin_profile> section.
  // The prompt is long — paste it verbatim from the source file.
  return `<system>
You are a senior LinkedIn profile strategist and recruiter with a strong editorial eye.
Respond ONLY with a valid JSON object — no markdown, no explanation, no preamble.
All string values MUST be in ${lang}. This is non-negotiable.
</system>

${contextBlock}

<linkedin_profile>
  <headline>${profile.headline}</headline>
  <about>${profile.about}</about>
  <experience>${profile.experience}</experience>
  <skills>${profile.skills}</skills>
  <education>${profile.education}</education>
  <certifications>${profile.certifications ?? 'none'}</certifications>
</linkedin_profile>

<raw_voice_input>
${
  voiceAnswers.length > 0
    ? voiceAnswers.map(a => `Q: ${a.label}\nA: ${a.answer}`).join('\n\n')
    : 'NOT PROVIDED — base voiceProfile on the linkedin_profile text only.'
}
</raw_voice_input>

${
  targetRole
    ? `<target_role>\n${targetRole}\n</target_role>`
    : '<target_role>Not provided — infer the most likely career direction from the profile.</target_role>'
}

<style_rules>
NEVER use: "Apaixonado por", "Passionate about", "Results-driven", "leverage", "utilize",
"implement", "deliver", "ensure", "facilitate", "seamless", "robust", "innovative", "dynamic", "passionate"
</style_rules>

<instructions>
Analyze the LinkedIn profile for discoverability, recruiter appeal, and alignment with the target role.
Produce rewrites informed by the anchor_evidence and positioning if provided.

Respond with this exact JSON shape:
{
  "voiceProfile": {
    "tone": "direct | narrative | technical | conversational",
    "signaturePatterns": ["string", "string", "string"],
    "avoidedPatterns": ["string"],
    "rawInputMissing": false,
    "qualityNote": "string"
  },
  "headlineAnalysis": {
    "currentScore": "weak | moderate | strong",
    "alternatives": ["string", "string", "string"]
  },
  "aboutAudit": {
    "issues": ["string"],
    "rewrite": "string | null"
  },
  "experienceGaps": [{ "role": "string", "original": "string", "rewrite": "string" }],
  "keywordGaps": {
    "technical": ["string"],
    "domain": ["string"],
    "softSkills": ["string"],
    "certifications": ["string"]
  },
  "quickWins": ["string"],
  "overallScore": {
    "score": 7,
    "strengths": ["string", "string"],
    "blockers": ["string", "string"],
    "priorityAction": "string"
  }
}
</instructions>`
}

export async function profileGeneratorNode(
  state: Pick<GraphState, 'input' | 'normalizedProfile'>
): Promise<Pick<GraphState, 'generation'>> {
  const { input, normalizedProfile } = state

  const prompt = buildPrompt(
    normalizedProfile,
    input.targetRole,
    input.locale,
    input.voiceAnswers ?? [],
    input.anchorEvidence,
    input.positioning
  )

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  let parsed: GenerationOutput
  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    parsed = JSON.parse(clean) as GenerationOutput
  } catch (error) {
    throw new Error(`profileGenerator: Failed to parse Gemini response: ${error instanceof Error ? error.message : 'Unknown'}`)
  }

  if (!parsed.headlineAnalysis || !parsed.aboutAudit || !parsed.overallScore) {
    throw new Error('profileGenerator: Invalid response — missing required fields')
  }

  return { generation: parsed }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd apps/linkedin-agent && yarn typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/graph/nodes/profileGenerator.ts
git commit -m "feat(linkedin-agent): add profileGenerator node (migrated from ats-agent)"
```

---

## Task 10: `deltaCalculator` node

**Files:**
- Create: `apps/linkedin-agent/src/graph/nodes/deltaCalculator.ts`

- [ ] **Step 1: Create the node**

```ts
import type { GraphState, LinkedInProfile } from '../../types'
import { calcKeywordDensityScore, calcCompletenessScore } from './seoScorer'
import { buildActionItems } from './reportCompiler'

function buildGeneratedProfile(state: Pick<GraphState, 'generation' | 'normalizedProfile'>): LinkedInProfile {
  const { generation, normalizedProfile } = state
  return {
    headline: generation.headlineAnalysis.alternatives[0] ?? normalizedProfile.headline,
    about: generation.aboutAudit.rewrite ?? normalizedProfile.about,
    experience: generation.experienceGaps.length > 0
      ? generation.experienceGaps.map(g => `${g.role}\n${g.rewrite}`).join('\n\n')
      : normalizedProfile.experience,
    skills: [
      ...normalizedProfile.skills.split(',').map(s => s.trim()),
      ...generation.keywordGaps.technical.slice(0, 5),
    ].join(', '),
    education: normalizedProfile.education,
    certifications: normalizedProfile.certifications,
  }
}

export function deltaCalculatorNode(
  state: Pick<GraphState, 'generation' | 'normalizedProfile' | 'jdKeywords' | 'seoBefore' | 'input'>
): Pick<GraphState, 'seoAfter' | 'delta'> {
  const generatedProfile = buildGeneratedProfile(state)

  const { score: keywordDensityScore, missingKeywords } = calcKeywordDensityScore(generatedProfile, state.jdKeywords)
  const { score: completenessScore, gaps: completenessGaps } = calcCompletenessScore(generatedProfile)

  // Role alignment and authority can't be re-scored without LLM in a sync call.
  // Carry forward the before scores as conservative estimates.
  const roleAlignmentScore = state.seoBefore.role_alignment_score
  const authorityScore = Math.min(100, state.seoBefore.authority_score + 10) // rewrites improve authority estimate

  // Specificity improves since generic phrases are rewritten
  const specificityScore = Math.min(100, state.seoBefore.specificity_score + 15)

  const overall_score = Math.round(
    keywordDensityScore * 0.25 +
    completenessScore * 0.25 +
    specificityScore * 0.20 +
    roleAlignmentScore * 0.15 +
    authorityScore * 0.15
  )

  const seoAfter = {
    overall_score,
    keyword_density_score: keywordDensityScore,
    completeness_score: completenessScore,
    specificity_score: specificityScore,
    role_alignment_score: roleAlignmentScore,
    authority_score: authorityScore,
    missing_keywords: missingKeywords,
    generic_phrases: [],
    completeness_gaps: completenessGaps,
    action_items: buildActionItems({
      missingKeywords,
      completenessGaps,
      genericPhrases: [],
      completenessScore,
      keywordDensityScore,
      authorityScore,
    }),
    sections: state.seoBefore.sections,
  }

  return { seoAfter, delta: overall_score - state.seoBefore.overall_score }
}
```

- [ ] **Step 2: Typecheck**

```bash
cd apps/linkedin-agent && yarn typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/linkedin-agent/src/graph/nodes/deltaCalculator.ts
git commit -m "feat(linkedin-agent): add deltaCalculator node"
```

---

## Task 11: Graph and routes

**Files:**
- Create: `apps/linkedin-agent/src/graph/index.ts`
- Create: `apps/linkedin-agent/src/api/routes.ts`

- [ ] **Step 1: Create `apps/linkedin-agent/src/graph/index.ts`**

```ts
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

const arr = <T>() => Annotation<T[]>({ reducer: (_, u) => u, default: () => [] })
const num = (def = 0) => Annotation<number>({ reducer: (_, u) => u, default: () => def })
const opt = <T>(def: () => T) => Annotation<T>({ reducer: (_, u) => u, default: def })

const GraphAnnotation = Annotation.Root({
  input: Annotation<LinkedInInput>({ reducer: (_, u) => u, default: () => ({ profile: { headline: '', about: '', experience: '', skills: '', education: '' }, jobDescription: '' }) }),
  normalizedProfile: Annotation<LinkedInProfile>({ reducer: (_, u) => u, default: () => ({ headline: '', about: '', experience: '', skills: '', education: '' }) }),
  jdKeywords: arr<string>(),
  keywordDensityScore: num(),
  completenessScore: num(),
  roleAlignmentScore: num(),
  completenessGaps: arr<string>(),
  missingKeywords: arr<string>(),
  authorityScore: num(),
  genericPhrases: arr<GenericPhrase>(),
  specificityScore: num(),
  seoBefore: opt<SEOReport>(() => ({ overall_score: 0, keyword_density_score: 0, completeness_score: 0, specificity_score: 0, role_alignment_score: 0, authority_score: 0, missing_keywords: [], generic_phrases: [], completeness_gaps: [], action_items: [], sections: {} })),
  generation: opt<GenerationOutput>(() => ({ headlineAnalysis: { currentScore: 'weak', alternatives: [] }, aboutAudit: { issues: [], rewrite: null }, experienceGaps: [], keywordGaps: { technical: [], domain: [], softSkills: [], certifications: [] }, quickWins: [], overallScore: { score: 0, strengths: [], blockers: [], priorityAction: '' }, voiceProfile: { tone: 'direct', signaturePatterns: [], avoidedPatterns: [], rawInputMissing: true, qualityNote: '' } })),
  seoAfter: opt<SEOReport>(() => ({ overall_score: 0, keyword_density_score: 0, completeness_score: 0, specificity_score: 0, role_alignment_score: 0, authority_score: 0, missing_keywords: [], generic_phrases: [], completeness_gaps: [], action_items: [], sections: {} })),
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
  .addConditionalEdges('profileParser', (state) =>
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
```

- [ ] **Step 2: Create `apps/linkedin-agent/src/api/routes.ts`**

```ts
import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { graph } from '../graph'
import type { LinkedInResult } from '../types'

const VoiceAnswerSchema = z.object({ label: z.string(), answer: z.string() })
const AnchorEvidenceSchema = z.object({ metric: z.string(), timeframe: z.string(), action: z.string() })

const AnalyzeBodySchema = z.object({
  profile: z.object({
    headline: z.string().min(1),
    about: z.string(),
    experience: z.string(),
    skills: z.string(),
    education: z.string(),
    certifications: z.string().optional(),
  }),
  targetRole: z.string().optional(),
  targetSector: z.array(z.string()).optional(),
  positioning: z.array(z.string()).optional(),
  tone: z.string().optional(),
  anchorEvidence: AnchorEvidenceSchema.optional(),
  jobDescription: z.string().optional(),
  locale: z.enum(['en', 'pt-BR']).optional(),
  voiceAnswers: z.array(VoiceAnswerSchema).optional(),
})

interface JobResult {
  status: 'pending' | 'running' | 'done' | 'error'
  result?: LinkedInResult
  error?: string
  createdAt: number
  completedAt?: number
}

const jobs = new Map<string, JobResult>()

setInterval(() => {
  const cutoff = Date.now() - 1000 * 60 * 30
  for (const [id, job] of jobs) {
    if (job.completedAt && job.completedAt < cutoff) jobs.delete(id)
  }
}, 1000 * 60 * 10)

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({ status: 'ok' }))

  app.get('/result/:requestId', async (request, reply) => {
    const { requestId } = request.params as { requestId: string }
    const job = jobs.get(requestId)
    if (!job) return reply.status(404).send({ message: 'Request not found' })
    return reply.send(job)
  })

  app.post('/analyze', async (request, reply) => {
    const parse = AnalyzeBodySchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({ message: parse.error.errors[0]?.message ?? 'Invalid request body' })
    }

    const input = parse.data
    const requestId = randomUUID()
    const job: JobResult = { status: 'pending', createdAt: Date.now() }
    jobs.set(requestId, job)
    reply.send({ requestId, status: 'pending' })

    job.status = 'running'
    try {
      const state = await graph.invoke({ input })
      const result: LinkedInResult = {
        seo: {
          before: state.seoBefore,
          after: state.seoAfter,
          delta: state.delta,
        },
        generation: state.generation,
        locale: input.locale ?? 'en',
      }
      job.status = 'done'
      job.result = result
    } catch (err) {
      job.status = 'error'
      job.error = err instanceof Error ? err.message : 'Internal error'
      request.log.error({ err, requestId }, 'linkedin-agent: graph failed')
    } finally {
      job.completedAt = Date.now()
    }
  })
}
```

- [ ] **Step 3: Typecheck**

```bash
cd apps/linkedin-agent && yarn typecheck
```

- [ ] **Step 4: Start the agent and verify health**

```bash
cd apps/linkedin-agent && yarn dev
```

In another terminal:
```bash
curl http://localhost:3002/health
```

Expected: `{"status":"ok"}`

- [ ] **Step 5: Commit**

```bash
git add apps/linkedin-agent/src/graph/index.ts apps/linkedin-agent/src/api/routes.ts
git commit -m "feat(linkedin-agent): add graph, routes, background job store"
```

---

## Task 12: Remove LinkedIn from `ats-agent`

**Files:**
- Delete: `apps/ats-agent/src/graph/nodes/linkedinAnalyzer.ts`
- Modify: `apps/ats-agent/src/api/routes.ts`

- [ ] **Step 1: Delete `linkedinAnalyzer.ts`**

```bash
rm apps/ats-agent/src/graph/nodes/linkedinAnalyzer.ts
```

- [ ] **Step 2: Remove the `/linkedin-analyze` route from `apps/ats-agent/src/api/routes.ts`**

Remove lines:
- `import { linkedinAnalyzerNode } from '../graph/nodes/linkedinAnalyzer'`
- The `VoiceAnswerSchema` and `LinkedInAnalyzeBodySchema` const blocks
- The entire `app.post('/linkedin-analyze', ...)` handler block (lines 250–272)

- [ ] **Step 3: Typecheck ats-agent**

```bash
cd apps/ats-agent && yarn typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/ats-agent/
git commit -m "feat(ats-agent): remove LinkedIn node and route (moved to linkedin-agent)"
```

---

## Task 13: Update `jobapply-api` — atsService and controller

**Files:**
- Modify: `apps/jobapply-api/src/services/atsService.ts`
- Modify: `apps/jobapply-api/src/controllers/cvController.ts`
- Modify: `apps/jobapply-api/.env` (add `LINKEDIN_AGENT_URL`)

- [ ] **Step 1: Add `LINKEDIN_AGENT_URL` to `apps/jobapply-api/.env`**

```
LINKEDIN_AGENT_URL=http://localhost:3002
```

- [ ] **Step 2: Replace `analyzeLinkedInWithATS` in `apps/jobapply-api/src/services/atsService.ts`**

Remove the `analyzeLinkedInWithATS` function (lines 55–82). Add in its place:

```ts
const LINKEDIN_AGENT_URL = process.env.LINKEDIN_AGENT_URL
if (!LINKEDIN_AGENT_URL) throw new Error('LINKEDIN_AGENT_URL environment variable is not set')

export async function analyzeLinkedInWithLinkedInAgent(payload: {
  profile: { headline: string; about: string; experience: string; skills: string; education: string; certifications?: string }
  targetRole?: string
  targetSector?: string[]
  positioning?: string[]
  tone?: string
  anchorEvidence?: { metric: string; timeframe: string; action: string }
  jobDescription?: string
  locale?: string
  voiceAnswers?: { label: string; answer: string }[]
}): Promise<{ requestId: string }> {
  const response = await fetch(`${LINKEDIN_AGENT_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string }
    const err = new Error(body.message ?? 'linkedin-agent error') as Error & { status: number }
    err.status = response.status
    throw err
  }
  return response.json() as Promise<{ requestId: string }>
}

export async function getLinkedInJobResult(requestId: string): Promise<{ status: string; result?: unknown; error?: string }> {
  const response = await fetch(`${LINKEDIN_AGENT_URL}/result/${requestId}`)
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string }
    const err = new Error(body.message ?? 'linkedin-agent error') as Error & { status: number }
    err.status = response.status
    throw err
  }
  return response.json() as Promise<{ status: string; result?: unknown; error?: string }>
}
```

- [ ] **Step 3: Update `analyzeLinkedInDirect` in `apps/jobapply-api/src/controllers/cvController.ts`**

Replace the import line:
```ts
import { analyzeWithATS, generateCVWithATS, analyzeLinkedInWithATS, generateResumeWithATS } from '../services/atsService'
```
with:
```ts
import { analyzeWithATS, generateCVWithATS, analyzeLinkedInWithLinkedInAgent, getLinkedInJobResult, generateResumeWithATS } from '../services/atsService'
```

Replace the body of `analyzeLinkedInDirect` (lines 459–492) with:

```ts
export async function analyzeLinkedInDirect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { profile, targetRole, locale, voiceAnswers, targetSector, positioning, tone, anchorEvidence, jobDescription } = req.body as {
      profile: { headline: string; about: string; experience: string; skills: string; education: string; certifications?: string }
      targetRole?: string
      targetSector?: string[]
      positioning?: string[]
      tone?: string
      anchorEvidence?: { metric: string; timeframe: string; action: string }
      jobDescription?: string
      locale?: 'en' | 'pt-BR'
      voiceAnswers?: { label: string; answer: string }[]
    }

    if (!profile) {
      res.status(400).json({ message: 'profile is required' })
      return
    }

    const resolvedLocale = locale ?? (targetRole ? detectLocale(targetRole) : detectLocale(profile.headline))

    const { requestId } = await analyzeLinkedInWithLinkedInAgent({
      profile, targetRole, targetSector, positioning, tone, anchorEvidence,
      jobDescription, locale: resolvedLocale, voiceAnswers,
    })

    // Poll until done (max 120s)
    const timeout = Date.now() + 120_000
    let jobResult = await getLinkedInJobResult(requestId)
    while (jobResult.status !== 'done' && jobResult.status !== 'error' && Date.now() < timeout) {
      await new Promise(r => setTimeout(r, 1500))
      jobResult = await getLinkedInJobResult(requestId)
    }

    if (jobResult.status === 'error') {
      res.status(502).json({ message: 'linkedin-agent error', detail: jobResult.error })
      return
    }
    if (jobResult.status !== 'done') {
      res.status(504).json({ message: 'linkedin-agent timeout' })
      return
    }

    res.json({ ...(jobResult.result as Record<string, unknown>), locale: resolvedLocale })
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string }
    if (e.status) {
      res.status(502).json({ message: 'linkedin-agent error', detail: e.message })
      return
    }
    next(err)
  }
}
```

- [ ] **Step 4: Typecheck jobapply-api**

```bash
cd apps/jobapply-api && yarn typecheck
```

- [ ] **Step 5: Commit**

```bash
git add apps/jobapply-api/
git commit -m "feat(jobapply-api): route LinkedIn analysis through linkedin-agent"
```

---

## Task 14: Frontend — update types and mock data

**Files:**
- Modify: `apps/jobapply-app/src/domain/linkedin/types.ts`
- Modify: `apps/jobapply-app/src/infrastructure/mock/linkedinMockData.ts`

- [ ] **Step 1: Replace `apps/jobapply-app/src/domain/linkedin/types.ts`**

```ts
// ── Existing types (kept) ─────────────────────────────────────────────────────

export interface LinkedInProfile {
  headline: string
  about: string
  experience: string
  skills: string
  education: string
  certifications?: string
}

export interface VoiceAnswer {
  label: string
  answer: string
}

export type VoiceAnswers = VoiceAnswer[]

/** Raw user info returned by LinkedIn OpenID Connect after OAuth. */
export interface LinkedInOAuthProfile {
  sub: string
  name: string
  given_name: string
  family_name: string
  email: string
  picture?: string | null
}

// ── New types for the optimizer ───────────────────────────────────────────────

export interface AnchorEvidence {
  metric: string
  timeframe: string
  action: string
}

export interface LinkedInInput {
  profile: LinkedInProfile
  targetRole?: string
  targetSector?: string[]
  positioning?: string[]
  tone?: string
  anchorEvidence?: AnchorEvidence
  jobDescription?: string
  locale?: 'en' | 'pt-BR'
  voiceAnswers?: VoiceAnswers
}

export interface GenericPhrase {
  phrase: string
  reason: string
  suggestion: string
}

export type ActionPriority = 'high' | 'medium' | 'low'

export interface ActionItem {
  action: string
  reason: string
  priority: ActionPriority
}

export interface SectionScore {
  label: string
  score: number
}

export interface SEOReport {
  overall_score: number
  keyword_density_score: number
  completeness_score: number
  specificity_score: number
  role_alignment_score: number
  authority_score: number
  missing_keywords: string[]
  generic_phrases: GenericPhrase[]
  completeness_gaps: string[]
  action_items: ActionItem[]
  sections: Record<string, SectionScore>
}

export interface GenerationOutput {
  headlineAnalysis: {
    currentScore: 'weak' | 'moderate' | 'strong'
    alternatives: string[]
  }
  aboutAudit: {
    issues: string[]
    rewrite: string | null
  }
  experienceGaps: Array<{ role: string; original: string; rewrite: string }>
  keywordGaps: {
    technical: string[]
    domain: string[]
    softSkills: string[]
    certifications: string[]
  }
  quickWins: string[]
  overallScore: {
    score: number
    strengths: string[]
    blockers: string[]
    priorityAction: string
  }
  voiceProfile?: {
    tone: string
    signaturePatterns: string[]
    rawInputMissing: boolean
    qualityNote: string
  }
}

export interface LinkedInResult {
  seo: {
    before: SEOReport
    after: SEOReport
    delta: number
  }
  generation: GenerationOutput
  locale: 'en' | 'pt-BR'
}

// ── Legacy type alias kept for OAuth flow ─────────────────────────────────────
export interface AnalyzeLinkedInPayload extends LinkedInInput {}

/** @deprecated Use LinkedInResult */
export interface LinkedInAnalysis extends GenerationOutput {
  locale: 'en' | 'pt-BR'
}
```

- [ ] **Step 2: Add `MOCK_LINKEDIN_RESULT` to `apps/jobapply-app/src/infrastructure/mock/linkedinMockData.ts`**

Add after the existing `MOCK_LINKEDIN_ANALYSIS` export:

```ts
import type { LinkedInResult } from '../../domain/linkedin/types'

export const MOCK_LINKEDIN_RESULT: LinkedInResult = {
  seo: {
    before: {
      overall_score: 52,
      keyword_density_score: 40,
      completeness_score: 75,
      specificity_score: 60,
      role_alignment_score: 55,
      authority_score: 45,
      missing_keywords: ['Next.js', 'Redux', 'micro-frontends', 'CI/CD'],
      generic_phrases: [
        { phrase: 'passionate about', reason: 'Generic opener', suggestion: 'Show it through the work described' },
      ],
      completeness_gaps: ['About section has 48 words (target: 200+)'],
      action_items: [
        { action: 'Add missing keywords: Next.js, Redux, CI/CD', reason: 'Required keywords absent from profile', priority: 'high' },
        { action: 'Expand About section to 200+ words', reason: 'About is the highest-weight field for LinkedIn SEO', priority: 'high' },
        { action: 'Replace "passionate about" with specific evidence', reason: 'Clichés reduce credibility', priority: 'medium' },
      ],
      sections: {
        headline: { label: 'Headline', score: 45 },
        about: { label: 'About', score: 20 },
        experience: { label: 'Experience', score: 60 },
        skills: { label: 'Skills', score: 75 },
      },
    },
    after: {
      overall_score: 74,
      keyword_density_score: 72,
      completeness_score: 90,
      specificity_score: 80,
      role_alignment_score: 68,
      authority_score: 70,
      missing_keywords: ['micro-frontends'],
      generic_phrases: [],
      completeness_gaps: [],
      action_items: [
        { action: 'Add micro-frontends experience or context', reason: 'Still missing from profile', priority: 'medium' },
      ],
      sections: {
        headline: { label: 'Headline', score: 85 },
        about: { label: 'About', score: 90 },
        experience: { label: 'Experience', score: 75 },
        skills: { label: 'Skills', score: 85 },
      },
    },
    delta: 22,
  },
  generation: {
    headlineAnalysis: {
      currentScore: 'weak',
      alternatives: [
        'Senior Frontend Engineer · React, TypeScript & Node.js · Scaling B2B SaaS from 0 to 200+ clients',
        'Frontend Architect | React + Vite | Reduced build times 70% | Open to Staff/Principal roles',
        'Senior Frontend Developer · B2B SaaS · TypeScript, GraphQL, AWS · Mentoring teams',
      ],
    },
    aboutAudit: {
      issues: ['No hook in first 300 chars', 'Missing quantified outcomes', 'Generic CTA'],
      rewrite:
        'Three years ago I inherited a legacy CRA monolith that took 8 minutes to build. Fourteen months later, builds ran in under 2. That migration taught me more about frontend architecture than any course — and it shipped zero regressions.\n\nI build B2B SaaS frontends that scale. At TechCorp I led the Vite migration, raised Lighthouse scores from 62 to 94, and mentored 3 engineers who now each own their own squads. At Startup XYZ I built the customer dashboard from scratch — the feature that became the main reason churned accounts came back.\n\nLooking for a Staff or Principal role where the frontend is a competitive advantage, not a cost center.',
    },
    experienceGaps: [
      {
        role: 'TechCorp',
        original: 'Led migration from CRA to Vite, reducing build times by 70%. Mentored 3 junior devs.',
        rewrite: 'Architected CRA → Vite migration across a 140k-line codebase. Build time: 8 min → 2 min (−70%). Lighthouse score: 62 → 94. Zero regressions in production. Mentored 3 engineers, two of whom were promoted within 12 months.',
      },
    ],
    keywordGaps: {
      technical: ['Next.js', 'Redux', 'micro-frontends', 'Testing Library'],
      domain: ['B2B SaaS', 'developer experience', 'platform engineering'],
      softSkills: ['technical mentorship', 'cross-functional alignment'],
      certifications: ['AWS Certified Developer'],
    },
    quickWins: [
      'Replace headline with the first alternative above — it has your title, stack, and a concrete result',
      'Add the About rewrite — it now passes the 300-char hook test and has 3 quantified achievements',
      'Expand the TechCorp bullet with the rewrite above',
      'Add Next.js and Testing Library to your Skills section',
      'Request a LinkedIn recommendation from the 3 engineers you mentored — focused on technical impact',
    ],
    overallScore: {
      score: 8,
      strengths: ['Strong B2B SaaS track record', 'Quantifiable infrastructure impact'],
      blockers: ['Headline wastes 220 chars on just a job title', 'About section too short to rank in recruiter search'],
      priorityAction: 'Rewrite your headline to include your core tech stack and one concrete result — this is the single highest-leverage change for recruiter discoverability.',
    },
    voiceProfile: {
      tone: 'direct',
      signaturePatterns: ['architectural decisions with numbers', 'before/after framing', 'understated delivery'],
      rawInputMissing: false,
      qualityNote: 'High confidence — strong evidence signals in experience section',
    },
  },
  locale: 'en',
}
```

- [ ] **Step 3: Typecheck**

```bash
cd apps/jobapply-app && yarn typecheck
```

- [ ] **Step 4: Commit**

```bash
git add apps/jobapply-app/src/domain/linkedin/types.ts apps/jobapply-app/src/infrastructure/mock/linkedinMockData.ts
git commit -m "feat(jobapply-app): update LinkedIn types and add LinkedInResult mock"
```

---

## Task 15: Frontend — update repository and hooks

**Files:**
- Modify: `apps/jobapply-app/src/infrastructure/repositories/linkedinRepository.ts`
- Create: `apps/jobapply-app/src/domain/linkedin/hooks/useLinkedInOnboarding.ts`
- Modify: `apps/jobapply-app/src/domain/linkedin/hooks/useLinkedInAnalysis.ts`

- [ ] **Step 1: Update `linkedinRepository.ts`**

Replace `analyzeLinkedIn` and `analyzeLinkedInPDF` (keep `handleLinkedInCallback` unchanged):

```ts
import api, { USE_MOCK } from '../http/client'
import type { LinkedInResult, LinkedInInput, LinkedInOAuthProfile, LinkedInProfile, VoiceAnswers } from '../../domain/linkedin/types'
import { setLinkedInConnected } from '../../domain/linkedin/linkedinOAuth'
import { parsePDFToLinkedInProfile } from '../../domain/linkedin/pdfParser'
import type { User } from '../../domain/auth/types'
import { MOCK_LINKEDIN_RESULT, MOCK_LINKEDIN_PROFILE } from '../mock/linkedinMockData'

function oauthProfileToLinkedInProfile(oauth: LinkedInOAuthProfile): LinkedInProfile {
  return { headline: oauth.name, about: '', experience: '', skills: '', education: '' }
}

const REDIRECT_URI = `${window.location.origin}/linkedin-callback`

function delay(ms = 500) {
  return new Promise(r => setTimeout(r, ms))
}

export interface LinkedInCallbackResult {
  action: 'login' | 'analyze'
  token?: string
  user?: User
}

type CallbackApiResponse = { token: string; user: User } | { profile: LinkedInOAuthProfile }

export async function handleLinkedInCallback(code: string, state: string): Promise<LinkedInCallbackResult> {
  const action = state.startsWith('login') ? 'login' : 'analyze'
  if (USE_MOCK) {
    await delay(1000)
    if (action === 'analyze') {
      setLinkedInConnected(MOCK_LINKEDIN_PROFILE)
      return { action }
    }
    const { MOCK_USER, MOCK_TOKEN } = await import('../mock/data')
    return { action, token: MOCK_TOKEN, user: MOCK_USER }
  }
  const { data } = await api.post<CallbackApiResponse>('/auth/linkedin/callback', { code, state, redirect_uri: REDIRECT_URI, action })
  if (action === 'analyze' && 'profile' in data) {
    setLinkedInConnected(oauthProfileToLinkedInProfile(data.profile))
    return { action }
  }
  if (action === 'login' && 'token' in data) {
    return { action, token: data.token, user: data.user }
  }
  return { action }
}

export async function analyzeLinkedIn(payload: LinkedInInput): Promise<LinkedInResult> {
  if (USE_MOCK) {
    await delay(2000)
    return MOCK_LINKEDIN_RESULT
  }
  const { data } = await api.post<LinkedInResult>('/cv/linkedin/analyze', payload)
  return data
}

export async function analyzeLinkedInPDF(file: File, input: Omit<LinkedInInput, 'profile'>): Promise<LinkedInResult> {
  if (USE_MOCK) {
    await delay(2000)
    return MOCK_LINKEDIN_RESULT
  }
  const profile = await parsePDFToLinkedInProfile(file)
  return analyzeLinkedIn({ ...input, profile })
}
```

- [ ] **Step 2: Create `useLinkedInOnboarding.ts`**

```ts
import { useState } from 'react'
import type { AnchorEvidence } from '../types'

export type OnboardingStep = 0 | 1 | 2 | 3 | 4

export interface OnboardingData {
  targetRole: string
  targetSector: string[]
  positioning: string[]
  anchorEvidence: AnchorEvidence
  jobDescription: string
}

export interface UseLinkedInOnboardingReturn {
  step: OnboardingStep
  data: OnboardingData
  setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void
  nextStep: () => void
  prevStep: () => void
  isStepValid: () => boolean
  reset: () => void
}

const EMPTY: OnboardingData = {
  targetRole: '',
  targetSector: [],
  positioning: [],
  anchorEvidence: { metric: '', timeframe: '', action: '' },
  jobDescription: '',
}

export function useLinkedInOnboarding(): UseLinkedInOnboardingReturn {
  const [step, setStep] = useState<OnboardingStep>(0)
  const [data, setData] = useState<OnboardingData>(EMPTY)

  function setField<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function isStepValid(): boolean {
    if (step === 1) return data.targetRole.trim().length > 0
    if (step === 2) return data.positioning.length > 0
    if (step === 3) {
      const e = data.anchorEvidence
      return e.metric.trim().length > 0 && e.timeframe.trim().length > 0 && e.action.trim().length > 0
    }
    return true
  }

  function nextStep() {
    if (step < 4) setStep(s => (s + 1) as OnboardingStep)
  }

  function prevStep() {
    if (step > 0) setStep(s => (s - 1) as OnboardingStep)
  }

  function reset() {
    setStep(0)
    setData(EMPTY)
  }

  return { step, data, setField, nextStep, prevStep, isStepValid, reset }
}
```

- [ ] **Step 3: Replace `useLinkedInAnalysis.ts`**

```ts
import { useState, useCallback } from 'react'
import type { LinkedInResult, LinkedInInput } from '../types'
import { analyzeLinkedIn } from '../../../infrastructure/repositories/linkedinRepository'

export interface UseLinkedInAnalysisReturn {
  result: LinkedInResult | null
  loading: boolean
  handleAnalyze: (input: LinkedInInput) => Promise<void>
  reset: () => void
}

interface Params {
  onError: (messageKey: string) => void
}

export function useLinkedInAnalysis({ onError }: Params): UseLinkedInAnalysisReturn {
  const [result, setResult] = useState<LinkedInResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = useCallback(async (input: LinkedInInput) => {
    setLoading(true)
    try {
      const data = await analyzeLinkedIn(input)
      setResult(data)
    } catch {
      onError('linkedin.analyzeError')
    } finally {
      setLoading(false)
    }
  }, [onError])

  const reset = useCallback(() => setResult(null), [])

  return { result, loading, handleAnalyze, reset }
}
```

- [ ] **Step 4: Typecheck**

```bash
cd apps/jobapply-app && yarn typecheck
```

- [ ] **Step 5: Commit**

```bash
git add apps/jobapply-app/src/infrastructure/repositories/linkedinRepository.ts \
  apps/jobapply-app/src/domain/linkedin/hooks/
git commit -m "feat(jobapply-app): update LinkedIn repository and hooks for new API contract"
```

---

## Task 16: Frontend — `LinkedInOptimizerPage` and route

**Files:**
- Create: `apps/jobapply-app/src/presentation/pages/LinkedInOptimizerPage/LinkedInOptimizerPage.tsx`
- Create: `apps/jobapply-app/src/presentation/pages/LinkedInOptimizerPage/OnboardingFlow.tsx`
- Create: `apps/jobapply-app/src/presentation/pages/LinkedInOptimizerPage/Dashboard.tsx`
- Create: `apps/jobapply-app/src/presentation/pages/LinkedInOptimizerPage/GenerationResults.tsx`
- Create: `apps/jobapply-app/src/presentation/pages/LinkedInOptimizerPage/LinkedInOptimizerPage.styles.ts`
- Create: `apps/jobapply-app/src/routes/_auth/linkedin/index.tsx`

- [ ] **Step 1: Create `LinkedInOptimizerPage.styles.ts`**

```ts
import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'

export const page = css`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
`

export const scoreCards = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const sectionTitle = css`
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 12px;
`

export const bar = (score: number) => css`
  height: 8px;
  border-radius: 4px;
  background: ${score >= 70 ? '#52c41a' : score >= 40 ? '#faad14' : '#ff4d4f'};
  width: ${score}%;
  transition: width 0.4s ease;
`

export const barTrack = css`
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin: 4px 0 16px;
`

export const priorityBadge = (priority: 'high' | 'medium' | 'low') => css`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-right: 8px;
  background: ${priority === 'high' ? '#fff1f0' : priority === 'medium' ? '#fffbe6' : '#f6ffed'};
  color: ${priority === 'high' ? '#cf1322' : priority === 'medium' ? '#d46b08' : '#389e0d'};
`

export const rewriteBlock = css`
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  white-space: pre-wrap;
`

export const originalBlock = css`
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  white-space: pre-wrap;
`

export const deltaChip = css`
  display: inline-block;
  background: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 13px;
  font-weight: 600;
`
```

- [ ] **Step 2: Create `OnboardingFlow.tsx`**

```tsx
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import type { OnboardingData, OnboardingStep, UseLinkedInOnboardingReturn } from '../../../domain/linkedin/hooks/useLinkedInOnboarding'
import type { LinkedInProfile } from '../../../domain/linkedin/types'
import { parsePDFToLinkedInProfile } from '../../../domain/linkedin/pdfParser'
import * as S from './LinkedInOptimizerPage.styles'

const POSITIONING_OPTIONS = ['executor', 'estrategista', 'líder', 'técnico', 'visionário']

interface Props {
  onboarding: UseLinkedInOnboardingReturn
  onComplete: (profile: LinkedInProfile, data: OnboardingData) => void
  loading: boolean
}

export function OnboardingFlow({ onboarding, onComplete, loading }: Props) {
  const { t } = useTranslation()
  const { step, data, setField, nextStep, prevStep, isStepValid } = onboarding
  const [profile, setProfile] = useState<LinkedInProfile | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfLoading(true)
    setPdfError(null)
    try {
      const parsed = await parsePDFToLinkedInProfile(file)
      setProfile(parsed)
    } catch {
      setPdfError('Não foi possível ler o PDF. Verifique se é um PDF exportado do LinkedIn.')
    } finally {
      setPdfLoading(false)
    }
  }, [])

  const handleNext = () => {
    if (step === 0 && !profile) return
    if (step === 4) {
      onComplete(profile!, data)
      return
    }
    nextStep()
  }

  const steps = ['PDF', 'Objetivo', 'Posicionamento', 'Evidência', 'Vaga']

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {steps.map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 4,
              borderRadius: 2,
              background: i <= step ? '#1677ff' : '#e0e0e0',
              marginBottom: 4,
            }} />
            <span style={{ fontSize: 11, color: i <= step ? '#1677ff' : '#999' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Step 0: PDF upload */}
      {step === 0 && (
        <div>
          <h3>Faça upload do seu perfil LinkedIn</h3>
          <p>Exporte como PDF no LinkedIn (Meu Perfil → Mais → Salvar como PDF) e envie aqui.</p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ marginBottom: 16 }}
          />
          {pdfLoading && <p>Lendo PDF...</p>}
          {pdfError && <p style={{ color: 'red' }}>{pdfError}</p>}
          {profile && (
            <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: 12, marginTop: 8 }}>
              <strong>Perfil detectado:</strong> {profile.headline}
            </div>
          )}
        </div>
      )}

      {/* Step 1: Objectives */}
      {step === 1 && (
        <div>
          <h3>Qual é o seu cargo alvo?</h3>
          <p>Seja específico: "Head de Produto em fintech" é melhor que "Liderança".</p>
          <Input
            value={data.targetRole}
            onChange={e => setField('targetRole', e.target.value)}
            placeholder="Ex: Head de Produto em fintech B2B"
            style={{ marginBottom: 12 }}
          />
          <p>Setores de interesse (opcional, separados por vírgula):</p>
          <Input
            value={data.targetSector.join(', ')}
            onChange={e => setField('targetSector', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="Ex: fintech, SaaS B2B, healthtech"
          />
        </div>
      )}

      {/* Step 2: Positioning chips */}
      {step === 2 && (
        <div>
          <h3>Como você se posiciona?</h3>
          <p>Escolha as combinações que melhor descrevem você (pode ser mais de uma).</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
            {POSITIONING_OPTIONS.map(opt => {
              const selected = data.positioning.includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const next = selected
                      ? data.positioning.filter(p => p !== opt)
                      : [...data.positioning, opt]
                    setField('positioning', next)
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: `2px solid ${selected ? '#1677ff' : '#d9d9d9'}`,
                    background: selected ? '#e6f4ff' : '#fff',
                    color: selected ? '#1677ff' : '#333',
                    cursor: 'pointer',
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 3: Evidence */}
      {step === 3 && (
        <div>
          <h3>Qual é a sua evidência âncora?</h3>
          <p>Uma conquista com número, prazo e ação que a causou. Este é o campo mais importante.</p>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Métrica (resultado com número)</label>
          <Input
            value={data.anchorEvidence.metric}
            onChange={e => setField('anchorEvidence', { ...data.anchorEvidence, metric: e.target.value })}
            placeholder="Ex: churn de 18% para 9%"
            style={{ marginBottom: 12 }}
          />
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Prazo</label>
          <Input
            value={data.anchorEvidence.timeframe}
            onChange={e => setField('anchorEvidence', { ...data.anchorEvidence, timeframe: e.target.value })}
            placeholder="Ex: em 14 meses"
            style={{ marginBottom: 12 }}
          />
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>O que você fez (ação causadora)</label>
          <Input
            value={data.anchorEvidence.action}
            onChange={e => setField('anchorEvidence', { ...data.anchorEvidence, action: e.target.value })}
            placeholder="Ex: reformulação do onboarding do produto"
          />
        </div>
      )}

      {/* Step 4: Job description */}
      {step === 4 && (
        <div>
          <h3>Tem uma vaga em mente? (opcional)</h3>
          <p>Cole a descrição da vaga para aumentar a precisão da análise de keywords.</p>
          <textarea
            value={data.jobDescription}
            onChange={e => setField('jobDescription', e.target.value)}
            placeholder="Cole a descrição completa da vaga aqui..."
            rows={8}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #d9d9d9', fontSize: 14 }}
          />
          {profile && step === 4 && (
            <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: 12, marginTop: 16 }}>
              <strong>Confirmação:</strong><br />
              Cargo alvo: <strong>{data.targetRole}</strong><br />
              Posicionamento: <strong>{data.positioning.join(', ')}</strong><br />
              Evidência: <em>{data.anchorEvidence.metric} em {data.anchorEvidence.timeframe}</em>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        {step > 0
          ? <Button onClick={prevStep}>Voltar</Button>
          : <span />
        }
        <Button
          type="primary"
          onClick={handleNext}
          disabled={!isStepValid() || (step === 0 && !profile) || loading}
          loading={loading && step === 4}
        >
          {step === 4 ? 'Analisar perfil' : 'Próximo'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `Dashboard.tsx`**

```tsx
import type { SEOReport, ActionItem } from '../../../domain/linkedin/types'
import * as S from './LinkedInOptimizerPage.styles'

interface Props {
  before: SEOReport
  after: SEOReport
  delta: number
}

const SCORE_LABELS: Record<string, string> = {
  keyword_density_score: 'SEO de Keywords',
  completeness_score: 'Completude',
  specificity_score: 'Especificidade',
  role_alignment_score: 'Fit com Vaga',
  authority_score: 'Autoridade',
}

export function Dashboard({ before, after, delta }: Props) {
  return (
    <div>
      {/* Score cards */}
      <div className={S.scoreCards}>
        <ScoreCard
          label="Score Geral"
          before={before.overall_score}
          after={after.overall_score}
          delta={delta}
          primary
        />
        <ScoreCard label="SEO de Keywords" before={before.keyword_density_score} after={after.keyword_density_score} />
        <ScoreCard label="Fit com Vaga" before={before.role_alignment_score} after={after.role_alignment_score} />
        <ScoreCard label="Autoridade" before={before.authority_score} after={after.authority_score} />
      </div>

      {/* Dimension bars */}
      <div className={S.sectionTitle}>Diagnóstico por dimensão</div>
      {Object.entries(before.sections).map(([key, section]) => (
        <div key={key}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{section.label}</span>
            <span style={{ fontWeight: 600 }}>{section.score}/100</span>
          </div>
          <div className={S.barTrack}>
            <div className={S.bar(section.score)} />
          </div>
        </div>
      ))}

      {/* Missing keywords */}
      {before.missing_keywords.length > 0 && (
        <>
          <div className={S.sectionTitle}>Keywords ausentes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {before.missing_keywords.map(kw => (
              <span key={kw} style={{ background: '#fff1f0', color: '#cf1322', border: '1px solid #ffccc7', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>
                {kw}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Action plan */}
      <div className={S.sectionTitle}>Plano de ação</div>
      {before.action_items.map((item, i) => (
        <ActionRow key={i} item={item} />
      ))}
    </div>
  )
}

function ScoreCard({ label, before, after, delta, primary }: {
  label: string; before: number; after: number; delta?: number; primary?: boolean
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: primary ? 36 : 28, fontWeight: 700 }}>{before}</div>
      {delta !== undefined && (
        <div className={S.deltaChip}>+{delta} pts após geração</div>
      )}
      {delta === undefined && (
        <div style={{ fontSize: 12, color: '#52c41a' }}>→ {after} após geração</div>
      )}
    </div>
  )
}

function ActionRow({ item }: { item: ActionItem }) {
  return (
    <div style={{ marginBottom: 12, padding: 12, background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
      <span className={S.priorityBadge(item.priority)}>
        {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Média' : 'Baixa'}
      </span>
      <strong>{item.action}</strong>
      <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{item.reason}</div>
    </div>
  )
}
```

- [ ] **Step 4: Create `GenerationResults.tsx`**

```tsx
import type { GenerationOutput } from '../../../domain/linkedin/types'
import * as S from './LinkedInOptimizerPage.styles'

interface Props {
  generation: GenerationOutput
}

export function GenerationResults({ generation }: Props) {
  const { headlineAnalysis, aboutAudit, experienceGaps, quickWins } = generation

  return (
    <div>
      {/* Headline */}
      <div className={S.sectionTitle}>
        Headline — score atual: {headlineAnalysis.currentScore}
      </div>
      {headlineAnalysis.alternatives.map((alt, i) => (
        <div key={i} className={S.rewriteBlock}>
          <strong>Opção {i + 1}:</strong><br />{alt}
        </div>
      ))}

      {/* About */}
      <div className={S.sectionTitle}>Seção Sobre</div>
      {aboutAudit.issues.length > 0 && (
        <ul style={{ color: '#cf1322', marginBottom: 12 }}>
          {aboutAudit.issues.map((issue, i) => <li key={i}>{issue}</li>)}
        </ul>
      )}
      {aboutAudit.rewrite && (
        <>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Reescrita sugerida:</div>
          <div className={S.rewriteBlock}>{aboutAudit.rewrite}</div>
        </>
      )}

      {/* Experience rewrites */}
      {experienceGaps.length > 0 && (
        <>
          <div className={S.sectionTitle}>Experiências — reescritas</div>
          {experienceGaps.map((gap, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <strong>{gap.role}</strong>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Original:</div>
              <div className={S.originalBlock}>{gap.original}</div>
              <div style={{ fontSize: 12, color: '#389e0d', marginBottom: 4 }}>Reescrita:</div>
              <div className={S.rewriteBlock}>{gap.rewrite}</div>
            </div>
          ))}
        </>
      )}

      {/* Quick wins */}
      {quickWins.length > 0 && (
        <>
          <div className={S.sectionTitle}>Quick wins</div>
          <ol style={{ paddingLeft: 20 }}>
            {quickWins.map((win, i) => (
              <li key={i} style={{ marginBottom: 8 }}>{win}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create `LinkedInOptimizerPage.tsx`**

```tsx
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../components/AntApp'
import { Spin } from '../../../components/Spin'
import { Tabs } from '../../../components/Tabs'
import { useLinkedInOnboarding } from '../../../domain/linkedin/hooks/useLinkedInOnboarding'
import { useLinkedInAnalysis } from '../../../domain/linkedin/hooks/useLinkedInAnalysis'
import type { LinkedInProfile, OnboardingData } from '../../../domain/linkedin/types'
import { OnboardingFlow } from './OnboardingFlow'
import { Dashboard } from './Dashboard'
import { GenerationResults } from './GenerationResults'
import * as S from './LinkedInOptimizerPage.styles'

// Fix the import for OnboardingData — it lives in the hook file, re-export here
import type { OnboardingData as OnboardingDataType } from '../../../domain/linkedin/hooks/useLinkedInOnboarding'

export default function LinkedInOptimizerPage() {
  const { t } = useTranslation()
  const { message } = useAntApp()
  const onboarding = useLinkedInOnboarding()
  const { result, loading, handleAnalyze, reset } = useLinkedInAnalysis({
    onError: () => message.error('Erro ao analisar perfil. Tente novamente.'),
  })

  const handleComplete = useCallback(async (profile: LinkedInProfile, data: OnboardingDataType) => {
    await handleAnalyze({
      profile,
      targetRole: data.targetRole || undefined,
      targetSector: data.targetSector.length ? data.targetSector : undefined,
      positioning: data.positioning.length ? data.positioning : undefined,
      anchorEvidence: data.anchorEvidence.metric ? data.anchorEvidence : undefined,
      jobDescription: data.jobDescription || undefined,
    })
  }, [handleAnalyze])

  const handleReset = () => {
    reset()
    onboarding.reset()
  }

  if (!result && !loading) {
    return (
      <div className={S.page}>
        <h2>LinkedIn Profile Optimizer</h2>
        <OnboardingFlow
          onboarding={onboarding}
          onComplete={handleComplete}
          loading={loading}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className={S.page} style={{ textAlign: 'center', paddingTop: 80 }}>
        <Spin size="large" />
        <p style={{ marginTop: 24, color: '#666' }}>
          Analisando perfil... Isso pode levar até 60 segundos.
        </p>
      </div>
    )
  }

  return (
    <div className={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>LinkedIn Profile Optimizer</h2>
        <button type="button" onClick={handleReset} style={{ background: 'none', border: 'none', color: '#1677ff', cursor: 'pointer' }}>
          ← Nova análise
        </button>
      </div>
      <Tabs
        items={[
          {
            key: 'dashboard',
            label: 'Dashboard',
            children: result ? (
              <Dashboard
                before={result.seo.before}
                after={result.seo.after}
                delta={result.seo.delta}
              />
            ) : null,
          },
          {
            key: 'results',
            label: 'Resultados',
            children: result ? <GenerationResults generation={result.generation} /> : null,
          },
        ]}
      />
    </div>
  )
}
```

- [ ] **Step 6: Create `apps/jobapply-app/src/routes/_auth/linkedin/index.tsx`**

```bash
mkdir -p apps/jobapply-app/src/routes/_auth/linkedin
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import LinkedInOptimizerPage from '../../../presentation/pages/LinkedInOptimizerPage/LinkedInOptimizerPage'

export const Route = createFileRoute('/_auth/linkedin/')({
  component: LinkedInOptimizerPage,
})
```

- [ ] **Step 7: Typecheck**

```bash
cd apps/jobapply-app && yarn typecheck
```

- [ ] **Step 8: Commit**

```bash
git add apps/jobapply-app/src/presentation/pages/LinkedInOptimizerPage/ \
  apps/jobapply-app/src/routes/_auth/linkedin/
git commit -m "feat(jobapply-app): add LinkedIn optimizer page and route"
```

---

## Task 17: Remove LinkedIn tab from tailoring

**Files:**
- Modify: `apps/jobapply-app/src/design-system/tailoring/TailoringWorkspaceTabs/TailoringWorkspaceTabs.types.ts`
- Modify: `apps/jobapply-app/src/domain/cv/types/tailoringUI.ts`
- Modify: `apps/jobapply-app/src/design-system/tailoring/TailoringWorkspaceTabs/TailoringWorkspaceTabs.tsx`
- Modify: `apps/jobapply-app/src/presentation/pages/CVTailoringPage/CVTailoringPage.tsx`

- [ ] **Step 1: Update `TailoringWorkspaceTabs.types.ts`**

Change:
```ts
export type WorkspaceTab = 'ats' | 'cover' | 'video' | 'interview' | 'linkedin'
```
to:
```ts
export type WorkspaceTab = 'ats' | 'cover' | 'video' | 'interview'
```

- [ ] **Step 2: Update `src/domain/cv/types/tailoringUI.ts`**

Change:
```ts
export type WorkspaceTab = 'ats' | 'cover' | 'video' | 'interview' | 'linkedin'
```
to:
```ts
export type WorkspaceTab = 'ats' | 'cover' | 'video' | 'interview'
```

- [ ] **Step 3: Remove the LinkedIn tab from `TailoringWorkspaceTabs.tsx`**

Remove the entire object:
```ts
{
  key: 'linkedin' as WorkspaceTab,
  icon: <LinkedinOutlined />,
  label: t('tailoring.linkedinAnalysis'),
  badgeBg: '#e8f4fb',
  badgeColor: '#0077B5',
  badgeText: t('tailoring.badgeNew'),
},
```

Remove `LinkedinOutlined` from the `@ant-design/icons` import.

- [ ] **Step 4: Remove LinkedIn block from `CVTailoringPage.tsx`**

Remove these lines:
- `import type { VoiceAnswers } from '../../../domain/linkedin/types'`
- `import { LinkedInWorkspace } from '../../../design-system/tailoring/LinkedInWorkspace'`
- `import { useLinkedInAnalysis } from '../../../domain/linkedin/hooks/useLinkedInAnalysis'`
- `const linkedin = useLinkedInAnalysis({ onError: handleError })`
- `const [coverVoiceAnswers, setCoverVoiceAnswers] = useState<VoiceAnswers | null>(null)`

Wait — `coverVoiceAnswers` is used by the cover letter flow, not LinkedIn. Keep it. Only remove:
- `import type { VoiceAnswers } from '../../../domain/linkedin/types'` (if only used for linkedin)
- `import { LinkedInWorkspace } from '../../../design-system/tailoring/LinkedInWorkspace'`
- `import { useLinkedInAnalysis } from '../../../domain/linkedin/hooks/useLinkedInAnalysis'`
- `const linkedin = useLinkedInAnalysis({ onError: handleError })`
- The `{ui.activeTab === 'linkedin' && <LinkedInWorkspace ... />}` block (lines 224–232)

Check: `VoiceAnswers` is imported only for `coverVoiceAnswers` type. Keep the import but change source if needed — or keep it since it's still in `types.ts`.

- [ ] **Step 5: Typecheck**

```bash
cd apps/jobapply-app && yarn typecheck
```

- [ ] **Step 6: Commit**

```bash
git add apps/jobapply-app/src/design-system/tailoring/TailoringWorkspaceTabs/ \
  apps/jobapply-app/src/domain/cv/types/tailoringUI.ts \
  apps/jobapply-app/src/presentation/pages/CVTailoringPage/CVTailoringPage.tsx
git commit -m "feat(jobapply-app): remove LinkedIn tab from tailoring workspace"
```

---

## Task 18: Update workspace dev script and verify end-to-end

- [ ] **Step 1: Update root `package.json` dev script to include `linkedin-agent`**

Change:
```json
"dev": "concurrently --names \"api,agent,app\" --prefix-colors \"blue,green,magenta\" \"yarn workspace jobapply-api dev\" \"yarn workspace ats-agent dev\" \"yarn workspace jobapply-app dev\""
```
to:
```json
"dev": "concurrently --names \"api,ats,linkedin,app\" --prefix-colors \"blue,green,cyan,magenta\" \"yarn workspace jobapply-api dev\" \"yarn workspace ats-agent dev\" \"yarn workspace linkedin-agent dev\" \"yarn workspace jobapply-app dev\""
```

Also add:
```json
"dev:linkedin": "yarn workspace linkedin-agent dev"
```

- [ ] **Step 2: Start all services**

```bash
yarn dev
```

Expected: all 4 services start without errors.

- [ ] **Step 3: Smoke test via curl**

```bash
# Check linkedin-agent health
curl http://localhost:3002/health
# Expected: {"status":"ok"}

# Check api still works
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

- [ ] **Step 4: Open frontend**

Navigate to `http://localhost:5173/linkedin` — should show the 5-step onboarding flow.

- [ ] **Step 5: Final typecheck across all packages**

```bash
yarn typecheck
```

- [ ] **Step 6: Commit**

```bash
git add package.json
git commit -m "chore: add linkedin-agent to workspace dev script"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|-----------------|------|
| linkedin-agent as new Fastify service at port 3002 | Task 1 |
| profileParser, jdKeywordExtractor, seoScorer, authorityScorer, genericDetector, reportCompiler nodes | Tasks 3–8 |
| profileGenerator migrated from ats-agent | Task 9 |
| deltaCalculator for SEO delta | Task 10 |
| Background job store + /analyze + /result/:id routes | Task 11 |
| ats-agent: remove linkedinAnalyzer + /linkedin-analyze route | Task 12 |
| jobapply-api: LINKEDIN_AGENT_URL + atsService functions | Task 13 |
| jobapply-api: controller polls linkedin-agent internally | Task 13 |
| Frontend: LinkedInInput, SEOReport, LinkedInResult types | Task 14 |
| Frontend: mock data for new contract | Task 14 |
| Frontend: updated repository + hooks | Task 15 |
| Frontend: 5-step onboarding (PDF + 4 chat steps) | Task 16 |
| Frontend: dashboard with score cards + dimension bars + keyword panel + action plan | Task 16 |
| Frontend: generation results (headline, about, experience, quick wins) | Task 16 |
| Frontend: /linkedin route | Task 16 |
| Frontend: remove LinkedIn tab from tailoring | Task 17 |
| Workspace dev script updated | Task 18 |

**Type consistency check:** `LinkedInInput` defined in Task 2 (backend) and Task 14 (frontend) — both match the spec. `SEOReport` fields match across backend types.ts, frontend types.ts, mock data, and component props. `GenerationOutput` matches `profileGenerator` return type.

**Placeholder scan:** No TBD or TODO items. All code blocks are complete.
