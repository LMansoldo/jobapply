# ats-agent

Serviço Fastify + LangGraph + GLM (Z.ai). Analisa CVs contra job descriptions — **clareza dos fatos, aderência dos bullets à JD, legibilidade humana e proeminência** — e gera relatórios ATS + resumes. Keywords (busca booleana literal) são o caminho até a análise, nunca o score.

## Stack
- Fastify (HTTP server)
- LangGraph (`@langchain/langgraph`) para o pipeline de análise
- GLM (`openai` SDK + API compatível da Z.ai) como LLM
- `node:sqlite` para o chunk index local

## Modelo de Análise

O score mede o que um recrutador humano vê numa leitura rápida:

```
universalScore = 0.35·factClarity + 0.30·jdAdherence + 0.20·humanReadability + 0.15·prominence
```

- **factClarity** — bullets expressam um fato único, concreto e compreensível isolado (julgado por bullet no `bulletAdvisor`; fallback heurístico determinístico)
- **jdAdherence** — quanto cada bullet prova algo que a JD exige
- **humanReadability** — escaneabilidade: comprimento de bullet, primeira pessoa, frases genéricas, summary longo
- **prominence** — os 3 bullets mais fortes (força = `0.4·clarity + 0.4·jdRelevance + 0.2·métrica`) estão nos primeiros bullets dos cargos recentes (F-pattern: visibilidade `100/(1+posição+índice)`)
- **keywords não entram no score** — `keywordCoverage` (busca literal ponderada por tier: `must-have` 3, `important` 2, `nice-to-have` 0) é informativo no breakdown; ausência vira dica no `gapAdvisor`/tips, nunca penalidade

## Pipeline

```
mapper → jdExtractor → cvExtractor → keywordComposer → keywordClassifier → booleanMatcher → bulletAdvisor → aiSmellValidator → scoreComposer → gapAdvisor → aggregator
```

1. **mapper** (determinístico) — achata `cv` estruturado ou `cvMarkdown` em `MappedCV`
2. **jdExtractor** (LLM, cacheado por hash da JD) — JD → chunks tipados `{ type, attr, tier }` + jobTitle
3. **cvExtractor** (LLM, cacheado por hash do CV) — CV → chunks tipados `{ type, attr, section }`
4. **keywordComposer** (LLM) — compara jd_chunks × cv_chunks por `type` → `{ term, tier, variants }`
5. **keywordClassifier** (LLM, payload pequeno) — valida as keywords compostas: funde EITHER-OR lists quebradas em must-haves independentes (`merge_into`), remove variantes que engolem o token diferenciador (`strip_variant`), classifica `keywordClass` (skill | eligibility | credential | seniority). Vereditos aplicados por pós-processamento determinístico (`applyKeywordVerdicts`); falha do LLM nunca bloqueia o pipeline
6. **booleanMatcher** (determinístico) — word-boundary + plural contra seções do CV, com `evidence` do trecho casado
7. **bulletAdvisor** (LLM) — julga cada bullet: `clarity` e `jdRelevance` (0–100) + `issue`/`suggestion` fiéis ao fato original; valida ids e clampa scores; bullets não cobertos/beyond-cap caem no fallback heurístico (`heuristicInsight`); falha do LLM nunca bloqueia o pipeline
8. **scoreComposer** (determinístico) — fórmula acima; sem `bulletInsights` (re-score do resume) deriva os insights heuristicamente — o re-score permanece LLM-free
9. **gapAdvisor** (LLM; só se houver missing) — classifica missing em `rephrase` (CV diz a mesma coisa com outras palavras) ou `absent`; guarda anti-fabricação degrada rephrase com cabeça compartilhada + qualificador novo; frases seguem o `keywordClass` (eligibility → linha de perfil, credential → linha de educação, etc.)
10. **aggregator** (determinístico) — monta o `ATSReport` (contrato com jobapply-api); tips priorizam fatos: proeminência (feito forte enterrado), clareza baixa com sugestão, aderência baixa, seções ausentes — keywords viram advice `medium`

Chamadas LLM por request: `/analyze` frio 6–7 / warm 4–5 (aiSmellValidator só chama quando o detector pega algo); `/generate-resume` frio 8–9 / warm 6–7 (bulletAdvisor + draft + ai-smell cleanup do draft, com 1 retry de JSON; re-score determinístico).

