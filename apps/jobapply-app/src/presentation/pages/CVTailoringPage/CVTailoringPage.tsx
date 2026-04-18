/**
 * @file CVTailoringPage.tsx
 * @description CV tailoring workspace — 3-column layout: ATS left, dark editor center, preview+export right.
 * Supports both job-based mode (with jobId) and manual mode (user enters job description).
 */
import { useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../components/AntApp'
import { useAuth } from '../../../application/providers/AuthProvider'
import { Spin } from '../../../components/Spin'
import { Drawer } from '../../../components/Drawer'
import { TailoringSetupModal } from '../../../design-system/tailoring/TailoringSetupModal'
import { TailoringContextBar } from '../../../design-system/tailoring/TailoringContextBar'
import { TailoringWorkspaceTabs } from '../../../design-system/tailoring/TailoringWorkspaceTabs'
import { ATSWorkspace } from '../../../design-system/tailoring/ATSWorkspace'
import { ATSPanel } from '../../../design-system/ats/ATSPanel'
import { CoverLetterWorkspace } from '../../../design-system/tailoring/CoverLetterWorkspace'
import { VideoScriptWorkspace } from '../../../design-system/tailoring/VideoScriptWorkspace'
import { InterviewWorkspace } from '../../../design-system/tailoring/InterviewWorkspace'
import { type TailoringEditorHandle } from '../../../design-system/tailoring/TailoringEditorPanel'
import { mapATSReportToPanel, buildSuggestionsList, buildEditorKeywords } from '../../../domain/cv/tailoringHelpers'
import { useTailoringWorkspace } from '../../../domain/cv/hooks/useTailoringWorkspace'
import { useSetupFlow } from '../../../domain/cv/hooks/useSetupFlow'
import { useTailoringPageData } from '../../../domain/cv/hooks/useTailoringPageData'
import { useTailoringPageUI } from '../../../domain/cv/hooks/useTailoringPageUI'
import { useTailoringExport } from '../../../domain/cv/hooks/useTailoringExport'
import { buildToneOptions, calculateScoreMetrics } from '../../../domain/cv/tailoringUIHelpers'
import * as styles from './CVTailoringPage.styles'

export default function CVTailoringPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { message } = useAntApp()
  const { t } = useTranslation()

  const isManualMode = !jobId
  const { cvId: cvIdFromAuth } = useAuth()
  const cvId = cvIdFromAuth ?? ''

  const handleError = useCallback((key: string) => message.error(t(key)), [message, t])

  const { setupModalProps, onNeedSetup, setupLocale, manualDescription } = useSetupFlow({
    isManualMode,
    onCancelManual: () => navigate('/'),
  })

  const { job, cv, loadingJob, loadingCv } = useTailoringPageData({
    cvId,
    jobId,
    onError: handleError,
    onJobNotFound: () => navigate('/'),
  })

  const workspace = useTailoringWorkspace({
    cvId,
    job,
    manualMode: isManualMode,
    onError: handleError,
    onNeedSetup,
  })

  const ui = useTailoringPageUI({ atsReport: workspace.atsReport })

  const { handleDownloadPDF, handleExportMarkdown, handleSaveAsVersion } = useTailoringExport({
    cv,
    tailoredContent: workspace.tailoredContent,
    chosenLocale: workspace.chosenLocale,
    setupLocale,
    job,
    manualDescription,
    message,
    t,
  })

  const editorRef = useRef<TailoringEditorHandle>(null)

  const panelData = workspace.atsReport
    ? mapATSReportToPanel(workspace.atsReport, job?.tags ?? [])
    : undefined

  const { suggestionsCount, currentScore, projectedScore, scoreDelta } = calculateScoreMetrics(panelData ?? null)
  const allSuggestions = workspace.atsReport ? buildSuggestionsList(workspace.atsReport) : []
  const editorKeywords = workspace.atsReport ? buildEditorKeywords(workspace.atsReport) : undefined
  const keywordPhrases = workspace.atsReport?.optimalTemplate?.keywordPhrases ?? []
  const removeSuggestions = workspace.atsReport?.removeSuggestions ?? []

  const toneOptions = buildToneOptions().map((opt) => ({
    ...opt,
    label: t(`tailoring.tone${opt.label.charAt(0).toUpperCase() + opt.label.slice(1)}`),
  }))

  const setupModal = <TailoringSetupModal {...setupModalProps} />

  if (loadingJob || loadingCv) {
    return (
      <>
        {setupModal}
        <div className={styles.spinWrapper}><Spin size="large" /></div>
      </>
    )
  }

  if (!isManualMode && !job) return setupModal

  return (
    <>
      {setupModal}
      <div className={styles.pageRoot}>
        <TailoringContextBar
          job={job}
          manualDescription={isManualMode ? manualDescription : undefined}
          isAnalysisRunning={workspace.atsLoading}
          onBack={() => navigate('/')}
          lang="pt-BR"
          currentScore={currentScore}
        />
        <TailoringWorkspaceTabs
          activeTab={ui.activeTab}
          onTabChange={ui.setActiveTab}
          suggestionsCount={suggestionsCount}
        />
        {ui.activeTab === 'ats' && (
          <div className={styles.workspaceContainer}>
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
              job={job}
              currentScore={currentScore}
              projectedScore={projectedScore}
              onSuggestionChange={ui.setCurrentSuggestion}
              onReanalyze={workspace.handleReanalyze}
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
        )}
        {ui.activeTab === 'cover' && (
          <CoverLetterWorkspace
            coverContent={workspace.coverContent}
            coverLoading={workspace.coverLoading}
            tone={ui.tone}
            toneOptions={toneOptions}
            onCoverContentChange={workspace.setCoverContent}
            onToneChange={ui.setTone}
            onGenerateCoverLetter={workspace.handleGenerateCoverLetter}
          />
        )}
        {ui.activeTab === 'video' && (
          <VideoScriptWorkspace
            videoContent={workspace.videoContent}
            videoLoading={workspace.videoLoading}
            onVideoContentChange={workspace.setVideoContent}
            onGenerateVideoScript={workspace.handleGenerateVideoScript}
          />
        )}
        {ui.activeTab === 'interview' && (
          <InterviewWorkspace
            interviewPrep={workspace.interviewPrep}
            loading={workspace.interviewPrepLoading}
            onGenerate={workspace.handleGenerateInterviewPrep}
          />
        )}
      </div>
    </>
  )
}
