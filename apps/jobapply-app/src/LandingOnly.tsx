import { createRouter, RouterProvider, createRootRoute, createFileRoute } from '@tanstack/react-router'
import './i18n'
import LandingPage from './presentation/pages/LandingPage'

// Minimal root route — no providers needed for landing
const rootRoute = createRootRoute({ component: () => <LandingPage /> })

// Landing page route at "/"
const indexRoute = createFileRoute('/')({ component: () => <LandingPage /> })

const routeTree = rootRoute.addChildren([indexRoute])

const landingRouter = createRouter({ routeTree })

export default function LandingOnly() {
  return <RouterProvider router={landingRouter} />
}
