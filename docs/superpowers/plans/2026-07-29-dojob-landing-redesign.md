# dojob Landing Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/` landing page of `jobapply-app` with the new "aurora on light" dojob redesign, fully bilingual (PT-BR/EN), with SEO metadata and a social thumbnail.

**Architecture:** Break the monolithic `LandingPage.tsx` into a composition of presentational subcomponents under `presentation/pages/LandingPage/`, sharing emotion `css` classes from a single styles module and typed data from `data.ts`. All visible text comes from the i18n `landing.*` namespace. SEO lives as static tags in `index.html` (SPA crawlers don't run JS), plus `robots.txt`, `sitemap.xml`, favicon and a 1200×630 `og-image.png`.

**Tech Stack:** Vite + React 18 + TypeScript, TanStack Router, `@emotion/css`, `react-i18next` (JSON resources), JetBrains Mono + Lato (Google Fonts).

**Source of truth for markup/visuals:** the mock at `DoJob landing page redesign/JobApply Landing.dc.html` (referenced by line ranges in each task) and the design spec `docs/superpowers/specs/2026-07-29-dojob-landing-redesign-design.md` (copy tables in §7).

## Global Constraints

- **No test runner exists** in `jobapply-app` (no vitest/jest/testing-library). The per-task gate is: `yarn workspace jobapply-app typecheck` passes, and (for render tasks) visual confirmation in `yarn workspace jobapply-app dev`. Do NOT add a test framework.
- **No business logic / no HTTP** in these components (`apps/jobapply-app/CLAUDE.md`). Purely presentational.
- **All commands run from the workspace root** `/Users/lucasmansoldo/Projects/jobapply`.
- **Every visible UI string** goes through `t('landing.…')`. Only proper nouns / technical tokens stay hardcoded: `Nubank`, `Lucas`, `Greenhouse`, `Lever`, `Workday`, `LinkedIn`, `Gupy`, `React`, `TypeScript`, `microfrontend`, `performance`, `a11y`, `design system`, `code review`, `12 microfrontends`, `37%`, `98`, `dojob.pro/editor`.
- **Brand/domain:** brand `dojob`, canonical domain `https://dojob.pro`.
- **Palette:** `--ink:#0a0a12` · `--brand:#7c5cfc` · accents `#8b5cf6 #06b6d4 #ec4899 #16a34a #eab308` · bg `#f2f2f5` · `--fg-soft:rgba(10,10,18,.62)` · `--line:rgba(10,10,18,.08)`.
- **Reduced motion:** all animations gated behind `@media (prefers-reduced-motion: no-preference)` (or disabled under `reduce`).
- **Commits:** semantic messages, no `Co-Authored-By` trailer.
- **i18n structure:** `translations.json` has top-level `"pt-BR"` and `"en"`, each with a `landing` object. Interpolation `escapeValue:false` is already set.

---

### Task 1: Styles module, reveal hook, and font swap

**Files:**
- Rewrite: `apps/jobapply-app/src/presentation/pages/LandingPage/LandingPage.styles.ts`
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/useRevealOnScroll.ts`
- Modify: `apps/jobapply-app/index.html` (fonts)

**Interfaces:**
- Produces (from `LandingPage.styles.ts`): named exports `tokens`, and emotion class-name string constants: `auroraCls`, `auroraBlob1Cls`, `auroraBlob2Cls`, `auroraBlob3Cls`, `auroraBlob4Cls`, `auroraVeilCls`, `sectionCls`, `sectionHeroCls`, `sectionStepsCls`, `sectionCtaCls`, `topbarCls`, `topbarBarCls`, `btnDarkMdCls`, `btnDarkLgCls`, `btnDarkXlCls`, `btnGhostLgCls`, `displayCls`, `headingCls`, `headingCtaCls`, `accentCls`, `accentCyanCls`, `accentPinkCls`, `leadCls`, `leadSmCls`, `glassCls`, `panelCls`, `cardWhiteCls`, `chipCls`, `monoCls`, `fadeInCls`, and a `revealInClass` string (`'in'`). Ring/bar helpers: `ringCls`, `ringSmCls`, `barCls`, `barSmCls`, `barFillCls`, `barFillCyanCls`, plus `scoreCountKeyframe` (emotion `keyframes` used inline on the animated ring circle).
- Produces (from `useRevealOnScroll.ts`): `export function useRevealOnScroll(): void` — on mount, queries `.${fadeInCls}` elements and adds the reveal class when they enter the viewport; no-op animation under reduced motion.

- [ ] **Step 1: Swap fonts in `index.html`**

Replace the two font/icon `<link>`s (the Lato Google Fonts link and the Font Awesome cdnjs link) with a single Google Fonts link for Lato + JetBrains Mono. Final `<head>` font block:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Verify no active route still depends on Font Awesome**

Run: `grep -rn "fa-" apps/jobapply-app/src --include=*.tsx | grep -v "LandingPage"`
Expected: no matches (the only `fa-*` usages are in the current `LandingPage.tsx`, which this plan replaces). If other matches appear, keep the Font Awesome `<link>` and note it.

- [ ] **Step 3: Write `LandingPage.styles.ts`**

Full module. Tokens as plain strings; classes via `@emotion/css`. Values copied from the mock `<style>` (lines 26–283). Keyframes `auroraDrift`, `auroraDrift2`, `fadeUp`, `scoreCount` from mock lines 49–52.

```ts
import { css, keyframes } from '@emotion/css'

export const tokens = {
  ink: '#0a0a12',
  brand: '#7c5cfc',
  fgSoft: 'rgba(10,10,18,.62)',
  line: 'rgba(10,10,18,.08)',
  bg: '#f2f2f5',
  glass: 'rgba(255,255,255,.72)',
  shSm: '0 4px 12px rgba(20,20,50,.06)',
  shMd: '0 16px 40px rgba(20,20,50,.10)',
  shLg: '0 32px 80px rgba(20,20,50,.14)',
  shDark: '0 12px 30px rgba(20,20,50,.22)',
  shBrand: '0 12px 30px rgba(124,92,252,.28)',
} as const

const font = "'Lato','Verdana',sans-serif"
const mono = "'JetBrains Mono',monospace"

// motion only when user allows it
const auroraDrift = keyframes`0%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}33%{transform:translate3d(6%,-2%,0) rotate(40deg) scale(1.25)}66%{transform:translate3d(-4%,8%,0) rotate(-25deg) scale(1.15)}100%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}`
const auroraDrift2 = keyframes`0%{transform:translate3d(10%,8%,0) rotate(0) scale(1)}50%{transform:translate3d(-12%,-4%,0) rotate(80deg) scale(1.3)}100%{transform:translate3d(10%,8%,0) rotate(0) scale(1)}`
const fadeUp = keyframes`from{opacity:0;transform:translateY(28px);filter:blur(6px)}to{opacity:1;transform:translateY(0);filter:blur(0)}`
export const scoreCountKeyframe = keyframes`from{stroke-dashoffset:283}to{stroke-dashoffset:26}`

const mm = '@media (prefers-reduced-motion: no-preference)'

export const revealInClass = 'in'
export const fadeInCls = css`opacity:0;&.in{${mm}{animation:${fadeUp} 1.1s cubic-bezier(.2,.7,.2,1) forwards}}@media (prefers-reduced-motion: reduce){opacity:1}`

export const auroraCls = css`position:absolute;top:0;left:0;right:0;height:100%;overflow:hidden;pointer-events:none;z-index:0`
const blob = `position:absolute;border-radius:50%`
export const auroraBlob1Cls = css`${blob};top:-8%;left:-18%;width:70vw;height:70vw;background:radial-gradient(closest-side,rgba(139,92,246,.5),rgba(139,92,246,0) 70%);filter:blur(90px);${mm}{animation:${auroraDrift} 22s ease-in-out infinite}`
export const auroraBlob2Cls = css`${blob};top:4%;right:-22%;width:65vw;height:65vw;background:radial-gradient(closest-side,rgba(34,211,238,.42),rgba(34,211,238,0) 70%);filter:blur(100px);${mm}{animation:${auroraDrift2} 28s ease-in-out infinite}`
export const auroraBlob3Cls = css`${blob};top:42%;left:12%;width:60vw;height:60vw;background:radial-gradient(closest-side,rgba(236,72,153,.3),rgba(236,72,153,0) 70%);filter:blur(120px);${mm}{animation:${auroraDrift} 34s ease-in-out infinite reverse}`
export const auroraBlob4Cls = css`${blob};top:66%;right:4%;width:55vw;height:55vw;background:radial-gradient(closest-side,rgba(74,222,128,.28),rgba(74,222,128,0) 70%);filter:blur(120px);${mm}{animation:${auroraDrift2} 40s ease-in-out infinite}`
export const auroraVeilCls = css`position:absolute;inset:0;background:linear-gradient(180deg,rgba(242,242,245,.4) 0%,rgba(242,242,245,.55) 45%,rgba(242,242,245,.9) 100%)`

export const sectionCls = css`position:relative;z-index:5;max-width:1440px;margin:0 auto;padding:120px 48px 60px;@media (max-width:640px){padding-left:22px;padding-right:22px}`
export const sectionHeroCls = css`${sectionCls};padding:150px 48px 100px;@media (max-width:640px){padding-left:22px;padding-right:22px}`
export const sectionStepsCls = css`${sectionCls};padding:120px 48px 100px;@media (max-width:640px){padding-left:22px;padding-right:22px}`
export const sectionCtaCls = css`${sectionCls};padding:60px 48px 160px;@media (max-width:640px){padding-left:22px;padding-right:22px}`

export const monoCls = css`font-family:${mono}`

const btn = `font-family:${font};font-weight:700;border-radius:999px;white-space:nowrap;text-align:center;display:inline-block;cursor:pointer;text-decoration:none`
const btnDark = `${btn};background:${tokens.ink};color:#fff;box-shadow:${tokens.shDark}`
const btnGhost = `${btn};background:rgba(255,255,255,.7);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.8);color:${tokens.ink};box-shadow:${tokens.shSm}`
export const btnDarkMdCls = css`${btnDark};padding:10px 18px;font-size:14px`
export const btnDarkLgCls = css`${btnDark};padding:18px 26px;font-size:16px`
export const btnDarkXlCls = css`${btnDark};padding:20px 32px;font-size:16px`
export const btnGhostLgCls = css`${btnGhost};padding:18px 26px;font-size:16px`

export const displayCls = css`font-family:${font};font-weight:900;font-size:clamp(56px,9.5vw,148px);line-height:.92;letter-spacing:-.045em;margin:0;color:${tokens.ink}`
export const headingCls = css`font-family:${font};font-weight:900;font-size:clamp(48px,6.5vw,100px);line-height:.94;letter-spacing:-.035em;margin:0;color:${tokens.ink}`
export const headingCtaCls = css`${headingCls};font-size:clamp(56px,8vw,124px);line-height:.92;letter-spacing:-.045em`
export const accentCls = css`background:linear-gradient(120deg,#8b5cf6 0%,#06b6d4 55%,#ec4899 100%);-webkit-background-clip:text;background-clip:text;color:transparent`
export const accentCyanCls = css`background:linear-gradient(120deg,#8b5cf6,#06b6d4);-webkit-background-clip:text;background-clip:text;color:transparent`
export const accentPinkCls = css`background:linear-gradient(120deg,#8b5cf6,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent`
export const leadCls = css`font-size:20px;line-height:1.5;color:${tokens.fgSoft};margin:0;max-width:580px`
export const leadSmCls = css`font-size:18px;line-height:1.55;max-width:640px;color:rgba(10,10,18,.6)`

export const glassCls = css`background:${tokens.glass};backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.8);box-shadow:${tokens.shMd},inset 0 1px 0 rgba(255,255,255,.9)`
export const panelCls = css`background:rgba(255,255,255,.7);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,.85);box-shadow:${tokens.shLg},inset 0 1px 0 rgba(255,255,255,.9);border-radius:32px`
export const cardWhiteCls = css`background:#fff;border:1px solid ${tokens.line};box-shadow:${tokens.shLg},inset 0 1px 0 rgba(255,255,255,.9);border-radius:20px;overflow:hidden`
export const chipCls = css`font-size:12px;padding:5px 12px;border-radius:999px;border:1px solid rgba(10,10,18,.12);color:rgba(10,10,18,.6)`

export const topbarCls = css`position:fixed;top:16px;left:0;right:0;z-index:50;padding:0 24px`
export const topbarBarCls = css`display:flex;align-items:center;justify-content:space-between;padding:14px 22px 14px 26px;max-width:1360px;margin:0 auto;border-radius:999px;background:rgba(255,255,255,.6);backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);border:1px solid rgba(255,255,255,.7);box-shadow:0 10px 30px rgba(20,20,50,.10),0 2px 8px rgba(20,20,50,.05),0 1px 0 rgba(255,255,255,.9) inset`

export const ringCls = css`position:relative;width:150px;height:150px;margin:0 auto;& svg{width:100%;height:100%;transform:rotate(-90deg)}`
export const ringSmCls = css`position:relative;width:100%;aspect-ratio:1;max-width:150px;margin:0 auto;& svg{width:100%;height:100%;transform:rotate(-90deg)}`
export const barCls = css`height:8px;border-radius:8px;background:rgba(10,10,18,.06);overflow:hidden`
export const barSmCls = css`height:4px;border-radius:8px;background:rgba(10,10,18,.06);overflow:hidden`
export const barFillCls = css`height:100%;background:linear-gradient(90deg,#7c5cfc,#c4b5fd);border-radius:8px`
export const barFillCyanCls = css`height:100%;background:linear-gradient(90deg,#8b5cf6,#06b6d4);border-radius:8px`
```

- [ ] **Step 4: Write `useRevealOnScroll.ts`**

Port the mock's reveal logic (mock lines 623–650) to a hook, honoring reduced motion.

```ts
import { useEffect } from 'react'
import { fadeInCls, revealInClass } from './LandingPage.styles'

export function useRevealOnScroll(): void {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(`.${fadeInCls}`))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      els.forEach(el => el.classList.add(revealInClass))
      return
    }
    const check = () => {
      const vh = window.innerHeight
      els.forEach(el => {
        if (el.classList.contains(revealInClass)) return
        const r = el.getBoundingClientRect()
        if (r.top < vh - 60 && r.bottom > 0) el.classList.add(revealInClass)
      })
    }
    els.forEach((el, i) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight) setTimeout(() => el.classList.add(revealInClass), Math.min(i, 8) * 90)
    })
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    const safety = setTimeout(check, 1500)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      clearTimeout(safety)
    }
  }, [])
}
```

- [ ] **Step 5: Typecheck**

Run: `yarn workspace jobapply-app typecheck`
Expected: PASS (no errors). The old `LandingPage.tsx` still imports the old styles file — since we rewrote `LandingPage.styles.ts` with new exports and the old file only did `export {}`-style, confirm the old `LandingPage.tsx` does not import removed names. If it errors, that's expected to be resolved in Task 4 when `LandingPage.tsx` is replaced; to keep this task green, leave the old `LandingPage.tsx` importing nothing from styles (it currently imports none — verify with `grep -n "LandingPage.styles" apps/jobapply-app/src/presentation/pages/LandingPage/LandingPage.tsx`; if no match, typecheck passes).

- [ ] **Step 6: Commit**

```bash
git add apps/jobapply-app/index.html apps/jobapply-app/src/presentation/pages/LandingPage/LandingPage.styles.ts apps/jobapply-app/src/presentation/pages/LandingPage/useRevealOnScroll.ts
git commit -m "feat(landing): add redesign style tokens, reveal hook, font swap"
```

---

### Task 2: Typed data module

**Files:**
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/data.ts`

