import { useTranslation } from 'react-i18next'
import type { PreviewTabsProps, PreviewTabKey } from './PreviewTabs.types'
import { Container, Tab } from './PreviewTabs.styles'

export function PreviewTabs({ activeTab, onChange }: PreviewTabsProps) {
  const { t } = useTranslation()

  const tabs: { key: PreviewTabKey; label: string }[] = [
    { key: 'editor', label: t('cv.editor') },
    { key: 'preview', label: t('cv.preview') },
  ]

  return (
    <Container>
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          type="button"
          $active={tab.key === activeTab}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </Tab>
      ))}
    </Container>
  )
}
