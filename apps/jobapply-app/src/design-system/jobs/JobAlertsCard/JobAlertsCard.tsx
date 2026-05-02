import { useTranslation } from 'react-i18next'
import type { JobAlertsCardProps } from './JobAlertsCard.types'
import { DSCard } from '../../primitives/DSCard'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

export function JobAlertsCard({ alerts, onNew }: JobAlertsCardProps) {
  const { t } = useTranslation()

  const extra = (
    <button
      type="button"
      onClick={onNew}
      style={{
        background: 'none',
        border: `1px solid ${Colors.primaryDark}`,
        borderRadius: BorderRadius.full,
        color: Colors.primaryDark,
        fontSize: FontSize.xxs,
        fontWeight: FontWeight.semibold,
        padding: `2px ${Spacing.sm}`,
        cursor: 'pointer',
        fontFamily: FontFamily.body,
      }}
    >
      {t('jobs.newAlert')}
    </button>
  )

  return (
    <DSCard title={t('jobs.alerts').toUpperCase()} extra={extra}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
        {alerts.map((alert) => (
          <div
            key={alert.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: Spacing.md,
              padding: `${Spacing.sm2} 0`,
            }}
          >
            <div
              style={{
                width: '3.6rem',
                height: '3.6rem',
                borderRadius: BorderRadius.full,
                background: Colors.primaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                flexShrink: 0,
              }}
            >
              {alert.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textMain, lineHeight: 1.3 }}>
                {alert.title}
              </p>
              <p style={{ margin: 0, fontSize: FontSize.xxs, color: Colors.textSub, marginTop: '2px' }}>
                {alert.subtitle}
              </p>
            </div>
            <div
              style={{
                background: Colors.primaryDark,
                color: Colors.white,
                borderRadius: BorderRadius.full,
                fontSize: FontSize.xxs,
                fontWeight: FontWeight.bold,
                padding: `2px ${Spacing.sm}`,
                minWidth: '2.4rem',
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              {alert.count}
            </div>
          </div>
        ))}
      </div>
    </DSCard>
  )
}