**Interfaces:**
- Produces: `minimap: string[]`, `atsList: string[]`, `suggestKw: string[]`, `categories: { key: string; pct: string }[]`, `features: { n: string; key: string; dot: string }[]`, `steps: { n: string; key: string }[]`, `scores: { name: string; pct: number }[]`. `key` values are i18n leaf names consumed as `t(\`landing.features.items.${key}.title\`)` etc.

- [ ] **Step 1: Write `data.ts`** (values from mock lines 658–692 and spec §6)

```ts
export const minimap: string[] = ['70%','90%','40%','85%','60%','95%','55%','80%','45%','92%','65%','88%','50%','75%','35%','90%','70%','60%','85%','48%','95%','55%','80%','42%','88%','62%']
export const atsList: string[] = ['Greenhouse','Lever','Workday','LinkedIn','Gupy']
export const suggestKw: string[] = ['a11y','performance','design system','code review']

export const categories: { key: string; pct: string }[] = [
  { key: 'catKeywords', pct: '18%' },
  { key: 'catContent', pct: '48%' },
  { key: 'catFormat', pct: '82%' },
]

export const features: { n: string; key: string; dot: string }[] = [
  { n: '01', key: '1', dot: '#16a34a' },
  { n: '02', key: '2', dot: '#8b5cf6' },
  { n: '03', key: '3', dot: '#06b6d4' },
  { n: '04', key: '4', dot: '#ec4899' },
  { n: '05', key: '5', dot: '#16a34a' },
  { n: '06', key: '6', dot: '#eab308' },
]

export const steps: { n: string; key: string }[] = [
  { n: '01', key: '1' },
  { n: '02', key: '2' },
  { n: '03', key: '3' },
  { n: '04', key: '4' },
]

export const scores: { name: string; pct: number }[] = [
  { name: 'React', pct: 95 },
  { name: 'TypeScript', pct: 90 },
  { name: 'Microfrontend', pct: 80 },
  { name: 'Soft skills', pct: 55 },
]
```

