import { createFileRoute, redirect } from '@tanstack/react-router'
import AppLayout from '../presentation/components/AppLayout'

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    // Not a JWT (e.g. mock token) — treat as non-expired
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1]))
    // No exp claim — treat as non-expired
    if (!payload.exp) return false
    return payload.exp * 1000 < Date.now()
  } catch {
    return false
  }
}

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
