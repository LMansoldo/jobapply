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

  const statusLabel = isAnalysisRunning
    ? t('tailoring.analysisRunning')
    : t('tailoring.manualMode')

  return (
    <S.ContextBar>
      {onNewAnalysis && (
        <S.BackBtn type="button" onClick={onNewAnalysis}>
          <ReloadOutlined />
          {t('tailoring.newAnalysis')}
        </S.BackBtn>
      )}
      <S.JobRow>
        <ManualModeInfo manualDescription={manualDescription} />
        {currentScore > 0 && <ATSScoreBadge score={currentScore} />}
      </S.JobRow>
      <S.AnalysisStatus>
        <S.AnalysisDot $running={isAnalysisRunning} />
        <S.AnalysisLabel $running={isAnalysisRunning}>{statusLabel}</S.AnalysisLabel>
      </S.AnalysisStatus>
    </S.ContextBar>
  )
}
