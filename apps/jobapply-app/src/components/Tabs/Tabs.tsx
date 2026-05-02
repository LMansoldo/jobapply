/**
 * @file Tabs.tsx
 * @description Wrapper around Ant Design Tabs. Provides a single import point for the project.
 */
import { Tabs as AntTabs } from 'antd'
import type { TabsProps } from './Tabs.types'

/**
 * Wrapper around Ant Design Tabs.
 * @param props - TabsProps forwarded to AntTabs
 */
export function Tabs(props: TabsProps) {
  return <AntTabs {...props} />
}
