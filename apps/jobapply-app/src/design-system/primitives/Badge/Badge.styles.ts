import type { CSSProperties } from 'react'
import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight, LetterSpacing } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${Spacing.xxs} ${Spacing.sm}`,
  borderRadius: BorderRadius.full,
  fontSize: '1.1rem',
  fontWeight: FontWeight.semibold,
  letterSpacing: LetterSpacing.badge,
  textTransform: 'uppercase',
  lineHeight: 1,
}

export const variantStyles: Record<string, CSSProperties> = {
  hot: { ...base, background: Colors.orangeBg, color: Colors.orange },
  new: { ...base, background: Colors.greenBg, color: Colors.green },
  remote: { ...base, background: Colors.blueBg, color: Colors.blue },
  default: { ...base, background: Colors.primaryLight, color: Colors.primaryDark },
}
