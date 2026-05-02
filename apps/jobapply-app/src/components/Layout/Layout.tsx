/**
 * @file Layout.tsx
 * @description Wrappers around Ant Design Layout, Layout.Header, and Layout.Content. Provides a single import point for the project.
 */
import { Layout } from 'antd'
import type { AppLayoutProps, AppHeaderProps, AppContentProps } from './Layout.types'

/**
 * Wrapper around Ant Design Layout.
 * @param props - AppLayoutProps forwarded to Layout
 */
export function AppLayout({ children, ...props }: AppLayoutProps) {
  return <Layout {...props}>{children}</Layout>
}

/**
 * Wrapper around Ant Design Layout.Header.
 * @param props - AppHeaderProps forwarded to Layout.Header
 */
export function AppHeader({ children, ...props }: AppHeaderProps) {
  return <Layout.Header {...props}>{children}</Layout.Header>
}

/**
 * Wrapper around Ant Design Layout.Content.
 * @param props - AppContentProps forwarded to Layout.Content
 */
export function AppContent({ children, ...props }: AppContentProps) {
  return <Layout.Content {...props}>{children}</Layout.Content>
}
