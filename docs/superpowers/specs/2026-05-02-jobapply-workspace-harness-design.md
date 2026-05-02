# Design: JobApply Workspace Harness

**Date:** 2026-05-02  
**Status:** Approved  
**Scope:** Sub-projeto 1 de 4 — Harness & Workspace Setup

---

## Objetivo

Criar um workspace unificado para os três repositórios do MVP JobApply, com um harness Claude Code que garanta contexto consistente para qualquer LLM (Claude, Deepseek, Gemini via open-claude), automações via hooks, e estrutura preparada para evolução para monorepo com contratos compartilhados.

---

## Estrutura do Workspace

```
/Projects/jobapply/
├── CLAUDE.md                          ← contexto global, contratos, anti-patterns
├── package.json                       ← yarn workspaces root (private: true)
├── .claude/
│   └── settings.json                  ← hooks globais (PostToolUse + Stop)
├── packages/
│   └── ui/                            ← design system extraído de jobapply-app
│       ├── CLAUDE.md
│       └── package.json               ← @jobapply/ui
├── apps/
│   ├── jobapply-app/                  ← frontend Vite + React (importa @jobapply/ui)
│   │   └── CLAUDE.md
│   ├── jobapply-api/                  ← backend Express + MongoDB + JWT
│   │   └── CLAUDE.md
│   └── ats-agent/                     ← agente Fastify + LangGraph + Gemini
│       └── CLAUDE.md
└── docs/
    └── superpowers/specs/             ← specs de brainstorming
```

Os repositórios existentes são movidos para `apps/` sem reescrita de código. O design system é extraído de `jobapply-app/src` para `packages/ui`.

---

## Yarn Workspaces

`package.json` raiz:

```json
{
  "name": "jobapply",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:api": "yarn workspace jobapply-api dev",
    "dev:agent": "yarn workspace ats-agent dev",
    "dev:app": "yarn workspace jobapply-app dev",
    "lint": "yarn workspaces run lint",
    "build": "yarn workspaces run build",
    "test": "yarn workspaces run test"
  }
}
```

Comandos úteis do dia a dia:
- `yarn workspace ats-agent dev` — roda o agente isolado
- `yarn workspaces run lint` — lint em todos os pacotes
- `yarn workspaces run build` — build em todos os pacotes

---

## CLAUDE.md Raiz

Cobre os seguintes tópicos (ordem importa — LLMs leem de cima para baixo):

1. **O que é este projeto** — descrição do MVP e propósito de cada serviço
2. **Arquitetura e fluxo de dados**
   - `jobapply-app` → consome `jobapply-api` via REST
   - `jobapply-api` → delega análise ATS para `ats-agent` via HTTP
   - `ats-agent` → stateless, não acessa banco
3. **Contratos entre serviços** — tipos `AgentInput`, `ATSReport`, `CV` documentados inline (até `packages/contracts` existir)
4. **Stack por pacote** — tabela rápida de tecnologias
5. **Comandos do workspace** — como rodar, buildar e testar cada pacote
6. **Anti-patterns PROIBIDOS** (aplicam a todos os pacotes):
   - Não criar abstrações para uso único
   - Não adicionar tratamento de erro para cenários impossíveis
   - Não criar arquivos de documentação não solicitados
   - Não refatorar código fora do escopo da tarefa
   - Não adicionar features não pedidas
   - Não mockar banco em testes — `jobapply-api` usa MongoDB real em test
   - Não alterar contratos entre serviços sem atualizar ambos os lados

---

## CLAUDE.md por Pacote

Cada arquivo é curto (< 40 linhas) e cobre:
- Propósito e stack específico
- Arquitetura interna (camadas, padrões de arquivo)
- Convenções de código do pacote
- O que NÃO fazer (específico do pacote)

### `apps/ats-agent/CLAUDE.md`
- Pipeline de nodes LangGraph em ordem
- Nodes são funções puras em `src/graph/nodes/`
- Platforms seguem interface de `src/platforms/types.ts`
- Background jobs via `Map<string, JobResult>` em routes.ts (sem Redis por ora)
- **Proibido:** estado persistente, alterar contrato de AgentInput/ATSReport sem sync com jobapply-api

### `apps/jobapply-api/CLAUDE.md`
- Camadas: routes → controllers → services/models
- `atsService.ts` é o único ponto de contato com ats-agent
- Controllers orquestram, não contêm lógica de negócio
- `sanitizeUserInput()` obrigatório antes de passar dados do usuário para LLM
- **Proibido:** chamar ats-agent fora de atsService, lógica LLM fora de llmService/atsService

### `apps/jobapply-app/CLAUDE.md`
- Vite + React + TypeScript
- Componentes em `src/components/`, domínios em `src/domain/`
- Design system importado de `@jobapply/ui`
- **Proibido:** copiar componentes do packages/ui localmente, lógica de negócio em componentes

### `packages/ui/CLAUDE.md`
- Design system puro — sem dependências de app ou api
- Cada componente tem `.tsx`, `.styles.ts`, `.types.ts`, `index.ts`
- **Proibido:** importar de apps/, lógica de negócio ou chamadas HTTP

---

## Hooks (`.claude/settings.json`)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$(dirname $CLAUDE_TOOL_INPUT_FILE)\" && yarn lint --quiet 2>&1 | head -20"
          },
          {
            "type": "command",
            "command": "cd \"$(dirname $CLAUDE_TOOL_INPUT_FILE)\" && yarn tsc --noEmit 2>&1 | head -20"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "yarn workspaces run build 2>&1 | tail -30"
          }
        ]
      }
    ]
  }
}
```

**Comportamento:**
- `PostToolUse` roda lint + typecheck no pacote do arquivo editado após cada `Edit` ou `Write`
- `Stop` roda build em todos os pacotes ao encerrar a sessão
- Outputs truncados para não poluir contexto

> **Detalhe de implementação:** o comando do PostToolUse precisa subir do diretório do arquivo até a raiz do pacote (onde está o `package.json` do pacote, não da workspace). Implementar via script auxiliar `scripts/find-package-root.sh` ou equivalente. Os nomes exatos de variáveis de ambiente dos hooks serão confirmados durante a implementação.

---

## Caminho para Opção C (futuro)

Quando iniciar a separação de microsserviços:

1. Criar `packages/contracts/` com tipos TypeScript compartilhados (`AgentInput`, `ATSReport`, `CV`, `GraphState`)
2. `ats-agent` e `jobapply-api` passam a importar de `@jobapply/contracts`
3. Adicionar `turbo.json` para orquestrar builds na ordem de dependência: `ui` e `contracts` → `api`/`agent` → `app`
4. Adicionar `packages/db/` com schemas Mongoose/Prisma compartilhados se banco relacional for adotado

---

## O que este design NÃO cobre

- Estratégia de testes (Sub-projeto 2)
- Separação de fluxos da API (Sub-projeto 3)
- Avaliação de banco relacional / microsserviços (Sub-projeto 4)
