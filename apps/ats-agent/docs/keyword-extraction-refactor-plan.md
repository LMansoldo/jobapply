# Refactor: ATS Agent → LangGraph Pipeline (v2)

## Contexto

Tenho um agente de análise de CVs que compara um currículo (CV) com uma Job Description (JD)
e retorna um score ATS com feedback editorial. O código atual usa um prompt monolítico que faz
tudo de uma vez, com extração de keywords acoplada ao score principal.

Preciso refatorar para um grafo LangGraph com nós separados por responsabilidade, dois modelos
Gemini distintos por tipo de tarefa, e sem nenhum mecanismo de fallback — a extração de keywords
via LLM é confiável o suficiente para ser o único caminho.

---

## O que o sistema faz hoje

1. Recebe CV (string parseada) e JD (string)
2. Extrai keywords da JD com um prompt dedicado (hoje com tools de fallback que serão removidas)
3. Roda um prompt principal de score que analisa tudo junto: experiência, educação, skills, formato
4. Retorna para o usuário um objeto com:
   - `keywordsFromJd` — keywords da JD identificadas no CV
   - `keywordsMissing` — keywords da JD ausentes no CV
   - `phrasesToKeep` — frases boas para manter
   - `phrasesToAlter` — frases fracas com sugestão de melhoria `{ original, suggestion }`
   - `phrasesToRemove` — frases para retirar
   - `suggestedPhrases` — frases novas para inserir
   - Score por plataforma ATS: iHire, Glassdoor, BambooHR, Greenhouse, Lever, Workday

---

## Arquitetura alvo

```
START
  ├──→ [parseCV]  ──┐
  └──→ [parseJD]  ──┴──→ [extractKeywords]  ← Gemini Pro
                               ↓
                         [analysisFork]      ← pass-through, fan-out
                               ↓
          ┌────────────────────┼────────────────────┐
          ↓                    ↓                    ↓              ↓
  [analyzeExperience]  [analyzeEducation]  [analyzeSkills]  [analyzeFormat]
          └────────────────────┴────────────────────┘
                               ↓
                       [scorePlatforms]      ← TypeScript puro, zero LLM
                               ↓
                           [aggregate]       ← TypeScript puro, zero LLM
                               ↓
                              END
```

**Sem fallback. Sem edge condicional. Sem `keywordExtractionFailed`.**
O grafo é linear após o fan-out.

---

## Modelos por nó

| Nó | Modelo | Motivo |
|---|---|---|
| `extractKeywords` | `gemini-2.5-pro` | Precisão em bigramas, termos técnicos compostos, termos inéditos |
| `parseCV` | `gemini-2.0-flash` | Tarefa de parse estruturado, velocidade importa |
| `parseJD` | `gemini-2.0-flash` | Idem |
| `analyzeExperience` | `gemini-2.0-flash` | Roda em paralelo, volume alto |
| `analyzeEducation` | `gemini-2.0-flash` | Idem |
| `analyzeSkills` | `gemini-2.0-flash` | Idem |
| `analyzeFormat` | `gemini-2.0-flash` | Idem |
| `scorePlatforms` | — | Sem LLM |
| `aggregate` | — | Sem LLM |

Instanciar dois clientes separados no topo de `graph.ts`:

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const flashLLM = new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash" });
const proLLM   = new ChatGoogleGenerativeAI({ model: "gemini-2.5-pro" });
```

---

## Estrutura de arquivos

```
src/
  ats/
    graph.ts              ← monta e exporta o grafo compilado
    state.ts              ← ATSState (Annotation.Root) + todas as interfaces
    nodes/
      parseCV.ts
      parseJD.ts
      extractKeywords.ts
      analysisFork.ts
      analyzeExperience.ts
      analyzeEducation.ts
      analyzeSkills.ts
      analyzeFormat.ts
      scorePlatforms.ts
      aggregate.ts
    schemas/
      sectionSchema.ts    ← Zod schema para structured output de seção
      keywordsSchema.ts   ← Zod schema para structured output de keywords
    config/
      platformWeights.ts  ← PLATFORM_WEIGHTS, sem LLM
    utils/
      scoreSection.ts     ← cálculo de score por seção
      recommendation.ts   ← score numérico → label
```

Sem `keywordsFallback.ts`. Sem `keyword-cache.ts`. Sem `scripts/`.

---

## Contratos de tipos (imutáveis)

```typescript
// state.ts

