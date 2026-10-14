import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Button } from 'antd'
import type { UITheme } from '@jobapply/ui'

export const EditorShell = styled.div<{ $height?: number }>`
  display: flex;
  flex-direction: column;
  height: ${({ $height }) => ($height ? `${$height}px` : 'auto')};
  min-height: 0;
  background: ${({ theme }) => theme.colors.surfacePage};
  border: none;
  border-radius: 0;
  overflow: hidden;
  font-family: ${({ theme }) => theme.typography.family.body};
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    align-items: flex-start;
    flex-direction: column;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  }
`

export const ToolbarIntro = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    width: 100%;
    justify-content: space-between;
  }
`

export const ToolbarEyebrow = styled.span`
  color: ${({ theme }) => theme.colors.textMain};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const ToolbarHint = styled.span`
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.xxs};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const ToolbarControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xxs};
`

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
`

export const ToolbarDivider = styled.div`
  width: 1px;
  height: 2rem;
  margin: 0 ${({ theme }) => theme.spacing.xxs};
  background: ${({ theme }) => theme.colors.borderLight};
`

export const ToolbarButton = styled(Button)<{ $active?: boolean }>`
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primaryDark : theme.colors.textSub};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primaryLight : 'transparent'};
  border-radius: ${({ theme }) => theme.radius.xs};
  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primaryLight : theme.colors.white};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    min-width: 2.75rem;
    min-height: 2.75rem;
  }
`

export const FloatingToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `calc(${theme.spacing.xxs} / 2) ${theme.spacing.xs}`};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    max-width: calc(100vw - 1rem);
    overflow-x: auto;
  }
`

export const ContentArea = styled.div<{ $height?: number }>`
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: ${({ theme }) => theme.spacing.lg};
  background:
    radial-gradient(circle at 10% 0%, rgba(196, 181, 253, 0.22), transparent 25rem),
    ${({ theme }) => theme.colors.surfacePage};
  height: ${({ $height }) => ($height ? `${$height}px` : undefined)};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    padding: ${({ theme }) => theme.spacing.xs};
  }
`

export const EditorSkeleton = styled.div<{ $height?: number }>`
  display: flex;
  flex-direction: column;
  height: ${({ $height }) => ($height ? `${$height}px` : '28rem')};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.white};
`

export const EditorSkeletonToolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: ${({ theme }) => theme.colors.surfaceSubtle};
`

export const EditorSkeletonBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
`

export const EditorSkeletonBlock = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '1.2rem'};
  border-radius: ${({ theme }) => theme.radius.xs};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceLight} 25%,
    ${({ theme }) => theme.colors.primaryLight} 50%,
    ${({ theme }) => theme.colors.surfaceLight} 75%
  );
  background-size: 200% 100%;
  animation: editorSkeletonShimmer 1.5s ease-in-out infinite;

  @keyframes editorSkeletonShimmer {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
  }
`

export const DocumentCanvas = styled.div`
  width: 100%;
  min-height: 100%;
  margin: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white};

  .ProseMirror {
    width: min(100%, 78rem);
    min-height: 48rem;
    margin: 0 auto;
    box-sizing: border-box;
    outline: none;
    padding: 2.8rem 4.8rem 6rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.typography.size.md};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

    ${({ theme }) => theme.mediaQueries.mobileOnly} {
      min-height: 42rem;
      padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md} 4rem`};
    }
  }
`

export const CanvasHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.md} 4.8rem`};
  background: linear-gradient(105deg, ${({ theme }) => theme.colors.surfaceSelected}, ${({ theme }) => theme.colors.white});
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    align-items: flex-start;
    flex-direction: column;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  }
`

export const CanvasHeaderCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const CanvasEyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

export const CanvasTitle = styled.span`
  color: ${({ theme }) => theme.colors.textMain};
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`

export const CanvasMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

export const CanvasMetaItem = styled.span`
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  white-space: nowrap;
`

