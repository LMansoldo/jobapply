# JobApply Workspace Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o workspace monorepo unificado em `/Projects/jobapply/` com yarn workspaces, harness CLAUDE.md em camadas, e hooks Claude Code de lint/typecheck/build.

**Architecture:** Yarn workspaces com `apps/*` (jobapply-api, ats-agent, jobapply-app) e `packages/*` (ui). Cada pacote mantém seu código intacto — apenas movidos para a nova estrutura. CLAUDE.md raiz + 4 CLAUDE.md por pacote formam o harness. Hooks PostToolUse (lint + tsc) e Stop (build) via `.claude/settings.json`.

**Tech Stack:** Yarn Workspaces, TypeScript, ESLint, Claude Code hooks (bash)

---

## Mapa de Arquivos

**Criados:**
- `/Projects/jobapply/package.json` — workspace root
- `/Projects/jobapply/CLAUDE.md` — harness global
- `/Projects/jobapply/.claude/settings.json` — hooks
- `/Projects/jobapply/scripts/find-package-root.sh` — helper para hooks
- `/Projects/jobapply/packages/ui/package.json` — scaffold @jobapply/ui
- `/Projects/jobapply/packages/ui/CLAUDE.md`
- `/Projects/jobapply/apps/jobapply-api/CLAUDE.md`
- `/Projects/jobapply/apps/ats-agent/CLAUDE.md`
- `/Projects/jobapply/apps/jobapply-app/CLAUDE.md`

**Movidos (sem alteração de código):**
- `/Projects/jobapply-api/` → `/Projects/jobapply/apps/jobapply-api/`
- `/Projects/ats-agent/` → `/Projects/jobapply/apps/ats-agent/`
- `/Projects/jobapply-app/` → `/Projects/jobapply/apps/jobapply-app/`

**Modificados:**
- `apps/jobapply-api/package.json` — adicionar scripts `lint` e `typecheck`
- `apps/ats-agent/package.json` — adicionar scripts `lint` e `typecheck`

> **Nota:** A extração dos componentes de `jobapply-app/src/components/` para `packages/ui/src/` é um passo futuro separado. Este plano apenas cria o scaffold de `packages/ui`.

---

## Task 1: Criar estrutura de diretórios do workspace

**Files:**
- Create: `/Projects/jobapply/` (diretório raiz)
- Create: `/Projects/jobapply/apps/` 
- Create: `/Projects/jobapply/packages/ui/`
- Create: `/Projects/jobapply/scripts/`
- Create: `/Projects/jobapply/docs/superpowers/specs/`
- Create: `/Projects/jobapply/docs/superpowers/plans/`

- [ ] **Step 1: Criar diretórios**

```bash
mkdir -p /Projects/jobapply/{apps,packages/ui,scripts,docs/superpowers/{specs,plans}}
```

- [ ] **Step 2: Inicializar git no workspace raiz**

```bash
cd /Projects/jobapply
git init
```

Expected: `Initialized empty Git repository in /Projects/jobapply/.git/`

- [ ] **Step 3: Criar .gitignore raiz**

Criar `/Projects/jobapply/.gitignore`:

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

- [ ] **Step 4: Criar package.json raiz**

Criar `/Projects/jobapply/package.json`:

```json
{
  "name": "jobapply",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:api": "yarn workspace jobapply-api dev",
    "dev:agent": "yarn workspace ats-agent dev",
    "dev:app": "yarn workspace jobapply-app dev",
    "lint": "yarn workspaces run lint",
    "typecheck": "yarn workspaces run typecheck",
    "build": "yarn workspaces run build",
    "test": "yarn workspaces run test --if-present"
  },
  "packageManager": "yarn@1.22.22"
}
```

- [ ] **Step 5: Commit**

```bash
cd /Projects/jobapply
git add .
git commit -m "chore: init workspace root with yarn workspaces"
```

---

## Task 2: Mover os três repositórios para apps/

**Files:**
- Move: `/Projects/jobapply-api/` → `/Projects/jobapply/apps/jobapply-api/`
- Move: `/Projects/ats-agent/` → `/Projects/jobapply/apps/ats-agent/`
- Move: `/Projects/jobapply-app/` → `/Projects/jobapply/apps/jobapply-app/`

