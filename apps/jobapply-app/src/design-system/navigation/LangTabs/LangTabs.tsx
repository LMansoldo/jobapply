import type { LangTabsProps } from './LangTabs.types'
import { Container, Tab } from './LangTabs.styles'

export function LangTabs({ tabs, activeKey, onChange }: LangTabsProps) {
  return (
    <Container>
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          type="button"
          $active={tab.key === activeKey}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </Tab>
      ))}
    </Container>
  )
}
