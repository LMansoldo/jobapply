import styled from '@emotion/styled'
import type { UITheme } from '../../theme'
import type { SkillTagColor } from './SkillTag.types'

const colorStyles: Record<SkillTagColor, (theme: UITheme) => string> = {
  blue: (t) => `background: ${t.colors.blueBg}; color: ${t.colors.blue};`,
  green: (t) => `background: ${t.colors.greenBg}; color: ${t.colors.green};`,
  orange: (t) => `background: ${t.colors.orangeBg}; color: ${t.colors.orange};`,
  purple: (t) => `background: ${t.colors.primaryLight}; color: ${t.colors.primaryDark};`,
}

export const StyledSkillTag = styled.span<{ $color: SkillTagColor }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: 1.4;
  ${({ theme, $color }) => colorStyles[$color](theme)}
`
