# Scorers — Documentação e Arquitetura

## Visão Geral

O sistema de scoring simula o comportamento de diferentes ATS (Applicant Tracking Systems). Cada plataforma tem seu próprio scorer que avalia um CV contra uma descrição de vaga e produz um `PlatformScore`.

```typescript
interface PlatformScore {
  platform: string
  score: number          // 0-100
  passed: boolean        // score >= threshold
  missingRequired: string[]
  missingPreferred: string[]
  flags: string[]        // warnings/red flags
  notes: string[]        // diagnostic info
}
```

**Arquivo:** `src/types.ts` (linhas 107-115)

---

## Camadas da Arquitetura

```
                     ┌─ Greenhouse ─┐
                     │  Lever        │
                     │  Workday      │
   ruleScorer ───────┤  iCIMS        ├─────► aggregator ──► ATSReport
     (graph node)    │  Gupy         │         (graph node)
                     │  Vagas        │
                     │  Catho        │
                     │  Inhire       │
                     │  Recruitee    │
                     │  BambooHR     │
                     │  Generic      │
                     └───────────────┘
```

### Camada 1 — Motor Compartilhado (`src/platforms/utils.ts`)

Funções utilitárias usadas por todos os scorers:

- **`extractJDKeywords(jd)`** — Tokeniza a JD em keywords únicas (stop words removidas, length >= 3, sem números puros)
- **`scoreKeywords(cv, jdKeywords)`** — Matching ponderado por seção (experiência=1.5, skills=1.4, summary=0.8, etc.). O divisor de normalização é 1.3 (tolerante).
- **`termMatches(cvText, keyword)`** — Substring matching, tolerância singular/plural, splitting de compostos
- **`detectGaps(experiences)`** — Detecta gaps de emprego (> 3 meses)
- **`detectShortTenures(experiences)`** — Detecta experiências curtas (< 6 meses)
- **`detectCareerProgression(experiences)`** — Detecta progressão de carreira
- **`extractDeclaredYears(summary)`** — Extrai anos de experiência declarados do summary

### Camada 2 — Scorers Específicos (10 plataformas)

Todos compartilham a mesma assinatura:
```typescript
(cv: MappedCV, jd: string, jdKeywords?: string[]) => PlatformScore
```

### Camada 3 — Orquestração (`src/graph/nodes/ruleScorer.ts`)

- Se o usuário especificou uma plataforma → roda apenas aquele scorer
- Se não especificou → roda TODOS os scorers em paralelo
- Usa `SCORER_MAP` (string → função) para dispatch nomeado

### Camada 4 — Agregação (`src/graph/nodes/aggregator.ts`)

- **Score universal**: Média ponderada dos scores individuais
  - Locale `pt-BR`: Gupy=3.0, Catho=1.5, Vagas=1.5, Inhire=1.5, demais=0.8
  - Locale `global`: Workday=3.0, Greenhouse=2.5, Lever=1.5, iCIMS=1.5, BR platforms=0.3-0.5
- **Geração de tips**: Missing keywords críticas → `critical`, flags recorrentes → `high` ou `critical`, gaps semânticos → `high`

### Camada 5 — Análise Semântica (`src/graph/nodes/semanticAnalyzer.ts`)

- Usa **Gemini** (LLM) para análise qualitativa
- Gera: voice profile, sugestões de rephrase, remove suggestions, keyword phrases com bullet points prontos

---

## Scorers Individuais

### 1. Greenhouse
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/greenhouse.ts` |
| **Threshold** | >= 70 |
| **Particularidades** | Se a JD tem seção "required" explícita, missing required keywords **capam o score em 60** (não passa). Detecta employment gaps (-10 cada) e career progression (+5). |
| **Passa se** | score >= 70 E não está capado |

### 2. Lever
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/lever.ts` |
| **Threshold** | >= 65 |
| **Particularidades** | **Synonym expansion**: React/React.js, k8s/Kubernetes, JS/JavaScript, etc. Detecta short tenures como flags. Todas as keywords missing vão para `missingPreferred` (sem split required/preferred). |

### 3. Workday
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/workday.ts` |
| **Threshold** | >= 70 |
| **Particularidades** | Detecta "dominant job family" da JD (frontend, backend, data, devops, mobile, ml) contando termos relacionados. Reporta family match % em notas. Sem modificadores de score. |

### 4. iCIMS
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/icims.ts` |
| **Threshold** | >= 65 |
| **Particularidades** | Mapeia skills do CV para uma taxonomia canônica. Extrai cidade da JD e compara com localização do CV — **flag se houver mismatch de localização**. |

