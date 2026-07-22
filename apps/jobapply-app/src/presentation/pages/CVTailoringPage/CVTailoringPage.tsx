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
import { Empty } from '../../../components/Empty'
import { TailoringSetupModal } from '../../../design-system/tailoring/TailoringSetupModal'
import { TailoringContextBar } from '../../../design-system/tailoring/TailoringContextBar'
import { ATSWorkspace } from '../../../design-system/tailoring/ATSWorkspace'
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
        </div>
      </div>
    </>
  )
}
