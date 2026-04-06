/**
 * @file CVTailoringPage.tsx
 * @description CV tailoring workspace — 3-column layout: ATS left, dark editor center, preview+export right.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useAntApp } from '../../components/AntApp'
import { Spin } from '../../components/Spin'
import { ATSPanel } from '../../design-system/ats/ATSPanel'
import { ToneChips } from '../../design-system/ats/ToneChips'
import { SuggestionBanner } from '../../design-system/tailoring/SuggestionBanner'
import { TailoringPreviewPanel } from '../../design-system/tailoring/TailoringPreviewPanel'
import { JobContextBar } from '../../domain/jobs/components/JobContextBar'
import type { Job } from '../../domain/jobs/types'
import { fetchJobs } from '../../infrastructure/repositories/jobsRepository'
import { tailorCV } from '../../infrastructure/repositories/cvRepository'
import { Colors } from '../../styles/theme/colors'
import * as styles from './CVTailoringPage.styles'

type WorkspaceTab = 'ats' | 'cover' | 'video'
type ToneKey = 'formal' | 'direct' | 'creative' | 'confident'

const TONE_OPTIONS: { key: ToneKey; label: string }[] = [
  { key: 'formal', label: 'Formal' },
  { key: 'direct', label: 'Direto' },
  { key: 'creative', label: 'Criativo' },
  { key: 'confident', label: 'Confiante' },
]

const MOCK_CATEGORIES = [
  { name: 'Keywords técnicas', value: 58 },
  { name: 'Experiência relevante', value: 81 },
  { name: 'Soft skills', value: 44 },
  { name: 'Formação', value: 90 },
  { name: 'Estrutura do CV', value: 65 },
]

const MOCK_KEYWORDS = [
  { keyword: 'React', status: 'found' as const },
  { keyword: 'TypeScript', status: 'found' as const },
  { keyword: 'Node.js', status: 'found' as const },
  { keyword: 'CI/CD', status: 'weak' as const },
  { keyword: 'Docker', status: 'missing' as const },
  { keyword: 'Agile', status: 'weak' as const },
  { keyword: 'GraphQL', status: 'missing' as const },
]

export default function CVTailoringPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { message } = useAntApp()
  const { t } = useTranslation()

  const [job, setJob] = useState<Job | null>(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [tailoring, setTailoring] = useState(false)
  const [tailoredContent, setTailoredContent] = useState('')
  const [coverContent, setCoverContent] = useState('')
  const [videoContent, setVideoContent] = useState('')
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('ats')
  const [tone, setTone] = useState<ToneKey>('direct')
  const [currentSuggestion, setCurrentSuggestion] = useState(1)

  const cvId = localStorage.getItem('cvId') ?? ''
  const MOCK_SCORE = 62
  const MOCK_PROJECTED = 85
  const MOCK_DELTA = 23
  const MOCK_SUGGESTIONS = 8

  useEffect(() => {
    async function loadJob() {
      if (!jobId) return
      try {
        const result = await fetchJobs({ limit: 100 })
        const found = result.jobs.find((j) => j._id === jobId)
        if (!found) { message.error(t('tailoring.jobNotFound')); navigate('/'); return }
        setJob(found)
      } catch {
        message.error(t('tailoring.loadError'))
        navigate('/')
      } finally {
        setLoadingJob(false)
      }
    }
    loadJob()
  }, [jobId, message, navigate, t])

  useEffect(() => {
    async function doTailor() {
      if (!job || !cvId) return
      setTailoring(true)
      try {
        const result = await tailorCV(cvId, job._id)
        setTailoredContent(result.tailoredCV)
      } catch {
        message.error(t('tailoring.tailorError'))
      } finally {
        setTailoring(false)
      }
    }
    if (job) doTailor()
  }, [job, cvId, message, t])

  if (loadingJob) {
    return (
      <div className={styles.spinWrapper}>
        <Spin size="large" />
      </div>
    )
  }
  if (!job) return null

  const contextBar = (
    <div className={styles.contextBar}>
      <button type="button" onClick={() => navigate('/')} className={styles.backBtn}>
        <ArrowLeftOutlined /> {t('tailoring.backToJobs')}
      </button>
      <div className={styles.contextDivider} />
      <JobContextBar job={job} lang="pt-BR" onBack={() => navigate('/')} />
      <div className={styles.analysisStatus}>
        <span className={styles.analysisDot} />
        <span className={styles.analysisLabel}>
          {t('tailoring.analysisComplete')}
        </span>
      </div>
    </div>
  )

  const workspaceTabs = (
    <div className={styles.workspaceTabs}>
      <button type="button" className={styles.tabBtn(activeTab === 'ats')} onClick={() => setActiveTab('ats')}>
        📊 {t('tailoring.ats')}
        <span className={styles.tabBadge(Colors.primaryLight, Colors.primaryDark)}>
          {MOCK_KEYWORDS.length}
        </span>
      </button>
      <button type="button" className={styles.tabBtn(activeTab === 'cover')} onClick={() => setActiveTab('cover')}>
        💌 {t('tailoring.coverLetter')}
        <span className={styles.tabBadge(Colors.successBg, Colors.success)}>
          NOVO
        </span>
      </button>
      <button type="button" className={styles.tabBtn(activeTab === 'video')} onClick={() => setActiveTab('video')}>
        🎬 {t('tailoring.videoScript')}
        <span className={styles.tabBadge(Colors.orangeBg, Colors.orange)}>
          Beta
        </span>
      </button>
    </div>
  )

  const atsWorkspace = (
    <div className={styles.atsGrid}>
      {/* LEFT: ATS Panel */}
      <div className={styles.atsLeft}>
        <ATSPanel score={MOCK_SCORE} categories={MOCK_CATEGORIES} keywords={MOCK_KEYWORDS} />
        <div className={styles.atsScoreBadge}>
          +{MOCK_DELTA} pts {t('tailoring.improvementBadge', { delta: MOCK_DELTA }).split('+' + MOCK_DELTA + ' pts').pop()}
        </div>
      </div>

      {/* CENTER: Dark editor */}
      <div className={styles.atsCenter}>
        <div className={styles.atsCenterToolbar}>
          <span className={styles.toolbarMonoLabel}>Markdown</span>
          <div className={styles.toolbarBtns}>
            <button type="button" className={styles.acceptAllBtn}>
              {t('tailoring.acceptAll')}
            </button>
            <button type="button" className={styles.rejectAllBtn}>
              {t('tailoring.rejectAll')}
            </button>
          </div>
        </div>

        <div className={styles.suggestionBannerPad}>
          <SuggestionBanner
            count={MOCK_SUGGESTIONS}
            current={currentSuggestion}
            onPrev={() => setCurrentSuggestion((n) => Math.max(1, n - 1))}
            onNext={() => setCurrentSuggestion((n) => Math.min(MOCK_SUGGESTIONS, n + 1))}
            onAcceptAll={() => message.success(t('tailoring.acceptAll'))}
          />
        </div>

        <div className={styles.editorArea}>
          {tailoring ? (
            <div className={styles.tailoringSpinWrapper}>
              <Spin size="large" />
            </div>
          ) : (
            <textarea
              className={styles.editorTextarea}
              value={tailoredContent}
              onChange={(e) => setTailoredContent(e.target.value)}
              placeholder={t('tailoring.cvPlaceholder')}
            />
          )}
        </div>

        <div className={styles.statusBar}>
          <span>Markdown</span>
          <span>UTF-8</span>
          <span>{MOCK_SUGGESTIONS} sugestões</span>
          <span className={styles.statusBarRight}>Score atual: {MOCK_SCORE} → com aplicação: {MOCK_PROJECTED}</span>
        </div>
      </div>

      {/* RIGHT: Preview + Export */}
      <TailoringPreviewPanel
        cv={null}
        locale={null}
        job={job}
        currentScore={MOCK_SCORE}
        projectedScore={MOCK_PROJECTED}
        scoreDelta={MOCK_DELTA}
        onDownloadPDF={() => message.info(t('tailoring.downloadPDF'))}
        onDownloadDOCX={() => message.info(t('tailoring.downloadDOCX'))}
        onExportMarkdown={() => message.info(t('tailoring.exportMarkdown'))}
        onSaveAsVersion={() => message.info(t('tailoring.saveAsVersion'))}
      />
    </div>
  )

  const coverTab = (
    <div className={styles.coverGrid}>
      <div className={styles.coverEditorPane}>
        <div className={styles.coverEditorBorder}>
          <textarea className={styles.coverTextarea} value={coverContent} onChange={(e) => setCoverContent(e.target.value)} placeholder={t('tailoring.coverPlaceholder')} />
        </div>
      </div>
      <div className={styles.coverSidePane}>
        <div className={styles.aiCard}>
          <p className={styles.aiCardTitle}>
            ✦ {t('tailoring.generateWithAI')}
          </p>
          <ToneChips options={TONE_OPTIONS} value={tone} onChange={(k) => setTone(k as ToneKey)} />
          <button type="button" className={styles.aiGenBtn}>
            🔄 {t('tailoring.regenCover')}
          </button>
        </div>
      </div>
    </div>
  )

  const videoTab = (
    <div className={styles.videoGrid}>
      <div className={styles.videoEditorPane}>
        <div className={styles.coverEditorBorder}>
          <textarea className={styles.videoTextarea} value={videoContent} onChange={(e) => setVideoContent(e.target.value)} placeholder={t('tailoring.videoPlaceholder')} />
        </div>
      </div>
      <div className={styles.videoSidePane}>
        <button type="button" className={styles.videoScriptBtn}>
          🎬 {t('tailoring.newScript')}
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.pageRoot}>
      {contextBar}
      {workspaceTabs}
      {activeTab === 'ats' && atsWorkspace}
      {activeTab === 'cover' && coverTab}
      {activeTab === 'video' && videoTab}
    </div>
  )
}