- [ ] **Step 1: Copiar repos para apps/ (preserva o original até verificar)**

```bash
cp -r /Projects/jobapply-api /Projects/jobapply/apps/jobapply-api
cp -r /Projects/ats-agent /Projects/jobapply/apps/ats-agent
cp -r /Projects/jobapply-app /Projects/jobapply/apps/jobapply-app
```

- [ ] **Step 2: Remover node_modules copiados (serão reinstalados pelo workspace)**

```bash
rm -rf /Projects/jobapply/apps/jobapply-api/node_modules
rm -rf /Projects/jobapply/apps/ats-agent/node_modules
rm -rf /Projects/jobapply/apps/jobapply-app/node_modules
```

- [ ] **Step 3: Verificar estrutura**

```bash
ls /Projects/jobapply/apps/
```

Expected: `ats-agent  jobapply-api  jobapply-app`

- [ ] **Step 4: Commit**

```bash
cd /Projects/jobapply
git add apps/
git commit -m "chore: move repos into apps/ directory"
```

---

## Task 3: Adicionar scripts lint e typecheck nos pacotes sem eles

`jobapply-api` e `ats-agent` não têm scripts `lint` ou `typecheck`. O workspace root precisa que existam para `yarn workspaces run lint` funcionar.

**Files:**
- Modify: `/Projects/jobapply/apps/jobapply-api/package.json`
- Modify: `/Projects/jobapply/apps/ats-agent/package.json`

- [ ] **Step 1: Adicionar eslint ao jobapply-api**

```bash
cd /Projects/jobapply/apps/jobapply-api
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

- [ ] **Step 2: Criar .eslintrc.json no jobapply-api**

Criar `/Projects/jobapply/apps/jobapply-api/.eslintrc.json`:

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
}
```

- [ ] **Step 3: Adicionar scripts ao package.json de jobapply-api**

Em `/Projects/jobapply/apps/jobapply-api/package.json`, adicionar nos scripts:

```json
"lint": "eslint src --ext .ts --quiet",
"typecheck": "tsc --noEmit"
```

O bloco `scripts` completo deve ficar:

