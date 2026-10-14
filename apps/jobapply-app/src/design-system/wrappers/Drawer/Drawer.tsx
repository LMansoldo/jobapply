/**
 * @file Drawer.tsx
 * @description Wrapper around Ant Design Drawer. Provides a single import point for the project.
 */
import { Drawer as AntDrawer } from 'antd'
import type { DrawerProps } from './Drawer.types'

/**
 * Wrapper around Ant Design Drawer.
 * @param props - DrawerProps forwarded to AntDrawer
 */
export function Drawer({ children, ...props }: DrawerProps) {
  return <AntDrawer {...props}>{children}</AntDrawer>
}