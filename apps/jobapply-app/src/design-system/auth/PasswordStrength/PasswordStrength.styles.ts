import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Spacing } from '../../../styles/theme/spacing'

export const strengthColors = ['transparent', Colors.danger, Colors.orange, Colors.warning, Colors.green]
export const strengthLabels = ['', 'Muito fraca', 'Fraca', 'Média', 'Forte']

export const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: Spacing.xxs,
  },
  bars: {
    display: 'flex',
    gap: Spacing.xs,
  },
  bar: {
    flex: 1,
    height: '4px',
    borderRadius: BorderRadius.full,
    background: Colors.surfaceBorder,
    transition: 'background 0.3s',
  },
  label: {
    fontSize: '1.2rem',
    transition: 'color 0.3s',
  },
}