```json
"scripts": {
  "start": "node dist/server.js",
  "build": "tsc",
  "dev": "nodemon --exec ts-node src/server.ts",
  "lint": "eslint src --ext .ts --quiet",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 4: Repetir para ats-agent**

```bash
cd /Projects/jobapply/apps/ats-agent
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Criar `/Projects/jobapply/apps/ats-agent/.eslintrc.json`:

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  }
}
```

Em `/Projects/jobapply/apps/ats-agent/package.json`, scripts completos:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "dev": "ts-node -r dotenv/config src/server.ts",
  "lint": "eslint src --ext .ts --quiet",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 5: Verificar que lint roda em cada pacote**

```bash
cd /Projects/jobapply/apps/jobapply-api && yarn lint
cd /Projects/jobapply/apps/ats-agent && yarn lint
```

Expected: sem erros críticos (warnings são ok)

- [ ] **Step 6: Commit**

```bash
cd /Projects/jobapply
git add apps/jobapply-api apps/ats-agent
git commit -m "chore: add lint and typecheck scripts to api and agent"
```

---

## Task 4: Scaffold packages/ui

Cria a estrutura de destino para o design system. Os componentes **não são movidos agora** — isso é uma tarefa futura separada.

**Files:**
- Create: `/Projects/jobapply/packages/ui/package.json`
- Create: `/Projects/jobapply/packages/ui/tsconfig.json`
- Create: `/Projects/jobapply/packages/ui/src/index.ts`

- [ ] **Step 1: Criar package.json do @jobapply/ui**

Criar `/Projects/jobapply/packages/ui/package.json`:

```json
{
  "name": "@jobapply/ui",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "echo 'no lint yet'",
    "typecheck": "tsc --noEmit",
    "build": "echo 'no build yet'"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

> Os scripts `lint` e `build` são placeholders até os componentes serem migrados. `echo` garante que `yarn workspaces run lint` não falhe.

- [ ] **Step 2: Criar tsconfig.json do @jobapply/ui**

Criar `/Projects/jobapply/packages/ui/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Criar src/index.ts vazio**

Criar `/Projects/jobapply/packages/ui/src/index.ts`:

```typescript
// @jobapply/ui — design system
// Components will be migrated here from apps/jobapply-app/src/components/
export {}
```

- [ ] **Step 4: Commit**

```bash
cd /Projects/jobapply
git add packages/ui
git commit -m "chore: scaffold packages/ui for design system migration"
```

---

## Task 5: Criar script auxiliar para hooks

O hook `PostToolUse` precisa encontrar a raiz do pacote (onde está o `package.json` do pacote, não o da workspace) a partir de qualquer arquivo editado.

**Files:**
- Create: `/Projects/jobapply/scripts/find-package-root.sh`

- [ ] **Step 1: Criar o script**

Criar `/Projects/jobapply/scripts/find-package-root.sh`:

```bash
#!/usr/bin/env bash
# find-package-root.sh
# Walks up from a given file path to find the nearest package.json
# that is NOT the workspace root (i.e., does not contain "workspaces").
# Usage: ./find-package-root.sh /absolute/path/to/edited/file
# Prints the package root directory path, or exits 1 if not found.

set -euo pipefail

FILE_PATH="${1:-}"

if [[ -z "$FILE_PATH" ]]; then
  echo "Usage: find-package-root.sh <file-path>" >&2
  exit 1
fi

dir="$(dirname "$FILE_PATH")"

while [[ "$dir" != "/" ]]; do
  pkg="$dir/package.json"
  if [[ -f "$pkg" ]]; then
    # Skip if it's the workspace root (has "workspaces" key)
    if ! python3 -c "import sys,json; d=json.load(open('$pkg')); sys.exit(0 if 'workspaces' in d else 1)" 2>/dev/null; then
      echo "$dir"
      exit 0
    fi
  fi
  dir="$(dirname "$dir")"
done

echo "No package root found for: $FILE_PATH" >&2
exit 1
```

- [ ] **Step 2: Tornar executável**

```bash
chmod +x /Projects/jobapply/scripts/find-package-root.sh
```

- [ ] **Step 3: Testar o script**

```bash
/Projects/jobapply/scripts/find-package-root.sh \
  /Projects/jobapply/apps/jobapply-api/src/server.ts
```

Expected: `/Projects/jobapply/apps/jobapply-api`

```bash
/Projects/jobapply/scripts/find-package-root.sh \
  /Projects/jobapply/apps/ats-agent/src/graph/nodes/mapper.ts
```

Expected: `/Projects/jobapply/apps/ats-agent`

- [ ] **Step 4: Commit**

```bash
cd /Projects/jobapply
git add scripts/find-package-root.sh
git commit -m "chore: add find-package-root helper for Claude Code hooks"
```

---

## Task 6: Criar .claude/settings.json com hooks

**Files:**
- Create: `/Projects/jobapply/.claude/settings.json`

- [ ] **Step 1: Criar diretório .claude**

```bash
mkdir -p /Projects/jobapply/.claude
```

- [ ] **Step 2: Criar settings.json**

Criar `/Projects/jobapply/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "PKG_ROOT=$(/Projects/jobapply/scripts/find-package-root.sh \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null) && [ -n \"$PKG_ROOT\" ] && cd \"$PKG_ROOT\" && yarn lint --quiet 2>&1 | head -20 || true"
          },
          {
            "type": "command",
            "command": "PKG_ROOT=$(/Projects/jobapply/scripts/find-package-root.sh \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null) && [ -n \"$PKG_ROOT\" ] && cd \"$PKG_ROOT\" && yarn typecheck 2>&1 | head -20 || true"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cd /Projects/jobapply && yarn workspaces run build 2>&1 | tail -30"
          }
        ]
      }
    ]
  }
}
```

> **Nota:** `$CLAUDE_TOOL_INPUT_FILE_PATH` é o nome da variável de ambiente que Claude Code injeta nos hooks com o caminho do arquivo editado. Se o nome exato diferir na versão do open-claude em uso, verificar na documentação e ajustar. O `|| true` ao final garante que o hook não bloqueie a sessão em caso de erro no script.

- [ ] **Step 3: Commit**

```bash
cd /Projects/jobapply
git add .claude/settings.json
git commit -m "chore: add Claude Code hooks for lint, typecheck, and build"
```

---

## Task 7: Criar CLAUDE.md raiz

**Files:**
- Create: `/Projects/jobapply/CLAUDE.md`

- [ ] **Step 1: Criar o arquivo**

Criar `/Projects/jobapply/CLAUDE.md`:

```markdown
# JobApply Workspace

