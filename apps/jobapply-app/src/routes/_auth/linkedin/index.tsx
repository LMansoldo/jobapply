import { createFileRoute } from '@tanstack/react-router'
import LinkedInPage from '../../../presentation/pages/LinkedInPage'

export const Route = createFileRoute('/_auth/linkedin/')({
  component: LinkedInPage,
})
