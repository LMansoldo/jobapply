/**
 * @file CVTailoringPage.tsx
 * @description CV tailoring workspace — ATS analysis over a pasted job description.
 * Remount-based reset: bumping sessionKey clears all workspace state and
 * re-opens the setup modal for a fresh analysis.
 */
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../design-system/wrappers/AntApp'
import { useAuth } from '../../../application/providers/AuthProvider'
import { Spin } from '../../../design-system/wrappers/Spin'
import { Empty } from '../../../design-system/wrappers/Empty'
import { TailoringSetupModal } from '../../components/tailoring/TailoringSetupModal'
import { TailoringContextBar } from '../../components/tailoring/TailoringContextBar'
import { ATSWorkspace } from '../../components/tailoring/ATSWorkspace'
import { DSButton } from '@jobapply/ui'
import { type TailoringEditorHandle } from '../../components/tailoring/TailoringEditorPanel'
import { mapATSReportToPanel, buildSuggestionsList, buildEditorKeywords } from '../../../domain/cv/tailoringHelpers'
import { useTailoringWorkspace } from '../../hooks/useTailoringWorkspace'
import { useSetupFlow } from '../../hooks/useSetupFlow'
import { useTailoringPageData } from '../../../domain/cv/hooks/useTailoringPageData'
import { useTailoringPageUI } from '../../hooks/useTailoringPageUI'
import { useTailoringExport } from '../../hooks/useTailoringExport'
import { calculateScoreMetrics } from './tailoringUIHelpers'
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

  // Derived data depends only on the report — memoizing keeps keystrokes in the
  // editor from rebuilding arrays and preserves prop identity for child memoization.
  const panelData = useMemo(
    () => (workspace.atsReport ? mapATSReportToPanel(workspace.atsReport) : undefined),
    [workspace.atsReport],
  )
  const scoreMetrics = useMemo(() => calculateScoreMetrics(panelData ?? null), [panelData])
  const allSuggestions = useMemo(
    () => (workspace.atsReport ? buildSuggestionsList(workspace.atsReport) : []),
    [workspace.atsReport],
  )
  const editorKeywords = useMemo(
    () => (workspace.atsReport ? buildEditorKeywords(workspace.atsReport) : undefined),
    [workspace.atsReport],
  )
  const keywordPhrases = useMemo(
    () => workspace.atsReport?.optimalTemplate?.keywordPhrases ?? [],
    [workspace.atsReport],
  )
  const removeSuggestions = useMemo(
    () => workspace.atsReport?.removeSuggestions ?? [],
    [workspace.atsReport],
  )
  const { suggestionsCount, currentScore, projectedScore, scoreDelta } = scoreMetrics

  const handleInsertKeyword = useCallback(
    (keyword: string) => editorRef.current?.insertAtCursor(keyword),
    [],
  )
  const handleReplaceKeyword = useCallback(
    (from: string, to: string) => editorRef.current?.findAndReplace(from, to),
    [],
  )
  const handleCopyPhrase = useCallback(
    (phrase: string) => {
      navigator.clipboard.writeText(phrase)
      message.success(t('tailoring.phraseCopied'))
    },
    [message, t],
  )

  const setupModal = <TailoringSetupModal {...setupModalProps} />

  if (loadingCv) {
    return (
      <>
        {setupModal}
        <styles.SpinWrapper><Spin size="large" /></styles.SpinWrapper>
      </>
    )
  }

  if (setupCancelled) {
    return (
      <styles.SpinWrapper>
        <Empty description={t('tailoring.noAnalysisYet')}>
          <DSButton variant="primary" onClick={onRestart}>
            {t('tailoring.startAnalysis')}
          </DSButton>
        </Empty>
      </styles.SpinWrapper>
    )
  }

  return (
    <>
      {setupModal}
      <styles.PageRoot>
        <TailoringContextBar
          manualDescription={manualDescription}
          isAnalysisRunning={workspace.atsLoading}
          onNewAnalysis={workspace.atsReport ? onRestart : undefined}
          currentScore={currentScore}
        />
        <styles.WorkspaceContainer>
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
            onInsertKeyword={handleInsertKeyword}
            onReplaceKeyword={handleReplaceKeyword}
            onDownloadPDF={handleDownloadPDF}
            onExportMarkdown={handleExportMarkdown}
            onSaveAsVersion={handleSaveAsVersion}
            keywordPhrases={keywordPhrases}
            removeSuggestions={removeSuggestions}
            onCopyPhrase={handleCopyPhrase}
          />
        </styles.WorkspaceContainer>
      </styles.PageRoot>
    </>
  )
}
