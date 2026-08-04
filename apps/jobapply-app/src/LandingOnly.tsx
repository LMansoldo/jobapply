import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router'
import './i18n'
import LandingPage from './presentation/pages/LandingPage'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <LandingPage />,
})

const routeTree = rootRoute.addChildren([indexRoute])

const landingRouter = createRouter({ routeTree })

export default function LandingOnly() {
  return <RouterProvider router={landingRouter} />
}
