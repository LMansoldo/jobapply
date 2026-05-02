import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { LinkedinOutlined } from '@ant-design/icons'
import { useAntApp } from '../../../components/AntApp'
import { LinkedInWorkspace } from '../../../design-system/tailoring/LinkedInWorkspace'
import { useLinkedInAnalysis } from '../../../domain/linkedin/hooks/useLinkedInAnalysis'
import * as styles from './LinkedInPage.styles'

export default function LinkedInPage() {
  const { t } = useTranslation()
  const { message } = useAntApp()

  const handleError = useCallback((key: string) => message.error(t(key)), [message, t])
  const linkedin = useLinkedInAnalysis({ onError: handleError })

  return (
    <div className={styles.pageRoot}>
      <div className={styles.pageHeader}>
        <div className={styles.headerBrand}>
          <LinkedinOutlined className={styles.brandIcon} />
          <span className={styles.brandTitle}>{t('nav.linkedin')}</span>
        </div>
        {linkedin.view === 'results' && linkedin.analysis && (
          <span className={styles.scoreChip}>
            Score: {linkedin.analysis.overallScore.score}/10
          </span>
        )}
      </div>
      <div className={styles.content}>
        <LinkedInWorkspace
          view={linkedin.view}
          analysis={linkedin.analysis}
          loading={linkedin.loading}
          onAnalyzePDF={linkedin.handleAnalyzePDF}
          onReset={linkedin.handleReset}
        />
      </div>
    </div>
  )
}
