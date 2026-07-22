# Frontend Simplification (Tailoring como Home) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduzir o `jobapply-app` a um único fluxo — análise ATS/tailoring de CV sobre descrição de vaga colada — removendo vagas, tabs secundárias e ruído nas telas de auth.

**Architecture:** O `CVTailoringPage` vira a rota `/` em modo manual permanente (sem `jobId`). Reset de análise por remontagem: um `sessionKey` numérico usado como `key` React da subárvore do workspace; incrementar a key zera todo o estado e reabre o modal de setup. Todo o código de jobs (páginas, domain, repository, design-system) e das tabs cover/video/interview é deletado.

**Tech Stack:** Vite + React 18 + TypeScript, TanStack Router (routeTree gerado por plugin no `vite dev`/`vite build`), TanStack Query, Ant Design, i18next, @emotion/css.

**Spec:** `docs/superpowers/specs/2026-07-22-frontend-simplification-design.md`

## Global Constraints

- Escopo: apenas `apps/jobapply-app`. **Não tocar em `jobapply-api` nem `ats-agent`.**
- Não alterar contratos entre serviços (`AgentInput`, `ATSReport`, `CV`).
- Chamadas HTTP só em `infrastructure/repositories/`; tipos de domínio em `domain/<dominio>/types.ts`.
- Não criar arquivos `.md` não solicitados; não adicionar features/flags não pedidos.
- Gate de verificação por task: `yarn workspace jobapply-app typecheck` limpo (rodar a partir da raiz do workspace `/Users/lucasmansoldo/Projects/jobapply`).
- Não existe script de teste no app (`package.json` não tem `test`); verificação é typecheck + lint + build.
- **Atenção ao `routeTree.gen.ts`:** é gerado pelo plugin do TanStack Router durante `vite dev`/`vite build`, mas o script `build` roda `tsc` ANTES do vite. Após criar/deletar arquivos de rota, regenerar com `timeout 20 yarn workspace jobapply-app dev >/dev/null 2>&1 || true` antes de rodar `typecheck`.
- Commits frequentes, um por task, mensagem em inglês estilo `feat:`/`refactor:` como no histórico.

---

### Task 1: Workspace de tailoring manual-only, só ATS, com reset

**Files:**
- Modify: `apps/jobapply-app/src/domain/cv/hooks/useTailoringWorkspace.ts` (reescrita completa abaixo)
- Modify: `apps/jobapply-app/src/domain/cv/hooks/useTailoringPageData.ts` (reescrita completa abaixo)
- Modify: `apps/jobapply-app/src/domain/cv/hooks/useTailoringPageUI.ts` (reescrita completa abaixo)
- Modify: `apps/jobapply-app/src/domain/cv/hooks/useTailoringExport.ts`
- Modify: `apps/jobapply-app/src/presentation/pages/CVTailoringPage/CVTailoringPage.tsx` (reescrita completa abaixo)
- Modify: `apps/jobapply-app/src/design-system/tailoring/TailoringContextBar/TailoringContextBar.tsx` + `.types.ts` (reescrita completa abaixo)
- Modify: `apps/jobapply-app/src/design-system/tailoring/TailoringSetupModal/TailoringSetupModal.tsx` + `.types.ts`
- Modify: `apps/jobapply-app/src/design-system/tailoring/ATSWorkspace/ATSWorkspace.tsx` + `.types.ts`
- Modify: `apps/jobapply-app/src/domain/cv/components/AtsPlatformSelector/AtsPlatformSelector.tsx`
- Modify: `apps/jobapply-app/src/domain/cv/tailoringHelpers.ts`
- Modify: `apps/jobapply-app/src/domain/cv/tailoringUIHelpers.ts`
- Modify: `apps/jobapply-app/src/domain/cv/types.ts`
- Modify: `apps/jobapply-app/src/infrastructure/repositories/cvRepository.ts`
- Modify: `apps/jobapply-app/src/i18n/translations.json`
- Delete: `apps/jobapply-app/src/design-system/tailoring/TailoringWorkspaceTabs/`
- Delete: `apps/jobapply-app/src/design-system/tailoring/CoverLetterWorkspace/`
- Delete: `apps/jobapply-app/src/design-system/tailoring/VideoScriptWorkspace/`
- Delete: `apps/jobapply-app/src/design-system/tailoring/InterviewWorkspace/`
- Delete (se sem outros consumidores — verificar com grep): `apps/jobapply-app/src/design-system/ats/ToneChips/`, `apps/jobapply-app/src/domain/cv/types/tailoringUI.ts`

**Interfaces:**
- Consumes: `analyzeCV(cvId, jobId?, locale, jobDescription, tailoredContent, atsPlatform?, jobUrl?)` e `generateResume(cvId, jobId?, locale, jobDescription, tailoredContent)` já existentes em `cvRepository.ts` — passam a receber `undefined` como `jobId`.
- Produces: `useTailoringWorkspace({ cvId, atsPlatform?, onError, onNeedSetup })` retornando `TailoringWorkspaceState` reduzido (sem cover/video/interview/rewrite); `TailoringContextBarProps { manualDescription?, isAnalysisRunning, onNewAnalysis?, currentScore? }`; `mapATSReportToPanel(report: ATSReport)` com um parâmetro só. A Task 2 depende de `CVTailoringPage` (default export) não precisar de nenhuma prop de rota.

