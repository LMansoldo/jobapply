# dojob — Redesign da Landing Page `/` (design spec)

**Data:** 2026-07-29
**App:** `apps/jobapply-app` (Vite + React + TypeScript, TanStack Router)
**Rota alvo:** `/` (`src/routes/index.tsx` → `presentation/pages/LandingPage`)
**Mock de referência:** `DoJob landing page redesign/JobApply Landing.dc.html`
**Marca / domínio:** `dojob` · `https://dojob.pro`

---

## 1. Objetivo

Substituir por completo a landing page atual (hero roxo-escuro + fundo lilás) pelo novo
redesign "aurora sobre fundo claro" do mock, com:

1. Reconstrução **fiel em JSX** de todas as seções, incluindo os dois screenshots
   detalhados do produto (app no hero + editor nos recursos).
2. **i18n completo BR + EN**, traduzindo inclusive o conteúdo ilustrativo dos screenshots.
3. **SEO** robusto na raiz `/` (tags estáticas no `index.html`, JSON-LD, robots, sitemap, favicon).
4. **Thumbnail / og:image** 1200×630 na identidade nova.

A rota já redireciona usuário autenticado para `/tailoring` (`beforeLoad` em `index.tsx`) —
esse comportamento é mantido.

---

## 2. Estado atual vs. alvo

| Área | Atual (no ar) | Redesign |
|---|---|---|
| Base visual | Hero gradiente roxo-escuro + fundo `#f5f3ff` | Fundo claro `#f2f2f5` + **aurora** (4 blobs animados roxo/ciano/rosa/verde + véu) |
| Nav | Pílula glass; CTA gradiente "Entrar" | Pílula glass branca; **botão preto** "Testar grátis" + link "Entrar" |
| Hero | Texto + placeholder de imagem + badge "91" | Display gigante (clamp 56→148px) + **screenshot fiel do app** |
| Recursos | 6 cards emoji (grid 3col) | Lista **sticky numerada** (6) + **mock claro do editor** |
| Passos | 3 passos + card ATS | **4 passos** em cards glass com números gigantes vazados |
| CTA | Banda roxa | Painel glass com aurora interna |
| Footer | Dark + 5 links | Minimal claro: marca · `© 2026 · dojob.pro` + 5 links |
| Fontes | Lato + **Font Awesome** | Lato + **JetBrains Mono** (Font Awesome removido) |

---

## 3. Arquitetura de arquivos

Quebrar a `LandingPage` (hoje monolito de 458 linhas) em subcomponentes presentacionais:

```
src/presentation/pages/LandingPage/
├── index.ts
├── LandingPage.tsx            # compõe seções + fundo aurora + hook de reveal
├── LandingPage.styles.ts      # classes emotion/css compartilhadas (aurora, glass, btn, tipografia, ring, bar)
├── data.ts                    # arrays tipados (features, steps, scores, categories, atsList, suggestKw, minimap)
├── useRevealOnScroll.ts       # hook: adiciona `.in` aos `.fade-in` ao entrar na viewport (respeita reduced-motion)
└── components/
    ├── Topbar.tsx
    ├── Hero.tsx
    ├── AppScreenshot.tsx       # mock fiel do app (tabs, editor md escuro, painel score 30/100)
    ├── FeaturesSection.tsx     # heading + lista sticky numerada
    ├── EditorMock.tsx          # mock claro (JD, antes/depois, keywords, ring 91)
    ├── StepsSection.tsx        # 4 cards glass
    ├── FinalCTA.tsx            # painel glass + aurora
    └── Footer.tsx
```

**Regras:**
- Componentes são puramente presentacionais; recebem `t` via `useTranslation()` interno e leem dados de `data.ts`.
- Nenhuma chamada HTTP nem lógica de negócio (conforme `apps/jobapply-app/CLAUDE.md`).
- Estilos por emotion `css`/`keyframes` (padrão já usado na `LandingPage` atual). Sem CSS global novo.
- Reaproveitar `Link` do `@tanstack/react-router` para navegação interna.

