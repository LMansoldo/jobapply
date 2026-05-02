/**
 * @file Segmented.types.ts
 * @description Type definitions for the Segmented wrapper component.
 */
import type { SegmentedProps as AntSegmentedProps } from 'antd'

/** Props for the Segmented wrapper. Extends Ant Design SegmentedProps with string | number value type. */
export interface SegmentedProps extends AntSegmentedProps<string | number> {}
