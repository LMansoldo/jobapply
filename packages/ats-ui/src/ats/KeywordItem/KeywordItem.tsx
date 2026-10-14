import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { useTheme } from '@emotion/react'
import type { KeywordItemProps } from './KeywordItem.types'
import { getStatusColors, Row, Keyword, StatusIcon } from './KeywordItem.styles'

const icons = {
  found: <CheckCircleOutlined />,
  missing: <CloseCircleOutlined />,
  weak: <WarningOutlined />,
}

export function KeywordItem({ keyword, status }: KeywordItemProps) {
  const theme = useTheme()
  const statusColors = getStatusColors(theme)

  return (
    <Row>
      <Keyword>{keyword}</Keyword>
      <StatusIcon $color={statusColors[status]}>
        {icons[status]}
      </StatusIcon>
    </Row>
  )
}
