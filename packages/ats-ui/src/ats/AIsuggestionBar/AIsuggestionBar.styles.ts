import type { CSSProperties } from 'react'
import type { UITheme } from '@jobapply/ui'

export function getStyles(theme: UITheme) {
  return {
    bar: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      background: theme.colors.gradientAiToolbar,
      border: `1px solid ${theme.colors.surfaceBorder}`,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
    },
    icon: {
      fontSize: '1.6rem',
      color: theme.colors.primary,
      flexShrink: 0,
      marginTop: '2px',
    },
    text: {
      flex: 1,
      fontSize: '1.3rem',
      color: theme.colors.textMain,
      lineHeight: 1.5,
    },
    btn: {
      flexShrink: 0,
      border: `1px solid ${theme.colors.primaryMid}`,
      background: 'transparent',
      color: theme.colors.primaryDark,
      fontSize: '1.2rem',
      fontWeight: theme.typography.weight.medium,
      borderRadius: theme.radius.full,
      padding: `${theme.spacing.xxs} ${theme.spacing.sm}`,
      cursor: 'pointer',
      transition: 'background 0.15s',
    },
  } satisfies Record<string, CSSProperties>
}
