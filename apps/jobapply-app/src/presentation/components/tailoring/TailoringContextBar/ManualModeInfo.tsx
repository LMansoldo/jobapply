import { useTranslation } from 'react-i18next'
import type { ManualModeInfoProps } from './ManualModeInfo.types'
import * as S from './TailoringContextBar.styles'

const MAX_DESC_LENGTH = 80

export function ManualModeInfo({ manualDescription }: ManualModeInfoProps) {
  const { t } = useTranslation()

  return (
    <S.ManualModeInfo>
      <S.ManualModeTitle>{t('tailoring.manualModeTitle')}</S.ManualModeTitle>
      {manualDescription && (
        <S.ManualModeDesc>
          {manualDescription.length > MAX_DESC_LENGTH
            ? `${manualDescription.slice(0, MAX_DESC_LENGTH)}…`
            : manualDescription}
        </S.ManualModeDesc>
      )}
    </S.ManualModeInfo>
  )
}
