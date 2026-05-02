import { useTranslation } from 'react-i18next'
import type { IndustryNewsCardProps } from './IndustryNewsCard.types'
import { DSCard } from '../../primitives/DSCard'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

export function IndustryNewsCard({ news }: IndustryNewsCardProps) {
  const { t } = useTranslation()

  return (
    <DSCard title={t('jobs.news').toUpperCase()}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
        {news.map((item) => (
          <div
            key={item.title}
            style={{
              display: 'flex',
              gap: Spacing.md,
              alignItems: 'flex-start',
              cursor: 'pointer',
              opacity: 1,
              transition: 'opacity 0.15s',
            }}
          >
            <div
              style={{
                width: '5.6rem',
                height: '4.4rem',
                background: Colors.surfacePage,
                borderRadius: BorderRadius.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                flexShrink: 0,
              }}
            >
              {item.thumbnail}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: FontSize.sm,
                fontWeight: FontWeight.medium,
                color: Colors.textMain,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {item.title}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: FontSize.xxs, color: Colors.textSub }}>
                {item.source} · {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DSCard>
  )
}
