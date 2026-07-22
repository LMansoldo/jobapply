import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import type { AuthContextValue } from '../application/providers/AuthProvider'

export interface RouterContext {
  queryClient: QueryClient
  auth: AuthContextValue
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
})
