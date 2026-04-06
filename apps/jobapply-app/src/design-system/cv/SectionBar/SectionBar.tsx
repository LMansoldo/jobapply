import type { SectionBarProps } from './SectionBar.types'
import { styles } from './SectionBar.styles'

export function SectionBar({ sections, activeKey, onChange }: SectionBarProps) {
  return (
    <div style={styles.bar}>
      {sections.map((section) => (
        <button
          key={section.key}
          type="button"
          style={{
            ...styles.chip,
            ...(section.key === activeKey ? styles.chipActive : {}),
          }}
          onClick={() => onChange(section.key)}
        >
          {section.label}
        </button>
      ))}
    </div>
  )
}
