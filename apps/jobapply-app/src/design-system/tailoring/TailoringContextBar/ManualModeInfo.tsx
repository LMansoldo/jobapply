import { useTranslation } from 'react-i18next'
import type { ManualModeInfoProps } from './ManualModeInfo.types'
import * as S from './TailoringContextBar.styles'

const MAX_DESC_LENGTH = 80

export function ManualModeInfo({ manualDescription }: ManualModeInfoProps) {
  const { t } = useTranslation()

  return (
    <div className={S.manualModeInfo}>
      <span className={S.manualModeTitle}>{t('tailoring.manualModeTitle')}</span>
      {manualDescription && (
        <span className={S.manualModeDesc}>
          {manualDescription.length > MAX_DESC_LENGTH
            ? `${manualDescription.slice(0, MAX_DESC_LENGTH)}…`
            : manualDescription}
        </span>
      )}
    </div>
  )
}
