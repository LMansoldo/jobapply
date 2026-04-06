import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'
import { FontSize, FontWeight, FontFamily } from '../../../../styles/theme/typography'
import { BorderRadius } from '../../../../styles/theme/radius'
import type { CSSProperties } from 'react'

export const styles: Record<string, CSSProperties> = {
  bar: {
    background: Colors.white,
    borderBottom: `1px solid ${Colors.surfaceBorder}`,
    padding: `${Spacing.xs} ${Spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.md,
    flexShrink: 0,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: Colors.primaryDark,
    cursor: 'pointer',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.body,
    fontWeight: FontWeight.semibold,
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: `${Spacing.xs} ${Spacing.sm}`,
    borderRadius: BorderRadius.sm,
    transition: 'background .15s',
  },
  sep: {
    width: '1px',
    height: '2rem',
    background: Colors.surfaceBorder,
  },
  jobInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logo: {
    width: '3rem',
    height: '3rem',
    borderRadius: '7px',
    background: Colors.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.bold,
    fontSize: '1.1rem',
    color: Colors.primaryDark,
    flexShrink: 0,
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: FontWeight.bold,
    color: Colors.textMain,
  },
  sub: {
    fontSize: FontSize.xs,
    color: Colors.textSub,
  },
  langBadge: {
    background: Colors.blueBg,
    color: Colors.blue,
    borderRadius: BorderRadius.full,
    padding: `0.3rem 1.2rem`,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    marginLeft: Spacing.xs,
  },
  actions: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
  },
}
