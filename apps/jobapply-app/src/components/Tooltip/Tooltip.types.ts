/**
 * @file Tooltip.types.ts
 * @description Type definitions for the Tooltip wrapper component.
 */
import type { TooltipProps as AntTooltipProps } from 'antd'
import type { ReactNode } from 'react'

/**
 * Props for the Tooltip wrapper.
 * Extends Ant Design TooltipProps and adds explicit children support.
 */
export type TooltipProps = AntTooltipProps & {
  /** Trigger element that receives the tooltip */
  children?: ReactNode
}
