import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'

export const styles = {
  wrapper: {
    display: 'inline-flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.8rem',
  },
  svgWrapper: {
    position: 'relative' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
  },
  value: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.bold,
    color: Colors.primaryDark,
    lineHeight: 1,
    display: 'block',
  },
  sublabel: {
    fontSize: '1.1rem',
    color: Colors.textSub,
    display: 'block',
  },
  label: {
    fontSize: '1.2rem',
    fontWeight: FontWeight.medium,
    color: Colors.textSub,
  },
  track: {
    stroke: Colors.surfaceBorder,
    fill: 'none',
  },
}
