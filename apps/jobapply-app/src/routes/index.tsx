import { createFileRoute, redirect } from '@tanstack/react-router'
import LandingPage from '../presentation/pages/LandingPage'
import { isTokenExpired } from '../application/auth/token'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = localStorage.getItem('token')
    if (token && !isTokenExpired(token)) {
      throw redirect({ to: '/tailoring' })
    }
  },
  component: LandingPage,
})
