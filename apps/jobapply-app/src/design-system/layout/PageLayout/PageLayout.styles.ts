import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { Spacing } from '../../../styles/theme/spacing'

export const Wrapper = styled.div`
  background: ${Colors.pageBg};
  min-height: 100vh;
  width: 100%;
`

interface GridProps {
  templateColumns: string
}

export const Grid = styled.div<GridProps>`
  display: grid;
  max-width: ${Spacing.pageMaxWidth};
  margin: 0 auto;
  padding: ${Spacing.lg} ${Spacing.lg};
  gap: ${Spacing.lg};
  align-items: start;
  grid-template-columns: ${({ templateColumns }) => templateColumns};
`

// Grid template constants
export const GRID_JOBS = '28rem 1fr 30rem'
export const GRID_LINKEDIN = '36rem 64rem 28rem'
export const GRID_CV = '26rem 1fr 34rem'
export const GRID_TAILORING = '1fr 36rem'
export const GRID_DEFAULT = '1fr'