---

## 4. Design tokens & estilos

Reproduzir o "guia de estilo" do mock (bloco `:root` + classes). Como o projeto usa emotion,
os tokens viram constantes em `LandingPage.styles.ts`:

```
--ink:      #0a0a12   (texto principal)
--brand:    #7c5cfc   (roxo marca)
--fg-soft:  rgba(10,10,18,.62)
--line:     rgba(10,10,18,.08)
acentos:    #8b5cf6 · #06b6d4 (ciano) · #ec4899 (rosa) · #16a34a (verde) · #eab308 (amarelo)
fundo:      #f2f2f5
glass:      rgba(255,255,255,.72) + backdrop-blur
sombras:    sh-sm / sh-md / sh-lg / sh-dark / sh-brand (ver mock)
```

**Superfícies e primitivos** (equivalentes às classes do mock): `glass`, `panel` (radius 32),
`card-white` (radius 20), `chip`, botões `btn--dark` / `btn--ghost` nos tamanhos `md/lg/xl`.

**Tipografia:** `.display` (clamp 56→148px, weight 900, line-height .92), `.heading`
(clamp 48→100px), `.heading--cta` (clamp 56→124px), `.lead` / `.lead--sm`, `.accent`
(gradiente em texto, variantes `--cyan` / `--pink`), `.u-mono` (JetBrains Mono).

**Ring de score** (SVG): reproduzir `.ring` (150px) e `.ring--sm`, com o gradiente `g1`/`g2`
e a animação `scoreCount` (stroke-dashoffset 283→26) no ring do editor mock.

**Barras** (`.bar` / `.bar__fill` / `--cyan` / `--sm`): largura vem dos dados (%).

### 4.1 Animações
- `auroraDrift` / `auroraDrift2` nos blobs; `fadeUp` no reveal; `scoreCount` no ring.
- **`prefers-reduced-motion: reduce`** desativa todas as animações (blobs estáticos, `.fade-in`
  entra sem transform, ring já no valor final).

### 4.2 Fontes
- `index.html`: trocar o `<link>` de fontes por
  `Lato:wght@300;400;700;900` + `JetBrains+Mono:wght@400;500`.
- **Remover** o `<link>` do Font Awesome (`cdnjs …/font-awesome`) — o redesign não usa FA;
  todos os "ícones" são CSS puro. Verificar que nenhuma outra página depende de `fa-*`
  (a `LandingPage` atual usa `fa-chevron-down`, `fa-rocket`, `fa-file-pdf`, `fa-arrow-up`,
  todas removidas neste redesign). Se outra rota usar FA, manter o link.

---

## 5. Especificação por seção

Todas as seções ficam dentro de um wrapper `position:relative; overflow:hidden; background:#f2f2f5`
com o `<Aurora/>` (4 blobs + véu) atrás (`z-index:0`) e o conteúdo em `.section` (max-width 1440,
`z-index:5`). Cada bloco de conteúdo recebe `fade-in`.

### 5.1 Topbar (`Topbar.tsx`)
Pílula glass fixa (`top:16px`), max-width 1360. Esquerda: marca `dojob` (weight 900).
Centro: links `Como funciona` (→ `#como-funciona`) e `Score ATS` (→ `#recursos`).
Direita: `Entrar` (link → `/login`) + botão preto `btn--dark btn--md` `Testar grátis` (→ `/register`).
Em ≤640px os links centrais somem (regra `.app__tabs{display:none}` do mock aplica-se aqui à nav).

### 5.2 Hero (`Hero.tsx`)
- `.section--hero` (`padding:150px 48px 100px`).
- `<h1 class="display">`: 3 linhas com `<br>`, última palavra em `.accent`.
- `.hero__sub`: `.lead` à esquerda (com trecho em `.lead__hl`) + `.hero__actions`
  (`Tailorizar meu CV →` `btn--dark btn--lg` → `/register`; `Ver como funciona`
  `btn--ghost btn--lg` → `#como-funciona`).
