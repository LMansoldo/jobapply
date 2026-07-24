import { createFileRoute, redirect } from '@tanstack/react-router'
import AppLayout from '../presentation/components/AppLayout'
import { isTokenExpired } from '../application/auth/token'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ location }) => {
    // Read directly from localStorage — context.auth is a React state snapshot
    // that may be stale when navigate() is called right after login().
    const token = localStorage.getItem('token')
    if (!token) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    if (isTokenExpired(token)) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppLayout,
})
