/**
 * @file CVTailoringPage.tsx
 * @description CV tailoring workspace. Adapts a CV locale version for a specific job using AI.
 * Composed of: JobContextBar (top), workspace tabs (CV / Cover letter / Video script),
 * and an ATSPanel sidebar showing score, categories, and keyword analysis.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileTextOutlined, MailOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useAntApp } from '../../components/AntApp'
import { Spin } from '../../components/Spin'
import { DSCard } from '../../design-system/primitives/DSCard'
import { ATSPanel } from '../../design-system/ats/ATSPanel'
import { AIsuggestionBar } from '../../design-system/ats/AIsuggestionBar'
import { ToneChips } from '../../design-system/ats/ToneChips'
import { PageLayout } from '../../design-system/layout/PageLayout'
import { JobContextBar } from '../../domain/jobs/components/JobContextBar'
import type { Job } from '../../domain/jobs/types'
import { fetchJobs } from '../../infrastructure/repositories/jobsRepository'
import { tailorCV } from '../../infrastructure/repositories/cvRepository'
import { Colors } from '../../styles/theme/colors'
import { Spacing } from '../../styles/theme/spacing'
import { FontSize, FontWeight, FontFamily } from '../../styles/theme/typography'
import { BorderRadius } from '../../styles/theme/radius'
import { Shadows } from '../../styles/theme/shadows'

type WorkspaceTab = 'cv' | 'cover' | 'video'
type ToneKey = 'formal' | 'direct' | 'creative' | 'confident'

const TONE_OPTIONS: { key: ToneKey; label: string }[] = [
  { key: 'formal', label: 'Formal' },
  { key: 'direct', label: 'Direto' },
  { key: 'creative', label: 'Criativo' },
  { key: 'confident', label: 'Confiante' },
]

const MOCK_CATEGORIES = [
  { name: 'Palavras-chave', value: 82 },
  { name: 'Experiência', value: 75 },
  { name: 'Habilidades', value: 90 },
  { name: 'Formato', value: 68 },
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

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: `${Spacing.sm} ${Spacing.md}`,
  border: 'none',
  background: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.semibold,
  color: active ? Colors.primaryDark : Colors.textSub,
  cursor: 'pointer',
  borderBottom: `2px solid ${active ? Colors.primary : 'transparent'}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  whiteSpace: 'nowrap' as const,
  transition: 'color .15s, border-color .15s',
})

const tabBarStyle: React.CSSProperties = {
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `0 ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.xs,
  flexShrink: 0,
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '36rem',
  padding: Spacing.lg,
  border: 'none',
  outline: 'none',
  fontFamily: FontFamily.body,
  fontSize: FontSize.base,
  lineHeight: '1.75',
  color: Colors.textMain,
  resize: 'none',
  background: 'transparent',
}

const coverEditorWrap: React.CSSProperties = {
  background: Colors.white,
  borderRadius: BorderRadius.base,
  border: `1px solid ${Colors.surfaceBorder}`,
  overflow: 'hidden',
  boxShadow: Shadows.sm,
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
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('cv')
  const [tone, setTone] = useState<ToneKey>('direct')
  const [aiSuggestion] = useState(t('tailoring.aiSuggestion'))

  const cvId = localStorage.getItem('cvId') ?? ''

  useEffect(() => {
    async function loadJob() {
      if (!jobId) return
      try {
        const result = await fetchJobs({ limit: 100 })
        const found = result.jobs.find((j) => j._id === jobId)
        if (!found) {
          message.error(t('tailoring.jobNotFound'))
          navigate('/')
          return
        }
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

  function handleBack() {
    navigate('/')
  }

  function handleRegen() {
    if (!job || !cvId) return
    setTailoring(true)
    tailorCV(cvId, job._id)
      .then((r) => setTailoredContent(r.tailoredCV))
      .catch(() => message.error(t('tailoring.tailorError')))
      .finally(() => setTailoring(false))
  }

  if (loadingJob) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!job) return null

  const centerContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Workspace tabs */}
      <div style={tabBarStyle}>
        <button type="button" style={tabStyle(activeTab === 'cv')} onClick={() => setActiveTab('cv')}>
          <FileTextOutlined />
          {t('tailoring.tabCV')}
        </button>
        <button type="button" style={tabStyle(activeTab === 'cover')} onClick={() => setActiveTab('cover')}>
          <MailOutlined />
          {t('tailoring.tabCoverLetter')}
        </button>
        <button type="button" style={tabStyle(activeTab === 'video')} onClick={() => setActiveTab('video')}>
          <VideoCameraOutlined />
          {t('tailoring.tabVideoScript')}
        </button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: Spacing.lg, overflow: 'auto', background: Colors.surfacePage }}>
        {activeTab === 'cv' && (
          <div>
            <AIsuggestionBar text={aiSuggestion} onRegen={handleRegen} />
            <div style={{ marginTop: Spacing.md }}>
              {tailoring ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: Spacing.xl }}>
                  <Spin size="large" />
                </div>
              ) : (
                <DSCard>
                  <textarea
                    style={textareaStyle}
                    value={tailoredContent}
                    onChange={(e) => setTailoredContent(e.target.value)}
                    placeholder={t('tailoring.cvPlaceholder')}
                  />
                </DSCard>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cover' && (
          <div>
            <DSCard title={t('tailoring.toneTitle')}>
              <ToneChips options={TONE_OPTIONS} value={tone} onChange={(k) => setTone(k as ToneKey)} />
            </DSCard>
            <div style={{ marginTop: Spacing.md }}>
              <div style={coverEditorWrap}>
                <textarea
                  style={textareaStyle}
                  value={coverContent}
                  onChange={(e) => setCoverContent(e.target.value)}
                  placeholder={t('tailoring.coverPlaceholder')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div>
            <DSCard title={t('tailoring.videoScriptTitle')}>
              <textarea
                style={{ ...textareaStyle, minHeight: '48rem' }}
                value={videoContent}
                onChange={(e) => setVideoContent(e.target.value)}
                placeholder={t('tailoring.videoPlaceholder')}
              />
            </DSCard>
          </div>
        )}
      </div>
    </div>
  )

  const rightContent = (
    <div style={{ background: Colors.white, borderLeft: `1px solid ${Colors.surfaceBorder}`, height: '100%', overflowY: 'auto' }}>
      <ATSPanel
        score={78}
        categories={MOCK_CATEGORIES}
        keywords={MOCK_KEYWORDS}
      />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 6rem)', overflow: 'hidden' }}>
      <JobContextBar job={job} lang="pt-BR" onBack={handleBack} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PageLayout
          variant="tailoring"
          center={centerContent}
          right={rightContent}
        />
      </div>
    </div>
  )
}