MVP de plataforma de candidatura a vagas com análise ATS via IA.

## Serviços

| Pacote | Localização | Stack | Porta |
|--------|-------------|-------|-------|
| jobapply-app | apps/jobapply-app | Vite + React + TypeScript | 5173 |
| jobapply-api | apps/jobapply-api | Express + MongoDB + JWT | 3000 |
| ats-agent | apps/ats-agent | Fastify + LangGraph + Gemini | 3001 |
| @jobapply/ui | packages/ui | React + TypeScript (design system) | — |

## Arquitetura e Fluxo de Dados

```
jobapply-app → (REST) → jobapply-api → (HTTP) → ats-agent → Gemini API
                              ↓
                          MongoDB
```

- `jobapply-app` consome `jobapply-api` via REST com JWT
- `jobapply-api` delega toda análise ATS e geração de CV ao `ats-agent` via HTTP
- `ats-agent` é **stateless** — não acessa banco, não persiste nada
- `ats-agent` usa background jobs em memória (`Map<string, JobResult>`) com TTL de 30min

## Contratos Entre Serviços

Tipos compartilhados entre `jobapply-api` e `ats-agent` (vivem em `ats-agent/src/types.ts` até `packages/contracts` existir):

- `AgentInput` — entrada do agente: `{ cv?, cvMarkdown?, jobDescription, locale?, platform?, jobUrl? }`
- `ATSReport` — relatório ATS: `{ universalScore, platforms[], semanticGaps[], optimalTemplate, tips[], removeSuggestions[] }`
- `CV` — estrutura do CV: `{ fullName?, email?, summary?, skills[], experience[], education[], ... }`

**Nunca alterar esses contratos em um serviço sem atualizar o outro.**

## Comandos do Workspace

```bash
# Instalar dependências de todos os pacotes
yarn install

# Rodar um pacote específico
yarn workspace jobapply-api dev
yarn workspace ats-agent dev
yarn workspace jobapply-app dev

# Rodar lint em todos os pacotes
yarn workspaces run lint

# Typecheck em todos os pacotes
yarn workspaces run typecheck

# Build em todos os pacotes
yarn workspaces run build
```

## Variáveis de Ambiente

Cada app tem seu próprio `.env`. Nunca commitar `.env`.

- `apps/jobapply-api/.env` — `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GOOGLE_AI_API_KEY`, `ATS_AGENT_URL`
- `apps/ats-agent/.env` — `PORT`, `GOOGLE_AI_API_KEY`
- `apps/jobapply-app/.env` — `VITE_API_URL`

## PROIBIDO — Valem para Todos os Pacotes

Estas regras aplicam-se a qualquer LLM trabalhando neste workspace:

- **Não criar abstrações para uso único** — três linhas similares são melhores que uma abstração prematura
- **Não adicionar tratamento de erro para cenários impossíveis** — confiar nas garantias do framework
- **Não criar arquivos de documentação (.md) não solicitados**
- **Não refatorar código fora do escopo da tarefa pedida**
- **Não adicionar features, flags ou configurações não pedidas**
- **Não mockar banco em testes** — jobapply-api usa MongoDB real nos testes
- **Não alterar contratos entre serviços** (AgentInput, ATSReport, CV) sem atualizar ambos os lados
- **Não chamar ats-agent diretamente de controllers** — sempre via `atsService.ts`
- **Não adicionar lógica LLM fora de** `llmService.ts` ou `atsService.ts` no jobapply-api

## Caminho para Opção C (Futuro)

Quando iniciar microsserviços:
1. Criar `packages/contracts/` com tipos TypeScript compartilhados
2. `ats-agent` e `jobapply-api` passam a importar de `@jobapply/contracts`
3. Adicionar `turbo.json` para orquestrar builds em ordem de dependência
```

- [ ] **Step 2: Commit**

```bash
cd /Projects/jobapply
git add CLAUDE.md
git commit -m "docs: add root CLAUDE.md with architecture, contracts, and anti-patterns"
```

---

## Task 8: Criar CLAUDE.md por pacote

**Files:**
- Create: `/Projects/jobapply/apps/ats-agent/CLAUDE.md`
- Create: `/Projects/jobapply/apps/jobapply-api/CLAUDE.md`
- Create: `/Projects/jobapply/apps/jobapply-app/CLAUDE.md`
- Create: `/Projects/jobapply/packages/ui/CLAUDE.md`

- [ ] **Step 1: Criar CLAUDE.md do ats-agent**

Criar `/Projects/jobapply/apps/ats-agent/CLAUDE.md`:

```markdown
# ats-agent