- `.hero__shot`: `<AppScreenshot/>`.

### 5.3 AppScreenshot (`AppScreenshot.tsx`) — mock fiel do produto
`card-white` contendo, de cima pra baixo (reproduzir markup/estilo do mock, §9b):
1. **`app__topbar`**: marca `do`+`job` (roxo no "job"); tabs `Tailoring` (ativa), `LinkedIn`, `Perfil`
   com ícones CSS; à direita `app__user` (avatar gradiente + nome `Lucas`).
2. **`app__sub`**: `Nova análise` (spinner CSS) · título `Tailoring manual` + desc
   `Two of Us Tech Page 1 · Frontend talent for modern product teams`; à direita
   `app__mode` (dot verde) `Modo manual`.
3. **`app__ats`**: label `ATS:` + chips de `atsList` (Greenhouse, Lever, Workday, LinkedIn, Gupy).
4. **`app__split`** (grid 1.55fr / 1fr, colapsa em 1col ≤900px):
   - **Editor markdown escuro** (`editor`): toolbar (`Arquivo`, `Exportar`, B/I/H1..H3,
     divider, ícones), corpo com o CV de exemplo em markdown colorido (`md-h`, `md-p`, `md-strong`,
     `md-sub`, `md-loc`, `md-remote`), minimapa (larguras de `data.minimap`), status bar
     (`Markdown` · `Ln 1, Col 1` · `842 palavras` · `PT-BR`).
   - **Painel de score** (`score`): banner `Com sugestões: 30 → 45 pts` + badge `+15 pts`;
     ring **30/100** (`ring__value` 30, `ring__unit` /100) + label `Pontuação ATS`;
     `Análise por categoria` com barras de `data.categories` (Keywords 18%, Conteúdo 48%, Formato 82%);
     bloco `export` (`Exportar versão otimizada`) com 3 `app-btn`
     (`Baixar CV otimizado · PDF` primary, `Exportar Markdown` outline, `Salvar como nova versão` outline).

### 5.4 FeaturesSection (`FeaturesSection.tsx`)
- Cabeçalho (max-width 900): `<h2 class="heading">` `Onde o ATS te elimina — e como `+`.accent--cyan corrigir`+`.`
  e `.lead--sm` de apoio.
- `.split` (grid 0.9fr / 1.1fr, colapsa ≤900px):
  - **`feat-list` sticky** (`top:120px`): 6 `feat` numeradas (`feat__num` mono, `feat__title`,
    `feat__desc`, `feat__tag` com `feat__dot` colorido/glow). Dados de `data.features`.
  - **`<EditorMock/>`**.

### 5.5 EditorMock (`EditorMock.tsx`) — mock claro do editor
`mock` (glass, radius 22) reproduzindo §10 do mock:
- `mock__bar`: 3 dots de janela + url `dojob.pro/editor` + toggle de idioma `PT-BR` / `EN`
  (`EN` com estado `--on`).
- `mock__split` (1fr / 220px, colapsa ≤900px):
  - **`mock__main`**: label `Descrição da vaga · Senior Frontend @ Nubank`; `mock__jd` (JD com
    keywords em `.hl`: React, TypeScript, microfrontend, performance, a11y); label
    `Seu currículo · Bullet #3`; caixa **Antes** (`mock__box--red`, texto riscado); caixa
    **Depois · IA** (`mock__box--green`, badge `+7 pts`, números em `mj-purple`/`mj-green`);
    `mock__kw` (`Keywords sugeridas` + chips de `data.suggestKw`: a11y, performance, design system, code review).
  - **`mock__side`**: label `Score ATS`; ring **91** (`ring--sm`, sub `+23 pts`, anim `scoreCount`);
    `hr`; `score-list` com barras de `data.scores` (React 95, TypeScript 90, Microfrontend 80,
    Soft skills 55); botão `app-btn--dark` `Baixar PDF`.