interface SectionAnalysis {
  keywordsFromJd: string[];
  keywordsMissing: string[];
  phrasesToKeep: string[];
  phrasesToAlter: { original: string; suggestion: string }[];
  phrasesToRemove: string[];
  suggestedPhrases: string[];
}

interface PlatformScore {
  platform: string;
  total: number;
  breakdown: Record<string, number>;
  recommendation: "Strong Match" | "Good Match" | "Needs Improvement" | "Poor Match";
}
```

---

## Estado do grafo

```typescript
// state.ts — ATSState

// Inputs
cvRaw: string
jdRaw: string

// Parsed
cvParsed: string
jdParsed: string

// Keywords — preenchidos por extractKeywords
cvKeywords: string[]
jdKeywords: string[]
keywordGaps: string[]   // jdKeywords que não aparecem no CV (case-insensitive)

// Análises por seção — preenchidas em paralelo
analysisExperience: SectionAnalysis
analysisEducation:  SectionAnalysis
analysisSkills:     SectionAnalysis
analysisFormat:     SectionAnalysis

// Scores — preenchidos por scorePlatforms (TS puro)
platformScores: Record<string, PlatformScore>

// Output final — preenchido por aggregate
resumeSuggestions: string[]
finalReport: Record<string, unknown>
```

**Remover `keywordExtractionFailed` — não existe mais no estado.**

---

## Regras por nó

### `parseCV` e `parseJD`
- Modelo: `flashLLM`
- Rodam em paralelo a partir do `START` — cada um tem sua própria aresta saindo de `START`
- `parseCV` system prompt: estruturar CV em texto limpo preservando todas as seções (experiência, educação, habilidades, formato)
- `parseJD` system prompt: estruturar JD em texto limpo destacando requisitos obrigatórios, desejáveis, responsabilidades e cultura
- `extractKeywords` só dispara após ambos terminarem — LangGraph aguarda automaticamente múltiplas arestas de entrada

### `extractKeywords`
- Modelo: `proLLM` com `withStructuredOutput(keywordsSchema)`
- Roda extração de CV e JD em **`Promise.all`** dentro do próprio nó (dois contextos distintos, sem dependência entre si)
- `keywordGaps` calculado em TypeScript: `jdKeywords.filter(k => !cvKeywords.includes(k.toLowerCase()))`
- System prompt CV: extrair keywords técnicas, profissionais e de domínio — incluir tecnologias, ferramentas, cargos, metodologias, soft skills
- System prompt JD: extrair keywords essenciais — priorizar requisitos técnicos, ferramentas, cargos citados, competências exigidas, **bigramas e termos compostos** (ex: "design system", "machine learning", "api rest")
- Não capturar exceção — deixar propagar. O grafo não tem fallback para este nó.

### `analysisFork`
- Nó pass-through: `async (_state) => ({})`
- Existe apenas como ponto de fan-out para os 4 nós de análise

### `analyzeExperience`, `analyzeEducation`, `analyzeSkills`, `analyzeFormat`
- Modelo: `flashLLM` com `withStructuredOutput(sectionSchema)`
- Rodam em paralelo via arestas do grafo — **não usar `Promise.all` entre eles**
- User message de todos: CV parseado + JD parseada + keywords da JD já extraídas
- System prompts focados exclusivamente na seção:
  - Experience: cargos, responsabilidades, realizações, tempo de experiência, domínios de atuação
  - Education: grau acadêmico, área de formação, certificações, cursos relevantes
  - Skills: tecnologias, ferramentas, linguagens, frameworks, competências interpessoais — hard e soft skills
  - Format: clareza das seções, uso de bullets, densidade de keywords, ausência de tabelas/imagens, legibilidade para parsers ATS
- Em caso de exceção: logar erro, retornar `SectionAnalysis` com todos os campos como arrays vazios

### `scorePlatforms`
- **Zero LLM**
- Importar pesos de `config/platformWeights.ts`
- Calcular `scoreSection` para cada seção usando `utils/scoreSection.ts`:
  ```
  keywordScore = keywordsFromJd.length / jdKeywords.length
  phraseScore  = phrasesToKeep.length / (phrasesToKeep + phrasesToAlter + phrasesToRemove).length
  sectionScore = (keywordScore * 0.6) + (phraseScore * 0.4)   → × 100 → arredondar
  ```
- Score final por plataforma: soma ponderada dos 4 `sectionScore` pelos pesos da plataforma
- `recommendation` via `utils/recommendation.ts`:
  - >= 80 → "Strong Match"
  - >= 60 → "Good Match"
  - >= 40 → "Needs Improvement"
  - <  40 → "Poor Match"
- `jdKeywords` vazio → `scoreSection` retorna 0 sem dividir por zero

### `aggregate`
- **Zero LLM**
- Coletar `suggestedPhrases` de todas as 4 seções → `resumeSuggestions`
- Montar `finalReport`:
  ```typescript
  {
    summary: {
      keywordCoverage: number,   // % de jdKeywords presentes no CV
      keywordGaps: string[],
      platformScores: Record<string, PlatformScore>,
    },
    sections: {
      experience: SectionAnalysis,
      education:  SectionAnalysis,
      skills:     SectionAnalysis,
      format:     SectionAnalysis,
    },
    resumeSuggestions: string[],
  }
  ```

---

## Pesos das plataformas (`config/platformWeights.ts`)

```typescript
export const PLATFORM_WEIGHTS: Record<string, Record<string, number>> = {
  greenhouse: { experience: 0.40, skills: 0.35, education: 0.15, format: 0.10 },
  glassdoor:  { experience: 0.30, skills: 0.40, education: 0.20, format: 0.10 },
  bamboohr:   { experience: 0.35, skills: 0.30, education: 0.25, format: 0.10 },
  ihire:      { experience: 0.45, skills: 0.25, education: 0.20, format: 0.10 },
  lever:      { experience: 0.35, skills: 0.35, education: 0.20, format: 0.10 },
  workday:    { experience: 0.40, skills: 0.30, education: 0.20, format: 0.10 },
}
```

---

## Montagem do grafo (`graph.ts`)

```typescript
builder
  // Parse em paralelo
  .addEdge(START,             "parseCV")
  .addEdge(START,             "parseJD")

  // extractKeywords aguarda os dois
  .addEdge("parseCV",         "extractKeywords")
  .addEdge("parseJD",         "extractKeywords")

  // Fan-out
  .addEdge("extractKeywords", "analysisFork")
  .addEdge("analysisFork",    "analyzeExperience")
  .addEdge("analysisFork",    "analyzeEducation")
  .addEdge("analysisFork",    "analyzeSkills")
  .addEdge("analysisFork",    "analyzeFormat")

  // Fan-in → score → aggregate → fim
  .addEdge("analyzeExperience", "scorePlatforms")
  .addEdge("analyzeEducation",  "scorePlatforms")
  .addEdge("analyzeSkills",     "scorePlatforms")
  .addEdge("analyzeFormat",     "scorePlatforms")
  .addEdge("scorePlatforms",    "aggregate")
  .addEdge("aggregate",         END)
