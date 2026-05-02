import { useTranslation } from 'react-i18next'
import type { PreviewTabsProps, PreviewTabKey } from './PreviewTabs.types'
import { styles } from './PreviewTabs.styles'

export function PreviewTabs({ activeTab, onChange }: PreviewTabsProps) {
  const { t } = useTranslation()

  const tabs: { key: PreviewTabKey; label: string }[] = [
    { key: 'editor', label: t('cv.editor') },
    { key: 'preview', label: t('cv.preview') },
  ]

  return (
    <div style={styles.container}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          style={{
            ...styles.tab,
            ...(tab.key === activeTab ? styles.tabActive : {}),
          }}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