### 5.6 StepsSection (`StepsSection.tsx`)
- `.section--steps`; cabeçalho `<h2 class="heading">` `Do CV genérico ao CV `+`.accent--pink sob medida`+`, em 4 passos.`
- `.steps` (grid 4col → 2col ≤1040px → 1col ≤560px): 4 cards `step glass` com `step__num`
  gigante vazado (01–04), `step__title`, `step__desc`. Dados de `data.steps`.

### 5.7 FinalCTA (`FinalCTA.tsx`)
- `.section--cta`; `cta panel` com `cta__aurora` (2 blobs internos), `heading--cta`
  `Pronto para tailorizar seu `+`.accent--cyan próximo CV`+`?`, `cta__lead`, e botão
  `btn--dark btn--xl` `Criar conta grátis →` (→ `/register`).

### 5.8 Footer (`Footer.tsx`)
`.footer` (border-top): esquerda marca `dojob` + `© 2026 · dojob.pro`; direita links
`Sobre` `Blog` `Privacidade` `Termos` `Suporte` — **placeholders sem rota** (`<a>` sem `href`,
igual ao comportamento atual).

---

## 6. Modelo de dados (`data.ts`)

Arrays tipados que substituem os `sc-for` do mock. As **strings visíveis** referenciam chaves
i18n (via `t(...)`), então `data.ts` guarda a estrutura/valores não-textuais e a chave i18n:

```ts
minimap: string[]                 // 26 larguras, ex '70%','90%',… (decorativo, sem i18n)
atsList: string[]                 // ['Greenhouse','Lever','Workday','LinkedIn','Gupy'] (nomes próprios, sem i18n)
categories: { key; pct: string }[]      // Keywords 18% / Conteúdo 48% / Formato 82%
features:   { n; key; dot: string }[]    // 01..06 + cor do dot; title/desc/tag via i18n
steps:      { n; key }[]                  // 01..04; title/desc via i18n
scores:     { key; pct: number }[]        // React 95 / TypeScript 90 / Microfrontend 80 / Soft skills 55 (nomes = i18n opcional)
suggestKw:  string[]              // ['a11y','performance','design system','code review'] (termos técnicos, sem i18n)
```

Nomes próprios/termos técnicos (ATS vendors, keywords técnicas, "Nubank", "Lucas") **não**
são traduzidos. Todo o resto entra no i18n (§7).

---

## 7. i18n — namespace `landing.*` (BR + EN completos)

Reescrever `landing` em `src/i18n/translations.json` para os dois idiomas. Chaves com quebra de
linha visual usam sufixo (`Line1/2/3`) ou marcadores de trecho (`Pre/Hl/Accent/Post`) renderizados
em JSX. Tabelas abaixo são a **fonte da verdade** do copy.

### 7.1 Nav / Hero / Features(head) / Steps(head) / CTA / Footer

