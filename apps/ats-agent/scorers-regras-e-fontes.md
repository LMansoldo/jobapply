# Scorers — Regras e Fontes de Referência

> **Atenção:** Nenhum scorer no código-fonte contém URLs, documentações externas ou referências bibliográficas. Todas as regras foram implementadas como **heurísticas próprias** (engenharia reversa informal, boas práticas do mercado de recrutamento, e conhecimento empírico). Abaixo, cada regra é acompanhada de **links sugeridos** como fonte de estudo para quem quiser aprofundar ou validar as premissas.

---

## Motor Compartilhado (`src/platforms/utils.ts`)

| Regra / Heurística | Fonte no Código | Links de Referência |
|---|---|---|
| **Stop words filtering** na extração de keywords da JD | Lista hardcoded de stop words em inglês/português | [NLTK Stop Words List](https://gist.github.com/sebleier/554280) • [Ranking TF-IDF para keyword extraction](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) |
| **Section-weighted keyword matching** (experiência=1.5, skills=1.4, summary=0.8, etc.) | Mapa `SECTION_WEIGHTS` | [JobScan — How ATS Parsing Works](https://www.jobscan.co/blog/ats-resume-parsing/) • [Resume Worded — ATS Keyword Strategy](https://resumeworded.com/blog/ats-keywords) |
| **Divisor de normalização = 1.3** (em vez de 1.5) para ser mais leniente | Comentário inline explicando a escolha | Heurística própria — não há referência externa |
| **Detecção de gaps** (> 3 meses entre experiências) | Função `detectGaps` | [The Balance — Employment Gaps on Resume](https://www.thebalancemoney.com/employment-gaps-on-resume-2062991) |
| **Short tenures** (< 6 meses) como bandeira amarela | Função `detectShortTenures` | [Indeed — How to Explain Short Tenures](https://www.indeed.com/career-advice/interviewing/explaining-short-tenure) |
| **Career progression** detectada por aumento de cargo/senioridade | Função `detectCareerProgression` | [LinkedIn — Career Progression Patterns](https://www.linkedin.com/business/talent/blog/talent-strategy/career-progression-patterns) |
| **Parsing de JD** — extração de seções (required, preferred, qualifications) | Regex `CONTENT_HEADER_RE` e `NOISE_HEADER_RE` | [Greenhouse — Structuring a Job Description](https://support.greenhouse.com/hc/en-us/articles/360022342012-Resume-Parsing) |

---

## Greenhouse (`src/platforms/greenhouse.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| Score capped em 60 se JD tem seção "Required" explícita e candidato não cobre keywords obrigatórias | Comentário: *"Only apply the cap when the JD actually has an explicit Required section"* | [Greenhouse — How Scoring Works](https://support.greenhouse.com/hc/en-us/articles/360022342012-Resume-Parsing) • [JobScan — Greenhouse ATS Guide](https://www.jobscan.co/blog/greenhouse-ats/) |
| -10 por employment gap, +5 por career progression | Heurística própria | [Greenhouse Blog — Sourcing & Screening](https://www.greenhouse.com/blog/tag/sourcing) |
| Threshold de aprovação: >= 70 | Heurística própria | — |

---

## Lever (`src/platforms/lever.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Synonym expansion**: React/React.js, k8s/Kubernetes, JS/JavaScript, etc. | Mapa `SYNONYMS` hardcoded | [Lever — Resume Parsing](https://help.lever.co/hc/en-us/articles/10476684445203-Resume-Parsing-Overview) |
| Short tenures viram flags, sem split required/preferred | Heurística própria | [Lever Blog — Hiring Best Practices](https://www.lever.co/blog/) |
| Threshold: >= 65 | Heurística própria | — |

---

## Workday (`src/platforms/workday.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Dominant job family detection** (frontend, backend, data, devops, mobile, ml) | Mapa `JOB_FAMILIES` hardcoded | [Workday — Skills Cloud](https://www.workday.com/en-us/product-pages/workday-skills-cloud.html) |
| Family match % reportado em notas, sem modificar score | Heurística própria | [Workday — HCM Documentation](https://www.workday.com/en-us/product-pages/workday-hcm.html) |
| Threshold: >= 70 | Heurística própria | — |

---

## iCIMS (`src/platforms/icims.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Canonical skills taxonomy** para mapeamento de skills do CV | Array `CANONICAL_SKILLS` hardcoded | [iCIMS — Skills Taxonomy](https://www.icims.com/platform/) • [EMSISkills](https://www.emsi.com/) (taxonomia referência de mercado) |
| **Location mismatch detection** — extrai cidade da JD e compara com CV | Regex `extractCitiesFromJD` + lista de cidades | [iCIMS — Candidate Matching](https://www.icims.com/platform/) |
| Threshold: >= 65 | Heurística própria | — |

---

## Gupy (`src/platforms/gupy.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Form-based scoring** (não parsing de PDF) — usa só experiência e skills | Comentário inline explicando que Gupy usa formulário | [Gupy — Portal da Pessoa Candidata](https://www.gupy.io/) • [Gupy Blog — Processo Seletivo](https://www.gupy.io/blog) |
| Pesos: experiência=2.0x, skills=1.8x | Heurística própria | — |
| **Generic Portuguese phrases detection** ("responsável por", "atuava como", etc.) | Array `GENERIC_PHRASES` | [Gupy Blog — Dicas de Currículo](https://www.gupy.io/blog/dicas-de-curriculo) |
| +2 por bullet point com métrica (max +10) | Regex `METRICS_PATTERN` | [Gupy — IA Gaia Scoring](https://www.gupy.io/) (plataforma de IA da Gupy) |
| Threshold: >= 65 e sem generic language flags | Heurística própria | — |

---

## Vagas.com (`src/platforms/vagas.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Strict keyword matching** (sem synonym tolerance) | Comentário inline | [Vagas.com — Para Candidatos](https://www.vagas.com.br/) |
| **Title matching bonus** (+15 se último cargo bater com título da JD nos primeiros campos) | Funções `extractJDTitle` e `titleMatches` | [Vagas.com Blog — Currículo Ideal](https://www.vagas.com.br/blog/) |
| Flag se não encontrar structured dates | Heurística própria | — |
| Threshold: >= 65 | Heurística própria | — |

---

## Catho (`src/platforms/catho.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Word count mínimo** de 50 palavras na experiência (senão capa em 60) | Heurística própria | [Catho — Dicas de Currículo](https://www.catho.com.br/) |
| **Declared years vs. estimated years** comparison | Regex `EXPERIENCE_YEARS_PATTERN` | [Catho Blog — Como Fazer Currículo](https://www.catho.com.br/carreira/curriculo/) |
| Location presence check | Heurística própria | — |
| Threshold: >= 65 e experience >= 50 palavras | Heurística própria | — |

---

## Inhire (`src/platforms/inhire.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Tech stack match** — computa % de match tech separado | Função `computeStackMatch` | [Inhire — Vagas de Tecnologia](https://inhire.com.br/) |
| Score final: 60% keyword match + 40% stack match | Heurística própria | [Inhire Blog — Recrutamento Tech](https://inhire.com.br/blog) |
| +5 se tiver portfolio/GitHub URL | Regex `URL_PATTERN` | — |
| Threshold: >= 65 e tem URLs | Heurística própria | — |

---

## Recruitee (`src/platforms/recruitee.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Culture-fit signals** (agile, ownership, cross-functional, etc.) | Array `CULTURE_SIGNALS` + mapa `SYNONYMS` | [Recruitee — Culture Fit Assessment](https://recruitee.com/) |
| +5 career progression, -5 se summary curto/ausente | Heurística própria | [Recruitee Blog — Hiring Culture](https://recruitee.com/blog) |
| Threshold: >= 65 | Heurística própria | — |

---

## BambooHR (`src/platforms/bamboohr.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **SMB focus** — scoring mais leniente | Comentário inline: *"BambooHR is common in SMBs"* | [BambooHR — Platform Overview](https://www.bamboohr.com/) |
| Score: 70% keyword match + 30% section completeness (5 seções) | Array `COMPLETENESS_SECTIONS` | [BambooHR Blog — Hiring for SMBs](https://www.bamboohr.com/blog) |
| -10 se email ausente | Heurística própria | — |
| Threshold: >= 50 (mais baixo que os demais) | Heurística própria | — |

---

## Generic (`src/platforms/generic.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Fallback** para plataformas desconhecidas — keyword match puro | Comentário inline | — |
| Flags se summary ausente ou conteúdo esparso | Heurística própria | — |
| Threshold: >= 45 | Comentário: *"baseline leniency"* | — |

---

## Agregação (`src/graph/nodes/aggregator.ts`)

| Regra | Fonte no Código | Links de Referência |
|---|---|---|
| **Pesos por locale** — pt-BR: Gupy=3.0, Catho=1.5, Vagas=1.5, Inhire=1.5, demais=0.8 | Mapa `WEIGHTS_BR` | Heurística própria — reflete dominância de mercado brasileiro |
| **Pesos globais**: Workday=3.0, Greenhouse=2.5, Lever=1.5, iCIMS=1.5 | Mapa `WEIGHTS_GLOBAL` | Heurística própria — baseada em market share estimado |
| **Deduplicação de tips**: missing keywords críticas → `critical`, flags em 2+ plataformas → `high`/`critical` | Função `buildTips` | Heurística própria |

---

## Resumo

**Nenhuma regra no código possui uma URL ou documentação oficial como fonte.** Tudo foi construído com base em:

1. **Engenharia reversa informal** — comportamento observado de cada ATS
2. **Boas práticas gerais de currículo para ATS** — conceitos como keyword density, section weighting, detection de gaps
3. **Heurísticas de mercado** — pesos de plataformas por dominância regional

### Para pesquisa e aprofundamento real, as fontes mais relevantes seriam:

- **JobScan** ([jobscan.co](https://www.jobscan.co/blog/ats-resume-parsing/)) — Análises de como diferentes ATS processam currículos
- **Resume Worded** ([resumeworded.com](https://resumeworded.com/blog/ats-keywords)) — Estratégias de keyword matching
- **Skill taxonomy providers**: [EMSISkills](https://www.emsi.com/), [Lightcast](https://lightcast.io/) — Taxonomias padronizadas de skills
- **Documentações oficiais** de parsing: [Greenhouse](https://support.greenhouse.com/hc/en-us/articles/360022342012-Resume-Parsing), [Lever](https://help.lever.co/hc/en-us/articles/10476684445203-Resume-Parsing-Overview)
- **Gupy Blog** ([gupy.io/blog](https://www.gupy.io/blog)) — Boas práticas para o mercado brasileiro

> **Nota:** Se o objetivo é tornar as regras mais fiéis à realidade, o caminho seria: (1) testar currículos reais em cada ATS e comparar scores, (2) calibrar as heurísticas com base nos resultados, (3) documentar as fontes de cada calibração.