```

**Sem `addConditionalEdges`. Sem rota de fallback.**

---

## Dependências

```bash
npm install @langchain/langgraph @langchain/google-genai zod
```

Remover `@langchain/anthropic` se não for usado em mais nenhum lugar do projeto.

---

## O que NÃO fazer

- Não adicionar fallback de keywords — o nó `extractKeywords` não tem tratamento de erro intencional
- Não usar `Promise.all` entre os nós de análise de seção — o LangGraph gerencia o paralelismo pelas arestas
- Não instanciar `ChatGoogleGenerativeAI` dentro dos nós — receber o cliente como parâmetro ou importar de `graph.ts`
- Não misturar lógica de scoring com chamadas LLM no mesmo nó
- Não hardcodar pesos dentro dos nós — sempre importar de `platformWeights.ts`
- Não usar `any` — tipar tudo com as interfaces de `state.ts`
- Não criar arquivo monolítico — respeitar a estrutura de pastas
- Não deixar `console.log` de debug — usar logger ou remover

---

## Entregável esperado

1. `src/ats/graph.ts` exporta `atsGraph` compilado e pronto para uso
2. Todos os nós em arquivos separados em `src/ats/nodes/`
3. Invocação funcional:
   ```typescript
   const result = await atsGraph.invoke({ cvRaw: "...", jdRaw: "..." });
   console.log(result.finalReport);
   ```
4. `tsc --noEmit` sem erros
5. Nenhum `console.log` de debug no código final