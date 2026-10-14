import type { DSButtonProps } from './DSButton.types'
import { StyledButton } from './DSButton.styles'

export function DSButton({ variant = 'primary', style, children, ...rest }: DSButtonProps) {
  return (
    <StyledButton {...rest} $variant={variant} style={style}>
      {children}
    </StyledButton>
  )
}
