# ATS Agent v2 — Score Único + Resume Verificado

**Data:** 2026-07-22
**Status:** Aprovado para planejamento
**Escopo:** `apps/ats-agent` (principal), `apps/jobapply-api` e `apps/jobapply-app` (migração de contrato)

## Problema

O ats-agent hoje tem três defeitos:

1. **Análise por plataforma não funcional.** Os 11 scorers em `src/platforms/` (Gupy, Greenhouse, Lever, Workday, iCIMS, Vagas, Catho, Inhire, Recruitee, BambooHR, Generic — 1.645 linhas) simulam algoritmos de ranking proprietários com heurísticas de substring-matching. Os scores resultantes são especulativos com aparência de precisão.
2. **Resume gerado perde métricas dos bullets.** O `resumeGenerator` instrui o LLM a "reescrever bullets para integrar keywords" (RULE 5/6 do prompt), mas nada valida a saída — na reescrita o modelo dropa números e métricas.
3. **Resume gerado inventa frases vagas da JD.** A job description inteira está no contexto do prompt de geração; o modelo copia frases da JD para bullets que não têm âncora no CV original.

Causa raiz dos itens 2 e 3: fidelidade garantida só por instrução de prompt, sem verificação, com a fonte de contaminação (JD completa) visível ao modelo durante a reescrita.

## Decisões de produto (tomadas em brainstorming)

- **Score único universal** de compatibilidade CV↔vaga, com breakdown transparente. A dimensão "plataforma" morre: `platforms[]` sai do contrato e da UI, sem período de deprecação.
- **Reescrita verificada** para o resume: o LLM continua reescrevendo bullets para integrar keywords, mas cada bullet gerado passa por verificação determinística (em código, zero LLM) e é revertido ao original quando falha.
- **Arquitetura:** manter um único serviço/grafo LangGraph, com o subfluxo de resume (source → generator → verifier → renderer) como módulos independentes e testáveis. Sem novos serviços.

## Abordagem escolhida (A): geração estruturada + verificação determinística

O gerador para de emitir Markdown livre e emite JSON onde cada bullet aponta (`sourceIndex`) para o bullet original. Um verificador em código puro checa métricas, rastreabilidade e contaminação da JD; falha → revert ao original verbatim. O Markdown final é montado por template determinístico. Elemento anti-contaminação: a JD inteira **sai** do prompt de geração — o modelo vê apenas título da vaga e keywords extraídas.

Alternativas descartadas: (B) verificador LLM-juiz com loop de reparo — +2 chamadas LLM, juiz também erra, pode não convergir; fica como extensão futura plugável se A for insuficiente nos casos sutis. (C) reescrita bullet-a-bullet isolada — N chamadas LLM, perde visão de conjunto; o elemento útil dela (JD fora do contexto) foi incorporado em A.

---

## Seção 1 — Novo contrato `ATSReport`

Breaking change sincronizado nos dois lados (regra do workspace: nunca alterar contrato sem atualizar ambos).

**Remove:** `PlatformScore`, `ATSReport.platforms`, `tips[].applicableTo`, `AgentInput.platform`, `AgentInput.jobUrl`.

**Novo shape** (em `ats-agent/src/types.ts`, espelhado em `jobapply-app/src/domain/cv/types.ts`):

```ts
export interface ScoreBreakdown {
  keywordCoverage: number   // 0–100: cobertura ponderada de keywords da JD
  contentQuality: number    // 0–100: métricas presentes, ausência de linguagem vaga
  format: number            // 0–100: seções presentes, datas parseáveis, contato completo
}

export interface WeightedKeyword {
  term: string
  weight: 'required' | 'preferred'
}

export interface ATSReport {
  universalScore: number          // round(0.6*keywordCoverage + 0.25*contentQuality + 0.15*format)
  scoreBreakdown: ScoreBreakdown
  matchedKeywords: string[]       // termos da JD encontrados no CV
  missingKeywords: string[]       // termos da JD ausentes (required primeiro)
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
```