- [ ] **Step 1: Deletar os workspaces secundários**

```bash
cd /Users/lucasmansoldo/Projects/jobapply
git rm -r apps/jobapply-app/src/design-system/tailoring/TailoringWorkspaceTabs \
  apps/jobapply-app/src/design-system/tailoring/CoverLetterWorkspace \
  apps/jobapply-app/src/design-system/tailoring/VideoScriptWorkspace \
  apps/jobapply-app/src/design-system/tailoring/InterviewWorkspace
```

- [ ] **Step 2: Reescrever `useTailoringWorkspace.ts` com este conteúdo completo**

```ts
/**
 * @file useTailoringWorkspace.ts
 * @description Manages all operations for the CV tailoring workspace.
 * Loads the CV directly, resolves locale + job description via the setup flow,
 * and owns ATS analysis and resume generation state. Manual mode only:
 * the user pastes the job description in the setup modal.
 *
 * ATS analysis uses TanStack Query (staleTime 30min — no re-dispatch without locale/desc change).
 * Resume generation and re-analyze use useMutation (on-demand).
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { ATSReport } from '../types'
import { localeVersionToMarkdown } from '../helpers'
import { prependObjectiveSection } from '../tailoringHelpers'
import {
  getCV,
  analyzeCV,
  generateResume,
} from '../../../infrastructure/repositories/cvRepository'

export interface TailoringWorkspaceState {
  tailoredContent: string
  setTailoredContent: (value: string) => void
  tailoring: boolean
  chosenLocale: 'en' | 'pt-BR' | null
  atsReport: ATSReport | null
  atsLoading: boolean
  resumeLoading: boolean
  handleGenerateResume: () => Promise<void>
  handleReanalyze: () => Promise<void>
}

export interface WorkspaceSetupResult {
  locale: 'en' | 'pt-BR'
  jobDescription: string
}

interface Params {
  cvId: string
  atsPlatform?: string
  onError: (messageKey: string) => void
  onNeedSetup: (locales: ('en' | 'pt-BR')[], initialJobDescription: string) => Promise<WorkspaceSetupResult>
}

export function useTailoringWorkspace({
  cvId,
  atsPlatform,
  onError,
  onNeedSetup,
}: Params): TailoringWorkspaceState {
  const onErrorRef = useRef(onError)
  const onNeedSetupRef = useRef(onNeedSetup)
  useEffect(() => { onErrorRef.current = onError })
  useEffect(() => { onNeedSetupRef.current = onNeedSetup })

  const [tailoredContent, setTailoredContent] = useState('')
  const [tailoring, setTailoring] = useState(false)
  const [chosenLocale, setChosenLocale] = useState<'en' | 'pt-BR' | null>(null)
  const [editedJobDescription, setEditedJobDescription] = useState<string | null>(null)
  const [detectedLocale, setDetectedLocale] = useState<'en' | 'pt-BR'>('pt-BR')

  // Prevents setup from running twice if cvId re-renders before resolution
  const setupInitiatedRef = useRef(false)

  const shouldInit = !!cvId && !setupInitiatedRef.current

  useEffect(() => {
    if (!shouldInit) return
    setupInitiatedRef.current = true
    setTailoring(true)
    getCV(cvId)
      .then(async (cv) => {
        const versions = cv.localeVersions ?? []
        if (versions.length === 0) return

        const locales = versions.map((v) => v.locale) as ('en' | 'pt-BR')[]
        const { locale, jobDescription } = await onNeedSetupRef.current(locales, '')

        const version = versions.find((v) => v.locale === locale)
        if (version) {
          const raw = localeVersionToMarkdown(version, cv.languages)
          setTailoredContent(prependObjectiveSection(raw, locale, ''))
        }
        setChosenLocale(locale)
        setEditedJobDescription(jobDescription)
      })
      .catch(() => onErrorRef.current('tailoring.loadCVError'))
      .finally(() => setTailoring(false))
  }, [cvId, shouldInit])

  // ── ATS analysis — useQuery: auto re-runs when locale/description change ─
  const atsEnabled = !!(
    cvId &&
    chosenLocale &&
    editedJobDescription !== null &&
    editedJobDescription.trim()
  )

  const atsQuery = useQuery({
    queryKey: ['atsReport', cvId, chosenLocale, editedJobDescription, atsPlatform ?? null],
    queryFn: () => analyzeCV(cvId, undefined, chosenLocale!, editedJobDescription!, tailoredContent, atsPlatform),
    enabled: atsEnabled,
    staleTime: 30 * 60 * 1000,
  })

  useEffect(() => {
    if (atsQuery.isError) onErrorRef.current('tailoring.analysisError')
  }, [atsQuery.isError])

  useEffect(() => {
    if (atsQuery.data) setDetectedLocale(atsQuery.data.locale)
  }, [atsQuery.data])

  // ── On-demand mutations ──────────────────────────────────────────────────
  const reanalyzeMutation = useMutation({
    mutationFn: () => analyzeCV(cvId, undefined, chosenLocale!, editedJobDescription!, tailoredContent, atsPlatform),
    onSuccess: (result) => setDetectedLocale(result.locale),
    onError: () => onErrorRef.current('tailoring.analysisError'),
  })

  const resumeMutation = useMutation({
    mutationFn: () =>
      generateResume(cvId, undefined, detectedLocale, editedJobDescription!, tailoredContent),
    onSuccess: (result) => setTailoredContent(result.resume),
    onError: () => onErrorRef.current('tailoring.resumeError'),
  })

  const handleGenerateResume = useCallback(async () => {
    if (!cvId) return
    await resumeMutation.mutateAsync()
  }, [cvId, resumeMutation])

  const handleReanalyze = useCallback(async () => {
    if (!atsEnabled) return
    await reanalyzeMutation.mutateAsync()
  }, [atsEnabled, reanalyzeMutation])

  return {
    tailoredContent,
    setTailoredContent,
    tailoring,
    chosenLocale,
    atsReport: reanalyzeMutation.data?.report ?? atsQuery.data?.report ?? null,
    atsLoading: atsQuery.isFetching || reanalyzeMutation.isPending,
    resumeLoading: resumeMutation.isPending,
    handleGenerateResume,
    handleReanalyze,
  }
}
```

