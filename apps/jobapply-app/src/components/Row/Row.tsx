/**
 * @file Row.tsx
 * @description Wrapper around Ant Design Row. Provides a single import point for the project.
 */
import { Row as AntRow } from 'antd'
import type { RowProps } from './Row.types'

/**
 * Wrapper around Ant Design Row.
 * @param props - RowProps forwarded to AntRow
 */
export function Row({ children, ...props }: RowProps) {
  return <AntRow {...props}>{children}</AntRow>
}
