import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { JobContextBar } from '../../../domain/jobs/components/JobContextBar'
import { ManualModeInfo } from './ManualModeInfo'
import { ATSScoreBadge } from './ATSScoreBadge'
import type { TailoringContextBarProps } from './TailoringContextBar.types'
import * as S from './TailoringContextBar.styles'

export function TailoringContextBar({
  job,
  manualDescription,
  isAnalysisRunning,
  onBack,
  lang = 'pt-BR',
  currentScore = 0,
}: TailoringContextBarProps) {
  const { t } = useTranslation()

  const dotClass = isAnalysisRunning ? S.analysisDotRunning : S.analysisDot
  const labelClass = isAnalysisRunning ? S.analysisLabelRunning : S.analysisLabel
  const statusLabel = isAnalysisRunning
    ? t('tailoring.analysisRunning')
    : job
      ? t('tailoring.analysisComplete')
      : t('tailoring.manualMode')

  return (
    <div className={S.contextBar}>
      <button type="button" className={S.backBtn} onClick={onBack}>
        <ArrowLeftOutlined />
        {t('common.back')}
      </button>
      <div className={S.jobRow}>
        {job ? (
          <JobContextBar job={job} lang={lang} />
        ) : (
          <ManualModeInfo manualDescription={manualDescription} />
        )}
        {currentScore > 0 && <ATSScoreBadge score={currentScore} />}
      </div>
      <div className={S.analysisStatus}>
        <span className={dotClass} />
        <span className={labelClass}>{statusLabel}</span>
      </div>
    </div>
  )
}
