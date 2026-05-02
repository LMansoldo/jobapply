import { createFileRoute, redirect } from '@tanstack/react-router'
import OnboardingPage from '../presentation/pages/OnboardingPage'

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1]))
    if (!payload.exp) return false
    return payload.exp * 1000 < Date.now()
  } catch {
    return false
  }
}

export const Route = createFileRoute('/onboarding')({
  beforeLoad: () => {
    const token = localStorage.getItem('token')
    if (!token || isTokenExpired(token)) {
      throw redirect({ to: '/login' })
    }
  },
  component: OnboardingPage,
})
