import styled from '@emotion/styled'
import { SearchOutlined } from '@ant-design/icons'

// ── Constants ──────────────────────────────────────────────
const SEARCH_MAX_WIDTH = '32rem' // 320px

export const Wrapper = styled.div`
  width: 100%;
  max-width: ${SEARCH_MAX_WIDTH};
`

export const PrefixIcon = styled(SearchOutlined)`
  color: ${({ theme }) => theme.colors.textPlaceholder};
`
