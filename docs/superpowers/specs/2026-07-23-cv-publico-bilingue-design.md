# CV público bilíngue (PT-BR + EN)

**Data:** 2026-07-23
**Apps:** `apps/jobapply-api` (Express + MongoDB) + `apps/jobapply-app` (React)

## Contexto

A rota pública `/public/:publicId` mostra apenas **um** idioma do CV. A análise do
pipeline mostrou que o problema é estrutural — o CV publicado guarda fisicamente
só um locale:

1. **Publish (frontend)** `CVPage.tsx:236-239` — escolhe `pt-BR` se existir, senão
   `en`, e publica **um só** locale.
2. **Publish (API)** `cvController.publishCV` — `applyLocale()` achata **um** locale
   e faz upsert de um `PublishedCV` por usuário, com `$unset: { localeVersions }`.
3. **Model** `PublishedCV.ts` — schema achatado (`skills`, `experience`,
   `education`… no topo), **sem** `localeVersions`.
4. **Public GET** `publicController.getPublicCV` — retorna o doc achatado.
5. **Viewer** `CVPublicViewer.tsx` — monta um `fakeLocale` com `locale: 'pt-BR'`
   hardcoded (só rótulo) e renderiza um único `CVTemplate`.

Objetivo: o CV público passa a exibir **PT-BR e EN**, com toggle de idioma.

## Decisões

- **Exibição:** toggle PT-BR / EN no topo; um CV por vez (assumido — usuário
  ausente na confirmação; revisar se necessário).
- **Um idioma só:** se o CV foi publicado com apenas um locale, o toggle é
  omitido e mostra-se o único idioma disponível.
- **Dados pessoais** (nome, email, telefone, links, idiomas) são compartilhados
  entre os locales — ficam no topo do `PublishedCV`, como já estão.
- **Compatibilidade retroativa:** publicações antigas (só campos achatados, sem
  `localeVersions`) continuam funcionando — o viewer faz fallback para os campos
  de topo como um único locale.

## Arquitetura

### 1. Model API — `PublishedCV.ts`

- Adicionar `localeVersions: ICVLocaleVersion[]` ao schema (reutilizar o
  `localeVersionSchema` do `CV.ts`; se não existir standalone, extrair).
- Manter os campos achatados atuais para retrocompatibilidade (não remover).
- **Migration plan:** aditivo, campo opcional com `default: []`. Documentos
  existentes permanecem válidos (sem `localeVersions`). Nenhuma migração de dados
  destrutiva; publicações antigas são reescritas na próxima publicação.

### 2. Controller API — `cvController.publishCV`

- Parar de achatar um único locale. Gravar:
  - Dados pessoais compartilhados no topo (como hoje).
  - `localeVersions: cv.localeVersions` (todos os disponíveis).
- Remover `localeVersions` do `$unset`.
- Manter `applyLocale`/`overrides` para os campos de topo compartilhados
  (nome, email, etc.). Os campos de conteúdo achatados (`skills`, `experience`,
  `education`, `summary`, `objective`, `projects`, `certifications`) passam a ser
  derivados do primeiro locale (ou do locale default) apenas para
  retrocompatibilidade do viewer antigo.

### 3. Publish frontend — `CVPage.tsx`

- `publishMutation` deixa de forçar `locale`. Chama `publishCV(cv._id)` sem
  locale, deixando a API gravar todos os `localeVersions`.

### 4. Tipos frontend — `domain/cv/types.ts`

- `PublishedCV` ganha `localeVersions?: CVLocaleVersion[]`.

### 5. Viewer — `CVPublicViewer.tsx`

- Ler `cv.localeVersions`:
  - **0 versões** (publicação antiga) → construir um único `fakeLocale` a partir
    dos campos de topo (comportamento atual) e renderizar sem toggle.
  - **1 versão** → renderizar essa versão, sem toggle.
  - **2 versões** → toggle PT-BR / EN (estado local `useState`), renderizar a
    versão ativa no `CVTemplate`. Default: `pt-BR` se existir, senão `en`.
- Toggle: componente simples (Segmented/Radio do design system) acima do
  `CVTemplate`, respeitando `isMobile`.
- Dados pessoais vêm sempre do topo do `PublishedCV` (compartilhados).

### 6. Mocks

- Atualizar `getMockPublishedCV` / `cvRepository` mock para incluir
  `localeVersions` com `pt-BR` e `en`, permitindo testar o toggle sem backend.

## Fora de escopo

- Export PDF por idioma na página pública.
- Idioma na URL (`?lang=`) — pode virar follow-up se quiserem link por idioma.
- Alterar o `CVTemplate` em si.
- Tradução automática entre locales (usa apenas o que o usuário já criou).

## Critérios de sucesso

- CV publicado com PT-BR + EN mostra toggle; alternar troca todo o conteúdo do CV.
- CV publicado com um idioma só mostra esse idioma, sem toggle.
- Publicações antigas (pré-mudança) continuam renderizando.
- Dados pessoais idênticos entre os dois idiomas.
- `typecheck` e `lint` passam em `jobapply-api` e `jobapply-app`.
- Testes da API de publish/public cobrindo caso bilíngue (MongoDB real, sem mock).
