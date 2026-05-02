import { createRouter } from '@tanstack/react-router'
import { queryClient } from './queryClient'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
