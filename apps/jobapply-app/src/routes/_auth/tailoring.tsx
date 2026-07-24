import { createFileRoute, redirect } from '@tanstack/react-router'
import CVTailoringPage from '../../presentation/pages/CVTailoringPage'

export const Route = createFileRoute('/_auth/tailoring')({
  beforeLoad: () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? 'null')
      if (!user?.cv) throw redirect({ to: '/cv' })
    } catch (e) {
      if (e && typeof e === 'object' && 'to' in e) throw e
      throw redirect({ to: '/cv' })
    }
  },
  component: CVTailoringPage,
})