| chave | pt-BR | en |
|---|---|---|
| `nav.howItWorks` | Como funciona | How it works |
| `nav.atsScore` | Score ATS | ATS Score |
| `nav.login` | Entrar | Log in |
| `nav.tryFree` | Testar grátis | Try for free |
| `hero.title1` | Um currículo | A resume |
| `hero.title2` | à altura da vaga | worthy of the job |
| `hero.title3` | que você | you |
| `hero.titleAccent` | quer | want |
| `hero.leadPre` | Cole a descrição da vaga e deixe a IA do dojob calibrar seu currículo com precisão — | Paste the job description and let dojob's AI calibrate your resume with precision — |
| `hero.leadHl` | score ATS, keywords e bullets reescritos | ATS score, keywords and rewritten bullets |
| `hero.leadPost` | , em minutos. | , in minutes. |
| `hero.ctaMain` | Tailorizar meu CV | Tailor my resume |
| `hero.ctaSec` | Ver como funciona | See how it works |
| `features.headingPre` | Onde o ATS te elimina — e como | Where the ATS rejects you — and how to |
| `features.headingAccent` | corrigir | fix it |
| `features.sub` | Cada palavra do seu CV comparada, cada bullet reescrito, cada ponto do score explicado. Você vê o que o recrutador vai ver. | Every word of your resume compared, every bullet rewritten, every score point explained. You see what the recruiter will see. |
| `steps.headingPre` | Do CV genérico ao CV | From a generic resume to a resume |
| `steps.headingAccent` | sob medida | made to measure |
| `steps.headingPost` | , em 4 passos. | , in 4 steps. |
| `cta.headingPre` | Pronto para tailorizar seu | Ready to tailor your |
| `cta.headingAccent` | próximo CV | next resume |
| `cta.headingPost` | ? | ? |
| `cta.lead` | Crie sua conta gratuitamente e rode sua primeira análise ATS hoje mesmo. | Create your account for free and run your first ATS analysis today. |
| `cta.btn` | Criar conta grátis | Create free account |
| `footer.copy` | © 2026 · dojob.pro | © 2026 · dojob.pro |
| `footer.about` | Sobre | About |
| `footer.blog` | Blog | Blog |
| `footer.privacy` | Privacidade | Privacy |
| `footer.terms` | Termos | Terms |
| `footer.support` | Suporte | Support |

### 7.2 Features (6 itens: `features.items.N.{title,desc,tag}`)

| # | pt-BR title / desc / tag | en title / desc / tag |
|---|---|---|
| 1 | Score ATS em tempo real · Sua pontuação atualiza a cada edição — breakdown por keyword, formatação, experiência e soft skills. · +23 pts médios | Real-time ATS score · Your score updates with every edit — breakdown by keyword, formatting, experience and soft skills. · +23 pts avg |
| 2 | Keywords extraídas da vaga · Descobre os termos que faltam no seu CV e sugere onde encaixar naturalmente. · < 30s por análise | Keywords pulled from the job · Finds the terms missing from your resume and suggests where to fit them naturally. · < 30s per scan |
| 3 | Bullets reescritos pela IA · Verbos de impacto, métricas e clareza — mantendo sua voz. Um clique por bullet. · 1-click | Bullets rewritten by AI · Impact verbs, metrics and clarity — keeping your voice. One click per bullet. · 1-click |
| 4 | Antes e depois, versionado · Cada ajuste registrado no histórico. Volte, compare e teste variações sem medo. · Histórico ilimitado | Before and after, versioned · Every change saved to history. Roll back, compare and test variations fearlessly. · Unlimited history |
| 5 | Português e inglês, calibrados juntos · Versões sincronizadas para vagas locais e remotas globais. · PT · EN | Portuguese and English, calibrated together · Synced versions for local jobs and global remote roles. · PT · EN |
| 6 | PDF que passa no parser · Exportação limpa, sem quebras nem elementos que confundem o ATS. Pronto para o Apply. · 100% ATS-safe | A PDF that passes the parser · Clean export, no breaks or elements that confuse the ATS. Ready to apply. · 100% ATS-safe |

### 7.3 Steps (4 itens: `steps.items.N.{title,desc}`)

| # | pt-BR title / desc | en title / desc |
|---|---|---|
| 1 | Cadastre seu CV completo · Suba seu currículo atual — o dojob lê e estrutura todo o conteúdo em markdown editável. | Add your full resume · Upload your current resume — dojob reads and structures all the content into editable markdown. |
| 2 | Insira a job description · Cole a descrição da vaga que você quer. A IA extrai keywords e requisitos automaticamente. | Paste the job description · Paste the job you want. The AI extracts keywords and requirements automatically. |
| 3 | Veja o score e sugestões · A análise ATS aponta aderência, keywords faltantes e bullets a melhorar, em tempo real. | See the score and suggestions · The ATS analysis shows fit, missing keywords and bullets to improve, in real time. |
| 4 | Aplique e baixe o PDF · Aceite as sugestões com um clique e exporte o CV já calibrado para a vaga. | Apply and download the PDF · Accept suggestions with one click and export the resume already calibrated for the job. |

