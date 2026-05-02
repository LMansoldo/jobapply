import { css } from '@emotion/css'
import { FontSize, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const keywordsArea = css({
  padding: `${Spacing.xs} ${Spacing.lg}`,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const keywordsRow = css({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: '6px',
  alignItems: 'center',
  overflow: 'hidden',
})

export const keywordsLabel = css({
  fontSize: FontSize.xxs,
  color: 'rgba(255,255,255,0.45)',
  fontFamily: FontFamily.mono,
  flexShrink: 0,
})

export const keywordChipAdd = css({
  background: 'rgba(239, 68, 68, 0.12)',
  border: '1px solid rgba(239, 68, 68, 0.35)',
  borderRadius: '4px',
  color: 'rgba(239, 68, 68, 0.85)',
  fontSize: FontSize.xxs,
  fontFamily: FontFamily.mono,
  padding: '2px 8px',
  cursor: 'pointer',
  lineHeight: '1.6',
  whiteSpace: 'nowrap', // Prevent text wrapping
  display: 'inline-block', // Ensure proper width calculation
  width: 'max-content', // Take only needed width
  maxWidth: '200px', // Limit maximum width
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  ':hover': { background: 'rgba(239, 68, 68, 0.22)' },
})

export const keywordChipRephrase = css({
  background: 'rgba(245, 158, 11, 0.12)',
  border: '1px solid rgba(245, 158, 11, 0.35)',
  borderRadius: '4px',
  color: 'rgba(245, 158, 11, 0.85)',
  fontSize: FontSize.xxs,
  fontFamily: FontFamily.mono,
  padding: '2px 8px',
  cursor: 'pointer',
  lineHeight: '1.6',
  whiteSpace: 'nowrap', // Prevent text wrapping
  display: 'inline-block', // Ensure proper width calculation
  width: 'max-content', // Take only needed width
  maxWidth: '200px', // Limit maximum width
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  ':hover': { background: 'rgba(245, 158, 11, 0.22)' },
})

export const carouselContainer = css({
  position: 'relative',
  width: '100%',
  minHeight: 'auto', // Ensure carousel has some height
  backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light background to see container
  maxWidth: '82vw',
})

export const carouselSection = css({
  marginBottom: Spacing.xs,
})

export const carouselLabel = css({
  fontSize: FontSize.xxs,
  color: 'rgba(255,255,255,0.45)',
  fontFamily: FontFamily.mono,
  marginBottom: '4px',
  display: 'block',
})

export const keywordChipWrapper = css({
  flexShrink: 0,
  display: 'inline-block',
  width: 'auto',
  height: 'auto',
  margin: '0 3px', // Add gap between items
  // Ensure proper sizing for carousel slides
  '& > button': {
    display: 'inline-block',
    width: 'auto',
  },
})

// Override Ant Design Carousel styles for variableWidth carousel
export const requestButton = css({
  background: 'rgba(59, 130, 246, 0.12)',
  border: '1px solid rgba(59, 130, 246, 0.35)',
  borderRadius: '4px',
  color: 'rgba(59, 130, 246, 0.85)',
  fontSize: FontSize.xxs,
  fontFamily: FontFamily.mono,
  padding: '2px 12px',
  cursor: 'pointer',
  lineHeight: '1.6',
  whiteSpace: 'nowrap',
  display: 'inline-block',
  marginLeft: Spacing.sm,
  ':hover': {
    background: 'rgba(59, 130, 246, 0.22)',
  },
})

export const buttonContainer = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: Spacing.xs,
})

export const carouselOverrides = css({
  '& .ant-carousel': {
    width: '100%',
    minHeight: '2rem', // Reduced height
  },
  '& .ant-carousel .slick-slide': {
    height: 'auto',
    display: 'inline-block',
    float: 'none',
    verticalAlign: 'top',
    '> div': {
      display: 'inline-block',
      width: 'auto',
    },
  },
  '& .ant-carousel .slick-list': {
    minHeight: '2rem', // Reduced height
    overflow: 'hidden',
  },
  '& .ant-carousel .slick-track': {
    display: 'block',
    whiteSpace: 'nowrap',
    marginLeft: 0,
    marginRight: 0,
    '&:before, &:after': {
      display: 'none',
    },
  },
  '& .ant-carousel .slick-prev, & .ant-carousel .slick-next': {
    width: '20px', // Smaller
    height: '20px', // Smaller
    fontSize: '10px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    zIndex: 1,
    top: '50%', // Center vertically
    transform: 'translateY(-50%)', // Center vertically
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
    '&::before': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  '& .ant-carousel .slick-prev': {
    left: '-10px',
  },
  '& .ant-carousel .slick-next': {
    right: '-10px',
  },
})