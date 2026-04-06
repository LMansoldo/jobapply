import type { PageLayoutProps } from './PageLayout.types'
import { styles } from './PageLayout.styles'

export function PageLayout({ left, center, right, variant = 'jobs' }: PageLayoutProps) {
  const gridVariant =
    variant === 'jobs'
      ? styles.gridJobs
      : variant === 'linkedin'
        ? styles.gridLinkedin
        : variant === 'cv'
          ? styles.gridCv
          : variant === 'tailoring'
            ? styles.gridTailoring
            : styles.gridDefault

  const hasLeft = left !== undefined
  const hasRight = right !== undefined

  const autoColumns =
    !hasLeft && !hasRight
      ? '1fr'
      : !hasLeft
        ? `1fr ${gridVariant.gridTemplateColumns.split(' ').pop()}`
        : !hasRight
          ? `${gridVariant.gridTemplateColumns.split(' ')[0]} 1fr`
          : gridVariant.gridTemplateColumns

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.grid, gridTemplateColumns: autoColumns }}>
        {hasLeft && <aside>{left}</aside>}
        <main>{center}</main>
        {hasRight && <aside>{right}</aside>}
      </div>
    </div>
  )
}
