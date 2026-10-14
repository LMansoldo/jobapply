import styled from '@emotion/styled'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'
import { BorderRadius } from '../../../../styles/theme/radius'

// Re-export theme tokens for use in presentational components
export { Colors, FontSize, FontWeight, FontFamily, Spacing, BorderRadius }

const TOOLBAR_HEIGHT = '7.2rem'
const STATUS_HEIGHT = '2.4rem'
const BTN_SIZE = '2.6rem'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${Colors.surfaceEditor};
  border-bottom: 1px solid ${Colors.surfaceEditorBorder};
  border-radius: ${BorderRadius.base};

  &[data-rich-editor='true'] {
    background: ${({ theme }) => theme.colors.surfacePage};
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
`

export const Toolbar = styled.div`
  height: ${TOOLBAR_HEIGHT};
  background: ${Colors.surfaceDarker};
  border-radius: ${BorderRadius.base} ${BorderRadius.base} 0 0;
  border-bottom: 1px solid ${Colors.surfaceEditorBorder};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 ${Spacing.md};
  gap: ${Spacing.xxs};
  flex-shrink: 0;

  &[data-rich-editor='true'] {
    min-height: 5.6rem;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${Spacing.sm} ${Spacing.lg};
    background: ${({ theme }) => theme.colors.white};
    border-bottom-color: ${({ theme }) => theme.colors.surfaceBorder};

    button {
      color: ${({ theme }) => theme.colors.textSub};
    }

    button:hover {
      background: ${({ theme }) => theme.colors.surfaceSelected};
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`
export const MenusRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${Spacing.xxs};
`

export const Tools = styled.div`
    flex-direction: row;
    display: flex;
    justify-content: flex-start;
`


export interface ToolbarBtnProps {
  active?: boolean
  wide?: boolean
}

export const ToolbarBtn = styled.button<ToolbarBtnProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${Spacing.xxs};
  min-width: ${BTN_SIZE};
  height: ${BTN_SIZE};
  padding: 0 ${({ wide }) => (wide ? Spacing.sm : Spacing.xs)};
  border: none;
  background: ${({ active }) => (active ? 'rgba(124,58,237,0.25)' : 'transparent')};
  color: ${({ active }) => (active ? Colors.primary : 'rgba(255,255,255,0.65)')};
  font-size: ${FontSize.md0};
  font-weight: ${({ wide }) => (wide ? FontWeight.semibold : FontWeight.regular)};
  font-family: ${FontFamily.body};
  cursor: pointer;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
  }
`

export const ToolbarDivider = styled.div`
  width: 1px;
  height: 1.6rem;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 ${Spacing.xxs};
  flex-shrink: 0;

  ${Toolbar}[data-rich-editor='true'] & {
    background: ${({ theme }) => theme.colors.surfaceBorder};
  }
`

export const EditorWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  position: relative;
  overscroll-behavior: contain;
  touch-action: pan-y;

  @media (max-width: 768px) {
    overflow: auto;
    min-height: auto;
    flex: none;
    height: 50vh;
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }
`

export const RichEditorHost = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  > * {
    flex: 1;
    min-height: 0;
  }

  @media (max-width: 768px) {
    flex: none;
    height: 50vh;
  }
`

export const RichEditorFallback = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surfaceSubtle};
`

export const StatusBar = styled.div`
  height: ${STATUS_HEIGHT};
  background: ${Colors.surfaceDarker};
  border-radius: 0 0 ${BorderRadius.base} ${BorderRadius.base};
  border-top: 1px solid ${Colors.surfaceEditorBorder};
  display: flex;
  align-items: center;
  gap: ${Spacing.lg};
  padding: 0 ${Spacing.lg};
  font-family: ${FontFamily.mono};
  font-size: ${FontSize.xxs};
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
`

export const StatusRight = styled.span`
  margin-left: auto;
`

// Diff styling classes
export const diffStyles = `
  .te-diff-insert {
    background: rgba(34, 197, 94, 1);
    border-radius: 0 2px 2px 0;
  }

  .te-diff-delete {
    text-decoration: line-through;
    text-decoration-color: rgba(239, 68, 68, 0.7);
    text-decoration-thickness: 2px;
    background:  rgba(239, 68, 68, 0.5);
    border-radius: 0 2px 2px 0;
    color: rgba(255, 255, 255, 0.5);
  }

  .te-diff-replace {
    background: rgba(245, 158, 11, 0.5);
    border-radius: 0 2px 2px 0;
  }
`

// For FileDropdownMenu
export const FileMenuWrapper = styled.div`
  position: relative;
`

export const FileMenuDrop = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${Colors.surfaceDarker};
  border: 1px solid ${Colors.surfaceEditorBorder};
  min-width: 20rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);

  ${Toolbar}[data-rich-editor='true'] & {
    background: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.surfaceBorder};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`

export const FileMenuList = styled.div`
  padding: ${Spacing.xs} 0;
`

export const MenuItemRow = styled.button`
  width: 100%;
  padding: ${Spacing.xs} ${Spacing.md};
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  font-size: ${FontSize.sm};
  font-family: ${FontFamily.body};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.35);
    cursor: not-allowed;
  }

  ${Toolbar}[data-rich-editor='true'] & {
    color: ${({ theme }) => theme.colors.textMain};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceSelected};
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    &:disabled {
      color: ${({ theme }) => theme.colors.textDisabled};
    }
  }
`

export const SubmenuDrop = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  background: ${Colors.surfaceDarker};
  border: 1px solid ${Colors.surfaceEditorBorder};
  min-width: 18rem;
  max-height: 30rem;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);

  ${Toolbar}[data-rich-editor='true'] & {
    background: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.surfaceBorder};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`

export const SubmenuItem = styled.button`
  width: 100%;
  padding: ${Spacing.xs} ${Spacing.md};
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  font-size: ${FontSize.sm};
  font-family: ${FontFamily.body};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  ${Toolbar}[data-rich-editor='true'] & {
    color: ${({ theme }) => theme.colors.textMain};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceSelected};
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`

export const NotificationDot = styled.div`
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: ${BorderRadius.avatar};
  background: #ff4d4f;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  animation: pulse 1.5s infinite;
`

// Modal styles (Phrases/Tips/SemanticGaps/KeywordPhrases/RemoveSuggestions modais)
// foram movidos para @jobapply/ats-ui (src/tailoring/modals.styles.ts).

export const RightArrowIcon = styled.span`
  .anticon {
    font-size: 0.8rem;
    opacity: 0.6;
  }
`

export const MenuItemIcon = styled.span`
  font-size: 1.2rem;
  opacity: 0.6;
`

export const MenuDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: ${Spacing.xs} 0;
`

export const JobTitleSpan = styled.span`
  font-size: ${FontSize.xxs};
  opacity: 0.6;
  font-style: italic;
`
