import { Colors } from '../../../styles/theme/colors'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${Spacing.xxs} 0`,
    gap: Spacing.sm,
  },
  keyword: {
    fontSize: '1.3rem',
    color: Colors.textMain,
    flex: 1,
  },
  statusIcon: {
    fontSize: '1.4rem',
    fontWeight: FontWeight.bold,
    flexShrink: 0,
  },
}

export const statusColors: Record<string, string> = {
  found: Colors.green,
  missing: Colors.danger,
  weak: Colors.orange,
}
