import { useTranslation } from 'react-i18next'
import type { PasswordStrengthProps } from './PasswordStrength.types'
import { strengthColors, Wrapper, Bars, Bar, Label } from './PasswordStrength.styles'

export function PasswordStrength({ value }: PasswordStrengthProps) {
  const { t } = useTranslation()
  const labels = ['', t('extension.passwordVeryWeak'), t('extension.passwordWeak'), t('extension.passwordMedium'), t('extension.passwordStrong')]
  return (
    <Wrapper>
      <Bars>
        {[1, 2, 3, 4].map((level) => (
          <Bar
            key={level}
            $color={value >= level ? strengthColors[value] : undefined}
          />
        ))}
      </Bars>
      {value > 0 && (
        <Label $color={strengthColors[value]}>
          {labels[value]}
        </Label>
      )}
    </Wrapper>
  )
}
