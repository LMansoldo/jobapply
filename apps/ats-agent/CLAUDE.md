# ats-agent

Serviço stateless Fastify + LangGraph + Gemini. Analisa CVs contra job descriptions e gera relatórios ATS.

## Stack
- Fastify (HTTP server)
- LangGraph (`@langchain/langgraph`) para o pipeline de análise
- Google Gemini (`@google/generative-ai`) como LLM

## Arquitetura Interna

Pipeline de nodes em sequência (ver `src/graph/index.ts`):
```
mapper → extractKeywords → jdKeywordExtractor → ruleScorer → semanticAnalyzer → cvGenerator → aggregator
```

Cada node: função pura que recebe `Partial<GraphState>` e retorna `Partial<GraphState>`.

## Estrutura de Arquivos

```
src/
├── server.ts           — entry point Fastify
├── types.ts            — todos os tipos: CV, AgentInput, ATSReport, GraphState
├── api/routes.ts       — endpoints HTTP + background job store
├── graph/
│   ├── index.ts        — definição do StateGraph compilado
│   └── nodes/          — um arquivo por node do pipeline
├── platforms/          — detecção e scoring por plataforma ATS
└── lib/gemini.ts       — cliente Gemini compartilhado
```

## Convenções

- Novos nodes vão em `src/graph/nodes/`, exportam função com signature `(state: Partial<GraphState>) => Promise<Partial<GraphState>>`
- Novas plataformas ATS vão em `src/platforms/`, seguem a interface em `src/platforms/types.ts`
- Background jobs: `Map<string, JobResult>` em `api/routes.ts` com TTL de 30 min — sem Redis por ora

## PROIBIDO

- Adicionar estado persistente (banco, cache externo, arquivo)
- Alterar tipos em `src/types.ts` sem sincronizar com `jobapply-api/src/services/atsService.ts`
- Criar endpoints não documentados no CLAUDE.md raiz
