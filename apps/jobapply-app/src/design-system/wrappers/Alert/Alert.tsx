/**
 * @file Alert.tsx
 * @description Wrapper around Ant Design Alert. Provides a single import point for the project.
 */
import { Alert as AntAlert } from 'antd'
import type { AlertProps } from './Alert.types'

/**
 * Wrapper around Ant Design Alert.
 * @param props - AlertProps forwarded to AntAlert
 */
export function Alert(props: AlertProps) {
  return <AntAlert {...props} />
}
