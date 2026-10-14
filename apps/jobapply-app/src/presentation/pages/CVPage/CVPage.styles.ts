import styled from '@emotion/styled'
import { Spacing } from '../../../styles/theme/spacing'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { BorderRadius } from '../../../styles/theme/radius'

export const SpinWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${Spacing.xxxl};
`

export const ViewerRoot = styled.div`
  max-width: 128rem;
  margin: 0 auto;
`

export const ViewerTopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${Spacing.md};
`

export const WizardRoot = styled.div`
  max-width: 96rem;
  margin: 0 auto;
`

export const StepContent = styled.div<{ $mobile: boolean }>`
  padding-bottom: ${({ $mobile }) => ($mobile ? Spacing.mobileNavHeight : 0)};
`

export const EditorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${Spacing.md};
  padding: 0 ${Spacing.xs};
`

export const FooterStepLabel = styled.span`
  font-size: ${FontSize.sm};
  color: ${Colors.textSub};
`

export const MobileBottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: ${Colors.white};
  border-top: 1px solid ${Colors.surfaceBorder};
  display: flex;
  height: ${Spacing.mobileNavHeight};
`

export const SavingIcon = styled.span`
  margin-right: ${Spacing.sm2};
`

export const MobileNavBtn = styled.button`
  flex: 1;
  border: none;
  background: ${Colors.primaryDark};
  cursor: pointer;
  color: ${Colors.white};
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.bold};
  font-family: ${FontFamily.body};
`

export const MobileSkipBtn = styled.button`
  flex: 1;
  border: none;
  background: ${Colors.surfacePage};
  cursor: pointer;
  color: ${Colors.textMain};
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.medium};
  font-family: ${FontFamily.body};
  border-right: 1px solid ${Colors.surfaceBorder};
`

export const PublishLinkContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.md1};
  margin-top: ${Spacing.md1};
`

export const PublishLinkUrl = styled.span`
  font-family: monospace;
  font-size: ${FontSize.md0};
  word-break: break-all;
  background: ${Colors.surfaceLight};
  padding: ${Spacing.sm};
  border-radius: ${BorderRadius.xs};
`
