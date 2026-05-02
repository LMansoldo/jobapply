/**
 * @file Descriptions.tsx
 * @description Wrapper around Ant Design Descriptions and Descriptions.Item. Provides a single import point for the project.
 */
import { Descriptions as AntDescriptions } from 'antd'
import type { DescriptionsProps, DescriptionsItemProps } from './Descriptions.types'

/**
 * Wrapper around Ant Design Descriptions.
 * @param props - DescriptionsProps forwarded to AntDescriptions
 */
export function Descriptions({ children, ...props }: DescriptionsProps) {
  return <AntDescriptions {...props}>{children}</AntDescriptions>
}

/**
 * Wrapper around Ant Design Descriptions.Item.
 * @param props - DescriptionsItemProps forwarded to AntDescriptions.Item
 */
export function DescriptionsItem({ children, ...props }: DescriptionsItemProps) {
  return <AntDescriptions.Item {...props}>{children}</AntDescriptions.Item>
}
