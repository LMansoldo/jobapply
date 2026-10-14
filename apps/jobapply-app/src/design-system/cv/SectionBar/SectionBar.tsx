import type { SectionBarProps } from './SectionBar.types'
import { Bar, Chip } from './SectionBar.styles'

export function SectionBar({ sections, activeKey, onChange }: SectionBarProps) {
  return (
    <Bar>
      {sections.map((section) => (
        <Chip
          key={section.key}
          type="button"
          $active={section.key === activeKey}
          onClick={() => onChange(section.key)}
        >
          {section.label}
        </Chip>
      ))}
    </Bar>
  )
}
