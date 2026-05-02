/**
 * @file Divider.tsx
 * @description Wrapper around Ant Design Divider. Provides a single import point for the project.
 */
import { Divider as AntDivider } from 'antd'
import type { DividerProps } from './Divider.types'

/**
 * Wrapper around Ant Design Divider.
 * @param props - DividerProps forwarded to AntDivider
 */
export function Divider(props: DividerProps) {
  return <AntDivider {...props} />
}
