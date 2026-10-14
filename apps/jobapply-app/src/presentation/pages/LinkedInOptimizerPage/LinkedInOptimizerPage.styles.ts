import styled from '@emotion/styled'
import type { FC } from 'react'
import { Steps, Space, Alert, Card, List, Typography } from 'antd'
import type { ListProps } from 'antd'
import { Spacing } from '../../../styles/theme/spacing'

const { Paragraph } = Typography

const StringList = List as unknown as FC<ListProps<string>>

// LinkedInOptimizerPage
export const LoadingWrap = styled.div`
  text-align: center;
  padding: ${Spacing.xxxl};
`

export const ResultsWrap = styled.div`
  max-width: 90rem;
  margin: 0 auto;
  padding: ${Spacing.lg} ${Spacing.md};
`

export const OnboardingWrap = styled.div`
  max-width: 70rem;
  margin: 0 auto;
  padding: ${Spacing.lg} ${Spacing.md};
`

export const ErrorAlert = styled(Alert)`
  margin-bottom: ${Spacing.md};
`

// OnboardingFlow
export const OnboardingSteps = styled(Steps)`
  margin-bottom: ${Spacing.xl};
`

export const FullWidthSpace = styled(Space)`
  width: 100%;
`

export const TagRowSpace = styled(Space)`
  margin-bottom: ${Spacing.md};
`

// GenerationResults
export const ResultCard = styled(Card)`
  margin-bottom: ${Spacing.md};
`

export const IssueList = styled(StringList)`
  margin-bottom: ${Spacing.md};
`

export const PreWrapParagraph = styled(Paragraph)`
  white-space: pre-wrap;
`

export const GapItem = styled.div`
  margin-bottom: ${Spacing.md};
`

// Dashboard
export const DashboardWrap = styled.div`
  margin-bottom: ${Spacing.xl};
`

export const SectionCard = styled(Card)`
  margin-top: ${Spacing.md};
`

export const DimensionRow = styled.div`
  margin-bottom: ${Spacing.sm};
`
