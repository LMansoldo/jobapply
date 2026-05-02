import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Grid } from '../../components/Grid'
import { getPublicCV } from '../../infrastructure/repositories/voucherRepository'
import { CVPublicViewer } from '../../domain/cv/components/CVPublicViewer'
import { Spin } from '../../components/Spin'
import { Empty } from '../../components/Empty'

const { useBreakpoint } = Grid

export const Route = createFileRoute('/public/$publicId')({
  head: ({ params }) => ({
    meta: [
      { name: 'description', content: `Currículo público — ${params.publicId}` },
      { property: 'og:type', content: 'profile' },
    ],
  }),
  component: PublicCVPage,
})

function PublicCVPage() {
  const { publicId } = Route.useParams()
  const { t } = useTranslation()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const { data: cv, isLoading, isError } = useQuery({
    queryKey: ['publicCV', publicId],
    queryFn: () => getPublicCV(publicId),
    staleTime: 60 * 60 * 1000,
    retry: false,
  })

  if (isLoading) return <Spin size="large" />

  if (isError || !cv) {
    return <Empty description={t('cv.publicCVNotFound')} />
  }

  return <CVPublicViewer cv={cv} isMobile={isMobile} />
}
