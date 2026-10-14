/**
 * @file Space.tsx
 * @description Wrapper around Ant Design Space. Provides a single import point for the project.
 */
import { Space as AntSpace } from 'antd'
import type { SpaceProps } from './Space.types'

/**
 * Wrapper around Ant Design Space.
 * @param props - SpaceProps forwarded to AntSpace
 */
export function Space({ children, ...props }: SpaceProps) {
  return <AntSpace {...props}>{children}</AntSpace>
}
