import { useState } from 'react'
import {
  ShareAltOutlined,
  EllipsisOutlined,
  BookOutlined,
  BookFilled,
  ExportOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { CompanyLogo } from '../CompanyLogo'
import type { JobDetailPanelProps } from './JobDetailPanel.types'
import * as styles from './JobDetailPanel.styles'

const MODALITY_LABEL: Record<string, string> = {
  remote: 'Remoto',
  hybrid: 'Híbrido',
  onsite: 'Presencial',
}

const CONTRACT_LABEL: Record<string, string> = {
  clt: 'CLT',
  pj: 'PJ',
  freelance: 'Freelance',
  internship: 'Estágio',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `Há ${days} dias`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `Há ${weeks} semana${weeks > 1 ? 's' : ''}`
  const months = Math.floor(days / 30)
  return `Há ${months} ${months > 1 ? 'meses' : 'mês'}`
}

export function JobDetailPanel({ job, onApply, onSave, onTailor, showHeader = true }: JobDetailPanelProps) {
  const { t } = useTranslation()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved((s) => !s)
    onSave?.(job)
  }

  function handleApply() {
    if (job.url) window.open(job.url, '_blank')
    onApply?.(job)
  }

  return (
    <div className={styles.panel}>
      {/* Header */}
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <CompanyLogo name={job.company} size={48} />
            <p className={styles.companyName}>{job.company}</p>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className={styles.iconBtn} aria-label="Compartilhar">
              <ShareAltOutlined />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Mais opções">
              <EllipsisOutlined />
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className={styles.body}>
        {/* Title */}
        <h1 className={styles.jobTitle}>{job.title}</h1>

        {/* Meta */}
        <p className={styles.jobMeta}>
          {job.location && <span>{job.location}</span>}
          {job.location && <span className={styles.metaDot}>·</span>}
          <span>{timeAgo(job.createdAt)}</span>
          <span className={styles.metaDot}>·</span>
          <span>Mais de 100 pessoas clicaram em Candidatar-se</span>
        </p>

        {/* Tags row */}
        {(job.modality || job.contractType) && (
          <div className={styles.tagRow}>
            {job.modality && (
              <span className={styles.tagPill}>
                <CheckCircleOutlined className={styles.tagPillCheck} />
                {MODALITY_LABEL[job.modality] ?? job.modality}
              </span>
            )}
            {job.contractType && (
              <span className={styles.tagPill}>
                <CheckCircleOutlined className={styles.tagPillCheck} />
                {CONTRACT_LABEL[job.contractType] ?? job.contractType}
              </span>
            )}
            {job.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={styles.tagPill}>{tag}</span>
            ))}
          </div>
        )}

        {/* Salary */}
        {job.salary && (
          <div className={styles.salary}>
            <DollarOutlined />
            {job.salary}
          </div>
        )}

        {/* Action buttons */}
        <div className={styles.actionsRow}>
          <button type="button" className={styles.applyBtn} onClick={handleApply}>
            {t('jobs.apply')} <ExportOutlined />
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            {saved ? <BookFilled /> : <BookOutlined />}
            {saved ? 'Salvo' : 'Salvar'}
          </button>
        </div>

        {/* Tailor CTA */}
        {onTailor && (
          <button type="button" className={styles.tailorBtn} onClick={() => onTailor(job)}>
            <ThunderboltOutlined />
            ✨ {t('tailoring.tailorWithAI', 'Tailoring com IA — adapte seu CV para esta vaga')}
          </button>
        )}

        <div className={styles.divider} />

        {/* Description */}
        <h2 className={styles.sectionTitle}>Sobre a vaga</h2>
        <p className={styles.descriptionText}>{job.description}</p>

        {/* Tags list */}
        {job.tags.length > 0 && (
          <>
            <div className={styles.dividerWithTopMargin} />
            <h2 className={styles.sectionTitle}>Competências</h2>
            <div className={styles.tagRow}>
              {job.tags.map((tag) => (
                <span key={tag} className={styles.tagPill}>{tag}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
