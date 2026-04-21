import { useTranslation } from 'react-i18next'
import { Spin } from '../../../components/Spin'
import { OnboardingFlow } from './onboarding/OnboardingFlow'
import { ResultsPanel } from './panels/ResultsPanel'
import type { LinkedInWorkspaceProps } from './LinkedInWorkspace.types'
import * as S from './LinkedInWorkspace.styles'

export function LinkedInWorkspace({
  view,
  analysis,
  loading,
  onAnalyzePDF,
  onReset,
}: LinkedInWorkspaceProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className={S.spinWrapper}>
        <Spin size="large" />
        <p className={S.loadingText}>{t('tailoring.linkedinAnalyzing')}</p>
      </div>
    )
  }

  if (view === 'results' && analysis) {
    return <ResultsPanel analysis={analysis} onReset={onReset} />
  }

  return <OnboardingFlow onAnalyze={onAnalyzePDF} />
}
