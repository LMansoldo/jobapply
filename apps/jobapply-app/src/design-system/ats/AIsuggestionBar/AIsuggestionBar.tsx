import { BulbOutlined, ReloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { AIsuggestionBarProps } from './AIsuggestionBar.types'
import { styles } from './AIsuggestionBar.styles'

export function AIsuggestionBar({ text, onRegen }: AIsuggestionBarProps) {
  const { t } = useTranslation()

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
