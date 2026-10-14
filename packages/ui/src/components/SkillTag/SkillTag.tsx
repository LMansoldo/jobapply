import type { SkillTagProps } from './SkillTag.types'
import { StyledSkillTag } from './SkillTag.styles'

export function SkillTag({ color = 'purple', children }: SkillTagProps) {
  return <StyledSkillTag $color={color}>{children}</StyledSkillTag>
}
