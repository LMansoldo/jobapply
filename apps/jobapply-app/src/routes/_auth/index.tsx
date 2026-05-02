import { createFileRoute } from '@tanstack/react-router'
import JobsPage from '../../presentation/pages/JobsPage'

export const Route = createFileRoute('/_auth/')({
  component: JobsPage,
})
