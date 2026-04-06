import type { ButtonProps } from '../../../components/Button/Button.types'

export type DSButtonVariant = 'primary' | 'ghost' | 'ghost-dark' | 'solid-white'

export interface DSButtonProps extends Omit<ButtonProps, 'type'> {
  variant?: DSButtonVariant
}
