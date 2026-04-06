/**
 * @file Popconfirm.tsx
 * @description Wrapper around Ant Design Popconfirm. Provides a single import point for the project.
 */
import { Popconfirm as AntPopconfirm } from 'antd'
import type { PopconfirmProps } from './Popconfirm.types'

/**
 * Wrapper around Ant Design Popconfirm.
 * @param props - PopconfirmProps forwarded to AntPopconfirm
 */
export function Popconfirm({ children, ...props }: PopconfirmProps) {
  return <AntPopconfirm {...props}>{children}</AntPopconfirm>
}
