/**
 * @file CVTailoringPage.tsx
 * @description CV tailoring workspace — 3-column layout: ATS left, dark editor center, preview+export right.
 * Supports both job-based mode (with jobId) and manual mode (user enters job description).
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../../components/AntApp'
import { Spin } from '../../../components/Spin'
import { Button } from '../../../components/Button'
import { Drawer } from '../../../components/Drawer'
import { TailoringSetupModal } from '../../../design-system/tailoring/TailoringSetupModal'
import { TailoringContextBar } from '../../../design-system/tailoring/TailoringContextBar'
import { TailoringWorkspaceTabs } from '../../../design-system/tailoring/TailoringWorkspaceTabs'
import { ATSWorkspace } from '../../../design-system/tailoring/ATSWorkspace'
import { ATSPanel } from '../../../design-system/ats/ATSPanel'
import { CoverLetterWorkspace } from '../../../design-system/tailoring/CoverLetterWorkspace'
import { VideoScriptWorkspace } from '../../../design-system/tailoring/VideoScriptWorkspace'
import { type TailoringEditorHandle } from '../../../design-system/tailoring/TailoringEditorPanel'
import { mapATSReportToPanel, buildSuggestionsList, buildEditorKeywords } from '../../../domain/cv/tailoringHelpers'
import { downloadMarkdownText, downloadMarkdownAsPdf } from '../../../domain/cv/helpers'
import { useTailoringWorkspace } from '../../../domain/cv/hooks/useTailoringWorkspace'
import type { WorkspaceSetupResult } from '../../../domain/cv/hooks/useTailoringWorkspace'
import type { Job } from '../../../domain/jobs/types'
import { buildToneOptions } from '../../../domain/cv/tailoringUIHelpers'
import type { WorkspaceTab } from '../../../domain/cv/types/tailoringUI'
import type { ToneKey } from '../../../design-system/ats/ToneChips/ToneChips.types'
import { getJobById } from '../../../infrastructure/repositories/jobsRepository'
import { getCV } from '../../../infrastructure/repositories/cvRepository'
import type { CV } from '../../../domain/cv/types'
import * as styles from './CVTailoringPage.styles'


export default function CVTailoringPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { message } = useAntApp()
  const { t } = useTranslation()

  const isManualMode = !jobId

  const [job, setJob] = useState<Job | null>(null)
  const [cv, setCv] = useState<CV | null>(null)
  const [loadingJob, setLoadingJob] = useState(!isManualMode)
  const [loadingCv, setLoadingCv] = useState(true)
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('ats')
  const [tone, setTone] = useState<ToneKey>('direct')
  const [currentSuggestion, setCurrentSuggestion] = useState(1)
  const [manualDescription, setManualDescription] = useState('')

  const editorRef = useRef<TailoringEditorHandle>(null)
  const setupResolveRef = useRef<((result: WorkspaceSetupResult) => void) | null>(null)
  const [setupOpen, setSetupOpen] = useState(false)
  const [setupStep, setSetupStep] = useState<1 | 2>(1)
  const [setupLocales, setSetupLocales] = useState<('en' | 'pt-BR')[]>([])
  const [setupLocale, setSetupLocale] = useState<'en' | 'pt-BR'>('pt-BR')
  const [setupJobDesc, setSetupJobDesc] = useState('')
  const [drawerVisible, setDrawerVisible] = useState(false)

  const cvId = localStorage.getItem('cvId') ?? ''

  const handleError = useCallback(
    (key: string) => message.error(t(key)),
    [message, t],
  )

  const onNeedSetup = useCallback(
    (locales: ('en' | 'pt-BR')[], initialJobDescription: string): Promise<WorkspaceSetupResult> =>
      new Promise((resolve) => {
        setupResolveRef.current = resolve
        setSetupLocales(locales)
        setSetupLocale(locales[0])
        setSetupJobDesc(initialJobDescription)
        setSetupStep(locales.length > 1 ? 1 : 2)
        setSetupOpen(true)
      }),
    [],
  )

  const workspace = useTailoringWorkspace({
    cvId,
    job,
    manualMode: isManualMode,
    onError: handleError,
    onNeedSetup,
  })

  const panelData = job && workspace.atsReport
    ? mapATSReportToPanel(workspace.atsReport, job.tags ?? [])
    : undefined

  const allSuggestions = workspace.atsReport ? buildSuggestionsList(workspace.atsReport) : []
  const editorKeywords = workspace.atsReport ? buildEditorKeywords(workspace.atsReport) : undefined

  useEffect(() => {
    if (workspace.atsReport) setCurrentSuggestion(1)
  }, [workspace.atsReport])

  const toneOptions = buildToneOptions().map(opt => ({
    ...opt,
    label: t(`tailoring.tone${opt.label.charAt(0).toUpperCase() + opt.label.slice(1)}`)
  }))

  // Fetch CV data
  useEffect(() => {
    if (!cvId) {
      setLoadingCv(false)
      return
    }
    getCV(cvId)
      .then(setCv)
      .catch(() => message.error(t('tailoring.loadCVError')))
      .finally(() => setLoadingCv(false))
  }, [cvId, message, t])

  // Fetch job only when we have a jobId
  useEffect(() => {
    if (!jobId) return
    getJobById(jobId)
      .then((found) => setJob(found))
      .catch(() => { message.error(t('tailoring.jobNotFound')); navigate('/') })
      .finally(() => setLoadingJob(false))
  }, [jobId, message, navigate, t])


  function handleInsertKeyword(keyword: string) {
    editorRef.current?.insertAtCursor(keyword)
  }

  function handleReplaceKeyword(from: string, to: string) {
    editorRef.current?.findAndReplace(from, to)
  }

  const handleSetupComplete = (result: WorkspaceSetupResult) => {
    setupResolveRef.current?.(result)
    setupResolveRef.current = null
    setSetupOpen(false)
    if (isManualMode) {
      setManualDescription(result.jobDescription)
    }
  }

  const handleSetupCancel = () => {
    if (isManualMode) {
      // In manual mode, cancelling goes back since there's no job to fall back to
      navigate('/')
      return
    }
    setupResolveRef.current?.({ locale: setupLocale, jobDescription: setupJobDesc })
    setupResolveRef.current = null
    setSetupOpen(false)
  }

  const setupModal = (
    <TailoringSetupModal
      open={setupOpen}
      step={setupStep}
      locales={setupLocales}
      selectedLocale={setupLocale}
      jobDescription={setupJobDesc}
      onStepChange={setSetupStep}
      onLocaleChange={setSetupLocale}
      onJobDescriptionChange={setSetupJobDesc}
      onConfirm={handleSetupComplete}
      onCancel={handleSetupCancel}
    />
  )

  if (loadingJob || loadingCv) {
    return (
      <>
        {setupModal}
        <div className={styles.spinWrapper}><Spin size="large" /></div>
      </>
    )
  }

  // Job-based mode: job not found after loading
  if (!isManualMode && !job) return setupModal

  const isAnalysisRunning = workspace.atsLoading

  const contextBar = (
    <TailoringContextBar
      job={job}
      manualDescription={isManualMode ? manualDescription : undefined}
      isAnalysisRunning={isAnalysisRunning}
      onBack={() => navigate('/')}
      lang="pt-BR"
    />
  )

  const suggestionsCount = panelData?.suggestionsCount ?? 0
  const currentScore = panelData?.score ?? 0
  const projectedScore = panelData?.projectedScore ?? 0
  const scoreDelta = panelData?.scoreDelta ?? 0

  const workspaceTabs = (
    <TailoringWorkspaceTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
      suggestionsCount={suggestionsCount}
    />
  )

  const atsWorkspace = (
    <>
      <ATSWorkspace
        atsLoading={workspace.atsLoading}
        panelData={panelData}
        scoreDelta={scoreDelta}
        allSuggestions={allSuggestions}
        currentSuggestion={currentSuggestion}
        suggestionsCount={suggestionsCount}
        editorKeywords={editorKeywords}
        tailoring={workspace.tailoring}
        tailoredContent={workspace.tailoredContent}
        chosenLocale={workspace.chosenLocale ?? undefined}
        onTailoredContentChange={workspace.setTailoredContent}
        job={job}
        currentScore={currentScore}
        projectedScore={projectedScore}
        onSuggestionChange={setCurrentSuggestion}
        onReanalyze={workspace.handleReanalyze}
        onInsertKeyword={handleInsertKeyword}
        onReplaceKeyword={handleReplaceKeyword}
        onDownloadPDF={async () => {
          if (workspace.tailoredContent && cv) {
            try {
              message.loading(t('tailoring.generatingPDF'), 0)
              const fullName = cv.fullName
              const locale = workspace.chosenLocale || setupLocale || 'pt-BR'
              const jobTitle = job?.title || manualDescription.split('\n')[0]?.substring(0, 50) || 'untitled'
              await downloadMarkdownAsPdf(workspace.tailoredContent, cv, locale, jobTitle)
              message.destroy()
              message.success(t('tailoring.downloadPDFSuccess'))
            } catch (error) {
              message.destroy()
              console.error('PDF generation error:', error)
              message.error(t('tailoring.downloadPDFError'))
            }
          } else {
            message.warning(t('tailoring.noContentToExport'))
          }
        }}
        onExportMarkdown={() => {
          if (workspace.tailoredContent) {
            downloadMarkdownText(workspace.tailoredContent, 'cv-otimizado')
            message.success(t('tailoring.exportMarkdownSuccess'))
          } else {
            message.warning(t('tailoring.noContentToExport'))
          }
        }}
        onSaveAsVersion={() => message.info(t('tailoring.saveAsVersion') + ' (feature em desenvolvimento)')}
      />
      <Drawer
        title={t('tailoring.ats.title')}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
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
              {panelData && (
                <div className={styles.atsScoreBadge}>
                  {t('tailoring.improvementBadge', { delta: scoreDelta })}
                </div>
              )}
              <div className={styles.reanalyzeWrapper}>
                <Button
                  type="default"
                  size="small"
                  onClick={workspace.handleReanalyze}
                  loading={workspace.atsLoading}
                >
                  {t('tailoring.reanalyze')}
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </>
  )

  const coverTab = (
    <CoverLetterWorkspace
      coverContent={workspace.coverContent}
      coverLoading={workspace.coverLoading}
      tone={tone}
      toneOptions={toneOptions}
      onCoverContentChange={workspace.setCoverContent}
      onToneChange={setTone}
      onGenerateCoverLetter={workspace.handleGenerateCoverLetter}
    />
  )

  const videoTab = (
    <VideoScriptWorkspace
      videoContent={workspace.videoContent}
      videoLoading={workspace.videoLoading}
      onVideoContentChange={workspace.setVideoContent}
      onGenerateVideoScript={workspace.handleGenerateVideoScript}
    />
  )

  return (
    <>
      {setupModal}
      <div className={styles.pageRoot}>
        {contextBar}
        {workspaceTabs}
        {activeTab === 'ats' && atsWorkspace}
        {activeTab === 'cover' && coverTab}
        {activeTab === 'video' && videoTab}
      </div>
    </>
  )
}
