import { createFileRoute } from '@tanstack/react-router'
import CVTailoringPage from '../../../presentation/pages/CVTailoringPage'

export const Route = createFileRoute('/_auth/tailoring/')({
  component: CVTailoringPage,
})