### 7.4 AppScreenshot (`landing.appMock.*`)

| chave | pt-BR | en |
|---|---|---|
| `tabTailoring` | Tailoring | Tailoring |
| `tabLinkedin` | LinkedIn | LinkedIn |
| `tabProfile` | Perfil | Profile |
| `newAnalysis` | Nova análise | New analysis |
| `manualTitle` | Tailoring manual | Manual tailoring |
| `manualDesc` | Two of Us Tech Page 1 · Frontend talent for modern product teams | Two of Us Tech Page 1 · Frontend talent for modern product teams |
| `manualMode` | Modo manual | Manual mode |
| `atsLabel` | ATS: | ATS: |
| `editorFile` | Arquivo | File |
| `editorExport` | Exportar | Export |
| `cvObjectiveH` | ## Objetivo | ## Objective |
| `cvObjective` | Product Designer Sênior — produtos digitais e design systems | Senior Product Designer — digital products and design systems |
| `cvSummaryH` | ## Resumo | ## Summary |
| `cvSummary` | Product Designer com 7 anos em fintech e SaaS B2B, liderando design de ponta a ponta — de pesquisa e discovery a design systems escaláveis usados por times de produto inteiros. Foco em transformar problemas complexos em interfaces claras e mensuráveis. | Product Designer with 7 years in fintech and B2B SaaS, leading end-to-end design — from research and discovery to scalable design systems used by entire product teams. Focused on turning complex problems into clear, measurable interfaces. |
| `cvSkillsH` | ## Habilidades | ## Skills |
| `cvSkillsDesign` | **Design:** Figma, Design Systems, Prototipagem, Design Tokens, Auto Layout | **Design:** Figma, Design Systems, Prototyping, Design Tokens, Auto Layout |
| `cvSkillsResearch` | **Pesquisa:** Entrevistas, Testes de Usabilidade, Discovery Contínuo, Métricas | **Research:** Interviews, Usability Testing, Continuous Discovery, Metrics |
| `cvSkillsCollab` | **Colaboração:** Handoff, Storybook, Acessibilidade (WCAG), Design Ops | **Collaboration:** Handoff, Storybook, Accessibility (WCAG), Design Ops |
| `cvExpH` | ## Experiência Profissional | ## Professional Experience |
| `cvExpRole` | ### Product Designer Sênior — Nubank \| São Paulo, Brasil (Remoto) | ### Senior Product Designer — Nubank \| São Paulo, Brazil (Remote) |
| `cvExpDate` | **Mar 2023 – Presente** | **Mar 2023 – Present** |
| `statusWords` | 842 palavras | 842 words |
| `scoreBanner` | Com sugestões: 30 → 45 pts | With suggestions: 30 → 45 pts |
| `scoreBannerBadge` | +15 pts | +15 pts |
| `scoreLabel` | Pontuação ATS | ATS score |
| `catsTitle` | Análise por categoria | Category breakdown |
| `catKeywords` | Keywords | Keywords |
| `catContent` | Conteúdo | Content |
| `catFormat` | Formato | Format |
| `exportTitle` | Exportar versão otimizada | Export optimized version |
| `exportPdf` | Baixar CV otimizado · PDF | Download optimized resume · PDF |
| `exportMd` | Exportar Markdown | Export Markdown |
| `exportSave` | Salvar como nova versão | Save as new version |

### 7.5 EditorMock (`landing.editorMock.*`)