`GraphState`: `platformScores` sai; entram `jobTitle?: string`, `weightedKeywords?: WeightedKeyword[]`, `scoreBreakdown?: ScoreBreakdown`, `matchedKeywords?/missingKeywords?: string[]`, `resumeDraft?: ResumeDraft`, `resumeVerification?: VerificationReport` (tipos nas Seções 2 e 4).

`AnalyzeBodySchema` (`routes.ts`): remove `platform` e `jobUrl`.

## Seção 2 — `jdKeywordExtractor` v2: keywords ponderadas + título da vaga

Hoje retorna `string[]`. Passa a retornar:

```ts
{ jdKeywords: string[]; weightedKeywords: WeightedKeyword[]; jobTitle: string }
```

- `jdKeywords` (plano) é derivado de `weightedKeywords.map(k => k.term)` — mantém funcionando os consumidores atuais durante a migração.
- `jobTitle`: título exato da vaga como escrito na JD. Necessário porque o resume generator não verá mais a JD (Seção 4b) e o Objective é o título verbatim.
- Critério de peso (instruído no prompt): `required` = termo em seção de requisitos obrigatórios ("requisitos", "requirements", "must have") ou repetido 2+ vezes na JD; `preferred` = resto.
- Mesmo modelo (`gemini-flash-lite-latest`), mesmo prompt base, só muda o shape do JSON pedido:
  `{ "jobTitle": "...", "keywords": [{ "term": "...", "weight": "required" | "preferred" }] }`.
- Fallback em erro de parse: `{ jdKeywords: [], weightedKeywords: [], jobTitle: '' }` (comportamento atual preservado).

## Seção 3 — `universalScorer` substitui `ruleScorer` e `src/platforms/`

Node **determinístico** (zero chamadas LLM) em `src/graph/nodes/universalScorer.ts`.

**Assinatura:** recebe `{ mapped, weightedKeywords }`; retorna `{ scoreBreakdown, matchedKeywords, missingKeywords }`.

### keywordCoverage (0–100)

- Normalização de ambos os lados: lowercase, strip de acentos (NFD), colapso de whitespace.
- Matching por **word boundary**, não substring ("java" não casa "javascript"). Termos compostos ("design system") casam como frase contígua normalizada.
- Tolerância a flexão simples: match se o termo ou termo+`s`/`es` (e o inverso) casa.
- Peso por importância: `required` conta 2×, `preferred` 1×.
- Peso por seção onde casou (usa `MappedCV.sections`): `experience` = 1.0, só em `skills` = 0.7, só em `summary` = 0.4. Vale o maior aplicável.
- Fórmula: `100 * Σ(pesoImportância * pesoSeção dos matched) / Σ(pesoImportância de todos)`. Lista vazia de keywords → `keywordCoverage = 0` e nota em `formatFixes` não é gerada aqui (aggregator lida).

### contentQuality (0–100)

Salva as duas únicas heurísticas boas de `src/platforms/gupy.ts`, movidas para dentro do scorer:

- `METRICS_PATTERN = /\d+\s*(%|R\$|\$|reais|mil|milhão|k\b|x\b|vezes|usuários|users|requests|deploys|horas|dias|ms|s\b)/i`
- `GENERIC_PHRASES` (lista atual de gupy.ts: "responsável por", "auxiliava", etc. + equivalentes en: "responsible for", "worked with", "assisted in").
- Base 100; penalidades: −8 por highlight com frase genérica (cap −40); bônus já embutido: highlights com métrica ≥ 40% → sem penalidade extra, < 40% → −5 por cada 10 pontos percentuais abaixo (cap −30). Sem highlights → 50.

### format (0–100)

Checks sobre `MappedCV`: seções `summary`, `skills`, `experience`, `education` não vazias (−15 cada ausente); email presente em `contact` (−15 se não); todos os `experiencePeriods` com period não vazio (−10 se algum vazio). Piso 0.

### Deleções e movimentações

