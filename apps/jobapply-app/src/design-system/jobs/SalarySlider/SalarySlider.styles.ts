import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const Wrapper = styled.div`
  padding: 0 ${Spacing.xs};
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${Spacing.xs};
`

export const MinLabel = styled.span`
  font-size: ${FontSize.sm};
  color: ${Colors.textSub};
`

export const MaxLabel = styled.span`
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.semibold};
  color: ${Colors.primaryDark};
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${Spacing.xs};
`

export const FooterLabel = styled.span`
  font-size: ${FontSize.xxs};
  color: ${Colors.textDisabled};
`
