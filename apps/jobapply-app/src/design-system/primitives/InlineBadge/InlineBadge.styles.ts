import type { CSSProperties } from 'react'
import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${Spacing.xxs} ${Spacing.xs}`,
  borderRadius: BorderRadius.full,
  fontSize: '1.1rem',
  fontWeight: FontWeight.medium,
  lineHeight: 1,
}

export const variantStyles: Record<string, CSSProperties> = {
  success: { ...base, background: Colors.greenBg, color: Colors.green },
  warning: { ...base, background: Colors.warningBg, color: Colors.warning },
}
