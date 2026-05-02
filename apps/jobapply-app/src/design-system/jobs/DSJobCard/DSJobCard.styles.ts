import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { Shadows } from '../../../styles/theme/shadows'
import { Spacing } from '../../../styles/theme/spacing'
import { FontFamily, FontWeight } from '../../../styles/theme/typography'

export const styles = {
  card: {
    background: Colors.white,
    borderRadius: BorderRadius.base,
    border: `1px solid ${Colors.surfaceBorder}`,
    boxShadow: Shadows.sm,
    padding: Spacing.lg,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, border-color 0.2s',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: Spacing.sm,
  },
  cardSelected: {
    borderColor: Colors.primaryDark,
    boxShadow: Shadows.md,
  },
  cardFeaturedAccent: {
    height: '4px',
    background: Colors.gradientTailorBtn,
    borderRadius: `${BorderRadius.base} ${BorderRadius.base} 0 0`,
    margin: `-${Spacing.lg} -${Spacing.lg} 0`,
  },
  top: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  titleGroup: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontWeight: FontWeight.semibold,
    fontSize: '1.5rem',
    color: Colors.textMain,
    margin: 0,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  company: {
    fontSize: '1.3rem',
    color: Colors.textSub,
    marginTop: '2px',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: Spacing.xs,
    alignItems: 'center',
  },
  metaText: {
    fontSize: '1.2rem',
    color: Colors.textSub,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: Spacing.xs,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  salary: {
    fontSize: '1.3rem',
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
}