- [ ] **Step 2: Typecheck**

Run: `yarn workspace jobapply-app typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/jobapply-app/src/presentation/pages/LandingPage/data.ts
git commit -m "feat(landing): add typed data module for redesign"
```

---

### Task 3: i18n — rewrite `landing` namespace (PT-BR + EN)

**Files:**
- Modify: `apps/jobapply-app/src/i18n/translations.json` (replace `pt-BR.landing` and `en.landing`)

**Interfaces:**
- Produces the `landing` key tree consumed by all components: `nav.*`, `hero.*`, `features.{headingPre,headingAccent,sub,items.{1..6}.{title,desc,tag}}`, `steps.{headingPre,headingAccent,headingPost,items.{1..4}.{title,desc}}`, `cta.*`, `footer.*`, `appMock.*`, `editorMock.*`.

- [ ] **Step 1: Replace `pt-BR.landing`**

Set `translations.json` → `"pt-BR"` → `"landing"` to the object below (copy from spec §7 tables, pt-BR column). Preserve all other top-level keys (`app`, `common`, `auth`, `nav`, `profile`, `cv`, `ats`, `tailoring`, `linkedin`, `onboarding`) untouched.

```json
{
  "nav": { "howItWorks": "Como funciona", "atsScore": "Score ATS", "login": "Entrar", "tryFree": "Testar grátis" },
  "hero": {
    "title1": "Um currículo", "title2": "à altura da vaga", "title3": "que você", "titleAccent": "quer",
    "leadPre": "Cole a descrição da vaga e deixe a IA do dojob calibrar seu currículo com precisão — ",
    "leadHl": "score ATS, keywords e bullets reescritos", "leadPost": ", em minutos.",
    "ctaMain": "Tailorizar meu CV", "ctaSec": "Ver como funciona"
  },
  "features": {
    "headingPre": "Onde o ATS te elimina — e como ", "headingAccent": "corrigir",
    "sub": "Cada palavra do seu CV comparada, cada bullet reescrito, cada ponto do score explicado. Você vê o que o recrutador vai ver.",
    "items": {
      "1": { "title": "Score ATS em tempo real", "desc": "Sua pontuação atualiza a cada edição — breakdown por keyword, formatação, experiência e soft skills.", "tag": "+23 pts médios" },
      "2": { "title": "Keywords extraídas da vaga", "desc": "Descobre os termos que faltam no seu CV e sugere onde encaixar naturalmente.", "tag": "< 30s por análise" },
      "3": { "title": "Bullets reescritos pela IA", "desc": "Verbos de impacto, métricas e clareza — mantendo sua voz. Um clique por bullet.", "tag": "1-click" },
      "4": { "title": "Antes e depois, versionado", "desc": "Cada ajuste registrado no histórico. Volte, compare e teste variações sem medo.", "tag": "Histórico ilimitado" },
      "5": { "title": "Português e inglês, calibrados juntos", "desc": "Versões sincronizadas para vagas locais e remotas globais.", "tag": "PT · EN" },
      "6": { "title": "PDF que passa no parser", "desc": "Exportação limpa, sem quebras nem elementos que confundem o ATS. Pronto para o Apply.", "tag": "100% ATS-safe" }
    }
  },
  "steps": {
    "headingPre": "Do CV genérico ao CV ", "headingAccent": "sob medida", "headingPost": ", em 4 passos.",
    "items": {
      "1": { "title": "Cadastre seu CV completo", "desc": "Suba seu currículo atual — o dojob lê e estrutura todo o conteúdo em markdown editável." },
      "2": { "title": "Insira a job description", "desc": "Cole a descrição da vaga que você quer. A IA extrai keywords e requisitos automaticamente." },
      "3": { "title": "Veja o score e sugestões", "desc": "A análise ATS aponta aderência, keywords faltantes e bullets a melhorar, em tempo real." },
      "4": { "title": "Aplique e baixe o PDF", "desc": "Aceite as sugestões com um clique e exporte o CV já calibrado para a vaga." }
    }
  },
  "cta": {
    "headingPre": "Pronto para tailorizar seu ", "headingAccent": "próximo CV", "headingPost": "?",
    "lead": "Crie sua conta gratuitamente e rode sua primeira análise ATS hoje mesmo.", "btn": "Criar conta grátis"
  },
  "footer": { "copy": "© 2026 · dojob.pro", "about": "Sobre", "blog": "Blog", "privacy": "Privacidade", "terms": "Termos", "support": "Suporte" },
  "appMock": {
    "tabTailoring": "Tailoring", "tabLinkedin": "LinkedIn", "tabProfile": "Perfil",
    "newAnalysis": "Nova análise", "manualTitle": "Tailoring manual",
    "manualDesc": "Two of Us Tech Page 1 · Frontend talent for modern product teams", "manualMode": "Modo manual",
    "atsLabel": "ATS:", "editorFile": "Arquivo", "editorExport": "Exportar",
    "cvObjectiveH": "## Objetivo", "cvObjective": "Product Designer Sênior — produtos digitais e design systems",
    "cvSummaryH": "## Resumo",
    "cvSummary": "Product Designer com 7 anos em fintech e SaaS B2B, liderando design de ponta a ponta — de pesquisa e discovery a design systems escaláveis usados por times de produto inteiros. Foco em transformar problemas complexos em interfaces claras e mensuráveis.",
    "cvSkillsH": "## Habilidades",
    "cvSkillsDesign": "**Design:** Figma, Design Systems, Prototipagem, Design Tokens, Auto Layout",
    "cvSkillsResearch": "**Pesquisa:** Entrevistas, Testes de Usabilidade, Discovery Contínuo, Métricas",
    "cvSkillsCollab": "**Colaboração:** Handoff, Storybook, Acessibilidade (WCAG), Design Ops",
    "cvExpH": "## Experiência Profissional",
    "cvExpRole": "### Product Designer Sênior — Nubank | São Paulo, Brasil (Remoto)", "cvExpDate": "**Mar 2023 – Presente**",
    "statusWords": "842 palavras", "scoreBanner": "Com sugestões: 30 → 45 pts", "scoreBannerBadge": "+15 pts",
    "scoreLabel": "Pontuação ATS", "catsTitle": "Análise por categoria",
    "catKeywords": "Keywords", "catContent": "Conteúdo", "catFormat": "Formato",
    "exportTitle": "Exportar versão otimizada", "exportPdf": "Baixar CV otimizado · PDF",
    "exportMd": "Exportar Markdown", "exportSave": "Salvar como nova versão"
  },
  "editorMock": {
    "jdLabel": "Descrição da vaga · Senior Frontend @ Nubank",
    "jdPre": "Buscamos engenheiro sênior com", "jdMid": "para liderar iniciativas de",
    "jdPost": ", garantindo", "jdEnd": "em produtos de alto tráfego.", "and": "e",
    "cvLabel": "Seu currículo · Bullet #3", "beforeTag": "Antes",
    "beforeText": "Ajudei no desenvolvimento de features front-end no time, trabalhando com o time de produto.",
    "afterTag": "Depois · IA", "afterBadge": "+7 pts",
    "afterPre": "Liderei a migração de", "afterMid": "em", "afterCut": ", reduzindo TTI em",
    "afterEnd": "e elevando o score Lighthouse para",
    "kwTitle": "Keywords sugeridas", "sideScore": "Score ATS", "downloadPdf": "Baixar PDF"
  }
}
```