- **Deletar** `src/platforms/` inteiro e `src/graph/nodes/ruleScorer.ts`.
- `parseJobDescription` (única função de `platforms/utils.ts` usada fora do diretório — por `jdKeywordExtractor` e `semanticAnalyzer`) migra para `src/lib/jd.ts` sem alteração de comportamento.

### Ajustes nos nodes vizinhos

- **`semanticAnalyzer`**: deixa de receber `platformScores` (e de lançar erro na ausência). Recebe `scoreBreakdown` + `missingKeywords`; o bloco `<ats_scores>` do prompt vira `<ats_analysis>` com esse conteúdo. A menção a "Brazilian platforms (Gupy, Vagas...)" na instrução de semanticGaps vira instrução neutra: "flag vague descriptions lacking metrics". `edge_context` que referenciava `missingRequired` passa a usar `missingKeywords.length === 0`.
- **`aggregator`**: remove `WEIGHTS_BR/GLOBAL`, `weightedScore`, dedup de flags por plataforma. Novo `buildTips`: critical = required keywords em `missingKeywords` (até 8, com prefixo explicativo); high = `semanticGaps` (até 5); medium = preferred keywords faltando (até 8). `universalScore` calculado aqui a partir do `scoreBreakdown` com os pesos 0.6/0.25/0.15. `keywordsToAdd` = `missingKeywords.slice(0, 20)`.
- **Grafo** (`graph/index.ts`): `mapper → jdKeywordExtractor → universalScorer → semanticAnalyzer → cvGenerator → aggregator`. Annotations atualizadas conforme Seção 1.
- **`cvGenerator`** (adaptedCV): sem mudança funcional nesta iteração — só ajuste de tipos se necessário. Fica explicitamente fora de escopo.

## Seção 4 — Subfluxo de resume: source → generator → verifier → renderer

Substitui o `resumeGenerator.ts` monolítico (322 linhas) por 4 módulos.

### 4a. `src/graph/resume/source.ts` — parser puro (extraído do atual)

Move sem mudança de lógica: `extractRawMarkdownSection`, `parseExperiencePositions`, `formatStructuredExperience` (adaptada), `buildExperienceFromRawCV`, `buildEducationFromRawCV`, `EXPERIENCE_ALIASES`, `EDUCATION_ALIASES`, `ParsedPosition`.

```ts
export interface ResumeSource {
  positions: ParsedPosition[]   // { header, period, context, bullets[] }
  educationRaw: string
  summaryRaw: string
  skillsRaw: string
}
export function buildResumeSource(mapped: MappedCV, cvMarkdown?: string, rawCV?: CV): ResumeSource
```

Resolve a precedência atual: `cvMarkdown` > `rawCV` > `mapped.sections`.

### 4b. `src/graph/resume/generator.ts` — LLM emite só JSON

**Mudança-chave anti-contaminação: a JD não entra no prompt.** O modelo vê apenas: `jobTitle`, `weightedKeywords`, `keywordPhrases`, `removeSuggestions`, `rephraseSuggestions`, e o `ResumeSource` com bullets numerados por posição. Locale igual ao atual.

Output pedido (JSON estrito, modelo `gemini-3-flash-preview` como hoje):

```ts
export interface ResumeDraft {
  summary: string
  skills: Array<{ category: string; items: string[] }>
  experience: Array<{
    positionIndex: number       // índice em ResumeSource.positions
    include: boolean            // seleção de relevância (ex-RULE 3)
    context: string             // reescrita do context original
    bullets: Array<{ sourceIndex: number; text: string }>  // sourceIndex = índice 0-based no bullets[] da posição
  }>
}
```

O que **não** é gerado (montado pelo renderer a partir da fonte, fidelidade por construção): Objective (= `jobTitle`), headers de experiência, períodos, educação inteira. As RULEs 1 e 2 do prompt atual deixam de existir como instrução — viram garantia estrutural.

