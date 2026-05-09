import React from 'react'
import { Spin, Alert, Button, Typography } from 'antd'
import { useLinkedInOnboarding } from '../../../domain/linkedin/hooks/useLinkedInOnboarding'
import { useLinkedInAnalysis } from '../../../domain/linkedin/hooks/useLinkedInAnalysis'
import { OnboardingFlow } from './OnboardingFlow'
import { Dashboard } from './Dashboard'
import { GenerationResults } from './GenerationResults'

const { Title } = Typography

export function LinkedInOptimizerPage() {
  const onboarding = useLinkedInOnboarding()
  const { result, loading, error, analyze, reset } = useLinkedInAnalysis()

  async function handleSubmit() {
    const input = onboarding.buildInput()
    if (!input) return
    await analyze(input)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" tip="Analyzing your profile..." />
      </div>
    )
  }

  if (result) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <Title level={2}>LinkedIn Optimizer</Title>
        <Dashboard seo={result.seo} />
        <GenerationResults generation={result.generation} />
        <Button onClick={reset}>Analyze another profile</Button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <OnboardingFlow onboarding={onboarding} onSubmit={handleSubmit} />
    </div>
  )
}