## Fluxo /generate-resume

Insights guiam a escrita; o score determinístico decide o loop:

1. `bulletAdvisor` roda sobre o CV **original** → `bulletInsights` (issue/suggestion por bullet) alimentam o bloco `<bullet_diagnosis>` do prompt do writer
2. `scoreBefore` usa insights **heurísticos** (mesma régua do `scoreAfter` — o loop nunca compara maçã com laranja)
3. `generateResumeDraft` reescreve: bullets fracos (clarity < 60) viram fato único (ação + resultado) com seed da suggestion; cargos com jdRelevance uniformemente baixa saem (`include: false`); feitos mais fortes primeiro
4. `verifyResumeDraft` reverte fabricação **e** clareza fraca do rewrite (`weak-clarity`: primeira pessoa, <6 ou >32 palavras) — reverter ao original é piso seguro
5. `rewriteDraftAiSmell` limpa AI smell do draft (gated pelo detector determinístico; o chamador re-verifica — nada de métrica perdida/inventada sobrevive)
6. `applyProminenceOrder` (determinístico) reordena os bullets de cada cargo por força heurística desc — a MESMA heurística do scorer, então a prominence do resume renderizado é maximizada sob o mesmo juiz
7. re-score do markdown renderizado; se não bater `scoreBefore`, tenta mais uma vez e fica o melhor

## Chunk Index (SQLite)

`src/db/chunks.ts` — `node:sqlite`, WAL, default `./data/chunks.db` (override: `CHUNKS_DB_PATH`, `:memory:` em testes).

- `jd_chunks (jd_id, id, type, attr, tier)` / `cv_chunks (cv_id, id, type, attr, section)` — PK composta `(owner, id)`, `id` = sha256 de `type::attr` normalizado (accents/pontuação/case-insensitive)
- `jd_meta (jd_id, job_title)`
- Cache por content hash do input, **sem TTL** — chunks são puros (mesmo input → mesmo output); INSERT OR IGNORE deduplica
- `data/` é gitignored; no Docker, `/app/data` é criado com owner do appuser (montar volume para persistir entre restarts)

## Estrutura de Arquivos

```
src/
├── server.ts           — entry point Fastify
├── types.ts            — tipos: CV, AgentInput, ATSReport, chunks, GraphState
├── db/chunks.ts        — SQLite chunk index (schema, dedup por hash, lookup)
├── api/routes.ts       — endpoints HTTP + background job store
├── graph/
│   ├── index.ts        — StateGraph + ordem dos nodes
│   ├── nodes/          — jdExtractor, cvExtractor, keywordComposer, keywordClassifier,
│   │                     booleanMatcher, bulletAdvisor, aiSmellValidator, scoreComposer,
│   │                     gapAdvisor, aggregator, mapper, resumeGenerator, interviewPrepAnalyzer
│   └── resume/         — source, generator, verifier, renderer, styleSanitizer
└── lib/                — glm.ts (cliente GLM), jd.ts (limpeza determinística da JD)
```

## Convenções

- Nodes são funções `(state: Partial<GraphState>) => Promise<Partial<GraphState>>`
- Matching usa sempre `norm()` de `db/chunks.ts` (NFD, lowercase, pontuação → espaço) — composer e booleanMatcher compartilham a mesma normalização
- Extratores validam e deduplicam a resposta do LLM; fallback determinístico em caso de JSON inválido
- Background jobs: `Map<string, JobResult>` em `api/routes.ts` com TTL de 30 min — sem Redis por ora
- Entrega do resultado: `POST /analyze` responde `{ requestId }` e o cliente consome por SSE em `GET /result/:requestId/stream` (eventos `data:` com o snapshot do job; heartbeat `: ping` de 15s; stream fecha no estado terminal). `GET /result/:requestId` segue disponível para consulta pontual

## PROIBIDO

- Usar banco além do SQLite local de chunks (`data/`); acessar o MongoDB
- Creditar score para match semântico/conceitual — só literal com variantes
- Alterar tipos em `src/types.ts` sem sincronizar com `jobapply-api/src/services/atsService.ts` e com `apps/jobapply-app/src/domain/cv/types.ts`
- Criar endpoints não documentados no CLAUDE.md raiz
- Lógica LLM fora de `graph/nodes/` e `graph/resume/`
