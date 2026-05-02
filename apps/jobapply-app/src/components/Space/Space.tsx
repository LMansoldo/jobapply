/**
 * @file Space.tsx
 * @description Wrapper around Ant Design Space. Provides a single import point for the project.
 */
import { forwardRef } from 'react'
import { Space as AntSpace } from 'antd'
import type { SpaceProps } from './Space.types'

export const Space = forwardRef<HTMLDivElement, SpaceProps>(({ children, ...props }, ref) => {
  return <AntSpace ref={ref} {...props}>{children}</AntSpace>
})

Space.displayName = 'Space'
