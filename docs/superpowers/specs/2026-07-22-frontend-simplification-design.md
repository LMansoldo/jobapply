# Frontend Simplification — Tailoring como Home

**Data:** 2026-07-22
**Escopo:** apenas `apps/jobapply-app`. A API não muda.

## Objetivo

Simplificar o app para um único fluxo: análise/tailoring de CV contra uma descrição de vaga colada pelo usuário. Remover completamente o conceito de "vagas" (listagem, publicação, rota) e as tabs secundárias (cover letter, roteiro de vídeo, preparo de entrevista).

## Decisões

| Tema | Decisão |
|------|---------|
| Rota principal | `CVTailoringPage` passa a ser a rota `/` (`routes/_auth/index.tsx`). Rotas `/tailoring` e `/tailoring/$jobId` são deletadas. |
| Reset de análise | Botão "Nova análise" na `TailoringContextBar`, visível quando existe relatório ATS. Implementado via remontagem: a página mantém um `sessionKey` numérico usado como `key` da subárvore do workspace; o botão incrementa a key, zerando todo o estado e reabrindo o modal de setup. |
| Tabs | Só existe o workspace ATS, renderizado direto — `TailoringWorkspaceTabs` deixa de existir. |
| Auth | Email+senha já está implementado e funcional em login e registro (front e API) — permanece. Remover o botão Google do login (onClick vazio, não funcional) e os `RoleCards` (Candidato/Recrutador) do registro (valor nunca enviado). LinkedIn permanece em ambos. |

## Remoções

### Vagas (tudo relacionado a jobs)
- `src/presentation/pages/JobsPage/`
- `src/design-system/jobs/` (JobsTopBar, DSJobCard, JobDetailPanel, JobListItem)
- `src/domain/jobs/` (types, repository, helpers, constants, hooks/useJobsList)
- `src/infrastructure/repositories/jobsRepository.ts`
- `src/routes/_auth/tailoring/$jobId.tsx` e `src/routes/_auth/tailoring/index.tsx` (a rota raiz assume)
- Mocks de jobs em `src/infrastructure/mock/data.ts`
- Chaves i18n `nav.jobs` e `jobs.*` em `src/i18n/translations.json`
- Item "Vagas" do `AppLayout` (topbar desktop e bottom-nav mobile); item "Tailoring" passa a `href: '/'`

### Tabs secundárias
- `src/design-system/tailoring/TailoringWorkspaceTabs/`
- `src/design-system/tailoring/CoverLetterWorkspace/` (incl. `CoverLetterOnboardingFlow`)
- `src/design-system/tailoring/VideoScriptWorkspace/`
- `src/design-system/tailoring/InterviewWorkspace/`
- Em `useTailoringWorkspace`: estados/handlers de `coverContent`, `videoContent`, `interviewPrep` e as gerações correspondentes
- Em `useTailoringPageUI`: `activeTab`/`setActiveTab` e `tone`/`setTone`
- `buildToneOptions` em `tailoringUIHelpers` (usado só pela cover letter)
- Funções de repository chamadas apenas por esses fluxos (cover letter, vídeo, entrevista) e chaves i18n `tailoring.coverLetter`, `tailoring.videoScript`, `tailoring.interviewTraining`, tons, badges e afins
- Estado `coverVoiceAnswers` no `CVTailoringPage`

### Auth
- Botão Google (`SocialLoginBtn provider="google"`) do `LoginPage`
- `RoleCards` e estado `role` do `RegisterPage` (o componente `RoleCards` em `design-system/auth/` é deletado se não tiver outro consumidor)

## Mudanças no CVTailoringPage

O modo job-based morre; a página é sempre modo manual:

- Remover `useParams`/`jobId`, `isManualMode` (sempre true), busca de `job` no `useTailoringPageData` (mantém a busca de CV), `onJobNotFound`, `handleRewriteCV`/`rewriteLoading`, prop `jobUrl` do `AtsPlatformSelector` e prop `job` de `TailoringContextBar`, `ATSWorkspace` e `TailoringSetupModal` (tipos incluídos — hoje importam de `domain/jobs`).
- `mapATSReportToPanel(report, [])` — não existem mais `job.tags`.
- Cancelar o setup deixa de navegar para `/` (não há outra tela): fecha o modal e mostra estado vazio com botão "Iniciar análise" que reabre o setup (mesmo mecanismo do reset).
- Botão "voltar" da `TailoringContextBar` deixa de existir (não há para onde voltar) — substituído pelo botão "Nova análise".

## Fluxo resultante

1. Login/registro (email+senha ou LinkedIn) → onboarding/CV → `/`.
2. `/` abre o `CVTailoringPage`; sem descrição de vaga ainda, o modal de setup pede locale + descrição.
3. Usuário roda a análise, trabalha no workspace ATS (score, sugestões, editor, export).
4. "Nova análise" remonta o workspace → volta ao passo 2.

## Fora de escopo

- `jobapply-api`: rotas `/jobs` ficam órfãs; limpeza fica para tarefa futura.
- Onboarding, CVPage, LinkedIn Optimizer: intocados.

## Verificação

- `yarn workspace jobapply-app typecheck`, `lint`, `build` limpos (routeTree regenerado pelo TanStack Router).
- Grep final por `jobs`, `JobsPage`, `coverLetter`, `videoScript`, `interview` sem referências mortas no front.
- Fluxo manual: login → análise → nova análise → segunda análise funciona.
