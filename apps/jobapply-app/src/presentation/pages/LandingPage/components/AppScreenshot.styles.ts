import styled from '@emotion/styled'
import { BarFill } from '../LandingPage.styles'

export const TopbarLeft = styled.div`display:flex;align-items:center;gap:28px`

export const ToolBold = styled.span`font-weight:900`

export const ToolItalic = styled.span`font-style:italic`

export const EditorMinirow = styled.div<{ $w: string }>`height:3px;border-radius:2px;background:rgba(255,255,255,.35);width:${({ $w }) => $w}`

export const StatusLang = styled.span`margin-left:auto`

export const CatBarFill = styled(BarFill)<{ $w: string }>`width:${({ $w }) => $w}`