export const CanvasBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: 0.4rem ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.xs};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
`

export const contentGlobalStyles = (theme: UITheme) => css`
  .rich-md-content h1 {
    font-family: ${theme.typography.family.heading};
    font-size: 2.8rem;
    font-weight: ${theme.typography.weight.bold};
    color: ${theme.colors.textMain};
    margin: 0 0 0.45em;
  }
  .rich-md-content h2 {
    font-family: ${theme.typography.family.heading};
    font-size: 2rem;
    font-weight: ${theme.typography.weight.bold};
    color: ${theme.colors.primaryDeeper};
    margin: 1.25em 0 0.45em;
    padding-bottom: 0.35em;
    border-bottom: 1px solid ${theme.colors.surfaceBorder};
  }
  .rich-md-content h3 {
    font-size: ${theme.typography.size.lg};
    font-weight: ${theme.typography.weight.semibold};
    color: ${theme.colors.textMain};
    margin: 1em 0 0.4em;
  }
  .rich-md-content p {
    margin: 0.65em 0;
    color: ${theme.colors.textBody};
  }
  .rich-md-content ul,
  .rich-md-content ol {
    margin: 0.5em 0;
    padding-left: 2.4rem;
  }
  .rich-md-content ul {
    list-style: disc;
  }
  .rich-md-content ol {
    list-style: decimal;
  }
  .rich-md-content li {
    margin: 0.35em 0;
    color: ${theme.colors.textBody};
  }
  .rich-md-content li > p {
    margin: 0;
  }
  .rich-md-content strong {
    font-weight: ${theme.typography.weight.bold};
  }
  .rich-md-content em {
    font-style: italic;
  }
  .rich-md-content hr {
    border: none;
    border-top: 1px solid ${theme.colors.border};
    margin: 1.2em 0;
  }
  .rich-md-content a {
    color: ${theme.colors.primaryDeeper};
  }
`

export const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.xxs};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  }
`

export const StatusBarButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  padding: ${({ theme }) => `0.2rem ${theme.spacing.xxs}`};
  border-radius: ${({ theme }) => theme.radius.xs};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const StatusBarMeta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  margin-left: auto;
  color: ${({ theme }) => theme.colors.success};
  font-weight: ${({ theme }) => theme.typography.weight.medium};

  &::before {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: ${({ theme }) => theme.radius.full};
    background: currentColor;
    content: '';
  }
`

export const StatusBarStats = styled.span`
  padding-left: ${({ theme }) => theme.spacing.sm};
  border-left: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.textSub};
`

export const EditorBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
  max-height: 600px;
`

export const suggestionGlobalStyles = (theme: UITheme) => css`
  .rich-md-content .rs-mark-replace {
    background: rgba(245, 158, 11, 0.35);
    box-shadow: 0 1px 0 rgba(245, 158, 11, 0.8);
    border-radius: 2px;
  }
  .rich-md-content .rs-mark-remove {
    background: rgba(239, 68, 68, 0.25);
    text-decoration: line-through;
    text-decoration-color: rgba(239, 68, 68, 0.7);
    text-decoration-thickness: 2px;
    border-radius: 2px;
  }
  .rich-md-content .rs-diff-added {
    background: rgba(34, 197, 94, 0.15);
    box-shadow: inset 3px 0 0 rgba(34, 197, 94, 0.8);
    border-radius: 0 2px 2px 0;
  }
  .rs-diff-removed {
    display: block;
    padding: 0.1em ${theme.spacing.sm};
    color: ${theme.colors.textMuted};
    background: ${theme.colors.surfaceLight};
    border-left: 3px solid rgba(239, 68, 68, 0.5);
    text-decoration: line-through;
    text-decoration-color: rgba(239, 68, 68, 0.7);
    text-decoration-thickness: 2px;
    font-size: 0.92em;
    border-radius: 0 2px 2px 0;
  }
  @keyframes rsFlashGreen {
    0% {
      background-color: rgba(34, 197, 94, 0.45);
    }
    100% {
      background-color: transparent;
    }
  }
  @keyframes rsFlashAmber {
    0% {
      background-color: rgba(245, 158, 11, 0.5);
    }
    100% {
      background-color: transparent;
    }
  }
  .rich-md-content .rs-flash-green {
    animation: rsFlashGreen 1.5s ease-out;
    border-radius: 2px;
  }
  .rich-md-content .rs-flash-amber {
    animation: rsFlashAmber 1.5s ease-out;
    border-radius: 2px;
  }
`

