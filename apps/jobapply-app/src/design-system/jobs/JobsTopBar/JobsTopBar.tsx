import { BellOutlined, ReadOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Dropdown } from '../../../components/Dropdown'
import { ProgressBar } from '../../primitives/ProgressBar'
import { SortDropdown } from '../SortDropdown'
import type { JobsTopBarProps } from './JobsTopBar.types'
import * as styles from './JobsTopBar.styles'

const CONTRACT_CHIPS = [
  { key: 'clt', label: 'CLT' },
  { key: 'pj', label: 'PJ' },
  { key: 'freelance', label: 'Freelance' },
  { key: 'internship', label: 'Estágio' },
]

const MODALITY_CHIPS = [
  { key: 'remote', label: 'Remoto' },
  { key: 'hybrid', label: 'Híbrido' },
  { key: 'onsite', label: 'Presencial' },
]

export function JobsTopBar({
  user,
  completionPercent,
  applications = 47,
  interviews = 12,
  offers = 3,
  alerts,
  news,
  filters,
  sort,
  onViewProfile,
  onFilterChange,
  onSortChange,
  onNewAlert,
}: JobsTopBarProps) {
  const { t } = useTranslation()

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const activeContracts: string[] = filters.contractTypes ?? []
  const activeModalities: string[] = filters.modalities ?? []

  function toggleContract(key: string) {
    const next = activeContracts.includes(key)
      ? activeContracts.filter((k) => k !== key)
      : [...activeContracts, key]
    onFilterChange('contractTypes', next)
  }

  function toggleModality(key: string) {
    const next = activeModalities.includes(key)
      ? activeModalities.filter((k) => k !== key)
      : [...activeModalities, key]
    onFilterChange('modalities', next)
  }

  function handleClear() {
    onFilterChange('contractTypes', [])
    onFilterChange('modalities', [])
    onFilterChange('sort', undefined)
    onSortChange('relevant')
  }

  const hasActiveFilters =
    activeContracts.length > 0 || activeModalities.length > 0 || sort !== 'relevant'

  // ── Alert dropdown panel ────────────────────────────────────────────────
  const alertsPanel = (
    <div className={styles.dropPanel}>
      <div className={styles.dropPanelHeader}>
        <p className={styles.dropPanelTitle}>{t('jobs.alerts')}</p>
        <button type="button" className={styles.newAlertBtn} onClick={onNewAlert}>
          <PlusOutlined /> {t('jobs.newAlert')}
        </button>
      </div>
      <div className={styles.dropPanelBody}>
        {alerts.map((alert) => (
          <div key={alert.title} className={styles.alertItem}>
            <div className={styles.alertIcon}>{alert.icon}</div>
            <div className={styles.alertContent}>
              <p className={styles.alertTitle}>{alert.title}</p>
              <p className={styles.alertSubtitle}>{alert.subtitle}</p>
            </div>
            <span className={styles.alertBadge}>{alert.count}</span>
          </div>
        ))}
      </div>
    </div>
  )

  // ── News dropdown panel ─────────────────────────────────────────────────
  const newsPanel = (
    <div className={styles.dropPanel}>
      <div className={styles.dropPanelHeader}>
        <p className={styles.dropPanelTitle}>{t('jobs.news')}</p>
      </div>
      <div className={styles.dropPanelBody}>
        {news.map((item) => (
          <div key={item.title} className={styles.newsItem}>
            <div className={styles.newsThumbnail}>{item.thumbnail}</div>
            <div className={styles.newsContent}>
              <p className={styles.newsTitle}>{item.title}</p>
              <p className={styles.newsMeta}>{item.source} · {item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const totalAlertCount = alerts.reduce((s, a) => s + a.count, 0)

  return (
    <div className={styles.card}>
      {/* Gradient banner with dropdown menu buttons */}
      <div className={styles.banner}>
        <div className={styles.menuBtnsRow}>
          <Dropdown dropdownRender={() => alertsPanel} trigger={['click']} placement="bottomRight">
            <button type="button" className={styles.menuBtn}>
              <BellOutlined />
              {t('jobs.alerts')}
              {totalAlertCount > 0 && (
                <span className={styles.menuBtnBadge}>{totalAlertCount}</span>
              )}
              <DownOutlined style={{ fontSize: '1rem' }} />
            </button>
          </Dropdown>

          <Dropdown dropdownRender={() => newsPanel} trigger={['click']} placement="bottomRight">
            <button type="button" className={styles.menuBtn}>
              <ReadOutlined />
              {t('jobs.news')}
              <DownOutlined style={{ fontSize: '1rem' }} />
            </button>
          </Dropdown>
        </div>
      </div>

      {/* Profile body */}
      <div className={styles.body}>
        <div className={styles.profileRow}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{user.name}</p>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{applications}</span>
            <span className={styles.statLabel}>{t('profile.applications')}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>{interviews}</span>
            <span className={styles.statLabel}>{t('profile.interviews')}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>{offers}</span>
            <span className={styles.statLabel}>{t('profile.offers')}</span>
          </div>
        </div>

        {/* Progress */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span className={styles.progressLabelText}>{t('profile.completion')}</span>
            <span className={styles.progressLabelValue}>{completionPercent}%</span>
          </div>
          <ProgressBar value={completionPercent} />
        </div>

        {/* CTA */}
        <button type="button" className={styles.viewProfileBtn} onClick={onViewProfile}>
          {t('profile.viewProfile')}
        </button>
      </div>

      {/* Filter strip */}
      <div className={styles.filterStrip}>
        <SortDropdown value={sort} onChange={onSortChange} />

        <div className={styles.filterDivider} />

        {CONTRACT_CHIPS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={styles.filterChip(activeContracts.includes(c.key))}
            onClick={() => toggleContract(c.key)}
          >
            {c.label}
          </button>
        ))}

        <div className={styles.filterDivider} />

        {MODALITY_CHIPS.map((m) => (
          <button
            key={m.key}
            type="button"
            className={styles.filterChip(activeModalities.includes(m.key))}
            onClick={() => toggleModality(m.key)}
          >
            {m.label}
          </button>
        ))}

        {hasActiveFilters && (
          <button type="button" className={styles.clearBtn} onClick={handleClear}>
            {t('jobs.clear')}
          </button>
        )}
      </div>
    </div>
  )
}
