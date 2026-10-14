import styled from '@emotion/styled'
import { Spacing } from '../../../styles/theme/spacing'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Shadows } from '../../../styles/theme/shadows'

export const CardRoot = styled.div`
  background: ${Colors.white};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${Shadows.sm};
  overflow: hidden;

  @media (max-width: 767px) {
    border-radius: 0;
    box-shadow: none;
  }
`

export const CardHeader = styled.div`
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  border-bottom: 1px solid ${Colors.surfaceBorder};
  display: flex;
  align-items: center;
  gap: ${Spacing.md};

  @media (max-width: 767px) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  }
`

export const HeaderIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: ${Colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Colors.primaryDark};
  font-size: 1.8rem;
  flex-shrink: 0;
`

export const HeaderTitle = styled.h3`
  margin: 0;
  font-family: ${FontFamily.heading};
  font-weight: ${FontWeight.semibold};
  font-size: ${FontSize.lg};
  color: ${Colors.textMain};
`

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: ${FontSize.sm};
  color: ${Colors.textSub};
`

export const CardBody = styled.div`
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};

  @media (max-width: 767px) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  }
`

export const AvatarZone = styled.div`
  border: 2px dashed ${Colors.borderPurple};
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${Spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Spacing.lg};
  background: ${Colors.surfacePage};
  cursor: pointer;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${Spacing.md};
    padding: ${Spacing.md};
  }
`

export const AvatarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.md};
`

export const AvatarCircle = styled.div`
  width: 5.6rem;
  height: 5.6rem;
  border-radius: 50%;
  background: ${Colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Colors.primaryDark};
  font-size: 2.4rem;
  flex-shrink: 0;
`

export const AvatarLabel = styled.p`
  margin: 0;
  font-weight: ${FontWeight.medium};
  font-size: ${FontSize.sm};
  color: ${Colors.textMain};
`

export const AvatarHint = styled.p`
  margin: 0;
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};
  margin-top: 2px;
`

export const ChoosePhotoBtn = styled.button`
  background: none;
  border: 1.5px solid ${Colors.primaryDark};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${Colors.primaryDark};
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.medium};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  cursor: pointer;
  flex-shrink: 0;
  font-family: ${FontFamily.body};
`

export const CardFooter = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-top: 1px solid ${Colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${Colors.surfacePage};

  @media (max-width: 767px) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  }
`

export const StepLabelText = styled.span`
  font-size: ${FontSize.sm};
  color: ${Colors.textSub};
  font-weight: ${FontWeight.medium};
`

export const PrefixIcon = styled.span`
  color: ${Colors.textSub};
`

export const PrefixEmoji = styled.span`
  color: ${Colors.textSub};
  font-size: ${FontSize.md};
`
