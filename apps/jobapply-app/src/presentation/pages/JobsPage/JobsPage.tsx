/**
 * @file JobsPage.tsx
 * @description Jobs listing page — LinkedIn-style layout:
 *   Top: JobsHero (search + location)
 *   Left: scrollable compact job list with pagination
 *   Center: full job detail + apply/tailor actions
 */
import { useState, useEffect } from 'react'
import { Grid } from '../../../components/Grid'
import { ArrowLeftOutlined, FileSearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { useAntApp } from '../../../components/AntApp'
import { Button } from '../../../components/Button'
import { Empty } from '../../../components/Empty'
import { Modal } from '../../../components/Modal'
import { Spin } from '../../../components/Spin'
import { JobListItem } from '../../../design-system/jobs/JobListItem'
import { JobDetailPanel } from '../../../design-system/jobs/JobDetailPanel'
import { JobsHero } from '../../../design-system/jobs/JobsHero'
import { JobFilterBar } from '../../../domain/jobs/components/JobFilterBar'
import type { Job } from '../../../domain/jobs/types'
import { PageLayout } from '../../../design-system/layout/PageLayout'
import { DSPagination } from '../../../design-system/navigation/DSPagination'
import { useJobsList } from '../../../domain/jobs/hooks/useJobsList'
import * as styles from './JobsPage.styles'

const { useBreakpoint } = Grid

const viewedSet = new Set<string>()

export default function JobsPage() {
  const { message } = useAntApp()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const {
    jobs,
    total,
    loading,
    filters,
    search,
    dismissed,
    handleFilterChange,
    handleSearchChange,
    handlePageChange,
    handleDismiss: dismissFromHook,
  } = useJobsList(() => message.error(t('jobs.loadError')))

  // Seleciona a primeira vaga não descartada quando a lista é carregada
  useEffect(() => {
    if (!loading && jobs.length > 0 && !selectedJob) {
      const firstNonDismissed = jobs.find(job => !dismissed.has(job._id))
      if (firstNonDismissed) {
        viewedSet.add(firstNonDismissed._id)
        setSelectedJob(firstNonDismissed)
      }
    }
  }, [loading, jobs, dismissed, selectedJob])

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
    dismissFromHook(id)
    if (selectedJob?._id === id) {
      // Cria um novo conjunto com a vaga descartada
      const newDismissed = new Set([...dismissed, id])
      const next = jobs.find((j) => j._id !== id && !newDismissed.has(j._id))
      setSelectedJob(next ?? null)
    }
  }

  function handleTailor(job: Job) {
    navigate({ to: '/tailoring/$jobId', params: { jobId: job._id } })
  }

  const visibleJobs = jobs.filter((j) => !dismissed.has(j._id))

  // ── Hero ─────────────────────────────────────────────────────────────────
  const topBar = (
    <JobsHero
      search={search}
      onSearchChange={handleSearchChange}
    />
  )

  // ── Left panel ──────────────────────────────────────────────────────────
  const leftPanel = (
    <div className={styles.leftPanel}>
      <div className={styles.countRow}>
        <p className={styles.countText}>
          <span className={styles.countBold}>{total}</span>{' '}
          {t('jobs.jobsFound', { count: total }).replace(String(total), '').trim()}
        </p>
      </div>

      <div className={styles.jobListScroll}>
        {loading ? (
          <div className={styles.spinWrapper}>
            <Spin />
          </div>
        ) : visibleJobs.length === 0 ? (
          <div className={styles.emptyWrapper}><Empty description={t('jobs.noJobs')} /></div>
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
      </div>
      {total > 20 && (
        <div className={styles.paginationContainer}>
          <DSPagination
            current={filters.page ?? 1}
            pageSize={20}
            total={total}
            onChange={(page) => handlePageChange(page)}
          />
        </div>
      )}
    </div>
  )

  // ── Center panel ────────────────────────────────────────────────────────
  const centerPanel = selectedJob ? (
    <styles.CenterPanel>
      <JobDetailPanel
        job={selectedJob}
        onApply={handleApply}
        onTailor={handleTailor}
      />
    </styles.CenterPanel>
  ) : (
    <styles.CenterPanel>
      <div className={styles.emptyDetail}>
        <FileSearchOutlined className={styles.emptyIcon} />
        <p className={styles.emptyText}>{t('jobs.selectJobHint')}</p>
      </div>
    </styles.CenterPanel>
  )

  // ── Right panel ─────────────────────────────────────────────────────────
  const rightPanel = (
    <JobFilterBar
      filters={filters}
      onFilterChange={handleFilterChange}
      onReload={() => {
        // Trigger a refetch by resetting to page 1
        handlePageChange(1)
      }}
    />
  )

  // ── Mobile ──────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {topBar}
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
          style={styles.mobileModalStyle}
          styles={styles.mobileModalStyles}
          footer={null}
          closable={false}
        >
          <div className={styles.mobileModalHeader}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setMobileDetailOpen(false)} className={styles.backBtnText}>
              {t('common.back')}
            </Button>
          </div>
          <div className={styles.mobileModalBody}>
            {selectedJob && (
              <JobDetailPanel
                job={selectedJob}
                onApply={handleApply}
                onTailor={handleTailor}
                showHeader={false}
              />
            )}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <div>
      {topBar}
      <PageLayout
        variant="linkedin"
        left={leftPanel}
        center={centerPanel}
        right={rightPanel}
      />
    </div>
  )
}
