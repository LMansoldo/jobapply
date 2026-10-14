/**
 * @file Layout.types.ts
 * @description Type definitions for the Layout wrapper components.
 */
import type { LayoutProps as AntLayoutProps } from 'antd'
import { Layout } from 'antd'
import type React from 'react'

/** Props for the AppLayout wrapper. Extends Ant Design LayoutProps. */
export interface AppLayoutProps extends AntLayoutProps {}

/** Props for the AppHeader wrapper. */
export type AppHeaderProps = React.ComponentProps<typeof Layout.Header>

/** Props for the AppContent wrapper. */
export type AppContentProps = React.ComponentProps<typeof Layout.Content>
