import { useTranslation } from 'react-i18next'
import { FileTextOutlined, CopyOutlined } from '@ant-design/icons'
import { ATSPanel } from '../../ats/ATSPanel'
import type { ExportPanelProps } from './ExportPanel.types'
import * as styles from './ExportPanel.styles'

export function ExportPanel({
  atsScore,
  atsCategories,
  currentScore,
  projectedScore,
  scoreDelta,
  onDownloadPDF,
  onExportMarkdown,
  onSaveAsVersion,
}: ExportPanelProps) {
  const { t } = useTranslation()

  return (
    <styles.PanelRoot>
      <styles.ScoreRow>
        <styles.ScoreText>
          {t('tailoring.scoreWithSuggestions')}: <strong>{currentScore} → {projectedScore} pts</strong>
        </styles.ScoreText>
        <styles.ScoreBadge>
          +{scoreDelta} pts
        </styles.ScoreBadge>
      </styles.ScoreRow>

      <styles.ScrollableContent>
        <ATSPanel score={atsScore} categories={atsCategories} keywords={[]} />
      </styles.ScrollableContent>

      <styles.ExportSection>
        <styles.ExportLabel>{t('tailoring.exportOptimized')}</styles.ExportLabel>
        <styles.ExportBtn primary onClick={onDownloadPDF}>
          <FileTextOutlined /> {t('tailoring.downloadPDF')}
        </styles.ExportBtn>
        <styles.ExportBtn onClick={onExportMarkdown}>
          <FileTextOutlined /> {t('tailoring.exportMarkdown')}
        </styles.ExportBtn>
        <styles.ExportBtn onClick={onSaveAsVersion}>
          <CopyOutlined /> {t('tailoring.saveAsVersion')}
        </styles.ExportBtn>
      </styles.ExportSection>
    </styles.PanelRoot>
  )
}