Nota: `analyzeCV` e `generateResume` mantêm a assinatura atual (segundo parâmetro `jobId?` recebe `undefined`). Não alterar `cvRepository.analyzeCV`/`generateResume`.

- [ ] **Step 3: Reescrever `useTailoringPageData.ts` com este conteúdo completo**

```ts
/**
 * @file useTailoringPageData.ts
 * @description Fetches the CV required by the tailoring workspace.
 * Uses TanStack Query for zero-latency cache hits on revisit.
 */
import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCV } from '../../../infrastructure/repositories/cvRepository'
import type { CV } from '../types'

interface UseTailoringPageDataParams {
  cvId: string
  onError: (key: string) => void
}

export interface UseTailoringPageDataReturn {
  cv: CV | null
  loadingCv: boolean
}

export function useTailoringPageData({
  cvId,
  onError,
}: UseTailoringPageDataParams): UseTailoringPageDataReturn {
  const onErrorRef = useRef(onError)
  useEffect(() => { onErrorRef.current = onError })

  const cvQuery = useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => getCV(cvId),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (cvQuery.isError) onErrorRef.current('tailoring.loadCVError')
  }, [cvQuery.isError])

  return {
    cv: cvQuery.data ?? null,
    loadingCv: cvQuery.isLoading,
  }
}
```

- [ ] **Step 4: Reescrever `useTailoringPageUI.ts` com este conteúdo completo**

```ts
/**
 * @file useTailoringPageUI.ts
 * @description Manages pure UI state for the tailoring workspace page:
 * suggestion navigation and drawer visibility.
 */
import { useState, useEffect } from 'react'
import type { ATSReport } from '../types'

interface UseTailoringPageUIParams {
  atsReport: ATSReport | null
}

export interface UseTailoringPageUIReturn {
  currentSuggestion: number
  setCurrentSuggestion: (n: number) => void
  drawerVisible: boolean
  setDrawerVisible: (v: boolean) => void
}

export function useTailoringPageUI({ atsReport }: UseTailoringPageUIParams): UseTailoringPageUIReturn {
  const [currentSuggestion, setCurrentSuggestion] = useState(1)
  const [drawerVisible, setDrawerVisible] = useState(false)

  useEffect(() => {
    if (atsReport) setCurrentSuggestion(1)
  }, [atsReport])

  return {
    currentSuggestion,
    setCurrentSuggestion,
    drawerVisible,
    setDrawerVisible,
  }
}
```

- [ ] **Step 5: Remover `job` do `useTailoringExport.ts`**

Três edits pontuais:

1. Remover a linha `import type { Job } from '../../jobs/types'`.
2. Em `UseTailoringExportParams` e no destructuring de `useTailoringExport`, remover `job: Job | null` / `job`.
3. No `handleDownloadPDF`, trocar:

```ts
const jobTitle = job?.title ?? manualDescription.split('\n')[0]?.substring(0, 50) ?? 'untitled'
```

por:

```ts
const jobTitle = manualDescription.split('\n')[0]?.substring(0, 50) ?? 'untitled'
```

e remover `job` do array de dependências do `useCallback` (fica `[tailoredContent, cv, chosenLocale, setupLocale, manualDescription]`).

- [ ] **Step 6: Reescrever `TailoringContextBar.types.ts` e `TailoringContextBar.tsx`**

`TailoringContextBar.types.ts` completo:

```ts
export interface TailoringContextBarProps {
  /** Manual job description shown in the bar */
  manualDescription?: string
  /** Whether ATS analysis is currently running */
  isAnalysisRunning: boolean
  /** When provided, renders the "New analysis" button (pass only once a report exists) */
  onNewAnalysis?: () => void
  /** ATS score to display as a compact badge on mobile (0 = hidden) */
  currentScore?: number
}
```

`TailoringContextBar.tsx` completo:

