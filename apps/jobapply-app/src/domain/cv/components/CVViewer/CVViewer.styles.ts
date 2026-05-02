import { css } from '@emotion/css'
import { Spacing } from '../../../../styles/theme/spacing'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize } from '../../../../styles/theme/typography'
import { Shadows } from '../../../../styles/theme/shadows'

export const desktopGrid = css({
  display: 'grid',
  gridTemplateColumns: '1fr 28rem',
  gap: Spacing.lg,
  alignItems: 'start',
})

export const fab = css({
  position: 'fixed',
  bottom: '2.4rem',
  right: '2rem',
  width: '5.6rem',
  height: '5.6rem',
  borderRadius: '50%',
  background: Colors.primary,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: Shadows.ctaHover,
  zIndex: 100,
  color: Colors.white,
  fontSize: FontSize.lg,
  transition: 'transform 0.15s, box-shadow 0.15s',
  ':active': {
    transform: 'scale(0.94)',
  },
})
