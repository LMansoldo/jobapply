/** Presentational: hero title and subtitle text. */
import type { HeroHeadlineProps } from './JobsHero.types'
import * as styles from './JobsHero.styles'

export function HeroHeadline({ title, subtitle }: HeroHeadlineProps) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </>
  )
}
