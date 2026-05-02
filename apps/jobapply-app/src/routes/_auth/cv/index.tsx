import { createFileRoute } from '@tanstack/react-router'
import CVPage from '../../../presentation/pages/CVPage'

export const Route = createFileRoute('/_auth/cv/')({
  component: CVPage,
})
