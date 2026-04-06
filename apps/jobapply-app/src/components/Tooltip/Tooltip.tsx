/**
 * @file Tooltip.tsx
 * @description Wrapper around Ant Design Tooltip. Provides a single import point for the project.
 */
import { Tooltip as AntTooltip } from 'antd'
import type { TooltipProps } from './Tooltip.types'

/**
 * Wrapper around Ant Design Tooltip.
 * All props are forwarded unchanged to AntTooltip.
 *
 * @param props - TooltipProps (AntD TooltipProps + children)
 */
export function Tooltip(props: TooltipProps) {
  return <AntTooltip {...props} />
}
