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
import { Spacing } from '../../styles/theme/spacing'
import { FontSize, FontWeight, FontFamily } from '../../styles/theme/typography'
import { BorderRadius } from '../../styles/theme/radius'

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

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: `${Spacing.sm} ${Spacing.md}`,
  border: 'none', background: 'none',
  fontFamily: FontFamily.body, fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: active ? Colors.primaryDark : Colors.textSub,
  cursor: 'pointer',
  borderBottom: `2px solid ${active ? Colors.primary : 'transparent'}`,
  display: 'flex', alignItems: 'center', gap: Spacing.xs,
  whiteSpace: 'nowrap' as const,
  transition: 'color .15s, border-color .15s',
})

const textareaStyle: React.CSSProperties = {
  width: '100%', minHeight: '36rem', padding: Spacing.lg,
  border: 'none', outline: 'none',
  fontFamily: FontFamily.body, fontSize: FontSize.base,
  lineHeight: '1.75', color: Colors.textMain, resize: 'none', background: 'transparent',
}

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }
  if (!job) return null

  const contextBar = (
    <div style={{
      background: Colors.white,
      borderBottom: `1px solid ${Colors.surfaceBorder}`,
      padding: `${Spacing.sm} ${Spacing.lg}`,
      display: 'flex',
      alignItems: 'center',
      gap: Spacing.md,
      flexShrink: 0,
    }}>
      <button
        type="button"
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: 'none', color: Colors.primaryDark,
          fontSize: FontSize.sm, fontWeight: FontWeight.medium, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: Spacing.xs, fontFamily: FontFamily.body,
        }}
      >
        <ArrowLeftOutlined /> {t('tailoring.backToJobs')}
      </button>
      <div style={{ width: '1px', height: '2rem', background: Colors.surfaceBorder }} />
      <JobContextBar job={job} lang="pt-BR" onBack={() => navigate('/')} />
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: Spacing.xs }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: Colors.success, flexShrink: 0 }} />
        <span style={{ fontSize: FontSize.sm, color: Colors.success, fontWeight: FontWeight.medium }}>
          {t('tailoring.analysisComplete')}
        </span>
      </div>
    </div>
  )

  const workspaceTabs = (
    <div style={{
      background: Colors.white,
      borderBottom: `1px solid ${Colors.surfaceBorder}`,
      padding: `0 ${Spacing.lg}`,
      display: 'flex',
      alignItems: 'center',
      gap: Spacing.xs,
      flexShrink: 0,
    }}>
      <button type="button" style={tabBtnStyle(activeTab === 'ats')} onClick={() => setActiveTab('ats')}>
        📊 {t('tailoring.ats')}
        <span style={{ background: Colors.primaryLight, color: Colors.primaryDark, borderRadius: '10px', padding: `0 ${Spacing.xs}`, fontSize: FontSize.xxs, fontWeight: FontWeight.bold }}>
          {MOCK_KEYWORDS.length}
        </span>
      </button>
      <button type="button" style={tabBtnStyle(activeTab === 'cover')} onClick={() => setActiveTab('cover')}>
        💌 {t('tailoring.coverLetter')}
        <span style={{ background: Colors.successBg, color: Colors.success, borderRadius: '10px', padding: `0 ${Spacing.xs}`, fontSize: FontSize.xxs, fontWeight: FontWeight.bold }}>
          NOVO
        </span>
      </button>
      <button type="button" style={tabBtnStyle(activeTab === 'video')} onClick={() => setActiveTab('video')}>
        🎬 {t('tailoring.videoScript')}
        <span style={{ background: Colors.orangeBg, color: Colors.orange, borderRadius: '10px', padding: `0 ${Spacing.xs}`, fontSize: FontSize.xxs, fontWeight: FontWeight.bold }}>
          Beta
        </span>
      </button>
    </div>
  )

  const atsWorkspace = (
    <div style={{ display: 'grid', gridTemplateColumns: '25rem 1fr 30rem', flex: 1, overflow: 'hidden' }}>
      {/* LEFT: ATS Panel */}
      <div style={{ background: Colors.white, borderRight: `1px solid ${Colors.surfaceBorder}`, overflowY: 'auto', padding: Spacing.lg }}>
        <div style={{ marginBottom: Spacing.md, textAlign: 'center' as const }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.xs }}>
          </div>
        </div>
        <ATSPanel score={MOCK_SCORE} categories={MOCK_CATEGORIES} keywords={MOCK_KEYWORDS} />
        <div style={{
          background: Colors.successBg, color: Colors.success, borderRadius: BorderRadius.base,
          padding: `${Spacing.sm} ${Spacing.md}`, textAlign: 'center' as const,
          fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginTop: Spacing.md,
        }}>
          +{MOCK_DELTA} pts {t('tailoring.improvementBadge', { delta: MOCK_DELTA }).split('+' + MOCK_DELTA + ' pts').pop()}
        </div>
      </div>

      {/* CENTER: Dark editor */}
      <div style={{ background: Colors.surfaceEditor, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Center toolbar */}
        <div style={{
          background: Colors.surfaceDarker, borderBottom: `1px solid ${Colors.surfaceEditorBorder}`,
          padding: `${Spacing.sm} ${Spacing.lg}`, display: 'flex', alignItems: 'center', gap: Spacing.sm, flexShrink: 0,
        }}>
          <span style={{ fontSize: FontSize.xxs, color: 'rgba(255,255,255,0.5)', fontFamily: FontFamily.mono }}>Markdown</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: Spacing.sm }}>
            <button type="button" style={{ background: Colors.success, border: 'none', borderRadius: '6px', color: Colors.white, fontSize: FontSize.xxs, fontWeight: FontWeight.semibold, padding: `3px ${Spacing.sm}`, cursor: 'pointer', fontFamily: FontFamily.body }}>
              {t('tailoring.acceptAll')}
            </button>
            <button type="button" style={{ background: Colors.danger, border: 'none', borderRadius: '6px', color: Colors.white, fontSize: FontSize.xxs, fontWeight: FontWeight.semibold, padding: `3px ${Spacing.sm}`, cursor: 'pointer', fontFamily: FontFamily.body }}>
              {t('tailoring.rejectAll')}
            </button>
          </div>
        </div>

        {/* Suggestion banner */}
        <div style={{ padding: `${Spacing.sm} ${Spacing.lg}`, flexShrink: 0 }}>
          <SuggestionBanner
            count={MOCK_SUGGESTIONS}
            current={currentSuggestion}
            onPrev={() => setCurrentSuggestion((n) => Math.max(1, n - 1))}
            onNext={() => setCurrentSuggestion((n) => Math.min(MOCK_SUGGESTIONS, n + 1))}
            onAcceptAll={() => message.success(t('tailoring.acceptAll'))}
          />
        </div>

        {/* Editor area */}
        <div style={{ flex: 1, overflow: 'auto', padding: `0 ${Spacing.lg} ${Spacing.lg}` }}>
          {tailoring ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" />
            </div>
          ) : (
            <textarea
              style={{
                ...textareaStyle,
                width: '100%',
                minHeight: '40rem',
                background: 'transparent',
                color: 'rgba(255,255,255,0.9)',
                fontFamily: FontFamily.mono,
                fontSize: FontSize.sm,
                border: `1px solid ${Colors.surfaceEditorBorder}`,
                borderRadius: BorderRadius.base,
                padding: Spacing.lg,
                boxSizing: 'border-box' as const,
              }}
              value={tailoredContent}
              onChange={(e) => setTailoredContent(e.target.value)}
              placeholder={t('tailoring.cvPlaceholder')}
            />
          )}
        </div>

        {/* Status bar */}
        <div style={{
          background: Colors.surfaceDarker, borderTop: `1px solid ${Colors.surfaceEditorBorder}`,
          padding: `${Spacing.xs} ${Spacing.lg}`,
          display: 'flex', gap: Spacing.lg, fontSize: FontSize.xxs,
          color: 'rgba(255,255,255,0.4)', fontFamily: FontFamily.mono, flexShrink: 0,
        }}>
          <span>Markdown</span>
          <span>UTF-8</span>
          <span>{MOCK_SUGGESTIONS} sugestões</span>
          <span style={{ marginLeft: 'auto' }}>Score atual: {MOCK_SCORE} → com aplicação: {MOCK_PROJECTED}</span>
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
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 30rem', overflow: 'hidden' }}>
      <div style={{ padding: Spacing.lg, overflowY: 'auto', background: Colors.white }}>
        <div style={{ border: `1px solid ${Colors.surfaceBorder}`, borderRadius: BorderRadius.base, overflow: 'hidden' }}>
          <textarea style={textareaStyle} value={coverContent} onChange={(e) => setCoverContent(e.target.value)} placeholder={t('tailoring.coverPlaceholder')} />
        </div>
      </div>
      <div style={{ borderLeft: `1px solid ${Colors.surfaceBorder}`, padding: Spacing.lg, background: Colors.surfacePage, overflowY: 'auto' }}>
        <div style={{ background: Colors.white, border: `1px solid ${Colors.surfaceBorder}`, borderRadius: BorderRadius.base, padding: Spacing.lg, marginBottom: Spacing.md }}>
          <p style={{ fontWeight: FontWeight.semibold, fontSize: FontSize.sm, margin: `0 0 ${Spacing.md}`, color: Colors.primaryDark }}>
            ✦ {t('tailoring.generateWithAI')}
          </p>
          <ToneChips options={TONE_OPTIONS} value={tone} onChange={(k) => setTone(k as ToneKey)} />
          <button type="button" style={{ width: '100%', marginTop: Spacing.md, background: Colors.primaryDark, color: Colors.white, border: 'none', borderRadius: BorderRadius.base, padding: Spacing.sm, fontFamily: FontFamily.body, fontWeight: FontWeight.semibold, fontSize: FontSize.sm, cursor: 'pointer' }}>
            🔄 {t('tailoring.regenCover')}
          </button>
        </div>
      </div>
    </div>
  )

  const videoTab = (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 30rem', overflow: 'hidden' }}>
      <div style={{ padding: Spacing.lg, overflowY: 'auto', background: Colors.white }}>
        <div style={{ border: `1px solid ${Colors.surfaceBorder}`, borderRadius: BorderRadius.base, overflow: 'hidden' }}>
          <textarea style={{ ...textareaStyle, minHeight: '48rem' }} value={videoContent} onChange={(e) => setVideoContent(e.target.value)} placeholder={t('tailoring.videoPlaceholder')} />
        </div>
      </div>
      <div style={{ borderLeft: `1px solid ${Colors.surfaceBorder}`, padding: Spacing.lg, background: Colors.surfacePage, overflowY: 'auto' }}>
        <button type="button" style={{ width: '100%', marginBottom: Spacing.md, background: Colors.primaryDark, color: Colors.white, border: 'none', borderRadius: BorderRadius.base, padding: Spacing.sm, fontFamily: FontFamily.body, fontWeight: FontWeight.semibold, fontSize: FontSize.sm, cursor: 'pointer' }}>
          🎬 {t('tailoring.newScript')}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 6.4rem)', overflow: 'hidden' }}>
      {contextBar}
      {workspaceTabs}
      {activeTab === 'ats' && atsWorkspace}
      {activeTab === 'cover' && coverTab}
      {activeTab === 'video' && videoTab}
    </div>
  )
}
