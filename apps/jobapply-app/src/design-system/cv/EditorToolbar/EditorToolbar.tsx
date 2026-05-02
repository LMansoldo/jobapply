import type { EditorToolbarProps } from './EditorToolbar.types'
import { styles } from './EditorToolbar.styles'

export function EditorToolbar({ items, onAction }: EditorToolbarProps) {
  const groups: Record<string, typeof items> = {}
  const ungrouped: typeof items = []

  for (const item of items) {
    if (item.group) {
      if (!groups[item.group]) groups[item.group] = []
      groups[item.group].push(item)
    } else {
      ungrouped.push(item)
    }
  }

  const sections = [
    ...ungrouped.map((item) => ({ type: 'item' as const, item })),
    ...Object.values(groups).flatMap((groupItems, i) => [
      { type: 'divider' as const, key: `divider-${i}` },
      ...groupItems.map((item) => ({ type: 'item' as const, item })),
    ]),
  ]

  return (
    <div style={styles.toolbar}>
      {sections.map((entry, idx) => {
        if (entry.type === 'divider') {
          return <div key={entry.key} style={styles.divider} />
        }
        const { item } = entry
        return (
          <button
            key={item.key}
            type="button"
            title={item.label}
            style={{
              ...styles.btn,
              ...(item.active ? styles.btnActive : {}),
              ...(item.wide ? styles.btnWide : {}),
            }}
            onClick={() => onAction(item.key)}
          >
            {item.icon}
            {item.wide && item.label && <span>{item.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
