import type { LangTabsProps } from './LangTabs.types'
import { styles } from './LangTabs.styles'

export function LangTabs({ tabs, activeKey, onChange }: LangTabsProps) {
  return (
    <div style={styles.container}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          style={{
            ...styles.tab,
            ...(tab.key === activeKey ? styles.tabActive : {}),
          }}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
