# jobapply-app

Frontend SPA Vite + React + TypeScript. Consome jobapply-api via REST.

## Stack
- Vite + React 18 + TypeScript
- Ant Design (via wrappers em src/components/ — futuramente @jobapply/ui)
- TanStack Router (`routeTree.gen.ts` gerado automaticamente)
- i18n via `src/i18n/`

## Arquitetura Interna

```
src/
├── components/      — wrappers de UI sobre Ant Design (futuramente → @jobapply/ui)
├── design-system/   — tokens, primitivos visuais
├── domain/          — tipos e repositories por domínio (auth, jobs, cv, voucher)
├── infrastructure/  — implementações concretas dos repositories
├── presentation/    — páginas e views
├── routes/          — definições de rota (TanStack Router)
└── styles/          — tema e variáveis CSS
```

## Convenções

- Componentes em `src/components/` seguem estrutura: `ComponentName.tsx`, `ComponentName.styles.ts`, `ComponentName.types.ts`, `index.ts`
- Chamadas HTTP ficam nos `infrastructure/repositories/`, nunca em componentes ou views
- Tipos de domínio ficam em `domain/<dominio>/types.ts`

## PROIBIDO

- Lógica de negócio em componentes React
- Chamadas HTTP diretas em componentes (usar infrastructure/repositories)
- Duplicar componentes que já existem em src/components/
- Importar de outros apps do workspace
