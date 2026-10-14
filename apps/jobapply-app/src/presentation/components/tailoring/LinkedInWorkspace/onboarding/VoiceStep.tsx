import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as S from './VoiceStep.styles'

export interface VoiceStepConfig {
  headlineKey: string
  subtextKey: string
  placeholderKey: string
  skipWarningKey: string
}

interface VoiceStepProps {
  config: VoiceStepConfig
  onNext: (value?: string) => void
  nextLabel?: string
  skipLabel?: string
}

export function VoiceStep({ config, onNext, nextLabel, skipLabel }: VoiceStepProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [skipPending, setSkipPending] = useState(false)

  function handleSkip() {
    if (!skipPending) { setSkipPending(true); return }
    onNext(undefined)
  }

  return (
    <S.Root>
      <S.Card>
        <S.Headline>{t(config.headlineKey)}</S.Headline>
        <S.Subtext>{t(config.subtextKey)}</S.Subtext>
        <S.Textarea
          placeholder={t(config.placeholderKey)}
          value={value}
          onChange={(e) => { setValue(e.target.value); setSkipPending(false) }}
        />
        <S.Actions>
          <S.NextBtn type="button" onClick={() => onNext(value || undefined)}>
            {nextLabel ?? t('tailoring.onboarding.next')}
          </S.NextBtn>
          <S.SkipRow>
            <S.SkipBtn type="button" onClick={handleSkip}>
              {skipLabel ?? t('tailoring.onboarding.skipLabel')}
            </S.SkipBtn>
            {skipPending && (
              <S.SkipWarning>{t(config.skipWarningKey)}</S.SkipWarning>
            )}
          </S.SkipRow>
        </S.Actions>
      </S.Card>
    </S.Root>
  )
}
