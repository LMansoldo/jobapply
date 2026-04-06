import { Button } from '../../../components/Button'
import type { DSButtonProps } from './DSButton.types'
import { variantStyles } from './DSButton.styles'

export function DSButton({ variant = 'primary', style, children, ...rest }: DSButtonProps) {
  return (
    <Button
      {...rest}
      style={{ ...variantStyles[variant], ...style }}
    >
      {children}
    </Button>
  )
}