| chave | pt-BR | en |
|---|---|---|
| `jdLabel` | Descrição da vaga · Senior Frontend @ Nubank | Job description · Senior Frontend @ Nubank |
| `jdPre` | Buscamos engenheiro sênior com | We're looking for a senior engineer with |
| `jdMid` | para liderar iniciativas de | to lead |
| `jdPost` | , garantindo | initiatives, ensuring |
| `jdEnd` | em produtos de alto tráfego. | in high-traffic products. |
| `cvLabel` | Seu currículo · Bullet #3 | Your resume · Bullet #3 |
| `beforeTag` | Antes | Before |
| `beforeText` | Ajudei no desenvolvimento de features front-end no time, trabalhando com o time de produto. | Helped develop front-end features on the team, working with the product team. |
| `afterTag` | Depois · IA | After · AI |
| `afterBadge` | +7 pts | +7 pts |
| `afterPre` | Liderei a migração de | Led the migration of |
| `afterMid` | em | in |
| `afterCut` | , reduzindo TTI em | , cutting TTI by |
| `afterEnd` | e elevando o score Lighthouse para | and raising the Lighthouse score to |
| `kwTitle` | Keywords sugeridas | Suggested keywords |
| `sideScore` | Score ATS | ATS score |
| `downloadPdf` | Baixar PDF | Download PDF |

> Nota de implementação: as frases da JD e do bullet "Depois" contêm trechos coloridos
> (keywords `.hl`, números `mj-green`). Renderizar interpolando os spans no JSX entre os
> segmentos (`jdPre` `<hl>React</hl>` `<hl>TypeScript</hl>` …). Os termos coloridos em si
> (React, TypeScript, microfrontend, performance, a11y, 12 microfrontends, 37%, 98) são
> constantes técnicas e **não** entram no i18n.

---

## 8. SEO (raiz `/`)

Como é SPA client-rendered e crawlers sociais não executam JS, as tags primárias vão
**estáticas no `apps/jobapply-app/index.html`**.

### 8.1 `<head>` do `index.html`
- `<html lang="pt-BR">` (mantido).
- `<title>dojob — Currículo sob medida para cada vaga, com IA</title>`
- `<meta name="description" content="Cole a descrição da vaga e deixe a IA do dojob calibrar seu currículo: score ATS, keywords e bullets reescritos em minutos. PT-BR e inglês.">`
- `<link rel="canonical" href="https://dojob.pro/">`
- `<meta name="robots" content="index, follow">`
- `<meta name="theme-color" content="#f2f2f5">`
- **Open Graph:** `og:type=website`, `og:site_name=dojob`, `og:title`, `og:description`,
  `og:url=https://dojob.pro/`, `og:image=https://dojob.pro/og-image.png`,
  `og:image:width=1200`, `og:image:height=630`, `og:locale=pt_BR`, `og:locale:alternate=en_US`.
- **Twitter:** `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`,
  `twitter:image=https://dojob.pro/og-image.png`.
