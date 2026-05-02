import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

// ── Constants ──────────────────────────────────────────────
const LOCALE_BTN_BORDER_WIDTH = '1.5px'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.md};
`

export const LocaleRow = styled.div`
  display: flex;
  gap: ${Spacing.sm};
`

export interface LocaleBtnProps {
  active: boolean
  enabled: boolean
}

export const LocaleBtn = styled.button<LocaleBtnProps>`
  flex: 1;
  padding: ${Spacing.sm} ${Spacing.md};
  border: ${LOCALE_BTN_BORDER_WIDTH} solid
    ${({ active }) => (active ? Colors.primaryDark : Colors.surfaceBorder)};
  border-radius: ${BorderRadius.base};
  background: ${({ active }) => (active ? Colors.primaryDark : Colors.white)};
  color: ${({ active, enabled }) =>
    active ? Colors.white : enabled ? Colors.textMain : Colors.textDisabled};
  font-family: ${FontFamily.body};
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.semibold};
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'not-allowed')};
  transition: all 0.15s;
`

export const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`

export const FullWidthBtn = styled.div`
  width: 100%;
  button {
    width: 100%;
    justify-content: center;
  }
`

export const DangerBtn = styled.div`
  width: 100%;
  button {
    width: 100%;
    justify-content: center;
    color: ${Colors.danger};
    border-color: ${Colors.danger};
  }
`

export const ScoreCenter = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${Spacing.md};
`

export const CompletionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`

export const CompletionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.sm};
  font-size: ${FontSize.sm};
  color: ${Colors.textMain};
`

export const VisibilityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`

export const VisibilityRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${FontSize.sm};
`

export const VisibilityLabel = styled.span`
  color: ${Colors.textSub};
`

export const VisibilityValue = styled.span`
  font-weight: ${FontWeight.bold};
  color: ${Colors.primaryDark};
  font-family: ${FontFamily.heading};
`

export const completionIcon = (color: string) => css({
  color,
  fontSize: FontSize.base,
})
