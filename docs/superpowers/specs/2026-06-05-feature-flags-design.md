---
title: Feature Flags — Frontend (jobapply-app)
date: 2026-06-05
status: approved
---

# Feature Flags — Frontend (jobapply-app)

## Objetivo

Controlar a visibilidade de rotas e abas no frontend via variáveis de ambiente, permitindo scoping do MVP por ambiente sem alterar código.

## Escopo

Flags implementadas nesta iteração:

| Flag | Controla |
|---|---|
| `VITE_FEATURE_LINKEDIN` | Rota `/linkedin` e item de nav "LinkedIn" |
| `VITE_FEATURE_COVER_LETTER` | Aba "Cover Letter" no CVTailoringPage |
| `VITE_FEATURE_VIDEO` | Aba "Video Script" no CVTailoringPage |
| `VITE_FEATURE_INTERVIEW` | Aba "Interview Training" no CVTailoringPage |

Fora do escopo: feature flags no `jobapply-api` ou `ats-agent`.

## Arquitetura

### Módulo central

Novo arquivo: `apps/jobapply-app/src/config/featureFlags.ts`

```ts
export const featureFlags = {
  linkedin:       import.meta.env.VITE_FEATURE_LINKEDIN      === 'true',
  coverLetterTab: import.meta.env.VITE_FEATURE_COVER_LETTER  === 'true',
  videoTab:       import.meta.env.VITE_FEATURE_VIDEO         === 'true',
  interviewTab:   import.meta.env.VITE_FEATURE_INTERVIEW     === 'true',
}
```

Todos os pontos de uso importam deste módulo. Nenhum componente lê `import.meta.env` diretamente.

### Configuração de ambiente

**`apps/jobapply-app/.env`** (default — MVP restrito):
```
VITE_FEATURE_LINKEDIN=false
VITE_FEATURE_COVER_LETTER=false
VITE_FEATURE_VIDEO=false
VITE_FEATURE_INTERVIEW=false
```

**`apps/jobapply-app/.env.development`** (dev — tudo ligado):
```
VITE_FEATURE_LINKEDIN=true
VITE_FEATURE_COVER_LETTER=true
VITE_FEATURE_VIDEO=true
VITE_FEATURE_INTERVIEW=true
```

As flags são build-time: mudar valores exige rebuild.

## Pontos de Aplicação

### 1. `AppLayout.tsx` — nav items

`navItems` é filtrado pela flag `linkedin` antes de ser passado ao `DSAppHeader` e ao bottom nav mobile.

`MOBILE_NAV_KEYS` é removido. O `mobileNavItems` passa a ser derivado diretamente de `navItems` (já filtrado pelas flags), eliminando a redundância da constante hardcoded.

### 2. `_auth/linkedin/index.tsx` — beforeLoad

Adicionar `beforeLoad` na rota `/linkedin` que redireciona para `/` quando `featureFlags.linkedin === false`. Impede acesso direto via URL mesmo com a nav escondida.

### 3. `TailoringWorkspaceTabs.tsx` — array de tabs

O array `tabs` é construído filtrando pelas flags:

```ts
const allTabs = [
  { key: 'ats', ... },
  featureFlags.coverLetterTab && { key: 'cover', ... },
  featureFlags.videoTab       && { key: 'video', ... },
  featureFlags.interviewTab   && { key: 'interview', ... },
].filter(Boolean)
```

A linha `const activeTabDef = tabs.find(...)!` perde o `!` e passa a ter fallback para o primeiro item disponível, prevenindo crash.

### 4. `CVTailoringPage.tsx` — guards de renderização

Os blocos condicionais das abas desabilitadas continuam existindo mas são protegidos por `featureFlags.*` adicionalmente. Garante que mesmo que `activeTab` aponte para uma tab desabilitada por algum bug, o workspace não é renderizado.

## Side-effects e Mitigações

| Side-effect | Severidade | Mitigação |
|---|---|---|
| `activeTabDef` crash no mobile se `activeTab` for uma tab filtrada | Alta | Remover `!`, adicionar fallback para primeira tab disponível |
| `/linkedin-callback` continua existindo como rota pública órfã | Baixa | Sem ação necessária agora — rota não é alcançável pelo fluxo normal |
| `MOBILE_NAV_KEYS` hardcoded fica desatualizado | Baixa | Remover a constante e derivar `mobileNavItems` de `navItems` diretamente |
| Flags são build-time — mudança exige rebuild | Esperado | Documentado no `.env.example`; limitação conhecida da Opção B |
| Tab desabilitada adicionada ao type `WorkspaceTab` sem guard no `CVTailoringPage` | Baixa | Guards redundantes no `CVTailoringPage` servem como segunda linha de defesa |

## Arquivos Modificados

- `apps/jobapply-app/src/config/featureFlags.ts` — **novo**
- `apps/jobapply-app/.env` — adicionar vars de flag
- `apps/jobapply-app/.env.development` — adicionar vars de flag
- `apps/jobapply-app/src/presentation/components/AppLayout.tsx` — filtrar navItems e remover MOBILE_NAV_KEYS
- `apps/jobapply-app/src/routes/_auth/linkedin/index.tsx` — adicionar beforeLoad redirect
- `apps/jobapply-app/src/design-system/tailoring/TailoringWorkspaceTabs/TailoringWorkspaceTabs.tsx` — filtrar tabs e corrigir activeTabDef
- `apps/jobapply-app/src/presentation/pages/CVTailoringPage/CVTailoringPage.tsx` — guards redundantes nas abas desabilitadas
