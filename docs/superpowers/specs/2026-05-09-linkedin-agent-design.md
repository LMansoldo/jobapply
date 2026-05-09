# LinkedIn Agent — Design Spec

**Data:** 2026-05-09  
**Status:** aprovado  
**Escopo:** criação do `linkedin-agent`, remoção do nó LinkedIn do `ats-agent`, ajuste mínimo na `jobapply-api`, nova página `/linkedin` no frontend.

---

## Contexto

O `ats-agent` contém um nó `linkedinAnalyzerNode` e uma rota `/linkedin-analyze` que analisa perfis LinkedIn via Gemini. A experiência no frontend (`LinkedInWorkspace` dentro do `CVTailoringPage`) exibe JSON cru. O objetivo é extrair essa responsabilidade para um serviço dedicado (`linkedin-agent`) que incorpora também um agente de avaliação de SEO de perfil, e criar uma experiência de frontend completa com onboarding conversacional, dashboard e resultados de geração.

---

## Arquitetura geral

```
jobapply-app → (REST + JWT) → jobapply-api → (HTTP) → linkedin-agent → Gemini API
                                    ↓
                                MongoDB
                                    ↓
                    (continua chamando ats-agent para análise ATS de CV)
```

- **`linkedin-agent`** — novo serviço em `apps/linkedin-agent/`, porta `3002`, Fastify + LangGraph + Gemini, stateless, background jobs em memória (mesmo padrão do `ats-agent`)
- **`ats-agent`** — perde `linkedinAnalyzerNode` e a rota `/linkedin-analyze`; tudo mais permanece intacto
- **`jobapply-api`** — ganha `LINKEDIN_AGENT_URL`; `atsService.ts` troca a função de LinkedIn; controller e rota pública `POST /cv/linkedin/analyze` permanecem iguais por fora
- **`jobapply-app`** — nova página `/linkedin` independente do `CVTailoringPage`; `LinkedInWorkspace` removido das abas de tailoring

---

## `linkedin-agent` — internals

### Estrutura de arquivos

```
apps/linkedin-agent/
├── src/
│   ├── server.ts
│   ├── types.ts
│   ├── api/routes.ts
│   ├── graph/
│   │   ├── index.ts
│   │   └── nodes/
│   │       ├── profileParser.ts       — estrutura o perfil recebido
│   │       ├── jdKeywordExtractor.ts  — extrai keywords da vaga (se fornecida)
│   │       ├── seoScorer.ts           — 4 sub-scores
│   │       ├── authorityScorer.ts     — métricas, progressão, especificidade
│   │       ├── genericDetector.ts     — regex + LLM para frases genéricas
│   │       ├── reportCompiler.ts      — agrega SEOReport + action_items priorizados
│   │       ├── profileGenerator.ts    — migrado do linkedinAnalyzerNode do ats-agent
│   │       └── deltaCalculator.ts     — SEO no perfil gerado, calcula delta
│   └── lib/gemini.ts
├── package.json
└── .env                               — PORT, GOOGLE_AI_API_KEY
```

### Grafo (sequencial)

```
profileParser
     │
     ▼
jdKeywordExtractor   ← edge condicional: só executa se jobDescription presente,
     │                 caso contrário passa direto para seoScorer com jdKeywords = []
     ▼
seoScorer → authorityScorer → genericDetector → reportCompiler
                                                      │
                                           (SEOReport "before" pronto)
                                                      │
                                                      ▼
                                             profileGenerator   ← usa voiceAnswers + context
                                                      │
                                                      ▼
                                             deltaCalculator    ← seoScorer+authority+generics no perfil gerado
                                                      │
                                                      ▼
                                              [LinkedInResult]
```

### Tipos principais (`types.ts`)

**Input:**

```ts
interface LinkedInInput {
  profile: {
    headline: string
    about: string
    experience: string
    skills: string
    education: string
    certifications?: string
  }
  targetRole?: string
  targetSector?: string[]
  positioning?: string[]       // executor | estrategista | líder | técnico | visionário
  tone?: string
  anchorEvidence?: {
    metric: string
    timeframe: string
    action: string
  }
  jobDescription?: string
  locale?: 'en' | 'pt-BR'
  voiceAnswers?: { label: string; answer: string }[]
}
```

**Output:**

