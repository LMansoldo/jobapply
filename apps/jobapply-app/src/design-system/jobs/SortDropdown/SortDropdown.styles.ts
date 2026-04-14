import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

// ── Constants ──────────────────────────────────────────────
const SELECT_WIDTH = '16rem' // 160px

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.sm2};
`

export const Label = styled.span`
  font-size: ${FontSize.sm};
  color: ${Colors.textSub};
  white-space: nowrap;
`

export const selectWidth = SELECT_WIDTH

export const selectClass = css`
  && {
    width: ${SELECT_WIDTH};
  }
`
