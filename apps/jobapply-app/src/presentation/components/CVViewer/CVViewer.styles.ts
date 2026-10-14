import styled from '@emotion/styled'
import { Spacing } from '../../../styles/theme/spacing'
import { Colors } from '../../../styles/theme/colors'
import { FontSize } from '../../../styles/theme/typography'
import { Shadows } from '../../../styles/theme/shadows'

export const DesktopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 28rem;
  gap: ${Spacing.lg};
  align-items: start;
`

export const Fab = styled.button`
  position: fixed;
  bottom: 9.4rem;
  right: 2rem;
  width: 5.6rem;
  height: 5.6rem;
  border-radius: 50%;
  background: ${Colors.primary};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${Shadows.ctaHover};
  z-index: 100;
  color: ${Colors.white};
  font-size: ${FontSize.lg};
  transition: transform 0.15s, box-shadow 0.15s;

  &:active {
    transform: scale(0.94);
  }
`

export const DrawerBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`
