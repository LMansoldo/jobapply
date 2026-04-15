/**
 * Container: composes HeroHeadline + HeroSearchForm + HeroQuickChips.
 * All state is controlled by the parent via props — no local state.
 */
import { useTranslation } from 'react-i18next'
import { HeroHeadline } from './HeroHeadline'
import { HeroSearchForm } from './HeroSearchForm'
import { HeroQuickChips } from './HeroQuickChips'
import { QUICK_CHIPS } from './helpers'
import type { JobsHeroProps } from './JobsHero.types'
import * as styles from './JobsHero.styles'

export function JobsHero({ search, onSearchChange, onSubmit }: JobsHeroProps) {
  const { t } = useTranslation()

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <HeroSearchForm
          search={search}
          searchPlaceholder={t('jobs.search.placeholder')}
          searchLabel={t('jobs.search.label')}
          onSearchChange={onSearchChange}
          onSubmit={onSubmit ?? (() => {})}
        />
        <HeroQuickChips
          chips={QUICK_CHIPS}
          onChipClick={onSearchChange}
        />
      </div>
    </section>
  )
}
