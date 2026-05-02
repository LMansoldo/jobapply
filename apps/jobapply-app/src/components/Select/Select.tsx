/**
 * @file Select.tsx
 * @description Wrapper around Ant Design Select. Provides a single import point for the project.
 */
import { Select as AntSelect } from 'antd'
import type { SelectProps } from './Select.types'

/**
 * Wrapper around Ant Design Select.
 * @param props - SelectProps forwarded to AntSelect
 */
export function Select(props: SelectProps) {
  return <AntSelect {...props} />
}
