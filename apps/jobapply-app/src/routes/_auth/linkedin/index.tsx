import { createFileRoute } from '@tanstack/react-router'
import { LinkedInOptimizerPage } from '../../../presentation/pages/LinkedInOptimizerPage/LinkedInOptimizerPage'

export const Route = createFileRoute('/_auth/linkedin/')({
  component: LinkedInOptimizerPage,
})