```tsx
import { ReloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ManualModeInfo } from './ManualModeInfo'
import { ATSScoreBadge } from './ATSScoreBadge'
import type { TailoringContextBarProps } from './TailoringContextBar.types'
import * as S from './TailoringContextBar.styles'

export function TailoringContextBar({
  manualDescription,
  isAnalysisRunning,
  onNewAnalysis,
  currentScore = 0,
}: TailoringContextBarProps) {
  const { t } = useTranslation()

  const dotClass = isAnalysisRunning ? S.analysisDotRunning : S.analysisDot
  const labelClass = isAnalysisRunning ? S.analysisLabelRunning : S.analysisLabel
  const statusLabel = isAnalysisRunning
    ? t('tailoring.analysisRunning')
    : t('tailoring.manualMode')

  return (
    <div className={S.contextBar}>
      {onNewAnalysis && (
        <button type="button" className={S.backBtn} onClick={onNewAnalysis}>
          <ReloadOutlined />
          {t('tailoring.newAnalysis')}
        </button>
      )}
      <div className={S.jobRow}>
        <ManualModeInfo manualDescription={manualDescription} />
        {currentScore > 0 && <ATSScoreBadge score={currentScore} />}
      </div>
      <div className={S.analysisStatus}>
        <span className={dotClass} />
        <span className={labelClass}>{statusLabel}</span>
      </div>
    </div>
  )
}
```

(Sai o `JobContextBar` de `domain/jobs`, o botão back e a prop `lang`; o estilo `S.backBtn` é reaproveitado para o botão de nova análise.)

- [ ] **Step 7: Remover `job` do `TailoringSetupModal`**

Em `TailoringSetupModal.types.ts`: remover `import type { Job } from '../../../domain/jobs/types'` e a prop `job?: Job`.

Em `TailoringSetupModal.tsx`: remover `job` do destructuring, remover o import de `Alert`, e trocar o bloco condicional do step 2:

```tsx
{!job?.description ? (
  <textarea
    className={S.setupJdTextarea}
    value={jobDescription}
    onChange={(e) => onJobDescriptionChange(e.target.value)}
  />
) : (
  <Alert
    message={t('tailoring.setupModal.descriptionLoaded')}
    type="info"
    showIcon
  />
)}
```

por:

```tsx
<textarea
  className={S.setupJdTextarea}
  value={jobDescription}
  onChange={(e) => onJobDescriptionChange(e.target.value)}
/>
```

- [ ] **Step 8: Remover `job`/rewrite do `ATSWorkspace`**

Em `ATSWorkspace.types.ts`: remover `import type { Job } from '../../../domain/jobs/types'` e as props `job: Job | null`, `onRewriteCV?: () => void`, `rewriteLoading?: boolean`.

Em `ATSWorkspace.tsx`: remover `job`, `onRewriteCV`, `rewriteLoading` do destructuring e, no JSX do `TailoringEditorPanel`, remover as três linhas:

```tsx
jobTitle={job?.title}
onRewriteCV={onRewriteCV}
rewriteLoading={rewriteLoading}
```

(As props correspondentes do `TailoringEditorPanel` já são opcionais — não editar esse componente.)

- [ ] **Step 9: Remover `jobUrl` do `AtsPlatformSelector.tsx`**

Remover da interface `Props` a linha `jobUrl?: string`, remover `jobUrl` do destructuring e apagar o efeito de auto-detecção:

```tsx
useEffect(() => {
  if (!jobUrl) return
  const detected = detectPlatform(jobUrl)
  if (detected) {
    onChange(detected)
    setAutoDetected(true)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [jobUrl])
```

Com o efeito removido, `detectPlatform`, `DOMAIN_MAP`, `useEffect` (import), o estado `autoDetected`/`setAutoDetected(true)` e o span `(detected from job URL)` ficam mortos — remover também (manter `setAutoDetected` se ainda usado; na prática `autoDetected` nunca vira true, então remover o estado, o `setAutoDetected(false)` do `handleChange` e o bloco `{autoDetected && ...}` inteiro, além dos estilos `detectedNote`).

- [ ] **Step 10: Ajustar helpers e tipos**

`tailoringHelpers.ts` — trocar a assinatura e a linha de keywords:

```ts
export function mapATSReportToPanel(report: ATSReport): ATSPanelData {
  const requiredMissing = collectRequiredMissing(report)
  const preferredMissing = collectPreferredMissing(report, requiredMissing)
  const keywords = buildKeywords([], requiredMissing, preferredMissing)
```

(restante da função inalterado).

`tailoringUIHelpers.ts` — remover `buildToneOptions`, `getTabBadgeColors`, a interface `TabBadgeColors` e os imports que ficarem sem uso (`WorkspaceTab`, `ToneKey`, `ToneOption`, `Colors` se nada mais usar).

`domain/cv/types.ts` — remover as interfaces `InterviewPrep` (linha ~71) e `TailorCVResponse` (linha ~227).

`domain/cv/types/tailoringUI.ts` — após as remoções acima, verificar consumidores com `grep -rn "types/tailoringUI" apps/jobapply-app/src`; se restar nenhum, `git rm` o arquivo.

`design-system/ats/ToneChips/` — verificar com `grep -rn "ToneChips" apps/jobapply-app/src --include="*.ts*" | grep -v ats/ToneChips`; se nenhum consumidor restar, `git rm -r`.

