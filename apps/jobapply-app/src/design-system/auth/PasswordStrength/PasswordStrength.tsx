import type { PasswordStrengthProps } from './PasswordStrength.types'
import { strengthColors, strengthLabels, Wrapper, Bars, Bar, Label } from './PasswordStrength.styles'

export function PasswordStrength({ value }: PasswordStrengthProps) {
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
          {strengthLabels[value]}
        </Label>
      )}
    </Wrapper>
  )
}
