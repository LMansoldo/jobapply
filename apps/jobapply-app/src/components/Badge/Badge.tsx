/**
 * @file Badge.tsx
 * @description Wrapper around Ant Design Badge. Provides a single import point for the project.
 */
import { Badge as AntBadge } from 'antd'
import type { BadgeProps } from './Badge.types'

/**
 * Wrapper around Ant Design Badge.
 * @param props - BadgeProps forwarded to AntBadge
 */
export function Badge(props: BadgeProps) {
  return <AntBadge {...props} />
}
