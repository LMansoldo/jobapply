import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'
import { mediaQueries } from '../../../styles/theme/breakpoints'

export const page = css({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: Colors.pageBg,

  [mediaQueries.md]: {
    flexDirection: 'row',
  },
})

export const leftPanel = css({
  display: 'none',

  [mediaQueries.md]: {
    display: 'flex',
    flex: '0 0 45%',
    background: Colors.gradientHeroDark,
    padding: Spacing.xxl,
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: Shadows.auth,
    overflow: 'hidden',
    position: 'relative',
  },
})

export const rightPanel = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${Spacing.xl} ${Spacing.md}`,
  minHeight: '100vh',

  [mediaQueries.md]: {
    padding: Spacing.xxl,
    minHeight: 'auto',
  },
})

export const formCard = css({
  background: Colors.white,
  borderRadius: '1.6rem',
  boxShadow: Shadows.lg,
  padding: `${Spacing.xl} ${Spacing.lg}`,
  width: '100%',
  maxWidth: '42rem',

  [mediaQueries.md]: {
    padding: Spacing.xxl,
  },
})
