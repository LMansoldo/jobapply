import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '../presentation/pages/LoginPage'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