- [ ] **Step 2: Replace `en.landing`** with the EN column from spec §7:

```json
{
  "nav": { "howItWorks": "How it works", "atsScore": "ATS Score", "login": "Log in", "tryFree": "Try for free" },
  "hero": {
    "title1": "A resume", "title2": "worthy of the job", "title3": "you", "titleAccent": "want",
    "leadPre": "Paste the job description and let dojob's AI calibrate your resume with precision — ",
    "leadHl": "ATS score, keywords and rewritten bullets", "leadPost": ", in minutes.",
    "ctaMain": "Tailor my resume", "ctaSec": "See how it works"
  },
  "features": {
    "headingPre": "Where the ATS rejects you — and how to ", "headingAccent": "fix it",
    "sub": "Every word of your resume compared, every bullet rewritten, every score point explained. You see what the recruiter will see.",
    "items": {
      "1": { "title": "Real-time ATS score", "desc": "Your score updates with every edit — breakdown by keyword, formatting, experience and soft skills.", "tag": "+23 pts avg" },
      "2": { "title": "Keywords pulled from the job", "desc": "Finds the terms missing from your resume and suggests where to fit them naturally.", "tag": "< 30s per scan" },
      "3": { "title": "Bullets rewritten by AI", "desc": "Impact verbs, metrics and clarity — keeping your voice. One click per bullet.", "tag": "1-click" },
      "4": { "title": "Before and after, versioned", "desc": "Every change saved to history. Roll back, compare and test variations fearlessly.", "tag": "Unlimited history" },
      "5": { "title": "Portuguese and English, calibrated together", "desc": "Synced versions for local jobs and global remote roles.", "tag": "PT · EN" },
      "6": { "title": "A PDF that passes the parser", "desc": "Clean export, no breaks or elements that confuse the ATS. Ready to apply.", "tag": "100% ATS-safe" }
    }
  },
  "steps": {
    "headingPre": "From a generic resume to a resume ", "headingAccent": "made to measure", "headingPost": ", in 4 steps.",
    "items": {
      "1": { "title": "Add your full resume", "desc": "Upload your current resume — dojob reads and structures all the content into editable markdown." },
      "2": { "title": "Paste the job description", "desc": "Paste the job you want. The AI extracts keywords and requirements automatically." },
      "3": { "title": "See the score and suggestions", "desc": "The ATS analysis shows fit, missing keywords and bullets to improve, in real time." },
      "4": { "title": "Apply and download the PDF", "desc": "Accept suggestions with one click and export the resume already calibrated for the job." }
    }
  },
  "cta": {
    "headingPre": "Ready to tailor your ", "headingAccent": "next resume", "headingPost": "?",
    "lead": "Create your account for free and run your first ATS analysis today.", "btn": "Create free account"
  },
  "footer": { "copy": "© 2026 · dojob.pro", "about": "About", "blog": "Blog", "privacy": "Privacy", "terms": "Terms", "support": "Support" },
  "appMock": {
    "tabTailoring": "Tailoring", "tabLinkedin": "LinkedIn", "tabProfile": "Profile",
    "newAnalysis": "New analysis", "manualTitle": "Manual tailoring",
    "manualDesc": "Two of Us Tech Page 1 · Frontend talent for modern product teams", "manualMode": "Manual mode",
    "atsLabel": "ATS:", "editorFile": "File", "editorExport": "Export",
    "cvObjectiveH": "## Objective", "cvObjective": "Senior Product Designer — digital products and design systems",
    "cvSummaryH": "## Summary",
    "cvSummary": "Product Designer with 7 years in fintech and B2B SaaS, leading end-to-end design — from research and discovery to scalable design systems used by entire product teams. Focused on turning complex problems into clear, measurable interfaces.",
    "cvSkillsH": "## Skills",
    "cvSkillsDesign": "**Design:** Figma, Design Systems, Prototyping, Design Tokens, Auto Layout",
    "cvSkillsResearch": "**Research:** Interviews, Usability Testing, Continuous Discovery, Metrics",
    "cvSkillsCollab": "**Collaboration:** Handoff, Storybook, Accessibility (WCAG), Design Ops",
    "cvExpH": "## Professional Experience",
    "cvExpRole": "### Senior Product Designer — Nubank | São Paulo, Brazil (Remote)", "cvExpDate": "**Mar 2023 – Present**",
    "statusWords": "842 words", "scoreBanner": "With suggestions: 30 → 45 pts", "scoreBannerBadge": "+15 pts",
    "scoreLabel": "ATS score", "catsTitle": "Category breakdown",
    "catKeywords": "Keywords", "catContent": "Content", "catFormat": "Format",
    "exportTitle": "Export optimized version", "exportPdf": "Download optimized resume · PDF",
    "exportMd": "Export Markdown", "exportSave": "Save as new version"
  },
  "editorMock": {
    "jdLabel": "Job description · Senior Frontend @ Nubank",
    "jdPre": "We're looking for a senior engineer with", "jdMid": "to lead",
    "jdPost": "initiatives, ensuring", "jdEnd": "in high-traffic products.", "and": "and",
    "cvLabel": "Your resume · Bullet #3", "beforeTag": "Before",
    "beforeText": "Helped develop front-end features on the team, working with the product team.",
    "afterTag": "After · AI", "afterBadge": "+7 pts",
    "afterPre": "Led the migration of", "afterMid": "in", "afterCut": ", cutting TTI by",
    "afterEnd": "and raising the Lighthouse score to",
    "kwTitle": "Suggested keywords", "sideScore": "ATS score", "downloadPdf": "Download PDF"
  }
}
```

- [ ] **Step 3: Validate JSON**

Run: `python3 -c "import json; d=json.load(open('apps/jobapply-app/src/i18n/translations.json')); assert d['pt-BR']['landing']['hero']['titleAccent']=='quer'; assert d['en']['landing']['features']['items']['6']['tag']=='100% ATS-safe'; print('OK')"`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add apps/jobapply-app/src/i18n/translations.json
git commit -m "feat(landing): rewrite landing i18n for redesign (pt-BR + en)"
```

---

### Task 4: Topbar + Hero + LandingPage shell

**Files:**
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/components/Topbar.tsx`
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/components/Hero.tsx`
- Rewrite: `apps/jobapply-app/src/presentation/pages/LandingPage/LandingPage.tsx`
- Keep: `apps/jobapply-app/src/presentation/pages/LandingPage/index.ts` (already `export { default } from './LandingPage'`)

**Interfaces:**
- Consumes: all exports from `LandingPage.styles.ts` (Task 1), `useRevealOnScroll` (Task 1), i18n `landing.nav.*` + `landing.hero.*` (Task 3).
- Produces: `export default function Topbar()`, `export default function Hero()`, and `LandingPage` composing `<Aurora/>` (inline) + `<Topbar/>` + `<Hero/>` + placeholders for later sections. `AppScreenshot` is added in Task 5; until then Hero renders without the screenshot (a `{/* AppScreenshot */}` slot).

- [ ] **Step 1: Write `Topbar.tsx`** (mock lines 297–311)

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { topbarCls, topbarBarCls, btnDarkMdCls, tokens } from '../LandingPage.styles'

const brandCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:900;letter-spacing:-.02em;font-size:20px;color:${tokens.ink}`
const navCls = css`display:flex;gap:28px;font-size:14px;color:rgba(10,10,18,.65);@media (max-width:640px){display:none}`
const linkCls = css`white-space:nowrap;cursor:pointer;&:hover{opacity:.7}`

