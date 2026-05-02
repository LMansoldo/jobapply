import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons'
import type { KeywordItemProps } from './KeywordItem.types'
import { styles, statusColors } from './KeywordItem.styles'

const icons = {
  found: <CheckCircleOutlined />,
  missing: <CloseCircleOutlined />,
  weak: <WarningOutlined />,
}

export function KeywordItem({ keyword, status }: KeywordItemProps) {
  return (
    <div style={styles.row}>
      <span style={styles.keyword}>{keyword}</span>
      <span style={{ ...styles.statusIcon, color: statusColors[status] }}>
        {icons[status]}
      </span>
    </div>
  )
}
