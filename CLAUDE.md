# JobApply Workspace

MVP de plataforma de candidatura a vagas com análise ATS via IA.

## Serviços

| Pacote | Localização | Stack | Porta |
|--------|-------------|-------|-------|
| jobapply-app | apps/jobapply-app | Vite + React + TypeScript | 5173 |
| jobapply-api | apps/jobapply-api | Express + MongoDB + JWT | 3000 |
| ats-agent | apps/ats-agent | Fastify + LangGraph + Gemini | 3001 |
| @jobapply/ui | packages/ui | React + TypeScript (design system) | — |

## Arquitetura e Fluxo de Dados

```
jobapply-app → (REST) → jobapply-api → (HTTP) → ats-agent → Gemini API
                              ↓
                          MongoDB
```

- `jobapply-app` consome `jobapply-api` via REST com JWT
- `jobapply-api` delega toda análise ATS e geração de CV ao `ats-agent` via HTTP
- `ats-agent` é **stateless** — não acessa banco, não persiste nada
- `ats-agent` usa background jobs em memória (`Map<string, JobResult>`) com TTL de 30min

## Contratos Entre Serviços

Tipos compartilhados entre `jobapply-api` e `ats-agent` (vivem em `ats-agent/src/types.ts` até `packages/contracts` existir):

- `AgentInput` — entrada do agente: `{ cv?, cvMarkdown?, jobDescription, locale?, platform?, jobUrl? }`
- `ATSReport` — relatório ATS: `{ universalScore, platforms[], semanticGaps[], optimalTemplate, tips[], removeSuggestions[] }`
- `CV` — estrutura do CV: `{ fullName?, email?, summary?, skills[], experience[], education[], ... }`

**Nunca alterar esses contratos em um serviço sem atualizar o outro.**

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
- `apps/ats-agent/.env` — `PORT`, `GOOGLE_AI_API_KEY`
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
