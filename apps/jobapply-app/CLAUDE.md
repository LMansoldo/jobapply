# jobapply-app

Frontend SPA Vite + React + TypeScript. Consome jobapply-api via REST.

## Stack
- Vite + React 18 + TypeScript
- Ant Design (via wrappers em src/design-system/wrappers/)
- UI kit base: `@jobapply/ui` (packages/ui) — primitives em @emotion/styled consumidos via fonte; `src/design-system/` contém apenas UI genérica (tokens, wrappers Ant Design e compostos sem acoplamento de domínio)
- TanStack Router (`routeTree.gen.ts` gerado automaticamente)
- i18n via `src/i18n/`

## Arquitetura Interna

```
src/
├── design-system/   — UI genérica: tokens, wrappers sobre Ant Design e compostos sem imports de domain/ (layout/, navigation/, auth/, ats/, cv/ genéricos, wrappers/; primitives vivem em @jobapply/ui)
├── domain/          — tipos, hooks de dados (fetch fino de repository) e helpers por domínio (auth, jobs, cv, voucher); sem componentes UI
├── infrastructure/  — implementações concretas dos repositories
├── presentation/    — páginas, views, hooks de orquestração de UI (hooks/) e features acopladas a domain (components/ — ex.: CVViewer, tailoring/)
├── routes/          — definições de rota (TanStack Router)
└── styles/          — tema e variáveis CSS
```

## Convenções

- Wrappers de UI em `src/design-system/wrappers/` seguem estrutura: `ComponentName.tsx`, `ComponentName.styles.ts`, `ComponentName.types.ts`, `index.ts`
- Estilização: `@emotion/styled` + `props.theme` em TODOS os *.styles.ts (ThemeProvider montado em `AppWithProviders.tsx`); tema único em `src/styles/theme/emotionTheme.ts` (dono dos VALORES dos tokens; a interface do tema vem de `@jobapply/ui` via `UITheme`); `@emotion/css` foi removido do app — não reintroduzir; `style={{ }}` inline evitado em código novo de design-system
- Chamadas HTTP ficam nos `infrastructure/repositories/`, nunca em componentes ou views
- Tipos de domínio ficam em `domain/<dominio>/types.ts`
- Hooks que orquestram estado de página/UI (modais, steps, formulário, toggles) ficam em `presentation/hooks/`; hooks wrapper fino de chamada a repository com loading/error ficam em `domain/<dominio>/hooks/`
- O editor rich da tailoring é controlado por `isRichEditorEnabled()` (`presentation/components/tailoring/editor/flag.ts`, override via localStorage `dojob:richEditor`); o Monaco permanece no `MonacoEditorPanel` (CVPage) e é carregado via `lazy` no `TailoringEditorPanel`

## PROIBIDO

- Lógica de negócio em componentes React
- Chamadas HTTP diretas em componentes (usar infrastructure/repositories)
- Duplicar componentes que já existem em src/design-system/wrappers/
- Importar de outros apps do workspace
- Imports de `domain/` dentro de `src/design-system/` — design-system é UI genérica; qualquer componente acoplado a domain vive em `presentation/components/`
