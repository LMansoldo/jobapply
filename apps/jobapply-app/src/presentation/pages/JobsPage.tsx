/**
 * @file JobsPage.tsx
 * @description Jobs listing page — LinkedIn-style 3-col layout:
 *   Left: scrollable compact job list
 *   Center: full job detail + apply/save/tailor actions
 *   Right: profile card, alerts, industry news
 */
import { useEffect, useState, useRef, useCallback } from 'react'
import { Grid } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAntApp } from '../../components/AntApp'
import { Button } from '../../components/Button'
import { Empty } from '../../components/Empty'
import { Modal } from '../../components/Modal'
import { Spin } from '../../components/Spin'
import { JobListItem } from '../../design-system/jobs/JobListItem'
import { JobDetailPanel } from '../../design-system/jobs/JobDetailPanel'
import type { Job, JobFilters } from '../../domain/jobs/types'
import { fetchJobs, deleteJob } from '../../infrastructure/repositories/jobsRepository'
import { PageLayout } from '../../design-system/layout/PageLayout'
import { SortDropdown } from '../../design-system/jobs/SortDropdown'
import type { SortOption } from '../../design-system/jobs/SortDropdown'
import { ProfileCard } from '../../design-system/jobs/ProfileCard'
import { JobAlertsCard } from '../../design-system/jobs/JobAlertsCard'
import { IndustryNewsCard } from '../../design-system/jobs/IndustryNewsCard'
import { DSPagination } from '../../design-system/navigation/DSPagination'
import { useAuth } from '../../application/providers/AuthProvider'
import { Colors } from '../../styles/theme/colors'
import { Spacing } from '../../styles/theme/spacing'
import * as styles from './JobsPage.styles'

const { useBreakpoint } = Grid

const MOCK_ALERTS = [
  { icon: '⚛️', title: 'React Sênior · Remoto', subtitle: 'Criado há 2 dias', count: 14 },
  { icon: '🔷', title: 'TypeScript · SP', subtitle: 'Criado há 5 dias', count: 7 },
  { icon: '👑', title: 'Tech Lead Frontend', subtitle: 'Criado há 1 semana', count: 3 },
]

const MOCK_NEWS = [
  { thumbnail: '📰', title: 'Mercado de tecnologia cresce 15% em 2025', source: 'TechBrasil', time: '2h' },
  { thumbnail: '🤖', title: 'IA generativa transforma processos de contratação', source: 'InfoQ', time: '5h' },
  { thumbnail: '💼', title: 'Salários de desenvolvedores React batem recorde', source: 'Glassdoor', time: '1d' },
  { thumbnail: '🚀', title: 'Startups brasileiras abrem 8 mil vagas em TI', source: 'Startups.com.br', time: '2d' },
]

// Jobs seen in the session (simulates LinkedIn's "Visualizado")
const viewedSet = new Set<string>()