export default function Topbar() {
  const { t } = useTranslation()
  return (
    <div className={topbarCls}>
      <nav className={topbarBarCls}>
        <span className={brandCls}>dojob</span>
        <div className={navCls}>
          <a href="#como-funciona" className={linkCls}>{t('landing.nav.howItWorks')}</a>
          <a href="#recursos" className={linkCls}>{t('landing.nav.atsScore')}</a>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <Link to="/login" className={linkCls} style={{ fontSize: 14 }}>{t('landing.nav.login')}</Link>
          <Link to="/register" className={btnDarkMdCls}>{t('landing.nav.tryFree')}</Link>
        </div>
      </nav>
    </div>
  )
}
```

- [ ] **Step 2: Write `Hero.tsx`** (mock lines 313–332; screenshot slot filled in Task 5)

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { sectionHeroCls, displayCls, accentCls, leadCls, btnDarkLgCls, btnGhostLgCls, fadeInCls, tokens } from '../LandingPage.styles'
import AppScreenshot from './AppScreenshot'

const subCls = css`display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:48px;flex-wrap:wrap`
const actionsCls = css`display:flex;gap:14px;align-items:center`
const hlCls = css`color:${tokens.ink};font-weight:700`
const shotCls = css`margin-top:80px;position:relative`

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section className={sectionHeroCls}>
      <h1 className={`${displayCls} ${fadeInCls}`}>
        {t('landing.hero.title1')}<br />{t('landing.hero.title2')}<br />
        {t('landing.hero.title3')} <span className={accentCls}>{t('landing.hero.titleAccent')}</span>.
      </h1>
      <div className={`${subCls} ${fadeInCls}`}>
        <p className={leadCls}>
          {t('landing.hero.leadPre')}<span className={hlCls}>{t('landing.hero.leadHl')}</span>{t('landing.hero.leadPost')}
        </p>
        <div className={actionsCls}>
          <Link to="/register" className={btnDarkLgCls}>{t('landing.hero.ctaMain')} →</Link>
          <a href="#como-funciona" className={btnGhostLgCls}>{t('landing.hero.ctaSec')}</a>
        </div>
      </div>
      <div className={`${shotCls} ${fadeInCls}`}>
        <AppScreenshot />
      </div>
    </section>
  )
}
```

> Note: `AppScreenshot` is created in Task 5. To keep Task 4 typechecking independently, create a minimal placeholder `AppScreenshot.tsx` now: `export default function AppScreenshot(){ return null }` — Task 5 replaces its body.

- [ ] **Step 3: Create placeholder `components/AppScreenshot.tsx`**

```tsx
export default function AppScreenshot() { return null }
```

- [ ] **Step 4: Rewrite `LandingPage.tsx` as the shell**

```tsx
import { useTranslation } from 'react-i18next'
import { auroraCls, auroraBlob1Cls, auroraBlob2Cls, auroraBlob3Cls, auroraBlob4Cls, auroraVeilCls, tokens } from './LandingPage.styles'
import { useRevealOnScroll } from './useRevealOnScroll'
import Topbar from './components/Topbar'
import Hero from './components/Hero'

function Aurora() {
  return (
    <div className={auroraCls} aria-hidden="true">
      <div className={auroraBlob1Cls} />
      <div className={auroraBlob2Cls} />
      <div className={auroraBlob3Cls} />
      <div className={auroraBlob4Cls} />
      <div className={auroraVeilCls} />
    </div>
  )
}

export default function LandingPage() {
  useTranslation()
  useRevealOnScroll()
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: tokens.bg, color: tokens.ink, fontFamily: "'Lato','Verdana',sans-serif" }}>
      <Aurora />
      <Topbar />
      <main>
        <Hero />
        {/* Task 6: FeaturesSection */}
        {/* Task 7: StepsSection, FinalCTA */}
      </main>
      {/* Task 7: Footer */}
    </div>
  )
}
```

- [ ] **Step 5: Typecheck + visual check**

Run: `yarn workspace jobapply-app typecheck` → PASS.
Run: `yarn workspace jobapply-app dev`, open `http://localhost:5173/`. Expected: aurora background, glass topbar, giant hero headline with gradient last word, lead + two buttons. Toggle browser language or temporarily set `lng:'en'` to confirm EN copy. Screenshot area is empty (Task 5).

- [ ] **Step 6: Commit**

```bash
git add apps/jobapply-app/src/presentation/pages/LandingPage/
git commit -m "feat(landing): add topbar, hero, and page shell with aurora"
```

---

### Task 5: AppScreenshot (hero product mock)

**Files:**
- Rewrite: `apps/jobapply-app/src/presentation/pages/LandingPage/components/AppScreenshot.tsx`

**Interfaces:**
- Consumes: `cardWhiteCls`, `ringCls`, `barCls`, `barFillCls`, `chipCls`, `tokens`, `monoCls` from styles; `atsList`, `categories`, `minimap`, `scores` from `data.ts`; i18n `landing.appMock.*`.
- Produces: `export default function AppScreenshot()` — the faithful product screenshot.

- [ ] **Step 1: Port mock lines 331–461 to JSX**

Reproduce, in order, the structure from the mock (`card-white` → `app__topbar` → `app__sub` → `app__ats` → `app__split` [dark markdown `editor` + `score` panel]). Rules:
- Use the shared classes for `cardWhiteCls`, `ringCls`, `barCls`/`barFillCls`, `chipCls`, `monoCls`; recreate the mock's `app__*`, `editor__*`, `score__*`, `cats__*`, `export__*`, `app-btn*` styles as **local** `css` consts in this file (they are screenshot-specific — copy the exact declarations from mock lines 114–186).
- All visible text via `t('landing.appMock.<key>')`. Markdown lines use `cvObjectiveH`, `cvObjective`, `cvSummaryH`, `cvSummary`, `cvSkillsH`, `cvSkillsDesign`, `cvSkillsResearch`, `cvSkillsCollab`, `cvExpH`, `cvExpRole`, `cvExpDate`.
- ATS chips: `atsList.map(a => <div className={chipCls} key={a}>{a}</div>)`.
- Category bars: `categories.map(c => …<span>{t(\`landing.appMock.${c.key}\`)}</span>…width:c.pct…)`.
- Minimap rows: `minimap.map((w,i) => <div key={i} style={{ width:w, height:3, borderRadius:2, background:'rgba(255,255,255,.35)' }} />)`.
- Score ring: SVG two circles + gradient `g1` (`#7c5cfc`→`#ec4899`), `stroke-dashoffset={198}` (value 30), center `<div className="value">30</div><div>/100</div>`.
- Status bar: `Markdown` · `Ln 1, Col 1` · `{t('landing.appMock.statusWords')}` · `PT-BR`.
- Export buttons: primary `exportPdf`, outline `exportMd`, outline `exportSave`.
- Mark decorative-only wrappers (minimap, avatar) with `aria-hidden="true"`.

Representative slice (ATS row + one category bar — follow this pattern for the rest):

```tsx
<div className={appAtsCls}>
  <span className={atsLabelCls}>{t('landing.appMock.atsLabel')}</span>
  {atsList.map(a => <div className={chipCls} key={a}>{a}</div>)}
</div>
{/* …inside score panel… */}
<div className={catsTitleCls}>{t('landing.appMock.catsTitle')}</div>
{categories.map(c => (
  <div key={c.key}>
    <div className={catNameCls}>{t(`landing.appMock.${c.key}`)}</div>
    <div className={barCls}><div className={barFillCls} style={{ width: c.pct }} /></div>
  </div>
))}
```

- [ ] **Step 2: Typecheck + visual check**

