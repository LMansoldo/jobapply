/**
 * @file Steps.tsx
 * @description Wrapper around Ant Design Steps. Provides a single import point for the project.
 */
import { Steps as AntSteps } from 'antd'
import type { StepsProps } from './Steps.types'

/**
 * Wrapper around Ant Design Steps.
 * @param props - StepsProps forwarded to AntSteps
 */
export function Steps(props: StepsProps) {
  return <AntSteps {...props} />
}