- [ ] **Step 11: Remover funções mortas do `cvRepository.ts`**

Deletar as funções `tailorCV`, `generateCoverLetter`, `generateVideoScript` e `generateInterviewPrep` (com seus JSDoc) e quaisquer imports de tipos que só elas usavam (ex.: `TailorCVResponse`, `InterviewPrep`, `VoiceAnswers` — conferir no topo do arquivo; `VoiceAnswers` continua existindo em `domain/linkedin/types` para o LinkedIn Optimizer, só sai o import daqui).

- [ ] **Step 12: Reescrever `CVTailoringPage.tsx` com este conteúdo completo**

```tsx
/**
 * @file CVTailoringPage.tsx
 * @description CV tailoring workspace — ATS analysis over a pasted job description.
 * Remount-based reset: bumping sessionKey clears all workspace state and
 * re-opens the setup modal for a fresh analysis.
 */
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../components/AntApp'
import { useAuth } from '../../../application/providers/AuthProvider'
import { Spin } from '../../../components/Spin'
import { Drawer } from '../../../components/Drawer'
import { Empty } from '../../../components/Empty'
import { TailoringSetupModal } from '../../../design-system/tailoring/TailoringSetupModal'
import { TailoringContextBar } from '../../../design-system/tailoring/TailoringContextBar'
import { ATSWorkspace } from '../../../design-system/tailoring/ATSWorkspace'
import { ATSPanel } from '../../../design-system/ats/ATSPanel'
import { DSButton } from '../../../design-system/primitives/DSButton'
import { type TailoringEditorHandle } from '../../../design-system/tailoring/TailoringEditorPanel'
import { mapATSReportToPanel, buildSuggestionsList, buildEditorKeywords } from '../../../domain/cv/tailoringHelpers'
import { useTailoringWorkspace } from '../../../domain/cv/hooks/useTailoringWorkspace'
import { useSetupFlow } from '../../../domain/cv/hooks/useSetupFlow'
import { useTailoringPageData } from '../../../domain/cv/hooks/useTailoringPageData'
import { useTailoringPageUI } from '../../../domain/cv/hooks/useTailoringPageUI'
import { useTailoringExport } from '../../../domain/cv/hooks/useTailoringExport'
import { calculateScoreMetrics } from '../../../domain/cv/tailoringUIHelpers'
import { AtsPlatformSelector } from '../../../domain/cv/components/AtsPlatformSelector'
import * as styles from './CVTailoringPage.styles'

export default function CVTailoringPage() {
  const [sessionKey, setSessionKey] = useState(0)
  const handleRestart = useCallback(() => setSessionKey((k) => k + 1), [])
  return <TailoringSession key={sessionKey} onRestart={handleRestart} />
}

function TailoringSession({ onRestart }: { onRestart: () => void }) {
  const { message } = useAntApp()
  const { t } = useTranslation()

  const { cvId: cvIdFromAuth } = useAuth()
  const cvId = cvIdFromAuth ?? ''

  const [setupCancelled, setSetupCancelled] = useState(false)

  const handleError = useCallback((key: string) => message.error(t(key)), [message, t])

  const { setupModalProps, onNeedSetup, setupLocale, manualDescription } = useSetupFlow({
    isManualMode: true,
    onCancelManual: () => setSetupCancelled(true),
  })

  const { cv, loadingCv } = useTailoringPageData({ cvId, onError: handleError })

  const [atsPlatform, setAtsPlatform] = useState<string | null>(null)

  const workspace = useTailoringWorkspace({
    cvId,
    atsPlatform: atsPlatform ?? undefined,
    onError: handleError,
    onNeedSetup,
  })

  const ui = useTailoringPageUI({ atsReport: workspace.atsReport })

  const { handleDownloadPDF, handleExportMarkdown, handleSaveAsVersion } = useTailoringExport({
    cv,
    tailoredContent: workspace.tailoredContent,
    chosenLocale: workspace.chosenLocale,
    setupLocale,
    manualDescription,
    message,
    t,
  })

  const editorRef = useRef<TailoringEditorHandle>(null)

  const panelData = workspace.atsReport ? mapATSReportToPanel(workspace.atsReport) : undefined

  const { suggestionsCount, currentScore, projectedScore, scoreDelta } = calculateScoreMetrics(panelData ?? null)
  const allSuggestions = workspace.atsReport ? buildSuggestionsList(workspace.atsReport) : []
  const editorKeywords = workspace.atsReport ? buildEditorKeywords(workspace.atsReport) : undefined
  const keywordPhrases = workspace.atsReport?.optimalTemplate?.keywordPhrases ?? []
  const removeSuggestions = workspace.atsReport?.removeSuggestions ?? []

  const setupModal = <TailoringSetupModal {...setupModalProps} />

  if (loadingCv) {
    return (
      <>
        {setupModal}
        <div className={styles.spinWrapper}><Spin size="large" /></div>
      </>
    )
  }

  if (setupCancelled) {
    return (
      <div className={styles.spinWrapper}>
        <Empty description={t('tailoring.noAnalysisYet')}>
          <DSButton variant="primary" onClick={onRestart}>
            {t('tailoring.startAnalysis')}
          </DSButton>
        </Empty>
      </div>
    )
  }

  return (
    <>
      {setupModal}
      <div className={styles.pageRoot}>
        <TailoringContextBar
          manualDescription={manualDescription}
          isAnalysisRunning={workspace.atsLoading}
          onNewAnalysis={workspace.atsReport ? onRestart : undefined}
          currentScore={currentScore}
        />
        <div className={styles.workspaceContainer}>
          <AtsPlatformSelector
            value={atsPlatform}
            onChange={setAtsPlatform}
          />
          <ATSWorkspace
            atsLoading={workspace.atsLoading}
            panelData={panelData}
            scoreDelta={scoreDelta}
            allSuggestions={allSuggestions}
            currentSuggestion={ui.currentSuggestion}
            suggestionsCount={suggestionsCount}
            editorKeywords={editorKeywords}
            tailoring={workspace.tailoring}
            tailoredContent={workspace.tailoredContent}
            chosenLocale={workspace.chosenLocale ?? undefined}
            onTailoredContentChange={workspace.setTailoredContent}
            currentScore={currentScore}
            projectedScore={projectedScore}
            onSuggestionChange={ui.setCurrentSuggestion}
            onReanalyze={workspace.handleReanalyze}
            onGenerateResume={workspace.handleGenerateResume}
            resumeLoading={workspace.resumeLoading}
            onInsertKeyword={(keyword) => editorRef.current?.insertAtCursor(keyword)}
            onReplaceKeyword={(from, to) => editorRef.current?.findAndReplace(from, to)}
            onDownloadPDF={handleDownloadPDF}
            onExportMarkdown={handleExportMarkdown}
            onSaveAsVersion={handleSaveAsVersion}
            keywordPhrases={keywordPhrases}
            removeSuggestions={removeSuggestions}
            onCopyPhrase={(phrase) => {
              navigator.clipboard.writeText(phrase)
              message.success(t('tailoring.phraseCopied'))
            }}
          />
          <Drawer
            title={t('tailoring.ats.title')}
            open={ui.drawerVisible}
            onClose={() => ui.setDrawerVisible(false)}
            width={400}
          >
            <div className={styles.atsLeft}>
              {panelData && (
                <>
                  <ATSPanel
                    score={panelData.score ?? 0}
                    categories={panelData.categories ?? []}
                    keywords={panelData.keywords ?? []}
                  />
                  <div className={styles.atsScoreBadge}>
                    {t('tailoring.improvementBadge', { delta: scoreDelta })}
                  </div>
                </>
              )}
            </div>
          </Drawer>
        </div>
      </div>
    </>
  )
}
```

