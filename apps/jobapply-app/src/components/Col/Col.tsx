/**
 * @file Col.tsx
 * @description Wrapper around Ant Design Col. Provides a single import point for the project.
 */
import { Col as AntCol } from 'antd'
import type { ColProps } from './Col.types'

/**
 * Wrapper around Ant Design Col.
 * @param props - ColProps forwarded to AntCol
 */
export function Col({ children, ...props }: ColProps) {
  return <AntCol {...props}>{children}</AntCol>
}
