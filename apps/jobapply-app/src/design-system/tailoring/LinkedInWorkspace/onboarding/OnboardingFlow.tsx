import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { VoiceAnswers } from '../../../../domain/linkedin/types'
import { VoiceStep, type VoiceStepConfig } from './VoiceStep'
import { PDFUploadPanel } from '../panels/PDFUploadPanel'
import * as S from './OnboardingFlow.styles'

interface OnboardingFlowProps {
  onAnalyze: (file: File, voiceAnswers?: VoiceAnswers) => Promise<void>
}

const TOTAL_STEPS = 5

const VOICE_STEPS: VoiceStepConfig[] = [
  {
    headlineKey: 'tailoring.onboarding.dayToDayHeadline',
    subtextKey: 'tailoring.onboarding.dayToDaySubtext',
    placeholderKey: 'tailoring.onboarding.dayToDayPlaceholder',
    skipWarningKey: 'tailoring.onboarding.dayToDaySkipWarning',
  },
  {
    headlineKey: 'tailoring.onboarding.hardestProblemHeadline',
    subtextKey: 'tailoring.onboarding.hardestProblemSubtext',
    placeholderKey: 'tailoring.onboarding.hardestProblemPlaceholder',
    skipWarningKey: 'tailoring.onboarding.hardestProblemSkipWarning',
  },
  {
    headlineKey: 'tailoring.onboarding.differentFromHeadline',
    subtextKey: 'tailoring.onboarding.differentFromSubtext',
    placeholderKey: 'tailoring.onboarding.differentFromPlaceholder',
    skipWarningKey: 'tailoring.onboarding.differentFromSkipWarning',
  },
  {
    headlineKey: 'tailoring.onboarding.nextStepHeadline',
    subtextKey: 'tailoring.onboarding.nextStepSubtext',
    placeholderKey: 'tailoring.onboarding.nextStepPlaceholder',
    skipWarningKey: 'tailoring.onboarding.nextStepSkipWarning',
  },
]

export function OnboardingFlow({ onAnalyze }: OnboardingFlowProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<VoiceAnswers>([])

  function handleVoiceNext(config: VoiceStepConfig, value?: string) {
    if (value) {
      setAnswers((prev) => [...prev, { label: t(config.headlineKey), answer: value }])
    }
    setStep((s) => s + 1)
  }

  const pct = ((step - 1) / TOTAL_STEPS) * 100

  return (
    <div className={S.root}>
      <div className={S.header}>
        <span className={S.linkedinLabel}>LinkedIn</span>
        <div className={S.stepDots}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className={i + 1 < step ? S.dotDone : i + 1 === step ? S.dotActive : S.dot}
            />
          ))}
        </div>
        <span className={S.stepCounter}>
          {t('tailoring.onboarding.stepOf', { current: step, total: TOTAL_STEPS })}
        </span>
      </div>

      <div className={S.progressBar}>
        <div className={S.progressFill(pct)} />
      </div>

      {step <= 4 ? (
        <VoiceStep
          config={VOICE_STEPS[step - 1]}
          onNext={(value) => handleVoiceNext(VOICE_STEPS[step - 1], value)}
        />
      ) : (
        <PDFUploadPanel
          onAnalyze={(file) => onAnalyze(file, answers)}
          headlineKey="tailoring.onboarding.pdfHeadline"
          subtextKey="tailoring.onboarding.pdfSubtext"
          dragLabelKey="tailoring.onboarding.pdfDragLabel"
          analyzeLabelKey="tailoring.onboarding.analyze"
        />
      )}
    </div>
  )
}
