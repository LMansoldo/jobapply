import type { SkillTagProps } from './SkillTag.types'
import { colorStyles } from './SkillTag.styles'

export function SkillTag({ color = 'purple', children }: SkillTagProps) {
  return <span style={colorStyles[color]}>{children}</span>
}
