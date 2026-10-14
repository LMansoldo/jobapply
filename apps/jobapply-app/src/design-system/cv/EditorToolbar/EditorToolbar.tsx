import type { EditorToolbarProps } from './EditorToolbar.types'
import { Toolbar, ToolBtn, Divider } from './EditorToolbar.styles'

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
    <Toolbar>
      {sections.map((entry, idx) => {
        if (entry.type === 'divider') {
          return <Divider key={entry.key} />
        }
        const { item } = entry
        return (
          <ToolBtn
            key={item.key}
            type="button"
            title={item.label}
            $active={!!item.active}
            $wide={!!item.wide}
            onClick={() => onAction(item.key)}
          >
            {item.icon}
            {item.wide && item.label && <span>{item.label}</span>}
          </ToolBtn>
        )
      })}
    </Toolbar>
  )
}
