import { ReloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ManualModeInfo } from './ManualModeInfo'
import { ATSScoreBadge } from './ATSScoreBadge'
import type { TailoringContextBarProps } from './TailoringContextBar.types'
import * as S from './TailoringContextBar.styles'

export function TailoringContextBar({
  manualDescription,
  isAnalysisRunning,
  onNewAnalysis,
  currentScore = 0,
}: TailoringContextBarProps) {
  const { t } = useTranslation()

  const dotClass = isAnalysisRunning ? S.analysisDotRunning : S.analysisDot
  const labelClass = isAnalysisRunning ? S.analysisLabelRunning : S.analysisLabel
  const statusLabel = isAnalysisRunning
    ? t('tailoring.analysisRunning')
    : t('tailoring.manualMode')

  return (
    <div className={S.contextBar}>
      {onNewAnalysis && (
        <button type="button" className={S.backBtn} onClick={onNewAnalysis}>
          <ReloadOutlined />
          {t('tailoring.newAnalysis')}
        </button>
      )}
      <div className={S.jobRow}>
        <ManualModeInfo manualDescription={manualDescription} />
        {currentScore > 0 && <ATSScoreBadge score={currentScore} />}
      </div>
      <div className={S.analysisStatus}>
        <span className={dotClass} />
        <span className={labelClass}>{statusLabel}</span>
      </div>
    </div>
  )
}
