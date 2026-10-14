import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
`

export const Avatar = styled.div`
  width: 9.6rem;
  height: 9.6rem;
  border-radius: ${({ theme }) => theme.radius.avatar};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-size: 3.2rem;
  color: ${({ theme }) => theme.colors.primaryDark};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.avatar};
  cursor: pointer;
  position: relative;
`

export const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const Overlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.avatar};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s;
  color: ${({ theme }) => theme.colors.white};
  font-size: 2rem;
`

export const HiddenInput = styled.input`
  display: none;
`

export const Hint = styled.span`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSub};
`
