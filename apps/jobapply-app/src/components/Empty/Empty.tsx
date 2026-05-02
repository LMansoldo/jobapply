/**
 * @file Empty.tsx
 * @description Wrapper around Ant Design Empty. Provides a single import point for the project.
 */
import { Empty as AntEmpty } from 'antd'
import type { EmptyProps } from './Empty.types'

/**
 * Wrapper around Ant Design Empty.
 * @param props - EmptyProps forwarded to AntEmpty
 */
export function Empty(props: EmptyProps) {
  return <AntEmpty {...props} />
}
