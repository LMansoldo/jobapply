/**
 * @file Paragraph.tsx
 * @description Wrapper around Ant Design Typography.Paragraph. Provides a single import point for the project.
 */
import { Typography } from 'antd'
import type { ParagraphProps } from './Typography.types'

/**
 * Wrapper around Ant Design Typography.Paragraph.
 * @param props - ParagraphProps forwarded to Typography.Paragraph
 */
export function Paragraph({ children, ...props }: ParagraphProps) {
  return <Typography.Paragraph {...props}>{children}</Typography.Paragraph>
}
