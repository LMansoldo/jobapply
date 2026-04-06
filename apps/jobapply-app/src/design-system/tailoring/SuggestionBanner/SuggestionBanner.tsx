import { useTranslation } from 'react-i18next'
import type { SuggestionBannerProps } from './SuggestionBanner.types'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

export function SuggestionBanner({ count, current, onPrev, onNext, onAcceptAll }: SuggestionBannerProps) {
  const { t } = useTranslation()

  return (
    <div style={{
      background: Colors.gradientAiToolbar,
      border: `1px solid rgba(124,58,237,0.2)`,
      borderRadius: BorderRadius.base,
      padding: `${Spacing.sm} ${Spacing.lg}`,
      display: 'flex',
      alignItems: 'center',
      gap: Spacing.md,
      flexWrap: 'wrap' as const,
    }}>
      {/* Pulse dot */}
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: Colors.primaryDark, flexShrink: 0, animation: 'pulse 2s infinite' }} />

      <span style={{ flex: 1, fontSize: FontSize.sm, color: Colors.primaryDark, fontWeight: FontWeight.medium, minWidth: '20rem' }}>
        ✦ {count} {t('tailoring.suggestions')} · clique para navegar ou aceitar individualmente
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm }}>
        <button
          type="button"
          onClick={onPrev}
          style={{
            background: 'none', border: `1px solid ${Colors.primaryDark}`, borderRadius: '6px',
            color: Colors.primaryDark, fontSize: FontSize.xxs, fontWeight: FontWeight.medium,
            padding: `2px ${Spacing.sm}`, cursor: 'pointer', fontFamily: FontFamily.body,
          }}
        >
          ← {t('tailoring.prev')}
        </button>
        <span style={{ fontSize: FontSize.xxs, color: Colors.textSub, minWidth: '3rem', textAlign: 'center' as const }}>
          {current}/{count}
        </span>
        <button
          type="button"
          onClick={onNext}
          style={{
            background: 'none', border: `1px solid ${Colors.primaryDark}`, borderRadius: '6px',
            color: Colors.primaryDark, fontSize: FontSize.xxs, fontWeight: FontWeight.medium,
            padding: `2px ${Spacing.sm}`, cursor: 'pointer', fontFamily: FontFamily.body,
          }}
        >
          {t('tailoring.next')} →
        </button>
        <button
          type="button"
          onClick={onAcceptAll}
          style={{
            background: Colors.primaryDark, border: 'none', borderRadius: BorderRadius.full,
            color: Colors.white, fontSize: FontSize.xxs, fontWeight: FontWeight.semibold,
            padding: `${Spacing.xs} ${Spacing.md}`, cursor: 'pointer', fontFamily: FontFamily.body,
          }}
        >
          {t('tailoring.acceptAll')}
        </button>
      </div>
    </div>
  )
}
