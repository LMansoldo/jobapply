# JobApply Workspace

MVP de plataforma de candidatura a vagas com análise ATS via IA.

## Serviços

| Pacote | Localização | Stack | Porta |
|--------|-------------|-------|-------|
| jobapply-app | apps/jobapply-app | Vite + React + TypeScript | 5173 |
| jobapply-api | apps/jobapply-api | Express + MongoDB + JWT | 3000 |
| ats-agent | apps/ats-agent | Fastify + LangGraph + GLM (Z.ai) | 3001 |
| @jobapply/ui | packages/ui | Kit de primitives @emotion/styled, consumido via fonte pelo app (sem build) | — |
| @jobapply/contracts | packages/contracts | Tipos TypeScript compartilhados (CV, ATSReport, AgentInput, EditorKeywords), consumido via fonte (sem build) | — |
| @jobapply/editor | packages/editor | Rich markdown editor (TipTap) com sugestões ATS, consumido via fonte pelo app (sem build) | — |

## Arquitetura e Fluxo de Dados

```
jobapply-app → (REST) → jobapply-api → (HTTP) → ats-agent → GLM API (Z.ai)
                              ↓                  ↓
                          MongoDB        SQLite (chunk index)
```

- `jobapply-app` consome `jobapply-api` via REST com JWT
- `jobapply-api` delega toda análise ATS e geração de resume ao `ats-agent` via HTTP
- `ats-agent` não acessa o MongoDB — mantém apenas um cache local SQLite (`data/chunks.db`) com chunks extraídos da JD e do CV, derivado dos inputs (reconstruível a qualquer momento, sem TTL)
- `ats-agent` usa background jobs em memória (`Map<string, JobResult>`) com TTL de 30min; `jobapply-api` recebe o `{requestId}` e consome o resultado via SSE (`GET /result/:requestId/stream`, heartbeat 15s) com deadline de 5min (AbortController)
- A extensão de navegador usa o mesmo fluxo async na API: `POST /cv/analyze` → 202 `{requestId}` → `GET /cv/analyze/:requestId/stream` (proxy do stream do agente, autenticado via Bearer)

## Contratos Entre Serviços

Tipos compartilhados entre `jobapply-api` e `ats-agent` (em `ats-agent/src/types.ts`; os tipos de UI — CV, ATSReport, AgentInput, EditorKeywords — vivem em `@jobapply/contracts`, que o app já consome; o ats-agent mantém os seus até integração):

- `AgentInput` — entrada do agente: `{ cv?, cvMarkdown?, jobDescription, locale? }`
- `ATSReport` — relatório ATS: `{ universalScore, scoreBreakdown { factClarity, jdAdherence, humanReadability, prominence, keywordCoverage }, bulletInsights[], aiSmellFixes[], matchedKeywords[], missingKeywords[], semanticGaps[], optimalTemplate { sectionsOrder, keywordsToAdd[], keywordPhrases[], keywordsToRephrase[], formatFixes[] }, tips[], removeSuggestions[] }`
- `CV` — estrutura do CV: `{ fullName?, email?, summary?, skills[], experience[], education[], ... }`

**Nunca alterar esses contratos em um serviço sem atualizar o outro.**

O score do ats-agent mede **clareza dos fatos, aderência dos bullets à JD, legibilidade humana e proeminência** (os feitos mais fortes onde os olhos batem primeiro): `0.35·factClarity + 0.30·jdAdherence + 0.20·humanReadability + 0.15·prominence`. Keywords são um caminho até a análise (matcher literal → `gapAdvisor`/tips), **nunca penalizam o score principal** — `keywordCoverage` é informativo no breakdown.

## Comandos do Workspace

```bash
# Instalar dependências de todos os pacotes
yarn install

# Rodar um pacote específico
yarn workspace jobapply-api dev
yarn workspace ats-agent dev
yarn workspace jobapply-app dev

# Rodar lint em todos os pacotes
yarn workspaces run lint

# Typecheck em todos os pacotes
yarn workspaces run typecheck

# Build em todos os pacotes
yarn workspaces run build
```

## Variáveis de Ambiente

Cada app tem seu próprio `.env`. Nunca commitar `.env`.

- `apps/jobapply-api/.env` — `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GOOGLE_AI_API_KEY`, `ATS_AGENT_URL`
- `apps/ats-agent/.env` — `PORT`, `ZAI_API_KEY`, `CHUNKS_DB_PATH` (opcional; default `./data/chunks.db`, usar `:memory:` em testes)
- `apps/jobapply-app/.env` — `VITE_API_URL`

## PROIBIDO — Valem para Todos os Pacotes

Estas regras aplicam-se a qualquer LLM trabalhando neste workspace:

- **Não criar abstrações para uso único** — três linhas similares são melhores que uma abstração prematura
- **Não adicionar tratamento de erro para cenários impossíveis** — confiar nas garantias do framework
- **Não criar arquivos de documentação (.md) não solicitados**
- **Não refatorar código fora do escopo da tarefa pedida**
- **Não adicionar features, flags ou configurações não pedidas**
- **Não mockar banco em testes** — jobapply-api usa MongoDB real nos testes
- **Não alterar contratos entre serviços** (AgentInput, ATSReport, CV) sem atualizar ambos os lados
- **Não chamar ats-agent diretamente de controllers** — sempre via `atsService.ts`
- **Não adicionar lógica LLM fora de** `llmService.ts` ou `atsService.ts` no jobapply-api

## Caminho para Opção C (Futuro)

Quando iniciar microsserviços:
1. Criar `packages/contracts/` com tipos TypeScript compartilhados
2. `ats-agent` e `jobapply-api` passam a importar de `@jobapply/contracts`
3. Adicionar `turbo.json` para orquestrar builds em ordem de dependência