Instruções que permanecem no prompt: seleção estrita de posições relevantes, até 5 bullets por posição, reescrever integrando keywords preservando fatos e números, manter categorias de skills relevantes reordenadas, omitir `removeSuggestions`, honestidade. Parse com fallback: 1 retry em erro de JSON; segundo erro → exception (como hoje).

### 4c. `src/graph/resume/verifier.ts` — verificação determinística (zero LLM)

```ts
export interface VerificationViolation {
  location: string              // ex: "experience[0].bullets[2]", "summary"
  rule: 'metric-dropped' | 'metric-invented' | 'low-overlap' | 'jd-contamination' | 'invalid-source'
  detail: string
  action: 'reverted'
}
export interface VerificationReport { violations: VerificationViolation[] }
export function verifyResumeDraft(
  draft: ResumeDraft, source: ResumeSource, jd: string, jdKeywords: string[]
): { draft: ResumeDraft; report: VerificationReport }   // draft retornado já com reverts aplicados
```

Checks por bullet gerado, contra o bullet original apontado por `sourceIndex`:

1. **`invalid-source`**: `positionIndex`/`sourceIndex` fora de range, ou dois bullets gerados apontando pro mesmo `sourceIndex` (o segundo é descartado). Revert impossível → bullet descartado.
2. **`metric-dropped` / `metric-invented`**: extração de tokens numéricos (`/\d+(?:[.,]\d+)?\s*(?:%|R\$|\$|k|x|mil|milhões?|pp)?/g`, normalizados: `4.2s` ≡ `4,2s`). Conjunto de tokens do original deve ⊆ gerado (dropped) e do gerado deve ⊆ original (invented). Anos em períodos não contam (bullets raramente têm, mas o check ignora tokens que são anos 19xx/20xx presentes no header/period da posição).
3. **`low-overlap`**: Jaccard sobre content-words normalizadas (stopwords pt+en removidas, acentos stripped) entre gerado e original **< 0.2** → o "rewrite" não deriva do original.
4. **`jd-contamination`**: bigramas e trigramas de content-words do texto gerado que (a) não ocorrem em nenhum lugar do CV original (source completo normalizado) e (b) ocorrem na JD normalizada → violação. Exceção: n-grams que são exatamente um termo de `jdKeywords` (integrar keyword é o objetivo; frase da JD não é).

Ação em qualquer violação: **revert para o bullet original verbatim** (exceto `invalid-source` → descarte). Mesmos checks para `context` (contra o context original da posição) e `summary` (checks 2 e 4, contra o CV inteiro como "original"). Posições com `include: false` no draft mas não listadas em `removeSuggestions` são respeitadas (seleção é prerrogativa do generator). Thresholds (`0.2` Jaccard, n-gram ≥ 2) são constantes nomeadas no topo do arquivo para calibração.

### 4d. `src/graph/resume/renderer.ts` — template determinístico

```ts
export function renderResume(
  draft: ResumeDraft, source: ResumeSource, jobTitle: string, locale?: string
): string
```

Monta o Markdown na estrutura atual (Objective / Summary / Skills / Experience / Education), com:

- `## Objective` = `jobTitle` (linha única).
- Por posição incluída: `### {header verbatim}`, `**{period verbatim}**`, blank line, context (do draft, já verificado), blank line, bullets.
- `## Education` = `educationRaw` verbatim.
- Skills: `**Categoria:** item1, item2` por linha.
- Blank lines corretas **por template** — os 3 blocos de regex de pós-processamento do arquivo atual (linhas 296–314: injeção de context, spacing fixes) são deletados sem substituição.
- Headers de seção localizados por `locale` (Objective/Objetivo etc. — seguir os labels que o app já espera; se o app não depende de labels, manter em inglês como hoje).

### 4e. Religação em `routes.ts` e node do grafo

- `resumeGeneratorNode` (usado pelo grafo/rotas) vira orquestrador fino: `buildResumeSource → generateResumeDraft → verifyResumeDraft → renderResume`, retornando `{ resume, resumeDraft, resumeVerification }`.
- `/generate-resume` passa a responder `{ resume: string, verification: VerificationReport }` — o campo novo é aditivo; `jobapply-api` repassa opaco.

