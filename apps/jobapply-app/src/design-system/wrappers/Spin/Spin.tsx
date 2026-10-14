/**
 * @file Spin.tsx
 * @description Wrapper around Ant Design Spin. Provides a single import point for the project.
 */
import { Spin as AntSpin } from 'antd'
import type { SpinProps } from './Spin.types'

/**
 * Wrapper around Ant Design Spin.
 * @param props - SpinProps forwarded to AntSpin
 */
export function Spin(props: SpinProps) {
  return <AntSpin {...props} />
}
