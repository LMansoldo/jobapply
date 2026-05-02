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
    <div className={S.root}>
      <div className={S.card}>
        <h2 className={S.headline}>{t(config.headlineKey)}</h2>
        <p className={S.subtext}>{t(config.subtextKey)}</p>
        <textarea
          className={S.textarea}
          placeholder={t(config.placeholderKey)}
          value={value}
          onChange={(e) => { setValue(e.target.value); setSkipPending(false) }}
        />
        <div className={S.actions}>
          <button type="button" className={S.nextBtn} onClick={() => onNext(value || undefined)}>
            {nextLabel ?? t('tailoring.onboarding.next')}
          </button>
          <div className={S.skipRow}>
            <button type="button" className={S.skipBtn} onClick={handleSkip}>
              {skipLabel ?? t('tailoring.onboarding.skipLabel')}
            </button>
            {skipPending && (
              <p className={S.skipWarning}>{t(config.skipWarningKey)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
