import { Colors } from '../../../styles/theme/colors'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  wrapper: {
    background: Colors.pageBg,
    minHeight: '100vh',
    width: '100%',
  },
  grid: {
    display: 'grid',
    maxWidth: Spacing.pageMaxWidth,
    margin: '0 auto',
    padding: `${Spacing.lg} ${Spacing.lg}`,
    gap: Spacing.lg,
    alignItems: 'start',
  },
  gridJobs: {
    gridTemplateColumns: '28rem 1fr 30rem',
  },
  gridLinkedin: {
    gridTemplateColumns: '36rem 1fr 28rem',
  },
  gridCv: {
    gridTemplateColumns: '26rem 1fr 34rem',
  },
  gridTailoring: {
    gridTemplateColumns: '1fr 36rem',
  },
  gridDefault: {
    gridTemplateColumns: '1fr',
  },
}