Run: `yarn workspace jobapply-app typecheck` → PASS.
Dev server: hero now shows the full app screenshot (dark editor left, score panel right, ring "30/100"). Collapses to 1 column ≤900px. EN toggle translates all labels and the CV markdown.

- [ ] **Step 3: Commit**

```bash
git add apps/jobapply-app/src/presentation/pages/LandingPage/components/AppScreenshot.tsx
git commit -m "feat(landing): build faithful app screenshot in hero"
```

---

### Task 6: FeaturesSection + EditorMock

**Files:**
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/components/EditorMock.tsx`
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/components/FeaturesSection.tsx`
- Modify: `apps/jobapply-app/src/presentation/pages/LandingPage/LandingPage.tsx` (mount `<FeaturesSection/>` in the `{/* Task 6 */}` slot, wrapped so `id="recursos"` and `id="como-funciona"` anchors exist)

**Interfaces:**
- Consumes: `headingCls`, `accentCyanCls`, `leadSmCls`, `ringSmCls`, `barSmCls`, `barFillCyanCls`, `scoreCountKeyframe`, `fadeInCls`, `tokens`, `monoCls`; `features`, `suggestKw`, `scores` from `data.ts`; i18n `landing.features.*` + `landing.editorMock.*`.
- Produces: `export default function EditorMock()`, `export default function FeaturesSection()`.

- [ ] **Step 1: Write `EditorMock.tsx`** (mock lines 492–570)

Reproduce `mock` (glass) → `mock__bar` (3 window dots, url `dojob.pro/editor`, lang toggle PT-BR/EN with `--on` on EN) → `mock__split` [`mock__main` + `mock__side`]. Screenshot-specific classes (`mock__*`, `hl`, `mj-*`, `kw-chip`, `score-row__*`) as local `css` consts copied from mock lines 200–237. Text via `t('landing.editorMock.<key>')`.

- JD sentence with highlighted keywords — interpolate spans between segments:

```tsx
const hl = css`background:rgba(139,92,246,.18);color:#7c3aed;padding:1px 4px;border-radius:3px`
// …
<div className={jdCls}>
  {t('landing.editorMock.jdPre')} <span className={hl}>React</span> {t('landing.editorMock.and')} <span className={hl}>TypeScript</span> {t('landing.editorMock.jdMid')} <span className={hl}>microfrontend</span>{t('landing.editorMock.jdPost')} <span className={hl}>performance</span> {t('landing.editorMock.and')} <span className={hl}>a11y</span> {t('landing.editorMock.jdEnd')}
</div>
```

> The connector `editorMock.and` (`"e"` / `"and"`) is already defined in the Task 3 JSON for both languages.

- After bullet: before box (strikethrough `beforeText`), after box (`afterTag`, `afterBadge`, sentence with `mj-purple` `12 microfrontends`, `React/TypeScript` and `mj-green` `37%`, `98`):

```tsx
<div className={afterCls}>
  {t('landing.editorMock.afterPre')} <span className={mjPurple}>12 microfrontends</span> {t('landing.editorMock.afterMid')} <span className={mjPurple}>React/TypeScript</span>{t('landing.editorMock.afterCut')} <span className={mjGreen}>37%</span> {t('landing.editorMock.afterEnd')} <span className={mjGreen}>98</span>.
</div>
```

- `mock__kw`: title `kwTitle` + `suggestKw.map(k => <span className={kwChip} key={k}>+{k}</span>)`.
- `mock__side`: label `sideScore`; ring 91 (`ringSmCls`, SVG gradient `g2` `#8b5cf6`→`#06b6d4`→`#16a34a`, animated circle uses `style={{ animation: \`${scoreCountKeyframe} 2.2s cubic-bezier(.2,.7,.2,1) .3s both\` }}` gated by reduced-motion — wrap in a `prefers-reduced-motion: no-preference` check by only applying the animation when `!reduce`); sub `+23 pts`; `hr`; `scores.map` rows with `barSmCls`/`barFillCyanCls` widths `${s.pct}%`; `Baixar PDF` button (`downloadPdf`).

- [ ] **Step 2: Write `FeaturesSection.tsx`** (mock lines 466–489)

```tsx
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { sectionCls, headingCls, accentCyanCls, leadSmCls, fadeInCls, tokens, monoCls } from '../LandingPage.styles'
import { features } from '../data'
import EditorMock from './EditorMock'

const splitCls = css`display:grid;grid-template-columns:0.9fr 1.1fr;gap:60px;margin-top:80px;align-items:start;@media (max-width:900px){grid-template-columns:1fr;gap:40px}`
const listCls = css`display:flex;flex-direction:column;position:sticky;top:120px;@media (max-width:900px){position:static}`
const featCls = css`padding:22px 0;border-top:1px solid rgba(10,10,18,.1);display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center`
const numCls = css`font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(10,10,18,.35);letter-spacing:.1em;width:28px`
const titleCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:700;font-size:22px;line-height:1.15;letter-spacing:-.015em;margin:0 0 4px;color:${tokens.ink}`
const descCls = css`font-size:13px;line-height:1.5;color:rgba(10,10,18,.55);margin:0`
const tagCls = css`display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.7);border:1px solid ${tokens.line};color:rgba(10,10,18,.7);font-family:'JetBrains Mono',monospace;white-space:nowrap;box-shadow:0 4px 12px rgba(20,20,50,.06)`

export default function FeaturesSection() {
  const { t } = useTranslation()
  return (
    <section className={sectionCls}>
      <div className={fadeInCls} style={{ maxWidth: 900 }}>
        <h2 className={headingCls}>{t('landing.features.headingPre')}<span className={accentCyanCls}>{t('landing.features.headingAccent')}</span>.</h2>
        <p className={leadSmCls} style={{ marginTop: 28 }}>{t('landing.features.sub')}</p>
      </div>
      <div className={splitCls}>
        <div className={`${listCls} ${fadeInCls}`}>
          {features.map(f => (
            <div className={featCls} key={f.n}>
              <div className={numCls}>{f.n}</div>
              <div>
                <h3 className={titleCls}>{t(`landing.features.items.${f.key}.title`)}</h3>
                <p className={descCls}>{t(`landing.features.items.${f.key}.desc`)}</p>
              </div>
              <div className={tagCls}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: f.dot, boxShadow: `0 0 8px ${f.dot}` }} />
                {t(`landing.features.items.${f.key}.tag`)}
              </div>
            </div>
          ))}
        </div>
        <div className={fadeInCls} style={{ position: 'relative' }}>
          <EditorMock />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Mount in `LandingPage.tsx`**

Replace the `{/* Task 6: FeaturesSection */}` comment with anchors + component:

```tsx
<div id="recursos" />
<div id="como-funciona" />
<FeaturesSection />
```

(Import `FeaturesSection` at top.)

- [ ] **Step 4: Typecheck + visual check**

Run: `yarn workspace jobapply-app typecheck` → PASS.
Dev server: features section shows sticky numbered list (scrolls while editor mock stays) + light editor mock with JD keywords highlighted, before/after bullet, ring "91" animating once. Reduced-motion OS setting: ring shows 91 with no animation. EN toggle translates everything.

- [ ] **Step 5: Commit**

```bash
git add apps/jobapply-app/src/presentation/pages/LandingPage/
git commit -m "feat(landing): add features list and editor mock section"
```

---

### Task 7: StepsSection + FinalCTA + Footer (page complete)

**Files:**
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/components/StepsSection.tsx`
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/components/FinalCTA.tsx`
- Create: `apps/jobapply-app/src/presentation/pages/LandingPage/components/Footer.tsx`
- Modify: `apps/jobapply-app/src/presentation/pages/LandingPage/LandingPage.tsx` (mount all three)

**Interfaces:**
- Consumes: `sectionStepsCls`, `sectionCtaCls`, `headingCls`, `headingCtaCls`, `accentPinkCls`, `accentCyanCls`, `glassCls`, `panelCls`, `btnDarkXlCls`, `fadeInCls`, `tokens`; `steps` from `data.ts`; i18n `landing.steps.*`, `landing.cta.*`, `landing.footer.*`.
- Produces: `export default` for `StepsSection`, `FinalCTA`, `Footer`.

