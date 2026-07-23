# Landing page pública em `/` + tailoring em `/tailoring`

**Data:** 2026-07-23
**App:** `apps/jobapply-app` (Vite + React 18 + TanStack Router)

## Contexto

Hoje a rota `/` é a página de tailoring de CV (`CVTailoringPage`), servida atrás
do layout protegido `_auth` — quem não tem token é redirecionado para `/login`.
Não existe uma página de marketing pública.

O objetivo é:

1. `/` passa a ser uma **landing page pública** (marketing), já desenhada no
   protótipo `Landing page JobBoard/Landing.dc.html`.
2. A tailoring passa para `/tailoring` e é a **rota inicial do usuário logado**.
3. Todos os redirects internos que apontam para `/` passam a apontar para
   `/tailoring`.
4. A marca exibida no header do app autenticado passa a ser **"dojob"**.

O protótipo é um formato *design-canvas* com runtime próprio (`support.js`,
bindings `{{ }}`, `style-hover`, `<image-slot>`) — não é React drop-in. Ele será
**portado** para um componente React fiel ao visual.

## Decisões

- **Integração da landing:** portar para um componente React (`LandingPage`),
  não embutir o HTML/JS estático.
- **Usuário logado em `/`:** é **redirecionado para `/tailoring`**. A landing é
  puramente marketing para deslogados.
- **Copy:** mantida em PT hardcoded (igual ao mockup). Sem wire de i18n (YAGNI).
- **Ícones:** os poucos glyphs Font Awesome do mockup (chevron-down, arrow-up,
  file-pdf, rocket) são substituídos pelos equivalentes `@ant-design/icons` (já
  no projeto) para não adicionar outro CDN.
- **Fonte Lato:** adicionada via `<link>` do Google Fonts no `index.html`.
- **Hero `<image-slot>`:** sem imagem real disponível — substituído por um
  placeholder premium em CSS (card com gradiente), mantendo o badge "91 · Score
  ATS após tailoring".

## Arquitetura

### 1. Roteamento (TanStack file-based)

| Rota | Antes | Depois |
|------|-------|--------|
| `/` | `routes/_auth/index.tsx` → `CVTailoringPage` (protegida) | `routes/index.tsx` → `LandingPage` (pública) |
| `/tailoring` | — | `routes/_auth/tailoring.tsx` → `CVTailoringPage` (protegida) |

- **Novo** `routes/index.tsx` (rota `/`, fora do `_auth`):
  - `beforeLoad` lê `localStorage.getItem('token')` e reaproveita a lógica
    `isTokenExpired` já existente em `routes/_auth.tsx` (extrair para um helper
    compartilhado `src/application/auth/token.ts` para não duplicar).
  - Se o token existe e não está expirado → `throw redirect({ to: '/tailoring' })`.
  - Caso contrário → renderiza `LandingPage`.
- **Renomear** `routes/_auth/index.tsx` → `routes/_auth/tailoring.tsx`:
  - `createFileRoute('/_auth/tailoring')`, mesmo componente `CVTailoringPage`.
- `routeTree.gen.ts` é regenerado automaticamente pelo plugin do TanStack Router
  no `dev`/`build`.

### 2. Componente `LandingPage`

Novo diretório `src/presentation/pages/LandingPage/`:

- `LandingPage.tsx` — markup portado do mockup.
- `LandingPage.styles.ts` — estilos com emotion: keyframes (`floatOrb`,
  `fadeUp`, `bounce`, `pulse`), regras de `:hover` (equivalentes aos
  `style-hover`) e helpers de estilo responsivo.
- `index.ts` — reexport.

Seções (fiéis ao `Landing.dc.html`):

1. **Nav liquid-glass** fixa — marca "dojob", links âncora "Como funciona" /
   "Score ATS", CTA "Entrar" (`/login`) e "Testar grátis" (`/register`).
2. **Hero editorial** — gradiente roxo, orbs animados, título, subtítulo,
   CTAs "Tailorizar meu CV" (`/register`) e "Ver como funciona" (âncora),
   card placeholder + badge de score.
3. **Features** — 6 cards (Score ATS, keywords, reescrita de bullets,
   antes/depois, PT-BR/English, export PDF).
4. **How it works** — 3 passos + card mock de análise ATS.
5. **CTA band** — "Criar conta grátis agora" (`/register`).
6. **Footer** — marca "dojob", links, copyright.

Detalhes de implementação:

- **Responsividade:** `useBreakpoint` do antd; mobile quando `!screens.md`
  (aproxima o breakpoint de 860px do mockup). Os objetos de estilo condicionais
  do `renderVals()` (navStyle, heroGridStyle, featuresGridStyle, etc.) viram
  funções/objetos que dependem do flag `isMobile`.
- **CTAs de navegação:** `Link`/`navigate` do TanStack Router para `/login` e
  `/register`. Âncoras `#como-funciona` / `#score` permanecem como `<a href>`
  com scroll suave (`html { scroll-behavior: smooth }`).
- **Marca "dojob":** `do` + `<span style="color:#c4b5fd">job</span>`.

### 3. Header "dojob"

`src/design-system/layout/AppHeader/AppHeader.tsx`:

- Logo `job` + `board` → `do` + `job` ("dojob", com "job" em `#c4b5fd`).
- Link do logo `href="/"` → `href="/tailoring"`.
- Ajustar `AppHeader.styles.ts` (`logoJob`/`logoBoard`) conforme necessário para
  o novo texto.

### 4. Redirects `/` → `/tailoring`

- `src/presentation/pages/LoginPage/LoginPage.tsx`:
  `user.cv ? '/' : '/cv'` → `user.cv ? '/tailoring' : '/cv'`.
- `src/presentation/pages/LinkedInCallbackPage/LinkedInCallbackPage.tsx`:
  `navigate({ to: '/' })` (2 ocorrências) e `returnPath as '/'` → `/tailoring`.
- `src/presentation/components/AppLayout.tsx`: navItem `tailoring` →
  `href: '/tailoring'`, `active: pathname === '/tailoring'`.
- `apps/jobapply-app/package.json` (config `reactSnap`): remover `/` da lista
  `exclude` para que a landing pública seja pré-renderizada; manter `/tailoring`,
  `/cv`, `/login`, `/register` excluídos.

## Fora de escopo

- i18n da landing (copy fica em PT).
- Imagem real no hero (fica placeholder CSS).
- Qualquer alteração na `CVTailoringPage` em si.
- Refatorações não relacionadas.

## Critérios de sucesso

- Deslogado em `/` vê a landing; clicar "Entrar" vai para `/login`, "Testar
  grátis"/"Criar conta"/"Tailorizar" vão para `/register`.
- Logado em `/` é redirecionado para `/tailoring`.
- `/tailoring` (protegida) renderiza a tailoring; sem token → `/login`.
- Após login, usuário com CV cai em `/tailoring`.
- Callback do LinkedIn redireciona para `/tailoring`.
- Header do app autenticado exibe "dojob" e o logo leva a `/tailoring`.
- `yarn workspace jobapply-app typecheck` e `lint` passam.
