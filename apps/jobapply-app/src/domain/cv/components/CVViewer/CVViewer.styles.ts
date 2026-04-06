import { css } from '@emotion/css'
import { Spacing } from '../../../../styles/theme/spacing'

export const mobileRoot = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.md,
})

export const desktopGrid = css({
  display: 'grid',
  gridTemplateColumns: '1fr 28rem',
  gap: Spacing.lg,
  alignItems: 'start',
})

export const desktopActions = css({
  marginTop: Spacing.md,
  display: 'flex',
  gap: Spacing.sm,
})
