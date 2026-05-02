import type { FilterTagCloudProps } from './FilterTagCloud.types'
import { styles } from './FilterTagCloud.styles'

export function FilterTagCloud({ tags, onChange }: FilterTagCloudProps) {
  return (
    <div style={styles.cloud}>
      {tags.map((tag) => (
        <button
          key={tag.label}
          type="button"
          style={{ ...styles.tag, ...(tag.active ? styles.tagActive : {}) }}
          onClick={() => onChange(tag.label, !tag.active)}
        >
          {tag.label}
        </button>
      ))}
    </div>
  )
}
