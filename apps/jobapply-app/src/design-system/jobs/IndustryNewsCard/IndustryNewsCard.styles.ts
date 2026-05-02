import styled from '@emotion/styled'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

// ── Constants ──────────────────────────────────────────────
const THUMBNAIL_WIDTH = '5.6rem'   // 56px
const THUMBNAIL_HEIGHT = '4.4rem'  // 44px
const THUMBNAIL_ICON_SIZE = '2.2rem' // 22px = FontSize.xxl

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.md};
`

export const Item = styled.div`
  display: flex;
  gap: ${Spacing.md};
  align-items: flex-start;
  cursor: pointer;
  transition: opacity 0.15s;
`

export const Thumbnail = styled.div`
  width: ${THUMBNAIL_WIDTH};
  height: ${THUMBNAIL_HEIGHT};
  background: ${Colors.surfacePage};
  border-radius: ${BorderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${THUMBNAIL_ICON_SIZE};
  flex-shrink: 0;
`

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`

export const Title = styled.p`
  margin: 0;
  font-size: ${FontSize.sm};
  font-weight: ${FontWeight.medium};
  color: ${Colors.textMain};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const Meta = styled.p`
  margin: ${Spacing.xs} 0 0;
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};
`
