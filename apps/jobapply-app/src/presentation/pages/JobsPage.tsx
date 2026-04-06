/**
 * @file JobsPage.tsx
 * @description Jobs listing page. Orchestrates state and layout for the job search feature.
 * Sub-components live in src/domain/jobs/components/.
 */
import { useEffect, useState, useRef, useCallback } from 'react'
import { Grid } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAntApp } from '../../components/AntApp'
import { Button } from '../../components/Button'
import { Empty } from '../../components/Empty'
import { Modal } from '../../components/Modal'
import { Pagination } from '../../components/Pagination'
import { Spin } from '../../components/Spin'
import { JobCard } from '../../domain/jobs/components/JobCard'
import { JobDetail } from '../../domain/jobs/components/JobDetail'
import { JobFilterBar } from '../../domain/jobs/components/JobFilterBar'
import type { Job, JobFilters } from '../../domain/jobs/types'
import { fetchJobs, deleteJob, tailorJobDescription } from '../../infrastructure/repositories/jobsRepository'
import { Colors } from '../../styles/theme/colors'
import { Spacing } from '../../styles/theme/spacing'
import { FontSize } from '../../styles/theme/typography'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

const { useBreakpoint } = Grid

/** Shared style for container panels */
const panelStyle: React.CSSProperties = {
  background: Colors.white,
  borderRadius: Spacing.sm,
  border: `${Spacing.px} solid ${Colors.borderCard}`,
  boxShadow: `0 1px 4px ${Colors.shadowXs}`,
}

/**
 * Jobs page — shows a filterable, paginated list of job applications.
 * On desktop: split view (list + detail). On mobile: list + modal detail.
 */
export default function JobsPage() {
  const { message } = useAntApp()
  const { t } = useTranslation()
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

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** Fetches jobs from the repository applying current filters. */
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

  /**
   * Handles filter field changes with debounce for text inputs.
   * @param key - Filter key to update
   * @param value - New filter value
   */
  function handleFilterChange(key: keyof JobFilters, value: string | number | undefined) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    if (typeof value === 'string') {
      debounceRef.current = setTimeout(() => loadJobs(newFilters), 400)
    }
  }

  /**
   * Selects a job and opens the detail view.
   * @param job - The job to display
   */
  function handleJobClick(job: Job) {
    setSelectedJob(job)
    if (isMobile) setMobileDetailOpen(true)
  }

  /**
   * Triggers AI tailoring for a job description.
   * @param job - Job to tailor
   */
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

  /**
   * Deletes a job by ID.
   * @param id - Job ID to delete
   */
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

  /** Pagination change handler — updates filter page and reloads. */
  function handlePageChange(page: number) {
    const newF = { ...filters, page }
    setFilters(newF)
    loadJobs(newF)
  }

  const jobCountLabel = `${total} ${t('jobs.jobsFound', 'vagas encontradas')}`

  const jobList = (
    <>
      <div style={{ padding: `${Spacing.md0} ${Spacing.md}`, borderBottom: `${Spacing.px} solid ${Colors.borderCard}`, fontSize: FontSize.md0, color: Colors.textPlaceholder }}>
        {jobCountLabel}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: Spacing.xxl }}>
            <Spin />
          </div>
        ) : jobs.length === 0 ? (
          <Empty description={t('jobs.noJobs')} style={{ paddingTop: Spacing.xxl }} />
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isSelected={!isMobile && selectedJob?._id === job._id}
              onClick={handleJobClick}
            />
          ))
        )}
      </div>
      {total > (filters.limit ?? 20) && (
        <div style={{ borderTop: `${Spacing.px} solid ${Colors.borderCard}`, padding: `${Spacing.md0} ${Spacing.md}`, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            simple
            current={filters.page}
            pageSize={filters.limit ?? 20}
            total={total}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  )

  return (
    <>
      <JobFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReload={() => loadJobs(filters)}
      />

      {/* Desktop: split layout */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: Spacing.md1, height: 'calc(100vh - 19rem)', minHeight: '50rem' }}>
          <div style={{ ...panelStyle, width: Spacing.sidebarWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {jobList}
          </div>
          <div style={{ ...panelStyle, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {selectedJob ? (
              <JobDetail
                job={selectedJob}
                deletingId={deletingId}
                tailoringId={tailoringId}
                onDelete={handleDelete}
                onTailor={handleTailor}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Empty description={t('jobs.selectJob', 'Selecione uma vaga para ver os detalhes')} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile: full-width list */}
      {isMobile && (
        <div style={{ ...panelStyle, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: Spacing.xxl }}>
              <Spin />
            </div>
          ) : (
            jobList
          )}
        </div>
      )}

      {/* Mobile: fullscreen detail modal */}
      <Modal
        open={isMobile && mobileDetailOpen}
        onCancel={() => setMobileDetailOpen(false)}
        width="100vw"
        style={{ top: 0, margin: 0, maxWidth: '100vw', padding: 0 }}
        styles={{
          content: { borderRadius: 0, padding: 0, minHeight: '100vh' },
          body: { padding: 0 },
        }}
        footer={null}
        closable={false}
        destroyOnClose
      >
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: Colors.white, borderBottom: `${Spacing.px} solid ${Colors.borderCard}`, padding: `${Spacing.sm} ${Spacing.md}` }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setMobileDetailOpen(false)} style={{ fontWeight: 500 }}>
            {t('common.back')}
          </Button>
        </div>
        <div style={{ overflowY: 'auto', maxHeight: `calc(100vh - ${Spacing.headerHeight})` }}>
          {selectedJob && (
            <JobDetail
              job={selectedJob}
              deletingId={deletingId}
              tailoringId={tailoringId}
              onDelete={handleDelete}
              onTailor={handleTailor}
            />
          )}
        </div>
      </Modal>
    </>
  )
}
