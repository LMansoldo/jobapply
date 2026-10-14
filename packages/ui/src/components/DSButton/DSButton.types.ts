import type { ButtonProps } from 'antd'

export type DSButtonVariant = 'primary' | 'ghost' | 'ghost-dark' | 'solid-white'

export interface DSButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant?: DSButtonVariant
}