### 5. Gupy
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/gupy.ts` |
| **Threshold** | >= 65 |
| **Particularidades** | Simula scoring **form-based** (Gupy usa formulário, não parsing de PDF). Pesos: experiência=2.0x, skills=1.8x. Detecta frases genéricas em português ("responsável por", "atuava como") como flags. +2 por métrica em bullet points (max +10). |
| **Passa se** | score >= 65 E sem flags de linguagem genérica |

### 6. Vagas.com
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/vagas.ts` |
| **Threshold** | >= 65 |
| **Particularidades** | **Strict keyword matching** (sem synonym tolerance). Extrai job title das primeiras 3 linhas da JD e dá +15 se o último cargo bater. Flag se não encontrar structured dates. |

### 7. Catho
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/catho.ts` |
| **Threshold** | >= 65 |
| **Particularidades** | Word count da seção de experiência deve ser >= 50 palavras (senão capa em 60). Extrai anos declarados vs. estimados por período. Checa presença de location. |
| **Passa se** | score >= 65 E experiência >= 50 palavras |

### 8. Inhire
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/inhire.ts` |
| **Threshold** | >= 65 |
| **Particularidades** | **Tech-focused**. Stack match % computado separadamente. Score final: 60% keyword match + 40% stack match. +5 se tiver portfolio/GitHub URL. |
| **Passa se** | score >= 65 E tem URLs |

### 9. Recruitee
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/recruitee.ts` |
| **Threshold** | >= 65 |
| **Particularidades** | **Culture-fit signals** (agile, ownership, cross-functional). +5 para career progression. -5 se summary for curto/ausente. Flags se faltam culture signals. |

### 10. BambooHR
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/bamboohr.ts` |
| **Threshold** | >= 50 |
| **Particularidades** | **SMB focus**. Score: 70% keyword match + 30% section completeness (5 seções: contact, summary, experience, education, skills). -10 se email ausente. Flags se experiência esparsa ou verbose. |

### 11. Generic (fallback)
| Campo | Detalhe |
|---|---|
| **Arquivo** | `src/platforms/generic.ts` |
| **Threshold** | >= 45 |
| **Particularidades** | **Fallback** para plataformas desconhecidas. Keyword match puro. Flags se summary ausente ou conteúdo esparso. |

---

## Pipeline Completo

```
src/graph/index.ts

mapper ──► jdKeywordExtractor ──► ruleScorer ──► semanticAnalyzer ──► cvGenerator ──► aggregator ──► end
```

1. **mapper**: Transforma CV raw em `MappedCV` (seções achatadas + entidades extraídas)
2. **jdKeywordExtractor**: Extrai keywords da JD
3. **ruleScorer**: Executa os platform scorers
4. **semanticAnalyzer**: Análise LLM (Gemini) com base nos scores + CV + JD
5. **cvGenerator**: Gera CV adaptado
6. **aggregator**: Produz o `ATSReport` final

---

## Referências e Documentação

### ATS Platforms
- [Greenhouse](https://support.greenhouse.com/hc/en-us/articles/360022342012-Resume-Parsing) — Resume parsing docs
- [Lever](https://help.lever.co/hc/en-us/articles/10476684445203-Resume-Parsing-Overview) — Resume parsing overview
- [Workday](https://www.workday.com/en-us/product-pages/workday-hcm.html) — HCM platform
- [iCIMS](https://www.icims.com/platform/) — Talent acquisition platform
- [Gupy](https://www.gupy.io/) — Brazilian ATS
- [Vagas.com](https://www.vagas.com.br/) — Brazilian job platform
- [Catho](https://www.catho.com.br/) — Brazilian job platform
- [Inhire](https://inhire.com.br/) — Brazilian tech recruitment
- [Recruitee](https://recruitee.com/) — Collaborative hiring platform (Europe)
- [BambooHR](https://www.bamboohr.com/) — SMB HR platform

### Tecnologias do Projeto
- [LangGraph](https://langchain-ai.github.io/langgraph/) — Graph-based orchestration framework
- [Gemini API](https://ai.google.dev/gemini-api/docs) — LLM for semantic analysis
- [TypeScript](https://www.typescriptlang.org/docs/) — Language

### Conceitos Relacionados
- [ATS Resume Parsing — How It Works](https://www.jobscan.co/blog/ats-resume-parsing/)
- [Keyword Matching Strategies](https://resumeworded.com/blog/ats-keywords)
- [Job Description to Skills Taxonomy](https://www.emsi.com/)