- **JSON-LD** inline (`<script type="application/ld+json">`): `SoftwareApplication`
  (name dojob, applicationCategory BusinessApplication, offers price 0) + `Organization`
  (name dojob, url https://dojob.pro, logo).
- Favicon próprio (§8.3) substituindo `vite.svg`.

### 8.2 `public/robots.txt` + `public/sitemap.xml`
- `robots.txt`: `User-agent: *` / `Allow: /` / `Sitemap: https://dojob.pro/sitemap.xml`.
- `sitemap.xml`: entrada única `https://dojob.pro/` (`changefreq weekly`, `priority 1.0`).
  Rotas autenticadas/login não entram no sitemap.

### 8.3 Favicon
`public/favicon.svg` na identidade nova (marca "dojob" ou monograma "d" roxo `#7c5cfc`
sobre fundo claro/transparente). Referenciar `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
+ `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` (180×180 opcional).
Remover a referência a `/vite.svg`.

### 8.4 Fora de escopo (evolução futura)
SEO dinâmico por-rota (login/register/onboarding/tailoring) via hook de `document.head`
ou lib (unhead/react-helmet) — **não** faz parte desta spec. Anotado como próximo passo.

---

## 9. Thumbnail / og:image

`public/og-image.png` **1200×630**, identidade nova:
- Fundo `#f2f2f5` com aurora (blobs roxo/ciano/rosa desfocados) + véu suave.
- Marca `dojob` (canto superior) e headline `Um currículo à altura da vaga que você quer.`
  em `.display` reduzido.
- **Ring de score 91** + chip `+23 pts` como elemento visual à direita.
- Contraste AA; sem texto essencial nas bordas de 5%.

**Produção:** template `scripts/og-image/og-template.html` (auto-contido, mesmas fontes/paleta)
renderizado para PNG (ex.: script Playwright/`@resvg` já disponível no repo, ou export manual).
O template fica versionado para regerar. Documentar o comando no topo do template.

---

## 10. Acessibilidade & responsivo

- **Reduced-motion:** `prefers-reduced-motion: reduce` desliga aurora/fade/scoreCount (§4.1).
- **Contraste:** texto `--ink` sobre `#f2f2f5`/glass atende AA; `--fg-soft` só em texto de apoio.
- **Semântica:** `<header>`(topbar)/`<main>`/`<section>`/`<footer>`; um único `<h1>` (hero),
  `<h2>` por seção, `<h3>`/`<h4>` nos itens. Aurora e minimapa com `aria-hidden="true"`.
- **Foco:** links/botões com `:focus-visible` visível.
- **Breakpoints** (do mock): `≤1040px` steps 4→2col; `≤900px` `app__split`/`split`/`mock__split`
  viram 1col e `feat-list` perde o sticky; `≤640px` padding lateral 22px, nav central some,
  `app__sub` empilha; `≤560px` steps 1col.
- **Imagens/mock:** todo o conteúdo é DOM (sem `<img>` além do og:image), então escala nítido.

---

## 11. Fora de escopo

- Backend/API, agente ATS, textos de outras páginas/rotas.
- SEO dinâmico por-rota (§8.4).
- Rotas reais para links de footer (permanecem placeholders).
- Troca do sistema de i18n ou de roteamento.

---

## 12. Critérios de aceitação

1. Rota `/` renderiza o novo redesign fiel ao mock (aurora, topbar glass, hero display,
   AppScreenshot, Features sticky + EditorMock, 4 Steps, CTA glass, footer) — visualmente
   equivalente ao `JobApply Landing.dc.html`.
2. `LandingPage` quebrada nos subcomponentes de §3; sem lógica de negócio/HTTP.
3. Alternar idioma PT-BR ↔ EN troca **todo** texto visível, incluindo o conteúdo dos dois
   screenshots; nenhuma string hardcoded de UI fora do i18n (exceto nomes próprios/termos
   técnicos listados).
4. Font Awesome removido do `index.html` (confirmado que nenhuma rota ativa depende de `fa-*`);
   JetBrains Mono carregada.
5. `index.html` com title/description/canonical/OG/Twitter/JSON-LD; `robots.txt`, `sitemap.xml`,
   `favicon.svg` presentes; `og-image.png` 1200×630 gerado e referenciado.
6. `prefers-reduced-motion` respeitado; layout responsivo nos breakpoints de §10.
7. `yarn workspace jobapply-app build` e `typecheck` passam.

---

## 13. Implementação

Implementação delegada a subagents no modelo **Sonnet** (um por seção/componente),
coordenados a partir do plano gerado em seguida (skill `writing-plans`). Ordem sugerida:
tokens/estilos → data/i18n → Topbar/Hero → AppScreenshot → Features/EditorMock →
Steps/CTA/Footer → SEO/og-image → build+typecheck.
