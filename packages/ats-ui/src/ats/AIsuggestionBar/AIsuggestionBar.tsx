import { BulbOutlined, ReloadOutlined } from '@ant-design/icons'
import { useTheme } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import type { AIsuggestionBarProps } from './AIsuggestionBar.types'
import { getStyles } from './AIsuggestionBar.styles'

export function AIsuggestionBar({ text, onRegen }: AIsuggestionBarProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = getStyles(theme)

  return (
    <div style={styles.bar}>
      <BulbOutlined style={styles.icon} />
      <span style={styles.text}>{text}</span>
      <button type="button" style={styles.btn} onClick={onRegen}>
        <ReloadOutlined /> {t('cv.regen')}
      </button>
    </div>
  )
}
