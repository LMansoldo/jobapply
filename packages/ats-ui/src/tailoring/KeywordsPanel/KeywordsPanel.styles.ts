import styled from '@emotion/styled'

export const Root = styled.div`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  & .ant-carousel {
    width: 100%;
    min-height: 2rem;
  }

  & .ant-carousel .slick-slide {
    height: auto;
    display: inline-block;
    float: none;
    vertical-align: top;

    > div {
      display: inline-block;
      width: auto;
    }
  }

  & .ant-carousel .slick-list {
    min-height: 2rem;
    overflow: hidden;
  }

  & .ant-carousel .slick-track {
    display: block;
    white-space: nowrap;
    margin-left: 0;
    margin-right: 0;

    &:before,
    &:after {
      display: none;
    }
  }

  & .ant-carousel .slick-prev,
  & .ant-carousel .slick-next {
    width: 20px;
    height: 20px;
    font-size: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    &::before {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  & .ant-carousel .slick-prev {
    left: -10px;
  }

  & .ant-carousel .slick-next {
    right: -10px;
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

export const CarouselSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const CarouselLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.family.mono};
  margin-bottom: 4px;
  display: block;
`

export const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: auto;
  background-color: rgba(0, 0, 0, 0.05);
  max-width: 82vw;
`

export const KeywordsRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  align-items: center;
  overflow: hidden;
`

export const KeywordsLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.family.mono};
  flex-shrink: 0;
`

export const KeywordChipWrapper = styled.div`
  flex-shrink: 0;
  display: inline-block;
  width: auto;
  height: auto;
  margin: 0 3px;

  & > button {
    display: inline-block;
    width: auto;
  }
`

export const KeywordChipAdd = styled.button`
  background: rgba(167, 139, 250, 0.15);
  border: 1px solid rgba(167, 139, 250, 0.45);
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-family: ${({ theme }) => theme.typography.family.mono};
  padding: 2px 8px;
  cursor: pointer;
  line-height: 1.6;
  white-space: nowrap;
  display: inline-block;
  width: max-content;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const KeywordChipRephrase = styled.button`
  background: rgba(167, 139, 250, 0.15);
  border: 1px solid rgba(167, 139, 250, 0.45);
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-family: ${({ theme }) => theme.typography.family.mono};
  padding: 2px 8px;
  cursor: pointer;
  line-height: 1.6;
  white-space: nowrap;
  display: inline-block;
  width: max-content;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const RequestButton = styled.button`
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 4px;
  color: rgba(59, 130, 246, 0.85);
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-family: ${({ theme }) => theme.typography.family.mono};
  padding: 2px 12px;
  cursor: pointer;
  line-height: 1.6;
  white-space: nowrap;
  display: inline-block;
  margin-left: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: rgba(59, 130, 246, 0.22);
  }
`
