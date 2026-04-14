import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const spinWrapper = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: Spacing.xxxl,
})

export const viewerRoot = css({
  maxWidth: '128rem',
  margin: '0 auto',
})

export const viewerTopBar = css({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: Spacing.md,
})

export const wizardRoot = css({
  maxWidth: '96rem',
  margin: '0 auto',
})

export const stepContent = (isMobile: boolean) => css({
  paddingBottom: isMobile ? Spacing.mobileNavPad : 0,
})

export const editorFooter = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: Spacing.md,
  padding: `0 ${Spacing.xs}`,
})

export const footerStepLabel = css({
  fontSize: FontSize.sm,
  color: Colors.textSub,
})

export const mobileBottomNav = css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 200,
  background: Colors.white,
  borderTop: `1px solid ${Colors.surfaceBorder}`,
  display: 'flex',
  height: Spacing.mobileNavHeight,
})

export const savingIcon = css({
  marginRight: Spacing.sm2,
})

export const mobileNavBtn = css({
  flex: 1,
  border: 'none',
  background: Colors.primaryDark,
  cursor: 'pointer',
  color: Colors.white,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.bold,
  fontFamily: FontFamily.body,
})
