/**
 * @file Title.tsx
 * @description Wrapper around Ant Design Typography.Title. Provides a single import point for the project.
 */
import { Typography } from 'antd'
import type { TitleProps } from './Typography.types'

/**
 * Wrapper around Ant Design Typography.Title.
 * @param props - TitleProps forwarded to Typography.Title
 */
export function Title({ children, ...props }: TitleProps) {
  return <Typography.Title {...props}>{children}</Typography.Title>
}
