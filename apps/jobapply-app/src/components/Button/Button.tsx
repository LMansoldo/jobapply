/**
 * @file Button.tsx
 * @description Wrapper around Ant Design Button. Provides a single import point for the project.
 */
import { Button as AntButton } from 'antd'
import type { ButtonProps } from './Button.types'

/**
 * Wrapper around Ant Design Button.
 * @param props - ButtonProps forwarded to AntButton
 */
export function Button({ children, ...props }: ButtonProps) {
  return <AntButton {...props}>{children}</AntButton>
}
