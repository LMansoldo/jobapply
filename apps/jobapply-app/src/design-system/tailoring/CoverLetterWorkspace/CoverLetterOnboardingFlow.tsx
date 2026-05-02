import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { VoiceAnswers } from '../../../domain/linkedin/types'
import { VoiceStep, type VoiceStepConfig } from '../LinkedInWorkspace/onboarding/VoiceStep'
import * as S from './CoverLetterOnboardingFlow.styles'

interface CoverLetterOnboardingFlowProps {
  onComplete: (answers: VoiceAnswers) => void
}

const TOTAL_STEPS = 3

const VOICE_STEPS: VoiceStepConfig[] = [
  {
    headlineKey: 'tailoring.coverOnboarding.whyThisRoleHeadline',
    subtextKey: 'tailoring.coverOnboarding.whyThisRoleSubtext',
    placeholderKey: 'tailoring.coverOnboarding.whyThisRolePlaceholder',
    skipWarningKey: 'tailoring.coverOnboarding.whyThisRoleSkipWarning',
  },
  {
    headlineKey: 'tailoring.coverOnboarding.bestResultHeadline',
    subtextKey: 'tailoring.coverOnboarding.bestResultSubtext',
    placeholderKey: 'tailoring.coverOnboarding.bestResultPlaceholder',
    skipWarningKey: 'tailoring.coverOnboarding.bestResultSkipWarning',
  },
  {
    headlineKey: 'tailoring.coverOnboarding.oneThingHeadline',
    subtextKey: 'tailoring.coverOnboarding.oneThingSubtext',
    placeholderKey: 'tailoring.coverOnboarding.oneThingPlaceholder',
    skipWarningKey: 'tailoring.coverOnboarding.oneThingSkipWarning',
  },
]

export function CoverLetterOnboardingFlow({ onComplete }: CoverLetterOnboardingFlowProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<VoiceAnswers>([])

  function handleNext(config: VoiceStepConfig, value?: string) {
    const next = value
      ? [...answers, { label: t(config.headlineKey), answer: value }]
      : answers

    if (step < TOTAL_STEPS) {
      setAnswers(next)
      setStep((s) => s + 1)
    } else {
      onComplete(next)
    }
  }

  const pct = ((step - 1) / TOTAL_STEPS) * 100
  const config = VOICE_STEPS[step - 1]

  return (
    <div className={S.root}>
      <div className={S.header}>
        <span className={S.label}>{t('tailoring.tabCoverLetter')}</span>
        <div className={S.stepDots}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className={i + 1 < step ? S.dotDone : i + 1 === step ? S.dotActive : S.dot}
            />
          ))}
        </div>
        <span className={S.stepCounter}>
          {t('tailoring.coverOnboarding.stepOf', { current: step, total: TOTAL_STEPS })}
        </span>
      </div>

      <div className={S.progressBar}>
        <div className={S.progressFill(pct)} />
      </div>

      <VoiceStep
        config={config}
        onNext={(value) => handleNext(config, value)}
        nextLabel={step < TOTAL_STEPS
          ? t('tailoring.coverOnboarding.next')
          : t('tailoring.coverOnboarding.done')}
        skipLabel={t('tailoring.coverOnboarding.skipLabel')}
      />
    </div>
  )
}
