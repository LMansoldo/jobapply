import React from 'react'
import { useTranslation } from 'react-i18next'
import { Spin, Button, Typography } from 'antd'
import { useLinkedInOnboarding } from '../../hooks/useLinkedInOnboarding'
import { useLinkedInAnalysis } from '../../../domain/linkedin/hooks/useLinkedInAnalysis'
import { OnboardingFlow } from './OnboardingFlow'
import { Dashboard } from './Dashboard'
import { GenerationResults } from './GenerationResults'
import * as styles from './LinkedInOptimizerPage.styles'

const { Title } = Typography

export function LinkedInOptimizerPage() {
  const { t } = useTranslation()
  const onboarding = useLinkedInOnboarding()
  const { result, loading, error, analyze, reset } = useLinkedInAnalysis()

  async function handleSubmit() {
    const input = onboarding.buildInput()
    if (!input) return
    await analyze(input)
  }

  if (loading) {
    return (
      <styles.LoadingWrap>
        <Spin size="large" tip={t("linkedin.analyzing")} />
      </styles.LoadingWrap>
    )
  }

  if (result) {
    return (
      <styles.ResultsWrap>
        <Title level={2}>{t("linkedin.optimizerTitle")}</Title>
        <Dashboard seo={result.seo} />
        <GenerationResults generation={result.generation} />
        <Button onClick={reset}>{t("linkedin.analyzeAnother")}</Button>
      </styles.ResultsWrap>
    )
  }

  return (
    <styles.OnboardingWrap>
      {error && <styles.ErrorAlert type="error" message={error} />}
      <OnboardingFlow onboarding={onboarding} onSubmit={handleSubmit} />
    </styles.OnboardingWrap>
  )
}
