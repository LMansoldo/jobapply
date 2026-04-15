import type { PageLayoutProps } from './PageLayout.types'
import { Wrapper, Grid, GRID_JOBS, GRID_LINKEDIN, GRID_CV, GRID_TAILORING, GRID_DEFAULT } from './PageLayout.styles'

const GRID_VARIANTS = {
  jobs: GRID_JOBS,
  linkedin: GRID_LINKEDIN,
  cv: GRID_CV,
  tailoring: GRID_TAILORING,
  default: GRID_DEFAULT,
} as const

export function PageLayout({ left, center, right, variant = 'jobs' }: PageLayoutProps) {
  const hasLeft = left !== undefined
  const hasRight = right !== undefined

  const gridVariant = GRID_VARIANTS[variant] || GRID_VARIANTS.default

  const [leftCol, centerCol, rightCol] = gridVariant.split(' ')

  let autoColumns: string

  if (!hasLeft && !hasRight) {
    autoColumns = '1fr'
  } else if (!hasLeft) {
    autoColumns = `1fr ${rightCol}`
  } else if (!hasRight) {
    autoColumns = `${leftCol} 1fr`
  } else {
    autoColumns = gridVariant
  }

  return (
    <Wrapper>
      <Grid templateColumns={autoColumns}>
        {hasLeft && <aside>{left}</aside>}
        <main>{center}</main>
        {hasRight && <aside>{right}</aside>}
      </Grid>
    </Wrapper>
  )
}
