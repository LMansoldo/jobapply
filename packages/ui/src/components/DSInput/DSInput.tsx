import type { DSInputProps } from './DSInput.types'
import { IconSlot, InputShell, StyledInput } from './DSInput.styles'

export function DSInput({ filled, leftIcon, style, ...rest }: DSInputProps) {
  const input = <StyledInput {...rest} style={style} $filled={filled} $hasIcon={!!leftIcon} />

  if (leftIcon) {
    return (
      <InputShell>
        <IconSlot>{leftIcon}</IconSlot>
        {input}
      </InputShell>
    )
  }

  return input
}
