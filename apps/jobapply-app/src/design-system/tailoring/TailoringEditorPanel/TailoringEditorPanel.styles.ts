import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

const TOOLBAR_HEIGHT = '3.6rem'
const STATUS_HEIGHT = '2.4rem'
const BTN_SIZE = '2.6rem'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${Colors.surfaceEditor};
`

export const Toolbar = styled.div`
  height: ${TOOLBAR_HEIGHT};
  background: ${Colors.surfaceDarker};
  border-bottom: 1px solid ${Colors.surfaceEditorBorder};
  display: flex;
  align-items: center;
  padding: 0 ${Spacing.md};
  gap: ${Spacing.xxs};
  flex-shrink: 0;
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
  border-radius: ${BorderRadius.xs};
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

export const StatusBar = styled.div`
  height: ${STATUS_HEIGHT};
  background: ${Colors.surfaceDarker};
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
    background: rgba(34, 197, 94, 0.15);
    border-left: 2px solid rgba(34, 197, 94, 0.5);
    border-radius: 0 2px 2px 0;
  }

  .te-diff-delete {
    text-decoration: line-through;
    text-decoration-color: rgba(239, 68, 68, 0.7);
    text-decoration-thickness: 2px;
    background: rgba(239, 68, 68, 0.1);
    border-left: 2px solid rgba(239, 68, 68, 0.5);
    border-radius: 0 2px 2px 0;
    color: rgba(255, 255, 255, 0.5);
  }

  .te-diff-replace {
    background: rgba(245, 158, 11, 0.15);
    border-left: 2px solid rgba(245, 158, 11, 0.5);
    border-radius: 0 2px 2px 0;
  }
`
