import { createFileRoute } from '@tanstack/react-router'
import LinkedInCallbackPage from '../presentation/pages/LinkedInCallbackPage/LinkedInCallbackPage'

export const Route = createFileRoute('/linkedin-callback')({
  component: LinkedInCallbackPage,
})