Serviço stateless Fastify + LangGraph + Gemini. Analisa CVs contra job descriptions e gera relatórios ATS.

## Stack
- Fastify (HTTP server)
- LangGraph (`@langchain/langgraph`) para o pipeline de análise
- Google Gemini (`@google/generative-ai`) como LLM

## Arquitetura Interna

Pipeline de nodes em sequência (ver `src/graph/index.ts`):
```
mapper → extractKeywords → jdKeywordExtractor → ruleScorer → semanticAnalyzer → cvGenerator → aggregator
```

Cada node: função pura que recebe `Partial<GraphState>` e retorna `Partial<GraphState>`.

## Estrutura de Arquivos

```
src/
├── server.ts           — entry point Fastify
├── types.ts            — todos os tipos: CV, AgentInput, ATSReport, GraphState
├── api/routes.ts       — endpoints HTTP + background job store
├── graph/
│   ├── index.ts        — definição do StateGraph compilado
│   └── nodes/          — um arquivo por node do pipeline
├── platforms/          — detecção e scoring por plataforma ATS
└── lib/gemini.ts       — cliente Gemini compartilhado
```

## Convenções

- Novos nodes vão em `src/graph/nodes/`, exportam uma função com signature `(state: Partial<GraphState>) => Promise<Partial<GraphState>>`
- Novas plataformas ATS vão em `src/platforms/`, seguem a interface em `src/platforms/types.ts`
- Background jobs: `Map<string, JobResult>` em `api/routes.ts` com TTL de 30 min — sem Redis por ora

## PROIBIDO

- Adicionar estado persistente (banco, cache externo, arquivo)
- Alterar tipos em `src/types.ts` sem sincronizar com `jobapply-api/src/services/atsService.ts`
- Criar endpoints que não estejam documentados no CLAUDE.md raiz
```

- [ ] **Step 2: Criar CLAUDE.md do jobapply-api**

Criar `/Projects/jobapply/apps/jobapply-api/CLAUDE.md`:

```markdown
# jobapply-api

API REST Express + MongoDB + JWT. Gerencia usuários, CVs e vagas. Orquestra chamadas ao ats-agent.

## Stack
- Express 4
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Google Gemini (`@google/generative-ai`) via `llmService.ts`

## Arquitetura Interna

```
routes/ → controllers/ → services/ + models/
```

- `routes/` — define apenas path e middleware de auth
- `controllers/` — orquestram: buscam dados, chamam services, retornam resposta
- `services/` — lógica de negócio: `atsService.ts` (ats-agent), `llmService.ts` (Gemini direto), `interviewPrepService.ts`
- `models/` — schemas Mongoose: User, CV, Job, Voucher, PublishedCV

## Convenções

- `atsService.ts` é o **único** ponto de contato com o ats-agent — nunca chamar a URL diretamente em controller
- `llmService.ts` é o **único** lugar onde Gemini é chamado diretamente
- `sanitizeUserInput()` de `utils/sanitize.ts` é obrigatório antes de passar qualquer dado do usuário para LLM
- Auth middleware em `middleware/auth.ts` — usar em todas as rotas protegidas
- Limite de uso em `middleware/usageLimit.ts` — aplicar em endpoints de geração LLM

## Detecção de Locale

`detectLocale(text)` em `controllers/cvController.ts` detecta pt-BR vs en automaticamente. Usar antes de chamar qualquer serviço LLM quando `locale` não for fornecido pelo cliente.

## PROIBIDO

- Lógica LLM fora de `llmService.ts` ou `atsService.ts`
- Chamar `ATS_AGENT_URL` diretamente fora de `atsService.ts`
- Mockar MongoDB nos testes
- Alterar schemas Mongoose sem migration plan
```

- [ ] **Step 3: Criar CLAUDE.md do jobapply-app**

Criar `/Projects/jobapply/apps/jobapply-app/CLAUDE.md`:

```markdown
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
```

- [ ] **Step 4: Criar CLAUDE.md do packages/ui**

Criar `/Projects/jobapply/packages/ui/CLAUDE.md`:

```markdown
# @jobapply/ui

