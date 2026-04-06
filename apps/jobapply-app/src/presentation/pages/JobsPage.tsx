/**
 * @file JobsPage.tsx
 * @description Jobs listing page. Orchestrates state and layout for the job search feature.
 */
import { useEffect, useState, useRef, useCallback } from 'react'
import { Grid } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../components/AntApp'
import { Button } from '../../components/Button'
import { Empty } from '../../components/Empty'
import { Modal } from '../../components/Modal'
import { Spin } from '../../components/Spin'
import { JobCard } from '../../domain/jobs/components/JobCard'
import { JobDetail } from '../../domain/jobs/components/JobDetail'
import { JobFilterBar } from '../../domain/jobs/components/JobFilterBar'
import type { Job, JobFilters } from '../../domain/jobs/types'
import { fetchJobs, deleteJob, tailorJobDescription } from '../../infrastructure/repositories/jobsRepository'
import { PageLayout } from '../../design-system/layout/PageLayout'
import { HeroSearch } from '../../design-system/jobs/HeroSearch'
import { ProfileCard } from '../../design-system/jobs/ProfileCard'
import { DSPagination } from '../../design-system/navigation/DSPagination'
import { useAuth } from '../../application/providers/AuthProvider'
import { Colors } from '../../styles/theme/colors'
import { Shadows } from '../../styles/theme/shadows'
import { BorderRadius } from '../../styles/theme/radius'
import { Spacing } from '../../styles/theme/spacing'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

const { useBreakpoint } = Grid

const panelStyle: React.CSSProperties = {
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.sm,
}

export default function JobsPage() {
  const { message } = useAntApp()
  const { t } = useTranslation()
  const { user } = useAuth()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tailoringId, setTailoringId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 20 })
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

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

  function handleFilterChange(key: keyof JobFilters, value: string | number | undefined) {
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

  function handleJobClick(job: Job) {
    setSelectedJob(job)
    if (isMobile) setMobileDetailOpen(true)
  }

  async function handleTailor(job: Job) {
    setTailoringId(job._id)
    try {
      const res = await tailorJobDescription(job._id)
      const updated = { ...job, tailoredDescription: res.tailoredDescription }
      setJobs((prev) => prev.map((j) => (j._id === job._id ? updated : j)))
      setSelectedJob((prev) => (prev?._id === job._id ? updated : prev))
      message.success(t('jobs.tailorSuccess'))
    } catch {
      message.error(t('jobs.tailorError'))
    } finally {
      setTailoringId(null)
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

  function handlePageChange(page: number) {
    const newF = { ...filters, page }
    setFilters(newF)
    loadJobs(newF)
  }

  const jobListCenter = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
      {/* Hero search */}
      <HeroSearch
        keywordValue={keyword}
        locationValue={location}
        onKeywordChange={setKeyword}
        onLocationChange={setLocation}
        onSearch={handleHeroSearch}
      />

      {/* Job list */}
      <div style={{ ...panelStyle, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: Spacing.xxl }}>
            <Spin />
          </div>
        ) : jobs.length === 0 ? (
          <Empty description={t('jobs.noJobs')} style={{ padding: Spacing.xxl }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.xs, padding: Spacing.sm }}>
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSelected={!isMobile && selectedJob?._id === job._id}
                onClick={handleJobClick}
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

  if (isMobile) {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
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
          <div style={{ position: 'sticky', top: 0, zIndex: 10, background: Colors.white, borderBottom: `1px solid ${Colors.surfaceBorder}`, padding: `${Spacing.sm} ${Spacing.md}` }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setMobileDetailOpen(false)} style={{ fontWeight: 500 }}>
              {t('common.back')}
            </Button>
          </div>
          <div style={{ overflowY: 'auto' }}>
            {selectedJob && (
              <JobDetail job={selectedJob} deletingId={deletingId} tailoringId={tailoringId} onDelete={handleDelete} onTailor={handleTailor} />
            )}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <PageLayout
      variant="jobs"
      left={
        <JobFilterBar filters={filters} onFilterChange={handleFilterChange} onReload={() => loadJobs(filters)} />
      }
      center={jobListCenter}
      right={
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          {user && <ProfileCard user={user} completionPercent={72} />}
          {selectedJob && (
            <div style={{ ...panelStyle, overflow: 'hidden' }}>
              <JobDetail job={selectedJob} deletingId={deletingId} tailoringId={tailoringId} onDelete={handleDelete} onTailor={handleTailor} />
            </div>
          )}
          {!selectedJob && (
            <Empty description={t('jobs.selectJob', 'Selecione uma vaga')} style={{ background: Colors.white, borderRadius: BorderRadius.base, padding: Spacing.xl }} />
          )}
        </div>
      }
    />
  )
}
