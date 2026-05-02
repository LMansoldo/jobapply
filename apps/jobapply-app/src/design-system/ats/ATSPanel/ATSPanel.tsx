import { useTranslation } from 'react-i18next'
import { ScoreRing } from '../../primitives/ScoreRing'
import { ProgressBar } from '../../primitives/ProgressBar'
import { KeywordItem } from '../KeywordItem'
import type { ATSPanelProps } from './ATSPanel.types'
import { styles } from './ATSPanel.styles'

export function ATSPanel({ score, categories = [], keywords = [] }: ATSPanelProps) {
  const { t } = useTranslation()

  return (
    <div style={styles.panel}>
      <div style={styles.scoreCenter}>
        <ScoreRing value={score} size={120} label={t('ats.score')} sublabel="/100" />
      </div>

      {categories.length > 0 && (
        <div>
          <p style={styles.sectionTitle}>{t('ats.breakdown')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categories.map((cat) => (
              <ProgressBar key={cat.name} value={cat.value} label={cat.name} />
            ))}
          </div>
        </div>
      )}

      {keywords.length > 0 && (
        <>
          <div style={styles.divider} />
          <div>
            <p style={styles.sectionTitle}>{t('ats.keywords')}</p>
            <div style={styles.keywordList}>
              {keywords.map((kw) => (
                <KeywordItem key={kw.keyword} keyword={kw.keyword} status={kw.status} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