Nota: `useSetupFlow` não muda — `isManualMode: true` fixo e `onCancelManual` agora só seta `setupCancelled` (sem navegação). O `Empty` é o wrapper existente em `src/components/Empty` (aceita `children` como o antd `Empty`); se o wrapper não repassar `children`, colocar o `DSButton` como irmão logo abaixo do `Empty` dentro do mesmo `div`.

- [ ] **Step 13: Atualizar i18n (`src/i18n/translations.json`)**

Em **ambos** os blocos `pt-BR` e `en`, dentro de `tailoring`:

1. **Adicionar:**
   - pt-BR: `"newAnalysis": "Nova análise"`, `"startAnalysis": "Iniciar análise"`, `"noAnalysisYet": "Nenhuma análise em andamento"`
   - en: `"newAnalysis": "New analysis"`, `"startAnalysis": "Start analysis"`, `"noAnalysisYet": "No analysis in progress"`
2. **Remover** as chaves que ficaram sem referência. Lista candidata (conferir cada uma com `grep -rn "tailoring.<chave>" apps/jobapply-app/src --include="*.ts*"` antes de apagar — só apagar as sem hits): `tabCoverLetter`, `tabVideoScript`, `toneTitle`, `videoScriptTitle`, `coverPlaceholder`, `videoPlaceholder`, `coverLetter`, `videoScript`, `coverError`, `videoError`, `generatingCover`, `generatingVideo`, `regenCover`, `coverOnboarding`, `badgeNew`, `badgeBeta`, `toneFormal`, `toneDirect`, `toneCreative`, `toneConfident`, `interviewTraining`, `interviewStories`, `interviewPositioning`, `noInterviewData`, `generateInterviewPrep`, `regenInterviewPrep`, `interviewError`, `rewriteCVError`, `jobNotFound`, `analysisComplete`, `setupModal.descriptionLoaded`.
   Manter: `manualMode`, `analysisRunning`, `improvementBadge`, `phraseCopied`, `ats*`, `setup*` restantes, chaves de export/save.

- [ ] **Step 14: Typecheck**

Run: `yarn workspace jobapply-app typecheck`
Expected: sem erros. (Os arquivos de rota `/tailoring` ainda existem e continuam válidos — `CVTailoringPage` segue sendo default export sem props obrigatórias. A rota `$jobId` também ainda compila porque a página ignora params; ela morre na Task 2.)

Atenção: se o typecheck acusar erro em `routes/_auth/tailoring/$jobId.tsx` ou em `useParams`, é porque algum resíduo de `jobId` sobrou na página — a página não deve mais importar `useParams`/`useNavigate`.

- [ ] **Step 15: Lint e commit**

