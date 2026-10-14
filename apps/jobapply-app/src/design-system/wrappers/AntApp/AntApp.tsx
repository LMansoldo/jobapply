/**
 * @file AntApp.tsx
 * @description Wrapper around Ant Design App component. Re-exports useApp as useAntApp.
 */
import { App } from 'antd'
import type { AppProps } from './AntApp.types'

/**
 * Wrapper around Ant Design App.
 * @param props - AppProps forwarded to App
 */
export function AntApp({ children, ...props }: AppProps) {
  return <App {...props}>{children}</App>
}

/**
 * Hook to access Ant Design App context (message, modal, notification).
 * @returns The App context from Ant Design
 */
export const useAntApp = App.useApp
