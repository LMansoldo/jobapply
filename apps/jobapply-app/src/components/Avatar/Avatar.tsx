/**
 * @file Avatar.tsx
 * @description Wrapper around Ant Design Avatar. Provides a single import point for the project.
 */
import { Avatar as AntAvatar } from 'antd'
import type { AvatarProps } from './Avatar.types'

/**
 * Wrapper around Ant Design Avatar.
 * @param props - AvatarProps forwarded to AntAvatar
 */
export function Avatar(props: AvatarProps) {
  return <AntAvatar {...props} />
}
