import { useTranslation } from 'react-i18next'
import { JobContextBar } from '../../../domain/jobs/components/JobContextBar'
import type { TailoringContextBarProps } from './TailoringContextBar.types'
import * as S from './TailoringContextBar.styles'

export function TailoringContextBar({
  job,
  manualDescription,
  isAnalysisRunning,
  onBack,
  lang = 'pt-BR',
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
      {job ? (
        <JobContextBar job={job} lang={lang} onBack={onBack} />
      ) : (
        <div className={S.manualModeInfo}>
          <span className={S.manualModeTitle}>{t('tailoring.manualModeTitle')}</span>
          {manualDescription && (
            <span className={S.manualModeDesc}>
              {manualDescription.length > 80
                ? `${manualDescription.slice(0, 80)}…`
                : manualDescription}
            </span>
          )}
        </div>
      )}
      <div className={S.analysisStatus}>
        <span className={dotClass} />
        <span className={labelClass}>{statusLabel}</span>
      </div>
    </div>
  )
}
