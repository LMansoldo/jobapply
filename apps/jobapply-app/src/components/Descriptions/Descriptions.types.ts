/**
 * @file Descriptions.types.ts
 * @description Type definitions for the Descriptions and DescriptionsItem wrapper components.
 */
import type { DescriptionsProps as AntDescriptionsProps } from 'antd'
import { Descriptions } from 'antd'

/** Props for the Descriptions wrapper. Extends Ant Design DescriptionsProps. */
export interface DescriptionsProps extends AntDescriptionsProps {}

/** Props for the DescriptionsItem wrapper. */
export type DescriptionsItemProps = React.ComponentProps<typeof Descriptions.Item>

import type React from 'react'
