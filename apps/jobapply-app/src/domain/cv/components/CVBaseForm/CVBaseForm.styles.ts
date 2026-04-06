import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'
import { BorderRadius } from '../../../../styles/theme/radius'
import { Shadows } from '../../../../styles/theme/shadows'

export const cardRoot = css({
  background: Colors.white,
  borderRadius: BorderRadius.base,
  boxShadow: Shadows.sm,
  overflow: 'hidden',
})

export const cardHeader = css({
  padding: `${Spacing.lg} ${Spacing.xl}`,
  borderBottom: `1px solid ${Colors.surfaceBorder}`,
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
})

export const headerIcon = css({
  width: '4rem',
  height: '4rem',
  borderRadius: '50%',
  background: Colors.primaryLight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: Colors.primaryDark,
  fontSize: '1.8rem',
  flexShrink: 0,
})

export const headerTitle = css({
  margin: 0,
  fontFamily: FontFamily.heading,
  fontWeight: FontWeight.semibold,
  fontSize: FontSize.lg,
  color: Colors.textMain,
})

export const headerSubtitle = css({
  margin: 0,
  fontSize: FontSize.sm,
  color: Colors.textSub,
})

export const cardBody = css({
  padding: `${Spacing.lg} ${Spacing.xl}`,
})

export const avatarZone = css({
  border: `2px dashed ${Colors.borderPurple}`,
  borderRadius: BorderRadius.base,
  padding: Spacing.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: Spacing.lg,
  background: Colors.surfacePage,
  cursor: 'pointer',
})

export const avatarLeft = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
})

export const avatarCircle = css({
  width: '5.6rem',
  height: '5.6rem',
  borderRadius: '50%',
  background: Colors.primaryLight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: Colors.primaryDark,
  fontSize: '2.4rem',
  flexShrink: 0,
})

export const avatarLabel = css({
  margin: 0,
  fontWeight: FontWeight.medium,
  fontSize: FontSize.sm,
  color: Colors.textMain,
})

export const avatarHint = css({
  margin: 0,
  fontSize: FontSize.xxs,
  color: Colors.textSub,
  marginTop: '2px',
})

export const choosePhotoBtn = css({
  background: 'none',
  border: `1.5px solid ${Colors.primaryDark}`,
  borderRadius: BorderRadius.full,
  color: Colors.primaryDark,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  padding: `${Spacing.xs} ${Spacing.md}`,
  cursor: 'pointer',
  flexShrink: 0,
  fontFamily: FontFamily.body,
})

export const cardFooter = css({
  padding: `${Spacing.md} ${Spacing.xl}`,
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: Colors.surfacePage,
})

export const stepLabelText = css({
  fontSize: FontSize.sm,
  color: Colors.textSub,
  fontWeight: FontWeight.medium,
})