export const Rail = styled.aside`
  width: 28rem;
  flex-shrink: 0;
  border-left: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.surfaceSelected};
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    display: none;
  }
`

export const RailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RailEyebrow = styled.span`
  display: block;
  margin-bottom: 0.3rem;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

export const RailTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const RailCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.8rem;
  height: 2.8rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`

export const RailHint = styled.p`
  margin: -0.2rem 0 0;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

export const RailGroupTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xxs};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const RailCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => `calc(${theme.spacing.xs} + 1.4rem)`};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: 0 0.4rem 1rem rgba(30, 27, 46, 0.04);

  &::before {
    content: '';
    position: absolute;
    top: ${({ theme }) => `calc(${theme.spacing.xs} + 0.2rem)`};
    left: ${({ theme }) => `calc(${theme.spacing.xs} + 0.1rem)`};
    width: 0.8rem;
    height: 0.8rem;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.primaryMid};
  }

  &[data-kind='insert']::before {
    background: ${({ theme }) => theme.colors.success};
  }

  &[data-kind='replace']::before {
    background: ${({ theme }) => theme.colors.warning};
  }

  &[data-kind='remove']::before {
    background: ${({ theme }) => theme.colors.danger};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderPurple};
  }
`

export const RailCardText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  word-break: break-word;
`

export const RailCardReason = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
`

export const RailCardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  margin-top: ${({ theme }) => theme.spacing.xxs};
`

export const RailButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primaryDark};
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.xs};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-family: ${({ theme }) => theme.typography.family.body};
  padding: ${({ theme }) => `0.1rem ${theme.spacing.xs}`};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDeeper};
    border-color: ${({ theme }) => theme.colors.primaryDeeper};
  }
`

export const RailDismissButton = styled(RailButton)`
  background: transparent;
  border-color: ${({ theme }) => theme.colors.borderLight};
  color: ${({ theme }) => theme.colors.textBase};
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.textMain};
    border-color: ${({ theme }) => theme.colors.border};
  }
`

export const PhraseChip = styled(RailButton)`
  background: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.primaryMid};
  color: ${({ theme }) => theme.colors.primaryDeeper};
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDeeper};
  }
`

export const RailPriorityBadge = styled.span<{ $priority?: string }>`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme, $priority }) =>
    $priority === 'critical' || $priority === 'high'
      ? theme.colors.danger
      : $priority === 'low'
        ? theme.colors.success
        : theme.colors.warning};
`

export const ApplyPopoverCard = styled.div<{
  $top: number
  $left: number
  $mobile?: boolean
}>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  z-index: 30;
  width: 24rem;
  max-width: calc(100% - 1.6rem);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  ${({ $mobile, theme }) =>
    $mobile &&
    css`
      position: fixed;
      top: auto;
      bottom: 0;
      left: 0;
      width: 100%;
      max-width: 100%;
      max-height: 60vh;
      overflow-y: auto;
      z-index: 60;
      border-radius: ${theme.radius.lg} ${theme.radius.lg} 0 0;
    `}
`

export const ApplyPopoverText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
  word-break: break-word;
`

export const ApplyPopoverActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxs};
  justify-content: flex-end;
`

export const ApplyButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.success};
  background: ${({ theme }) => theme.colors.successBg};
  color: ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.radius.xs};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  padding: ${({ theme }) => `0.2rem ${theme.spacing.sm}`};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.white};
  }
`

export const DismissButton = styled(ApplyButton)`
  border-color: ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const MobileRailToggle = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.sm};
  left: 50%;
  transform: translateX(-50%);
  z-index: 45;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  min-height: 2.75rem;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primaryDeeper};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

export const SuggestionSheetPanel = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  max-height: 60vh;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => `${theme.radius.lg} ${theme.radius.lg} 0 0`};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

export const SheetDragHandle = styled.div`
  width: 3rem;
  height: 0.25rem;
  margin: ${({ theme }) => theme.spacing.xs} auto 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`

export const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
`

export const SheetCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.md};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const SheetBody = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};
`