export default function JobsPage() {
  const { message } = useAntApp()
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 20 })
  const [sort, setSort] = useState<SortOption>('relevant')
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadJobs = useCallback(
    async (f: JobFilters) => {
      setLoading(true)
      try {
        const res = await fetchJobs(f)
        setJobs(res.jobs)
        setTotal(res.total)
        setSelectedJob((prev) => {
          if (!prev) return res.jobs[0] ?? null
          const updated = res.jobs.find((j) => j._id === prev._id)
          return updated ?? res.jobs[0] ?? null
        })
      } catch {
        message.error(t('jobs.loadError'))
      } finally {
        setLoading(false)
      }
    },
    [message, t],
  )

  useEffect(() => {
    loadJobs(filters)
  }, [filters, loadJobs])

  function handleFilterChange(key: keyof JobFilters, value: string | string[] | number | undefined) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    if (typeof value === 'string') {
      debounceRef.current = setTimeout(() => loadJobs(newFilters), 400)
    }
  }

  function handleJobClick(job: Job) {
    viewedSet.add(job._id)
    setSelectedJob(job)
    if (isMobile) setMobileDetailOpen(true)
  }

  function handleApply(job: Job) {
    if (job.url) {
      window.open(job.url, '_blank')
    } else {
      message.info(t('jobs.applyJob'))
    }
  }

  function handleDismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]))
    if (selectedJob?._id === id) {
      const next = jobs.find((j) => j._id !== id && !dismissed.has(j._id))
      setSelectedJob(next ?? null)
    }
  }

  function handleTailor(job: Job) {
    navigate(`/tailor/${job._id}`)
  }

  function handlePageChange(page: number) {
    const newF = { ...filters, page }
    setFilters(newF)
    loadJobs(newF)
  }

  const visibleJobs = jobs.filter((j) => !dismissed.has(j._id))

  // ── Left panel ──────────────────────────────────────────────────────────
  const leftPanel = (
    <div className={styles.leftPanel}>
      <div className={styles.leftPanelHeader}>
        <p className={styles.leftPanelTitle}>Vagas para você</p>
        <p className={styles.leftPanelSubtitle}>Com base no seu perfil e candidaturas recentes</p>
      </div>

      <div className={styles.countRow}>
        <p className={styles.countText}>
          <span className={styles.countBold}>{total}</span>{' '}
          {t('jobs.jobsFound', { count: total }).replace(String(total), '').trim()}
        </p>
        <SortDropdown value={sort} onChange={(v) => { setSort(v); handleFilterChange('sort', v) }} />
      </div>

      <div className={styles.jobListScroll}>
        {loading ? (
          <div className={styles.spinWrapper}>
            <Spin />
          </div>
        ) : visibleJobs.length === 0 ? (
          <Empty description={t('jobs.noJobs')} style={{ padding: Spacing.xxl }} />
        ) : (
          visibleJobs.map((job, i) => (
            <JobListItem
              key={job._id}
              job={job}
              isSelected={selectedJob?._id === job._id}
              isViewed={viewedSet.has(job._id)}
              isHot={i < 3}
              onClick={handleJobClick}
              onDismiss={handleDismiss}
            />
          ))
        )}
        {total > (filters.limit ?? 20) && (
          <DSPagination
            simple
            current={filters.page}
            pageSize={filters.limit ?? 20}
            total={total}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )

  // ── Center panel ────────────────────────────────────────────────────────
  const centerPanel = selectedJob ? (
    <div className={styles.centerScroll}>
      <JobDetailPanel
        job={selectedJob}
        onApply={handleApply}
        onTailor={handleTailor}
      />
    </div>
  ) : (
    <div className={styles.emptyDetail}>
      <span style={{ fontSize: '3.6rem' }}>💼</span>
      <p style={{ margin: 0, fontSize: '1.4rem', color: Colors.textSub }}>
        Selecione uma vaga para ver os detalhes
      </p>
    </div>
  )

  // ── Right panel ─────────────────────────────────────────────────────────
  const rightPanel = (
    <div className={styles.rightPanelWrapper}>
      {user && (
        <ProfileCard
          user={user}
          completionPercent={72}
          applications={47}
          interviews={12}
          offers={3}
          onViewProfile={() => navigate('/cv')}
        />
      )}
      <JobAlertsCard alerts={MOCK_ALERTS} />
      <IndustryNewsCard news={MOCK_NEWS} />
    </div>
  )

  // ── Mobile ──────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div className={styles.mobilePadding}>
          {visibleJobs.map((job, i) => (
            <JobListItem
              key={job._id}
              job={job}
              isSelected={selectedJob?._id === job._id}
              isViewed={viewedSet.has(job._id)}
              isHot={i < 3}
              onClick={handleJobClick}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
        <Modal
          open={mobileDetailOpen}
          onCancel={() => setMobileDetailOpen(false)}
          width="100vw"
          style={{ top: 0, margin: 0, maxWidth: '100vw', padding: 0 }}
          styles={{ content: { borderRadius: 0, padding: 0, minHeight: '100vh' }, body: { padding: 0 } }}
          footer={null}
          closable={false}
          destroyOnClose
        >
          <div className={styles.mobileModalHeader(Colors.white, Colors.surfaceBorder)}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setMobileDetailOpen(false)} style={{ fontWeight: 500 }}>
              {t('common.back')}
            </Button>
          </div>
          <div className={styles.mobileModalBody}>
            {selectedJob && (
              <JobDetailPanel
                job={selectedJob}
                onApply={handleApply}
                onTailor={handleTailor}
              />
            )}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <PageLayout
      variant="linkedin"
      left={leftPanel}
      center={centerPanel}
      right={rightPanel}
    />
  )
}
