/**
 * @file Text.tsx
 * @description Wrapper around Ant Design Typography.Text. Provides a single import point for the project.
 */
import { Typography } from 'antd'
import type { TextProps } from './Typography.types'

/**
 * Wrapper around Ant Design Typography.Text.
 * @param props - TextProps forwarded to Typography.Text
 */
export function Text({ children, ...props }: TextProps) {
  return <Typography.Text {...props}>{children}</Typography.Text>
}
