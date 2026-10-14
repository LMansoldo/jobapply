import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Carousel } from 'antd'
import type { KeywordsPanelProps } from './KeywordsPanel.types'
import { KeywordItem } from './KeywordItem'
import { useVisibleKeywords, calculateSlidesToShow } from './KeywordsPanel.helpers'
import * as S from './KeywordsPanel.styles'

export function KeywordsPanel({
  editorKeywords,
  onInsertKeyword,
  onReplaceKeyword,
  onNewRequest,
  showNewRequestButton = false,
}: KeywordsPanelProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [slidesToShow, setSlidesToShow] = useState(5)

  const {
    visibleToAdd,
    visibleToRephrase,
    removeToAdd,
    removeToRephrase,
  } = useVisibleKeywords(editorKeywords)

  // Calculate responsive slidesToShow
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        setSlidesToShow(calculateSlidesToShow(width))
      }
    }

    updateSlidesToShow()
    window.addEventListener('resize', updateSlidesToShow)
    return () => window.removeEventListener('resize', updateSlidesToShow)
  }, [])

  const handleInsertKeyword = (keyword: string) => {
    // Enhanced: Insert at cursor position with highlight
    onInsertKeyword(keyword)
    removeToAdd(keyword)
  }

  const handleReplaceKeyword = (from: string, to: string) => {
    // Enhanced: Replace with diff display and scroll to phrase
    onReplaceKeyword(from, to)
    removeToRephrase(from)
  }

  const handleNewRequest = () => {
    if (onNewRequest) {
      onNewRequest()
    }
  }

  if (!editorKeywords || (visibleToAdd.length === 0 && visibleToRephrase.length === 0)) {
    return null
  }

  const carouselSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToShow: slidesToShow, // Approximate number of items to show
    slidesToScroll: 1, // Scroll one item at a time for better control
    swipeToSlide: true,
    draggable: true,
    variableWidth: true, // Always use variable width for left alignment
    centerMode: false, // Disable center mode
    centerPadding: '0px', // No center padding
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.max(2, slidesToShow - 2),
          slidesToScroll: 1,
          variableWidth: true,
          maxWidth: '85vw',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
          maxWidth: '85vw',
        },
      },
    ],
  }

  return (
    <S.Root ref={containerRef}>
      {(visibleToAdd.length > 0 || visibleToRephrase.length > 0 || showNewRequestButton) && (
        <S.ButtonContainer>
          <div>
            {visibleToAdd.length > 0 && (
              <S.CarouselSection>
                <S.CarouselLabel>+ {t('tailoring.keywordsToAdd')}:</S.CarouselLabel>
                <S.CarouselContainer>
                  <Carousel {...carouselSettings}>
                    {visibleToAdd.map((kw) => (
                        <KeywordItem
                          key={kw}
                          keyword={kw}
                          type="add"
                          onClick={() => handleInsertKeyword(kw)}
                        />
                    ))}
                  </Carousel>
                </S.CarouselContainer>
              </S.CarouselSection>
            )}

            {visibleToRephrase.length > 0 && (
              <S.CarouselSection>
                <S.CarouselLabel>↺ {t('tailoring.keywordsToRephrase')}:</S.CarouselLabel>
                <S.CarouselContainer>
                  <Carousel {...carouselSettings}>
                    {visibleToRephrase.map((kw) => (
                      <KeywordItem
                        key={kw.from}
                        keyword={kw.from}
                        type="rephrase"
                        onClick={() => handleReplaceKeyword(kw.from, kw.to)}
                        title={kw.to}
                      />
                    ))}
                  </Carousel>
                </S.CarouselContainer>
              </S.CarouselSection>
            )}
          </div>

          {showNewRequestButton && onNewRequest && (
            <S.RequestButton
              type="button"
              onClick={handleNewRequest}
            >
              {t('tailoring.newRequest')}
            </S.RequestButton>
          )}
        </S.ButtonContainer>
      )}
    </S.Root>
  )
}