import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { mediaQueries } from '../../../styles/theme/breakpoints'

const LINKEDIN_BLUE = '#0077B5'
const LINKEDIN_BG = '#e8f4fb'

export const pageRoot = css({
  minHeight: 'calc(100vh - 6.4rem)',
  background: Colors.pageBg,
  display: 'flex',
  flexDirection: 'column',
})

export const pageHeader = css({
  background: Colors.white,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  padding: `${Spacing.sm} ${Spacing.lg}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
})

export const headerBrand = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
})

export const brandIcon = css({
  color: LINKEDIN_BLUE,
  fontSize: '2.4rem',
  lineHeight: 1,
})

export const brandTitle = css({
  fontSize: FontSize.base,
  fontWeight: FontWeight.semibold,
  color: Colors.textMain,

  [mediaQueries.tabletDown]: {
    fontSize: FontSize.sm,
  },
})

export const scoreChip = css({
  background: LINKEDIN_BG,
  color: LINKEDIN_BLUE,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.sm,
  padding: `${Spacing.xs} ${Spacing.md}`,
  borderRadius: '10px',
  whiteSpace: 'nowrap' as const,
})

export const content = css({
  flex: 1,
  maxWidth: '128rem',
  margin: '0 auto',
  width: '100%',
  padding: Spacing.lg,

  [mediaQueries.tabletDown]: {
    padding: Spacing.md,
  },
})
