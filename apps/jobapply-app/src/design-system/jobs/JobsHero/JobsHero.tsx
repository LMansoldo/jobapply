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

export function JobsHero({ search, location, onSearchChange, onLocationChange, onSubmit }: JobsHeroProps) {
  const { t } = useTranslation()

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <HeroHeadline
          title={t('jobs.heroTitle')}
          subtitle={t('jobs.heroSubtitle')}
        />
        <HeroSearchForm
          search={search}
          location={location}
          searchPlaceholder={t('jobs.jobKeywordPlaceholder')}
          locationPlaceholder={t('jobs.cityStatePlaceholder')}
          searchLabel={t('jobs.search')}
          onSearchChange={onSearchChange}
          onLocationChange={onLocationChange}
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
