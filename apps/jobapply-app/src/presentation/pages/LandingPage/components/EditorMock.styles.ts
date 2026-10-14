import styled from '@emotion/styled'
import { BarFillCyan, scoreCountKeyframe } from '../LandingPage.styles'

export const MockDot = styled.div<{ $bg: string }>`width:9px;height:9px;border-radius:999px;background:${({ $bg }) => $bg}`

export const MockLabelDot = styled.span<{ $color: string }>`width:5px;height:5px;border-radius:999px;background:${({ $color }) => $color};box-shadow:0 0 8px ${({ $color }) => $color}`

export const KwPlus = styled.span`font-size:10px`

export const RingProgressCircle = styled.circle<{ $reduce: boolean }>`
  ${({ $reduce }) => ($reduce ? 'stroke-dashoffset:26' : `animation:${scoreCountKeyframe} 2.2s cubic-bezier(.2,.7,.2,1) .3s both`)}
`

export const ScoreBarFill = styled(BarFillCyan)<{ $w: string }>`width:${({ $w }) => $w}`