```bash
yarn workspace jobapply-app lint
git add -A apps/jobapply-app
git commit -m "refactor(app): tailoring workspace manual-only with ATS tab and remount reset"
```

---

### Task 2: Tailoring como rota raiz e remoção completa de vagas

**Files:**
- Modify: `apps/jobapply-app/src/routes/_auth/index.tsx`
- Delete: `apps/jobapply-app/src/routes/_auth/tailoring/` (`index.tsx` e `$jobId.tsx`)
- Modify: `apps/jobapply-app/src/presentation/components/AppLayout.tsx`
- Modify: `apps/jobapply-app/src/design-system/layout/AppHeader/AppHeader.tsx` + `AppHeader.types.ts` + `AppHeader.styles.ts`
- Delete: `apps/jobapply-app/src/presentation/pages/JobsPage/`
- Delete: `apps/jobapply-app/src/design-system/jobs/`
- Delete: `apps/jobapply-app/src/domain/jobs/`
- Delete: `apps/jobapply-app/src/infrastructure/repositories/jobsRepository.ts`
- Modify: `apps/jobapply-app/src/infrastructure/mock/data.ts`
- Modify: `apps/jobapply-app/src/i18n/translations.json`
- (gerado) `apps/jobapply-app/src/routeTree.gen.ts` — regenerado pelo plugin, não editar à mão

**Interfaces:**
- Consumes: `CVTailoringPage` (default export, sem props) da Task 1.
- Produces: rota `/` renderiza o tailoring; `AppHeaderProps` sem `onPublishJob`; nenhum import de `domain/jobs` sobra no app.

- [ ] **Step 1: Apontar a rota raiz para o tailoring**

Substituir o conteúdo de `src/routes/_auth/index.tsx` por:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import CVTailoringPage from '../../presentation/pages/CVTailoringPage'

export const Route = createFileRoute('/_auth/')({
  component: CVTailoringPage,
})
```

- [ ] **Step 2: Deletar as rotas de tailoring e todo o código de jobs**

```bash
cd /Users/lucasmansoldo/Projects/jobapply
git rm -r apps/jobapply-app/src/routes/_auth/tailoring \
  apps/jobapply-app/src/presentation/pages/JobsPage \
  apps/jobapply-app/src/design-system/jobs \
  apps/jobapply-app/src/domain/jobs
git rm apps/jobapply-app/src/infrastructure/repositories/jobsRepository.ts
```

- [ ] **Step 3: Limpar mocks de jobs**

Em `src/infrastructure/mock/data.ts`: remover `import type { Job } from '../../domain/jobs/types'` e o bloco inteiro `export const MOCK_JOBS: Job[] = [ ... ]` (linhas ~14–102). `MOCK_USER`, `MOCK_TOKEN` e `MOCK_CV` ficam.

- [ ] **Step 4: Atualizar o `AppLayout.tsx`**

Edits no arquivo existente:

1. Remover `ToolOutlined` do import de ícones.
2. `const MOBILE_NAV_KEYS = ['tailoring', 'linkedin', 'profile']`
3. Substituir o array `navItems` por:

```tsx
const navItems = [
  {
    key: 'tailoring',
    label: t('nav.tailoring'),
    icon: <FileSearchOutlined />,
    href: '/',
    active: pathname === '/',
  },
  {
    key: 'linkedin',
    label: t('nav.linkedin'),
    icon: <LinkedinOutlined />,
    href: '/linkedin',
    active: pathname === '/linkedin' || pathname.startsWith('/linkedin/'),
  },
  {
    key: 'profile',
    label: t('nav.profile'),
    icon: <UserOutlined />,
    href: '/cv',
    active: pathname === '/cv',
  },
]
```

- [ ] **Step 5: Remover o botão "Publicar vaga" do `AppHeader`**

Em `AppHeader.tsx`: remover `onPublishJob` do destructuring e o botão:

```tsx
<button type="button" style={styles.publishBtn} onClick={onPublishJob}>
  {t('nav.publishJob')}