## Seção 5 — Migração dos consumidores

`jobapply-api` **não lê** `platforms[]` (verificado por grep) — repassa `ATSReport` opaco. Superfície real:

- **jobapply-api**: sincronizar espelho de tipos se existir em `atsService.ts`; remover forwarding/validação de `platform` e `jobUrl` em requests para o ats-agent (grep por esses campos e limpar).
- **jobapply-app**:
  - `src/domain/cv/types.ts`: remove `ATSPlatformScore` e `platforms`; adiciona `scoreBreakdown`, `matchedKeywords`, `missingKeywords`; `tips` sem `applicableTo`.
  - `src/domain/cv/tailoringHelpers.ts:36`: keywords faltantes passam a vir de `report.missingKeywords`.
  - `src/domain/cv/tailoringHelpers.ts:55`: chart por plataforma vira chart do breakdown — 3 barras: `[{ name: 'Keywords', value: keywordCoverage }, { name: 'Conteúdo', value: contentQuality }, { name: 'Formato', value: format }]`.
  - **Deletar** `src/domain/cv/components/AtsPlatformSelector/`; limpar referências em `useTailoringWorkspace.ts`, `ATSWorkspace.types.ts`, `CVTailoringPage.tsx`, `cvRepository.ts` (campo `platform` em requests).

## Seção 6 — Estratégia de testes

Módulos novos são funções puras — testáveis sem LLM, sem mock de banco:

- **`verifier`** (mais importante): fixtures — métrica dropada → revert; número inventado → revert; frase de 3+ palavras da JD sem âncora no CV → revert; reescrita legítima integrando keyword da lista → passa; `sourceIndex` duplicado → descarte; Jaccard baixo → revert.
- **`renderer`**: snapshot do Markdown de um `ResumeDraft` + `ResumeSource` fixos; caso com posição `include: false`; caso com educação multi-entrada.
- **`universalScorer`**: CV/keywords fixtures com breakdown esperado; "java" não casa "javascript"; termo composto casa; peso de seção aplicado; lista vazia de keywords.
- **`source`**: parser de markdown com aliases pt/en; CV estruturado sem markdown.
- E2E manual ao final: `POST /analyze` e `POST /generate-resume` com CV real, inspecionando `resumeVerification`.

Runner: o ats-agent não tem test runner hoje (`package.json` só tem build/dev/lint/typecheck). Adicionar `vitest` como devDependency + script `"test": "vitest run"` — primeira microtask da fase que introduz testes (B1 ou C1, a que rodar primeiro).

## Seção 7 — Decomposição em microtasks

Cada microtask: escopo de 1 agente pequeno, arquivos explícitos, DoD verificável. Dependências indicadas.

### Fase A — Fundação (sequencial)

| # | Microtask | Arquivos | DoD |
|---|-----------|----------|-----|
| A1 | Tipos v2 no ats-agent, aditivos (novos tipos convivem com velhos) | `ats-agent/src/types.ts` | `ScoreBreakdown`, `WeightedKeyword`, `ResumeDraft`, `VerificationReport`, `ResumeSource` exportados; `GraphState` estendido; typecheck passa |
| A2 | `jdKeywordExtractor` v2 (weighted + jobTitle, mantém `jdKeywords` plano) | `graph/nodes/jdKeywordExtractor.ts` | Node retorna os 3 campos; fallback de parse preservado; consumidores atuais intactos |
| A3 | Mover `parseJobDescription` para `src/lib/jd.ts` | `lib/jd.ts`, `platforms/utils.ts`, imports em 2 nodes | Função movida sem mudança de comportamento; imports atualizados; typecheck passa |

### Fase B — Score único (sequencial, depende de A)

