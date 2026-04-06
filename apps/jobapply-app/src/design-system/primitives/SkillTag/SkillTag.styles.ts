import type { CSSProperties } from 'react'
import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${Spacing.xxs} ${Spacing.sm}`,
  borderRadius: BorderRadius.sm,
  fontSize: '1.2rem',
  fontWeight: FontWeight.medium,
  lineHeight: 1.4,
}

export const colorStyles: Record<string, CSSProperties> = {
  blue: { ...base, background: Colors.blueBg, color: Colors.blue },
  green: { ...base, background: Colors.greenBg, color: Colors.green },
  orange: { ...base, background: Colors.orangeBg, color: Colors.orange },
  purple: { ...base, background: Colors.primaryLight, color: Colors.primaryDark },
}
