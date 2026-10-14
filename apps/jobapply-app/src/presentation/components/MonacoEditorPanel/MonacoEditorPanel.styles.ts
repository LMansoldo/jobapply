import styled from '@emotion/styled'
import { Alert } from 'antd'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const BTN_SIZE = '2.6rem'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  background: ${Colors.surfaceEditor};
  border-radius: ${({ theme }) => theme.radius.base};
  overflow: hidden;
`

export const Toolbar = styled.div`
  background: ${Colors.surfaceDarker};
  border-bottom: 1px solid ${Colors.surfaceEditorBorder};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  gap: ${Spacing.xs};
  flex-shrink: 0;
`

export const ToolbarHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const ToolbarHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.sm};
`

export const LocaleTitle = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.3rem;
`

export const ToolbarHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.md1};
`

export const LocaleBadge = styled.span`
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.bold};
  background: rgba(124,58,237,0.25);
  color: ${Colors.primary};
  padding: 1px ${Spacing.sm};
  border-radius: 10px;
`

export const OptionalBadge = styled.span`
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  background: rgba(96,165,250,0.15);
  color: ${Colors.blue};
  padding: 1px ${Spacing.sm};
  border-radius: 10px;
`

export const WordCountLabel = styled.span`
  font-size: ${FontSize.xxs};
  color: ${Colors.white};
  font-family: ${FontFamily.mono};
`

export const ToolsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const ToolbarBtn = styled.button<{ $active?: boolean; $wide?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${Spacing.xxs};
  min-width: ${BTN_SIZE};
  height: ${BTN_SIZE};
  padding: 0 ${({ $wide }) => ($wide ? Spacing.sm : Spacing.xs)};
  border: none;
  background: ${({ $active }) => ($active ? 'rgba(124,58,237,0.25)' : 'transparent')};
  color: ${({ $active }) => ($active ? Colors.primary : 'rgba(255,255,255,0.65)')};
  font-size: ${FontSize.md0};
  font-weight: ${({ $wide }) => ($wide ? FontWeight.semibold : FontWeight.regular)};
  font-family: ${FontFamily.body};
  cursor: pointer;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.9);
  }
`

export const ToolbarDivider = styled.div`
  width: 1px;
  height: 1.6rem;
  background: rgba(255,255,255,0.12);
  margin: 0 ${Spacing.xxs};
  flex-shrink: 0;
`

export const MobileTabRow = styled.div`
  display: flex;
  gap: 2px;
`

export const MobileTabBtn = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: 1px solid ${({ $active }) => ($active ? Colors.primary : 'rgba(255,255,255,0.15)')};
  background: ${({ $active }) => ($active ? 'rgba(124,58,237,0.25)' : 'transparent')};
  color: ${({ $active }) => ($active ? Colors.primary : 'rgba(255,255,255,0.5)')};
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.medium};
  font-family: ${FontFamily.body};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.xs};
`

export const SplitPane = styled.div<{ $height: number }>`
  display: flex;
  height: ${({ $height }) => $height};
  overflow: hidden;
`

export const EditorHalf = styled.div`
  width: 50%;
  border-right: 1px solid ${Colors.surfaceEditorBorder};
  overflow: hidden;
`

export const PreviewHalf = styled.div`
  width: 50%;
  overflow-y: auto;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${Colors.white};
`

const MOBILE_EDITOR_HEIGHT = '52rem'
const SMALL_MOBILE_EDITOR_HEIGHT = '32rem'

export const MobileEditorHeight = styled.div`
  height: ${MOBILE_EDITOR_HEIGHT};
  overflow: hidden;

  @media (max-width: 767px) and (max-height: 680px) {
    height: ${SMALL_MOBILE_EDITOR_HEIGHT};
  }
`

export const MobilePreviewPane = styled.div`
  height: ${MOBILE_EDITOR_HEIGHT};

  @media (max-width: 767px) and (max-height: 680px) {
    height: ${SMALL_MOBILE_EDITOR_HEIGHT};
  }

  overflow-y: auto;
  padding: ${({ theme }) => `${theme.spacing.md2} ${theme.spacing.md}`};
  background: ${Colors.white};
`

export const ErrorBanner = styled(Alert)`
  border-left: none;
  border-right: none;
  border-bottom: none;
  border-radius: 0;
`

export const ErrorList = styled.ul`
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  padding-left: ${({ theme }) => theme.spacing.lg0};
`

export const StatusBar = styled.div`
  height: 2.4rem;
  background: ${Colors.surfaceDarker};
  border-top: 1px solid ${Colors.surfaceEditorBorder};
  display: flex;
  align-items: center;
  gap: ${Spacing.lg};
  padding: 0 ${Spacing.lg};
  font-family: ${FontFamily.mono};
  font-size: ${FontSize.xxs};
  color: rgba(255,255,255,0.4);
  flex-shrink: 0;
`

export const StatusRight = styled.span`
  margin-left: auto;
`

export const EditorAreaRelative = styled.div`
  position: relative;
`

export const EmptyOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(26,7,51,0.88);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Spacing.md};
  z-index: 10;
`

export const OverlayEmoji = styled.span`
  font-size: 4rem;
`

export const OverlayTitle = styled.p`
  margin: 0;
  font-family: ${FontFamily.heading};
  font-weight: ${FontWeight.bold};
  font-size: ${FontSize.xl};
  color: ${Colors.white};
  text-align: center;
`

export const OverlaySubtitle = styled.p`
  margin: 0;
  font-size: ${FontSize.sm};
  color: rgba(255,255,255,0.7);
  text-align: center;
  max-width: 40rem;
`

export const OverlayBtns = styled.div`
  display: flex;
  gap: ${Spacing.md};
  margin-top: ${Spacing.sm};
`

export const OverlayPrimaryBtn = styled.button`
  background: ${Colors.primaryDark};
  color: ${Colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-family: ${FontFamily.body};
  font-weight: ${FontWeight.semibold};
  font-size: ${FontSize.sm};
  cursor: pointer;
`

export const OverlayGhostBtn = styled.button`
  background: rgba(255,255,255,0.15);
  color: ${Colors.white};
  border: 1.5px solid rgba(255,255,255,0.4);
  border-radius: ${({ theme }) => theme.radius.full};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-family: ${FontFamily.body};
  font-weight: ${FontWeight.semibold};
  font-size: ${FontSize.sm};
  cursor: pointer;
`