| # | Microtask | Arquivos | DoD |
|---|-----------|----------|-----|
| B1 | `universalScorer` + testes | `graph/nodes/universalScorer.ts`, teste | Breakdown conforme Seção 3; testes de boundary/composto/seção passam |
| B2 | `semanticAnalyzer` sem platformScores | `graph/nodes/semanticAnalyzer.ts` | Recebe breakdown+missingKeywords; prompt atualizado; sem referência a plataformas |
| B3 | `aggregator` v2 | `graph/nodes/aggregator.ts` | Report novo shape; tips sem `applicableTo`; pesos 0.6/0.25/0.15 |
| B4 | Religar grafo + deletar plataforma | `graph/index.ts`, `graph/nodes/ruleScorer.ts` (del), `src/platforms/` (del), `types.ts` (remover tipos velhos), `api/routes.ts` (schema sem platform/jobUrl) | Grafo compila e roda; `PlatformScore` não existe mais; typecheck do pacote passa |

### Fase C — Resume verificado (depende de A; paralelizável com B)

| # | Microtask | Arquivos | DoD |
|---|-----------|----------|-----|
| C1 | Extrair `resume/source.ts` + testes do parser | `graph/resume/source.ts`, teste; `resumeGenerator.ts` importa dele | Funções movidas; comportamento idêntico; testes pt/en passam |
| C2 | `resume/generator.ts` (JSON, sem JD no prompt) | `graph/resume/generator.ts` | Emite `ResumeDraft` válido; prompt não contém a JD; 1 retry de parse |
| C3 | `resume/verifier.ts` + testes | `graph/resume/verifier.ts`, teste | 4 rules implementadas; reverts aplicados; todos os fixtures da Seção 6 passam |
| C4 | `resume/renderer.ts` + snapshot tests | `graph/resume/renderer.ts`, teste | Markdown por template; zero regex de pós-processamento; snapshots passam |
| C5 | Orquestrador + rota | `graph/nodes/resumeGenerator.ts` (vira fino), `api/routes.ts` | `/generate-resume` responde `{ resume, verification }`; código antigo de prompt/regex deletado |

### Fase D — Consumidores (depende de B4 e C5)

| # | Microtask | Arquivos | DoD |
|---|-----------|----------|-----|
| D1 | jobapply-api sync | `jobapply-api/src/services/atsService.ts` + schemas que citem platform/jobUrl | Sem referência a platform/jobUrl; typecheck passa |
| D2 | app: tipos + helpers | `jobapply-app/src/domain/cv/types.ts`, `tailoringHelpers.ts` | `ATSPlatformScore` removido; helpers usam `missingKeywords` e breakdown; typecheck passa |
| D3 | app: UI sem plataforma | `AtsPlatformSelector/` (del), `useTailoringWorkspace.ts`, `ATSWorkspace.types.ts`, `CVTailoringPage.tsx`, `cvRepository.ts` | Componente deletado; zero referências órfãs; app builda |
| D4 | Verificação final | — | `yarn workspaces run typecheck` e `lint` passam; e2e manual de `/analyze` e `/generate-resume` com inspeção do `resumeVerification` |

## Fora de escopo

- `cvGenerator` (adaptedCV): mantido como está, só ajustes de tipo.
- `interviewPrepAnalyzer` e `/interview-prep`: intocados.
- Verificador LLM-juiz (abordagem B): extensão futura se a verificação determinística for insuficiente nos casos sutis.
- `packages/contracts` (Opção C do workspace): fora desta iteração.

## Riscos e mitigações

- **Falsos positivos do verifier** (reescrita legítima revertida): revert é fail-safe — o resultado é o bullet original, nunca pior que o CV. Thresholds nomeados para calibração com o `VerificationReport` exposto.
- **`jobTitle` mal extraído** quebra o Objective: fallback — se vazio, Objective omitido do render (melhor que título errado).
- **Score único parecer "menos completo" que 8 scores**: o breakdown de 3 dimensões + matched/missing keywords dá mais informação acionável que os scores especulativos por plataforma.
