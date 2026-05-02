/**
 * @file Segmented.tsx
 * @description Wrapper around Ant Design Segmented. Provides a single import point for the project.
 */
import { Segmented as AntSegmented } from 'antd'
import type { SegmentedProps } from './Segmented.types'

/**
 * Wrapper around Ant Design Segmented.
 * @param props - SegmentedProps forwarded to AntSegmented
 */
export function Segmented(props: SegmentedProps) {
  return <AntSegmented {...props} />
}
