/**
 * @file JobsPage.tsx
 * @description Jobs listing page matching mockup — hero + 3-col layout.
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
import { JobCard } from '../../domain/jobs/components/JobCard'
import { JobFilterBar } from '../../domain/jobs/components/JobFilterBar'
import type { Job, JobFilters } from '../../domain/jobs/types'
import { fetchJobs, deleteJob } from '../../infrastructure/repositories/jobsRepository'
import { PageLayout } from '../../design-system/layout/PageLayout'
import { HeroSection } from '../../design-system/jobs/HeroSection'
import { ProfileCard } from '../../design-system/jobs/ProfileCard'
import { JobAlertsCard } from '../../design-system/jobs/JobAlertsCard'
import { IndustryNewsCard } from '../../design-system/jobs/IndustryNewsCard'
import { SortDropdown } from '../../design-system/jobs/SortDropdown'
import type { SortOption } from '../../design-system/jobs/SortDropdown'
import { DSPagination } from '../../design-system/navigation/DSPagination'
import { useAuth } from '../../application/providers/AuthProvider'
import { Colors } from '../../styles/theme/colors'
import { Spacing } from '../../styles/theme/spacing'
import { FontFamily, FontWeight } from '../../styles/theme/typography'
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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 20 })
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [sort, setSort] = useState<SortOption>('relevant')

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

  function handleHeroSearch() {
    const newF = { ...filters, title: keyword, location, page: 1 }
    setFilters(newF)
    loadJobs(newF)
  }

  function handleChipClick(chip: string) {
    setKeyword(chip)
    const newF = { ...filters, title: chip, page: 1 }
    setFilters(newF)
    loadJobs(newF)
  }

  function handleJobClick(job: Job) {
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

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteJob(id)
      message.success(t('jobs.deleteSuccess'))
      setJobs((prev) => {
        const next = prev.filter((j) => j._id !== id)
        if (selectedJob?._id === id) {
          setSelectedJob(next[0] ?? null)
          setMobileDetailOpen(false)
        }
        return next
      })
      setTotal((n) => n - 1)
    } catch {
      message.error(t('jobs.deleteError'))
    } finally {
      setDeletingId(null)
    }
  }

  void handleDelete // used via detail panel

  function handlePageChange(page: number) {
    const newF = { ...filters, page }
    setFilters(newF)
    loadJobs(newF)
  }

  const jobCountRow = (
    <div className={styles.jobCountRow}>
      <p className={styles.jobCountText}>
        <span className={styles.jobCountNumber}>{total}</span>{' '}
        {t('jobs.jobsFound', { count: total }).replace(String(total), '').trim()}
      </p>
      <SortDropdown value={sort} onChange={(v) => { setSort(v); handleFilterChange('sort', v) }} />
    </div>
  )

  const jobListCenter = (
    <div className={styles.jobListWrapper}>
      {jobCountRow}
      <div className={styles.panelWithOverflow}>
        {loading ? (
          <div className={styles.spinWrapper}>
            <Spin />
          </div>
        ) : jobs.length === 0 ? (
          <Empty description={t('jobs.noJobs')} style={{ padding: Spacing.xxl }} />
        ) : (
          <div className={styles.jobCardsWrapper}>
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSelected={!isMobile && selectedJob?._id === job._id}
                onClick={handleJobClick}
                onApply={handleApply}
              />
            ))}
          </div>
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

  const hero = (
    <HeroSection
      keywordValue={keyword}
      locationValue={location}
      onKeywordChange={setKeyword}
      onLocationChange={setLocation}
      onSearch={handleHeroSearch}
      onChipClick={handleChipClick}
    />
  )

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

  if (isMobile) {
    return (
      <>
        {hero}
        <div className={styles.mobilePadding}>
          <JobFilterBar filters={filters} onFilterChange={handleFilterChange} onReload={() => loadJobs(filters)} />
          {jobListCenter}
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
              <div>
                <h3 className={styles.mobileJobTitle}>{selectedJob.title}</h3>
                <p className={styles.mobileJobCompany}>{selectedJob.company}</p>
                <p className={styles.mobileJobDescription}>{selectedJob.description}</p>
              </div>
            )}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <>
      {hero}
      <div className={styles.heroOffset}>
        <PageLayout
          variant="jobs"
          left={<JobFilterBar filters={filters} onFilterChange={handleFilterChange} onReload={() => loadJobs(filters)} />}
          center={jobListCenter}
          right={rightPanel}
        />
      </div>
    </>
  )
}