- [ ] **Step 1: Write `StepsSection.tsx`** (mock lines 576–590)

```tsx
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { sectionStepsCls, headingCls, accentPinkCls, glassCls, fadeInCls, tokens } from '../LandingPage.styles'
import { steps } from '../data'

const gridCls = css`display:grid;grid-template-columns:repeat(4,1fr);gap:24px;@media (max-width:1040px){grid-template-columns:repeat(2,1fr)}@media (max-width:560px){grid-template-columns:1fr}`
const stepCls = css`padding:40px;border-radius:24px;min-height:300px;position:relative`
const numCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:900;font-size:112px;line-height:1;color:transparent;-webkit-text-stroke:1.5px rgba(10,10,18,.16);letter-spacing:-.04em`
const titleCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:700;font-size:26px;line-height:1.15;letter-spacing:-.02em;margin:20px 0 12px;color:${tokens.ink}`
const descCls = css`font-size:15px;line-height:1.55;color:rgba(10,10,18,.6);margin:0`

export default function StepsSection() {
  const { t } = useTranslation()
  return (
    <section className={sectionStepsCls}>
      <div className={fadeInCls} style={{ maxWidth: 900, marginBottom: 80 }}>
        <h2 className={headingCls}>{t('landing.steps.headingPre')}<span className={accentPinkCls}>{t('landing.steps.headingAccent')}</span>{t('landing.steps.headingPost')}</h2>
      </div>
      <div className={gridCls}>
        {steps.map(s => (
          <div className={`${stepCls} ${glassCls} ${fadeInCls}`} key={s.n}>
            <div className={numCls}>{s.n}</div>
            <h4 className={titleCls}>{t(`landing.steps.items.${s.key}.title`)}</h4>
            <p className={descCls}>{t(`landing.steps.items.${s.key}.desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write `FinalCTA.tsx`** (mock lines 593–607)

```tsx
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { css, keyframes } from '@emotion/css'
import { sectionCtaCls, headingCtaCls, accentCyanCls, panelCls, btnDarkXlCls, fadeInCls, tokens } from '../LandingPage.styles'

const mm = '@media (prefers-reduced-motion: no-preference)'
const drift = keyframes`0%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}33%{transform:translate3d(6%,-2%,0) rotate(40deg) scale(1.25)}66%{transform:translate3d(-4%,8%,0) rotate(-25deg) scale(1.15)}100%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}`
const ctaCls = css`position:relative;overflow:hidden;padding:100px 60px;text-align:center`
const blobWrap = css`position:absolute;inset:0;overflow:hidden;pointer-events:none`
const blob1 = css`position:absolute;top:-40%;left:20%;width:60%;height:200%;background:radial-gradient(closest-side,rgba(139,92,246,.35),transparent 70%);filter:blur(70px);${mm}{animation:${drift} 24s ease-in-out infinite}`
const blob2 = css`position:absolute;top:-30%;right:10%;width:50%;height:180%;background:radial-gradient(closest-side,rgba(6,182,212,.3),transparent 70%);filter:blur(80px);${mm}{animation:${drift} 30s ease-in-out infinite}`
const leadCtaCls = css`font-size:20px;color:${tokens.fgSoft};margin:32px auto 0;max-width:560px`
const actionsCls = css`display:flex;gap:14px;justify-content:center;margin-top:40px;flex-wrap:wrap`

export default function FinalCTA() {
  const { t } = useTranslation()
  return (
    <section className={sectionCtaCls}>
      <div className={`${ctaCls} ${panelCls} ${fadeInCls}`}>
        <div className={blobWrap} aria-hidden="true"><div className={blob1} /><div className={blob2} /></div>
        <div style={{ position: 'relative' }}>
          <h2 className={headingCtaCls}>{t('landing.cta.headingPre')}<span className={accentCyanCls}>{t('landing.cta.headingAccent')}</span>{t('landing.cta.headingPost')}</h2>
          <p className={leadCtaCls}>{t('landing.cta.lead')}</p>
          <div className={actionsCls}>
            <Link to="/register" className={btnDarkXlCls}>{t('landing.cta.btn')} →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Write `Footer.tsx`** (mock lines 610–618)

```tsx
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { tokens } from '../LandingPage.styles'

const footerCls = css`position:relative;z-index:5;max-width:1440px;margin:0 auto;padding:40px 48px 60px;border-top:1px solid ${tokens.line};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px`
const leftCls = css`display:flex;align-items:center;gap:14px`
const brandCls = css`font-family:'Lato','Verdana',sans-serif;font-weight:900;font-size:16px;color:${tokens.ink}`
const copyCls = css`font-size:12px;color:rgba(10,10,18,.4)`
const linksCls = css`display:flex;gap:24px;font-size:13px;color:rgba(10,10,18,.55)`
const linkCls = css`cursor:pointer;&:hover{opacity:.7}`

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className={footerCls}>
      <div className={leftCls}>
        <span className={brandCls}>dojob</span>
        <span className={copyCls}>{t('landing.footer.copy')}</span>
      </div>
      <div className={linksCls}>
        <a className={linkCls}>{t('landing.footer.about')}</a>
        <a className={linkCls}>{t('landing.footer.blog')}</a>
        <a className={linkCls}>{t('landing.footer.privacy')}</a>
        <a className={linkCls}>{t('landing.footer.terms')}</a>
        <a className={linkCls}>{t('landing.footer.support')}</a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Mount all three in `LandingPage.tsx`**

Replace the `{/* Task 7 … */}` comments: `<StepsSection />` and `<FinalCTA />` inside `<main>`, `<Footer />` after `</main>`. Add imports.

- [ ] **Step 5: Typecheck + full visual pass**

Run: `yarn workspace jobapply-app typecheck` → PASS.
Dev server: full page top-to-bottom matches mock — hero, app screenshot, features+editor, 4 glass step cards (numbers 01–04), glass CTA panel with drifting blobs, minimal footer. Anchor links "Como funciona"/"Score ATS" scroll to sections. EN toggle translates the whole page.

- [ ] **Step 6: Commit**

```bash
git add apps/jobapply-app/src/presentation/pages/LandingPage/
git commit -m "feat(landing): add steps, final CTA, and footer sections"
```

---

### Task 8: SEO metadata, robots, sitemap, favicon

**Files:**
- Modify: `apps/jobapply-app/index.html` (`<head>`)
- Create: `apps/jobapply-app/public/robots.txt`
- Create: `apps/jobapply-app/public/sitemap.xml`
- Create: `apps/jobapply-app/public/favicon.svg`

**Interfaces:** none (static assets/markup).

- [ ] **Step 1: Update `index.html` `<head>`** (spec §8.1). Keep `<html lang="pt-BR">`, charset, viewport, the Task 1 font links. Replace the `vite.svg` icon link and add the SEO block:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="canonical" href="https://dojob.pro/" />
<meta name="robots" content="index, follow" />
<meta name="theme-color" content="#f2f2f5" />
<meta name="description" content="Cole a descrição da vaga e deixe a IA do dojob calibrar seu currículo: score ATS, keywords e bullets reescritos em minutos. PT-BR e inglês." />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="dojob" />
<meta property="og:title" content="dojob — Currículo sob medida para cada vaga, com IA" />
<meta property="og:description" content="Score ATS, keywords e bullets reescritos pela IA. Do CV genérico ao CV sob medida em minutos." />
<meta property="og:url" content="https://dojob.pro/" />
<meta property="og:image" content="https://dojob.pro/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:locale:alternate" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="dojob — Currículo sob medida para cada vaga, com IA" />
<meta name="twitter:description" content="Score ATS, keywords e bullets reescritos pela IA. Do CV genérico ao CV sob medida em minutos." />
<meta name="twitter:image" content="https://dojob.pro/og-image.png" />
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"SoftwareApplication","name":"dojob","applicationCategory":"BusinessApplication","operatingSystem":"Web","url":"https://dojob.pro/","offers":{"@type":"Offer","price":"0","priceCurrency":"BRL"}},
{"@type":"Organization","name":"dojob","url":"https://dojob.pro/","logo":"https://dojob.pro/favicon.svg"}
]}
</script>
<title>dojob — Currículo sob medida para cada vaga, com IA</title>
```

- [ ] **Step 2: Create `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://dojob.pro/sitemap.xml
```

- [ ] **Step 3: Create `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dojob.pro/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 4: Create `public/favicon.svg`** (monogram "d" in brand purple on transparent)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="#0a0a12"/>
  <text x="50%" y="50%" dy=".07em" text-anchor="middle" dominant-baseline="middle" font-family="Lato, Verdana, sans-serif" font-weight="900" font-size="40" fill="#7c5cfc">d</text>
