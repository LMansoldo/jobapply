import { useTranslation } from 'react-i18next'
import { Spin } from '../../../../design-system/wrappers/Spin'
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
      <S.SpinWrapper>
        <Spin size="large" />
        <S.LoadingText>{t('tailoring.linkedinAnalyzing')}</S.LoadingText>
      </S.SpinWrapper>
    )
  }

  if (view === 'results' && analysis) {
    return <ResultsPanel analysis={analysis} onReset={onReset} />
  }

  return <OnboardingFlow onAnalyze={onAnalyzePDF} />
}