</button>
```

(o `<div style={styles.right}>` fica só com `{rightSlot}`). Se `t` ficar sem uso, remover também `useTranslation`.

Em `AppHeader.types.ts`: remover a prop `onPublishJob`. Em `AppHeader.styles.ts`: remover o estilo `publishBtn`.

- [ ] **Step 6: Limpar i18n de jobs**

Em ambos os locales de `translations.json`: remover a seção `jobs` inteira e, em `nav`, as chaves `jobs` e `publishJob`. Conferir `companies`, `salaries`, `alerts` com `grep -rn "nav.companies\|nav.salaries\|nav.alerts" apps/jobapply-app/src --include="*.ts*" | grep -v i18n` — se sem hits (esperado após deletar `design-system/jobs`), remover também.

- [ ] **Step 7: Regenerar o routeTree e typecheck**

```bash
timeout 20 yarn workspace jobapply-app dev >/dev/null 2>&1 || true
grep -n "tailoring" apps/jobapply-app/src/routeTree.gen.ts
```

Expected: nenhum hit de rotas `/tailoring` no routeTree (o grep sai vazio).

Run: `yarn workspace jobapply-app typecheck`
Expected: sem erros. Se aparecer erro de import de `domain/jobs` em algum arquivo não previsto, remover o import/uso morto nesse arquivo (nenhum consumidor além dos listados foi encontrado na análise: mock/data, jobsRepository, ATSWorkspace, TailoringContextBar, TailoringSetupModal — os três últimos já limpos na Task 1).

- [ ] **Step 8: Lint e commit**

```bash
yarn workspace jobapply-app lint
git add -A apps/jobapply-app
git commit -m "refactor(app): remove jobs feature; tailoring is the home route"
```

---

### Task 3: Limpeza das telas de auth

**Files:**
- Modify: `apps/jobapply-app/src/presentation/pages/LoginPage/LoginPage.tsx`
- Modify: `apps/jobapply-app/src/presentation/pages/RegisterPage/RegisterPage.tsx`
- Delete (após verificar único consumidor): `apps/jobapply-app/src/design-system/auth/RoleCards/`
- Modify: `apps/jobapply-app/src/i18n/translations.json`

**Interfaces:**
- Consumes: nada das tasks anteriores.
- Produces: telas de auth com LinkedIn + email/senha apenas (o fluxo email+senha já existe e não muda).

- [ ] **Step 1: Remover o botão Google do `LoginPage.tsx`**

Trocar:

```tsx
<div className={styles.socialBtns}>
  <SocialLoginBtn provider="google" onClick={() => {}} />
  <SocialLoginBtn provider="linkedin" onClick={() => redirectToLinkedIn('login')} />
</div>
```

por:

```tsx
<div className={styles.socialBtns}>
  <SocialLoginBtn provider="linkedin" onClick={() => redirectToLinkedIn('login')} />
</div>
```

- [ ] **Step 2: Remover os RoleCards do `RegisterPage.tsx`**

1. Remover o import `import { RoleCards } from '../../../design-system/auth/RoleCards'`.
2. Remover o estado `const [role, setRole] = useState('candidate')`.
3. Remover o bloco JSX:

```tsx
<RoleCards
  roles={[
    { key: 'candidate', label: t('auth.roleCandidate'), icon: '👤' },
    { key: 'recruiter', label: t('auth.roleRecruiter'), icon: '🔍' },
  ]}
  value={role}
  onChange={setRole}
/>
```

- [ ] **Step 3: Deletar o componente RoleCards e chaves i18n**

```bash
grep -rn "RoleCards" apps/jobapply-app/src --include="*.ts*" | grep -v design-system/auth/RoleCards
```

Expected: vazio. Então:

```bash
git rm -r apps/jobapply-app/src/design-system/auth/RoleCards
```

Em `translations.json` (ambos locales), remover `auth.roleCandidate` e `auth.roleRecruiter`.

- [ ] **Step 4: Typecheck, lint e commit**

```bash
yarn workspace jobapply-app typecheck
yarn workspace jobapply-app lint
git add -A apps/jobapply-app
git commit -m "refactor(app): drop dead Google button and role cards from auth pages"
```

---

### Task 4: Varredura final e build

**Files:**
- Nenhum novo; correções pontuais de resíduos que os greps encontrarem.

- [ ] **Step 1: Greps de resíduo**

```bash
cd /Users/lucasmansoldo/Projects/jobapply/apps/jobapply-app/src
grep -rn "domain/jobs\|jobsRepository\|JobsPage\|JobContextBar\|MOCK_JOBS" . --include="*.ts*" | grep -v routeTree
grep -rn "CoverLetterWorkspace\|VideoScriptWorkspace\|InterviewWorkspace\|TailoringWorkspaceTabs\|WorkspaceTab\b" . --include="*.ts*"
grep -rn "generateCoverLetter\|generateVideoScript\|generateInterviewPrep\|tailorCV\|handleRewriteCV" . --include="*.ts*"
grep -rn "onPublishJob\|nav.publishJob\|nav.jobs" . --include="*.ts*"
```

Expected: todos vazios. Qualquer hit é resíduo — remover o código morto no arquivo apontado (sem refatorar além disso).

- [ ] **Step 2: Verificação completa**

```bash
cd /Users/lucasmansoldo/Projects/jobapply
yarn workspace jobapply-app typecheck
yarn workspace jobapply-app lint
yarn workspace jobapply-app build
```

Expected: os três limpos (o `build` roda `tsc && vite build` e regenera/valida o routeTree).

- [ ] **Step 3: Smoke test manual (relatar ao usuário, não automatizável)**

Com `jobapply-api` e `ats-agent` rodando: `yarn workspace jobapply-app dev` e verificar no browser:
1. Login por email+senha → cai em `/` com o modal de setup do tailoring.
2. Cancelar o setup → estado vazio com "Iniciar análise"; clicar reabre o modal.
3. Colar uma descrição, confirmar → análise roda, workspace ATS aparece, sem tabs.
4. Botão "Nova análise" aparece após o relatório → clicar zera tudo e reabre o setup.
5. Topbar sem "Vagas" e sem "Publicar vaga"; registro sem cards de papel; login sem botão Google.

- [ ] **Step 4: Commit final (se houve correções de resíduo)**

```bash
git add -A apps/jobapply-app
git commit -m "chore(app): final cleanup after jobs/tabs removal"
```