</svg>
```

- [ ] **Step 5: Build to confirm public assets are copied**

Run: `yarn workspace jobapply-app build`
Expected: build succeeds; `apps/jobapply-app/dist/robots.txt`, `dist/sitemap.xml`, `dist/favicon.svg` exist, and `dist/index.html` contains the OG tags. Verify: `grep -c "og:image" apps/jobapply-app/dist/index.html` → `≥1`.

- [ ] **Step 6: Commit**

```bash
git add apps/jobapply-app/index.html apps/jobapply-app/public/robots.txt apps/jobapply-app/public/sitemap.xml apps/jobapply-app/public/favicon.svg
git commit -m "feat(landing): add SEO metadata, robots, sitemap, favicon"
```

---

### Task 9: og:image thumbnail (1200×630)

**Files:**
- Create: `scripts/og-image/og-template.html`
- Create: `apps/jobapply-app/public/og-image.png`

**Interfaces:** none (asset generation).

- [ ] **Step 1: Write `scripts/og-image/og-template.html`** — a self-contained 1200×630 page in the new identity (aurora bg, `dojob` brand, headline "Um currículo à altura da vaga que você quer.", a score ring "91" + "+23 pts" chip). Fonts inline via Google Fonts link. Add a comment at the top with the render command:

```html
<!-- Render: npx playwright screenshot --viewport-size=1200,630 scripts/og-image/og-template.html apps/jobapply-app/public/og-image.png
     (or open in a 1200x630 window and export). Keep essential text ≥5% from edges. -->
<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#f2f2f5;font-family:'Lato',sans-serif;color:#0a0a12}
  .wrap{position:relative;width:1200px;height:630px;padding:80px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center}
  .b{position:absolute;border-radius:50%;filter:blur(90px)}
  .b1{top:-15%;left:-10%;width:600px;height:600px;background:radial-gradient(closest-side,rgba(139,92,246,.5),transparent 70%)}
  .b2{top:-10%;right:-10%;width:520px;height:520px;background:radial-gradient(closest-side,rgba(6,182,212,.42),transparent 70%)}
  .b3{bottom:-20%;left:30%;width:520px;height:520px;background:radial-gradient(closest-side,rgba(236,72,153,.3),transparent 70%)}
  .brand{position:relative;font-weight:900;font-size:34px;margin-bottom:28px}
  h1{position:relative;font-weight:900;font-size:76px;line-height:.98;letter-spacing:-.03em;margin:0;max-width:820px}
  .acc{background:linear-gradient(120deg,#8b5cf6,#06b6d4,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent}
  .ring{position:absolute;right:90px;top:50%;transform:translateY(-50%);width:220px;height:220px}
  .ring svg{transform:rotate(-90deg)}
  .rv{position:absolute;inset:0;display:grid;place-items:center;font-weight:900;font-size:64px;color:#7c5cfc}
  .chip{position:absolute;right:100px;bottom:120px;background:#0a0a12;color:#fff;font-weight:700;font-size:20px;padding:10px 20px;border-radius:999px}
</style></head><body>
<div class="wrap">
  <div class="b b1"></div><div class="b b2"></div><div class="b b3"></div>
  <div class="brand">dojob</div>
  <h1>Um currículo à altura da vaga que você <span class="acc">quer</span>.</h1>
  <div class="ring">
    <svg width="220" height="220" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(10,10,18,.08)" stroke-width="7"/>
      <circle cx="50" cy="50" r="45" fill="none" stroke="#7c5cfc" stroke-width="7" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="26"/>
    </svg>
    <div class="rv">91</div>
  </div>
  <div class="chip">+23 pts</div>
</div></body></html>
```

- [ ] **Step 2: Render the PNG**

Run: `npx -y playwright@latest screenshot --viewport-size=1200,630 "scripts/og-image/og-template.html" "apps/jobapply-app/public/og-image.png"`
Expected: `apps/jobapply-app/public/og-image.png` created at 1200×630. Verify: `file apps/jobapply-app/public/og-image.png` reports PNG 1200 x 630.
If Playwright is unavailable in the environment, note it and generate the PNG by opening the template in a 1200×630 browser window and exporting; the template stays versioned for regeneration.

- [ ] **Step 3: Commit**

```bash
git add scripts/og-image/og-template.html apps/jobapply-app/public/og-image.png
git commit -m "feat(landing): add og:image thumbnail and template"
```

---

### Task 10: Final verification pass

**Files:** none (verification + fixes only).

- [ ] **Step 1: Typecheck + build**

Run: `yarn workspace jobapply-app typecheck && yarn workspace jobapply-app build`
Expected: both PASS. Fix any type/build error inline.

- [ ] **Step 2: Lint**

Run: `yarn workspace jobapply-app lint`
Expected: no new errors in `presentation/pages/LandingPage/**`. Fix inline.

- [ ] **Step 3: Manual acceptance checklist** (dev server, spec §12)

Run: `yarn workspace jobapply-app dev`, then verify at `http://localhost:5173/`:
- Page matches the mock top-to-bottom (aurora, topbar, hero+screenshot, features+editor mock, 4 steps, CTA, footer).
- Switch language PT-BR ↔ EN (set `lng` in `src/i18n/index.ts` or via `navigator.language`): **all** visible text changes, including CV markdown, JD sentence, before/after bullet, category names, export buttons.
- Resize: ≤1040px steps 4→2 cols; ≤900px screenshot/split/mock collapse to 1 col and feature list loses sticky; ≤640px topbar center links hide, side padding 22px.
- macOS System Settings → Accessibility → Reduce Motion ON: aurora static, no fade-in, ring shows final value.
- `Como funciona` / `Score ATS` anchors scroll to sections.
- Authenticated (token in localStorage) still redirects to `/tailoring`.

- [ ] **Step 4: Final commit (if any fixes)**

```bash
git add -A apps/jobapply-app
git commit -m "fix(landing): final polish and verification fixes"
```

---

## Self-Review

**Spec coverage:**
- §3 architecture (subcomponents + data + hook) → Tasks 1,2,4,5,6,7. ✅
- §4 tokens/styles/animations/fonts → Task 1. ✅
- §5 sections → Topbar/Hero (4), AppScreenshot (5), Features/EditorMock (6), Steps/CTA/Footer (7). ✅
- §6 data model → Task 2. ✅
- §7 i18n BR+EN (incl. screenshot copy) → Task 3 (incl. `editorMock.and` connector). ✅
- §8 SEO → Task 8. ✅
- §9 og:image → Task 9. ✅
- §10 a11y/responsive → built into component tasks + verified Task 10. ✅
- §12 acceptance criteria → Task 10 checklist. ✅

**Placeholder scan:** Foundation tasks (1,2,3,8,9) contain complete code/content. JSX-port tasks (5,6,7) give full component code except AppScreenshot/EditorMock inner markup, which is a faithful 1:1 port of specific mock line ranges (200–237, 114–186, 331–461, 492–570) using the exact shared classes and i18n keys — the source file is referenced precisely, not left "TBD".

**Type consistency:** Style export names in Task 1 match imports in Tasks 4–7. Data shapes in Task 2 (`features[].key`, `steps[].key`, `categories[].{key,pct}`, `scores[].{name,pct}`) match consumption in Tasks 5–7. i18n key paths in Task 3 (`landing.features.items.N.title`, `landing.appMock.*`, `landing.editorMock.*`) match `t(...)` calls in components, including the `editorMock.and` connector now present in the Task 3 JSON.