```ts
interface LinkedInResult {
  seo: {
    before: SEOReport
    after: SEOReport
    delta: number              // after.overall_score - before.overall_score
  }
  generation: {
    headlineAnalysis: { currentScore: 'weak' | 'moderate' | 'strong'; alternatives: string[] }
    aboutAudit: { issues: string[]; rewrite: string | null }
    experienceGaps: Array<{ role: string; original: string; rewrite: string }>
    keywordGaps: { technical: string[]; domain: string[]; softSkills: string[]; certifications: string[] }
    quickWins: string[]
    overallScore: { score: number; strengths: string[]; blockers: string[]; priorityAction: string }
    voiceProfile: { tone: string; signaturePatterns: string[]; rawInputMissing: boolean; qualityNote: string }
  }
  locale: 'en' | 'pt-BR'
}

interface SEOReport {
  overall_score: number
  keyword_density_score: number
  completeness_score: number
  specificity_score: number
  role_alignment_score: number
  authority_score: number
  missing_keywords: string[]
  generic_phrases: Array<{ phrase: string; reason: string; suggestion: string }>
  completeness_gaps: string[]
  action_items: ActionItem[]
  sections: Record<string, SectionScore>
}

interface ActionItem {
  action: string
  reason: string
  priority: 'high' | 'medium' | 'low'
}

interface SectionScore {
  score: number
  label: 'headline' | 'about' | 'experience' | 'skills'
}
```

### Nós — lógica

**`profileParser`** — valida e normaliza o input estruturado recebido (`{ headline, about, experience, skills, education, certifications }`). Não faz extração — o PDF já foi parseado no frontend. Garante que campos obrigatórios existem e trunca strings excessivamente longas para não estourar o contexto do LLM.

**`seoScorer`** — 4 sub-scores (0–100):
- `keyword_density_score`: presença das keywords do JD no perfil, ponderada por localização (headline 3x, about 2x, experiências 1x, skills 1x). Score 0 se `jobDescription` não foi fornecida.
- `completeness_score`: checklist binário ponderado sobre campos detectáveis do PDF (headline preenchida 25, about com 200+ palavras 20, 3+ experiências com texto 20, 10+ skills 20, educação preenchida 15)
- `specificity_score`: `100 - (generics_found * 10)`, mínimo 0
- `role_alignment_score`: similaridade semântica entre headline/experiências recentes e `targetRole` via LLM classificador. Score 0 se `targetRole` não foi fornecido.

**`authorityScorer`** — mede:
- Presença de métricas numéricas por experiência (regex + LLM)
- Especificidade de impacto vs. genericidade (LLM, escala 1–5)
- Consistência de progressão de carreira (senioridade crescente)

**`genericDetector`** — dois passes:
1. Regex contra lista de clichês fixos (ex: "apaixonado por", "results-driven", "responsável por")
2. LLM identifica frases semanticamente genéricas além da lista, retorna `{ phrase, reason, suggestion }`

**`reportCompiler`** — agrega sub-scores, prioriza action_items:
- Alta prioridade (impacto > 10 pts): keywords obrigatórias ausentes, about vazio ou < 100 palavras, experiências sem métrica
- Média prioridade (5–10 pts): keywords preferenciais ausentes, clichês em headline/about, skills ausentes
- Baixa prioridade (< 5 pts): URL não customizada, featured vazia, atividade baixa

**`profileGenerator`** — migração direta do `linkedinAnalyzerNode` do ats-agent. Recebe `LinkedInInput` completo (incluindo `anchorEvidence`, `positioning`, `tone`) e retorna o bloco `generation` do output.

**`deltaCalculator`** — executa `seoScorer + authorityScorer + genericDetector + reportCompiler` sobre o texto dos rewrites gerados pelo `profileGenerator`. Retorna `SEOReport` (after) e calcula delta.

### Endpoints

```
POST /analyze        → { requestId, status: 'pending' }   (background job)
GET  /result/:id     → JobResult com status + LinkedInResult quando done
GET  /health         → { status: 'ok' }
```

Background job store: `Map<string, JobResult>` com TTL de 30 min, limpeza a cada 10 min — igual ao ats-agent.

---

## `jobapply-api` — mudanças

### `.env`

```
LINKEDIN_AGENT_URL=http://localhost:3002
```

### `atsService.ts`

Remove `analyzeLinkedInWithATS()`. Adiciona:

```ts
export async function analyzeLinkedInWithLinkedInAgent(payload: LinkedInAgentInput): Promise<{ requestId: string }>
// POST ${LINKEDIN_AGENT_URL}/analyze

export async function getLinkedInJobResult(requestId: string): Promise<LinkedInJobResult>
// GET ${LINKEDIN_AGENT_URL}/result/:requestId
```

### `cvController.ts` — `analyzeLinkedInDirect()`

Passa a:
1. Chamar `analyzeLinkedInWithLinkedInAgent()` → recebe `{ requestId }`
2. Fazer polling interno (loop com delay de 1s, timeout de 120s) até `status === 'done'` ou `'error'`
3. Retornar `LinkedInResult` ao frontend

O frontend continua fazendo uma única chamada `POST /cv/linkedin/analyze` e aguardando resposta HTTP — sem polling exposto ao cliente.

### Rota

`POST /cv/linkedin/analyze` — inalterada (auth middleware + usageLimit).

---

## `ats-agent` — remoção

- Deletar `src/graph/nodes/linkedinAnalyzer.ts`
- Remover a rota `POST /linkedin-analyze` de `src/api/routes.ts`
- Remover imports correspondentes

---

## `jobapply-app` — nova página `/linkedin`

### Estrutura

```
apps/jobapply-app/src/
├── routes/_auth/linkedin/index.tsx
├── presentation/pages/LinkedInOptimizerPage/
│   ├── LinkedInOptimizerPage.tsx
│   └── LinkedInOptimizerPage.styles.ts
├── domain/linkedin/
│   ├── types.ts                         — estende com LinkedInInput, SEOReport, LinkedInResult
│   ├── hooks/
│   │   ├── useLinkedInOnboarding.ts     — estado das 4 etapas do chat
│   │   └── useLinkedInAnalysis.ts       — substitui o atual, chama novo payload
│   └── (pdfParser.ts, linkedinOAuth.ts — sem alteração)
└── infrastructure/repositories/
    └── linkedinRepository.ts            — atualiza analyzeLinkedIn() para novo contrato
```

### Fluxo de telas

**Momento 1 — Onboarding (steps 0–4):**

| Step | Conteúdo | Tipo de input |
|------|----------|---------------|
| 0 | Upload PDF | File upload (reutiliza parser existente) |
| 1 | Cargo alvo e setor | Campo aberto |
| 2 | Posicionamento | Chips de múltipla escolha (executor / estrategista / líder / técnico / visionário) |
| 3 | Evidência âncora (métrica + prazo + ação) | Campo obrigatório — bloqueia avanço se vazio |
| 4 | URL ou descrição de vaga | Campo opcional |

Ao fim do step 3: card de confirmação com cargo alvo, posicionamento, evidência âncora e tom inferido. Usuário confirma antes de disparar análise.

**Momento 2 — Dashboard:**

Quatro cards de métricas:
- Score geral (0–100) + delta (`+N pts vs. perfil gerado`)
- SEO do perfil (`keyword_density_score` + `completeness_score`)
- Fit com vaga (`role_alignment_score` — só se JD fornecida)
- Autoridade percebida (`authority_score`)

Barras horizontais por dimensão (Headline / Sobre / Experiências / Skills) com cor semântica (verde ≥70, amarelo 40–69, vermelho <40).

Painel de keywords ausentes categorizadas (técnicas / domínio / soft skills / certificações).

Plano de ação priorizado: lista ordenada com badge de prioridade (alta / média / baixa) e justificativa por item.

**Momento 3 — Resultados de geração:**

- **Headline:** score atual (`weak/moderate/strong`) + 3 alternativas geradas
- **Sobre:** lista de issues + rewrite completo
- **Experiências:** rewrites das gaps identificadas (original → rewrite por role)
- **Quick wins:** lista destacada

### `CVTailoringPage`

Remove `LinkedInWorkspace` das abas. Remove `useLinkedInAnalysis` e imports relacionados.

---

## Variáveis de ambiente por serviço

| Serviço | Variável | Valor dev |
|---------|----------|-----------|
| `linkedin-agent` | `PORT` | `3002` |
| `linkedin-agent` | `GOOGLE_AI_API_KEY` | — |
| `jobapply-api` | `LINKEDIN_AGENT_URL` | `http://localhost:3002` |

---

## O que NÃO está no escopo

- Editor interativo antes/depois com aprovar / editar / regenerar por seção
- Persistência do resultado da análise no MongoDB
- Autenticação própria no `linkedin-agent` (stateless, chamado apenas pela API)