Design system compartilhado. Wrappers sobre Ant Design com convenções do projeto.

## Status
Em setup. Componentes serão migrados de `apps/jobapply-app/src/components/` em tarefa futura.

## Convenções (quando migrar componentes)

Cada componente segue a estrutura:
```
ComponentName/
├── ComponentName.tsx        — implementação
├── ComponentName.styles.ts  — estilos (styled-components ou CSS modules)
├── ComponentName.types.ts   — tipos/props
└── index.ts                 — re-export público
```

`src/index.ts` exporta tudo que é público.

## PROIBIDO

- Importar de `apps/` — este pacote não conhece a aplicação
- Lógica de negócio ou chamadas HTTP
- Dependências de runtime além de `react` e `antd`
```

- [ ] **Step 5: Commit**

```bash
cd /Projects/jobapply
git add apps/ats-agent/CLAUDE.md apps/jobapply-api/CLAUDE.md \
        apps/jobapply-app/CLAUDE.md packages/ui/CLAUDE.md
git commit -m "docs: add per-package CLAUDE.md files for Claude Code harness"
```

---

## Task 9: Instalar dependências e verificar workspace

- [ ] **Step 1: Instalar dependências via workspace root**

```bash
cd /Projects/jobapply
yarn install
```

Expected: dependências instaladas em `node_modules/` hoisted na raiz.

- [ ] **Step 2: Verificar que yarn reconhece os workspaces**

```bash
cd /Projects/jobapply
yarn workspaces info
```

Expected: JSON listando `ats-agent`, `jobapply-api`, `jobapply-app`, `@jobapply/ui` com seus `workspaceDependencies`.

- [ ] **Step 3: Verificar lint em todos os pacotes**

```bash
cd /Projects/jobapply
yarn workspaces run lint 2>&1 | grep -E "(Done|error|warn|✓)" | head -20
```

Expected: sem erros bloqueantes (warnings são aceitáveis).

- [ ] **Step 4: Verificar typecheck em todos os pacotes**

```bash
cd /Projects/jobapply
yarn workspaces run typecheck 2>&1 | grep -E "(error TS|Done|✓)" | head -20
```

Expected: sem erros de tipo.

- [ ] **Step 5: Commit final**

```bash
cd /Projects/jobapply
git add yarn.lock
git commit -m "chore: yarn install — workspace dependencies resolved"
```

---

## Task 10: Mover spec e plano para o workspace novo

**Files:**
- Move: `/Projects/docs/superpowers/` → `/Projects/jobapply/docs/superpowers/`

- [ ] **Step 1: Copiar docs existentes**

```bash
cp -r /Projects/docs/superpowers /Projects/jobapply/docs/
```

- [ ] **Step 2: Verificar**

```bash
ls /Projects/jobapply/docs/superpowers/specs/
ls /Projects/jobapply/docs/superpowers/plans/
```

Expected: spec e plano presentes.

- [ ] **Step 3: Commit**

```bash
cd /Projects/jobapply
git add docs/
git commit -m "docs: import specs and plans into workspace"
```

---

## Self-Review

**Spec coverage:**
- ✅ Estrutura `apps/*` + `packages/*` — Task 1 e 2
- ✅ Yarn workspaces `package.json` — Task 1
- ✅ Scaffold `packages/ui` — Task 4
- ✅ Scripts `lint`/`typecheck` em todos os pacotes — Task 3 e 4
- ✅ CLAUDE.md raiz com arquitetura, contratos, anti-patterns — Task 7
- ✅ CLAUDE.md por pacote (4 arquivos) — Task 8
- ✅ `.claude/settings.json` com PostToolUse + Stop hooks — Task 6
- ✅ Script `find-package-root.sh` para hooks — Task 5
- ✅ Extração design system: scaffolded em Task 4, migração adiada (documentado)

**Placeholders:** Nenhum TBD ou TODO no plano.

**Type consistency:** Não aplicável (sem código TypeScript novo — apenas config e documentação).
