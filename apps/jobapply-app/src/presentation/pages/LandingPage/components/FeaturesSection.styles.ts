import styled from '@emotion/styled'
import { LeadSm, RevealFade } from '../LandingPage.styles'

export const FeatureLead = styled(LeadSm)`margin-top:28px`

export const FeatDot = styled.span<{ $color: string }>`display:inline-block;width:5px;height:5px;border-radius:999px;background:${({ $color }) => $color};box-shadow:0 0 8px ${({ $color }) => $color}`

export const MockWrap = styled(RevealFade)`position:relative`
