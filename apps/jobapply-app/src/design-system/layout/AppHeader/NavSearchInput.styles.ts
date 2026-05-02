import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { Colors } from '../../../styles/theme/colors'

// ── Constants ──────────────────────────────────────────────
const SEARCH_MAX_WIDTH = '32rem' // 320px

export const Wrapper = styled.div`
  width: 100%;
  max-width: ${SEARCH_MAX_WIDTH};
`

export const prefixIcon = css({
  color: Colors.textPlaceholder,
})
