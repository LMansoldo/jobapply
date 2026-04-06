/**
 * @file Tag.tsx
 * @description Wrapper around Ant Design Tag. Provides a single import point for the project.
 */
import { Tag as AntTag } from 'antd'
import type { TagProps } from './Tag.types'

/**
 * Wrapper around Ant Design Tag.
 * @param props - TagProps forwarded to AntTag
 */
export function Tag({ children, ...props }: TagProps) {
  return <AntTag {...props}>{children}</AntTag>
}
