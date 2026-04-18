import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'
import { FontSize, FontWeight, FontFamily } from '../../../../styles/theme/typography'
import { BorderRadius } from '../../../../styles/theme/radius'
import type { CSSProperties } from 'react'

export const styles: Record<string, CSSProperties> = {
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
}
