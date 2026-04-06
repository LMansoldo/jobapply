import { CheckOutlined } from '@ant-design/icons'
import type { HorizontalStepperProps } from './HorizontalStepper.types'
import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export function HorizontalStepper({ steps, current }: HorizontalStepperProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: `${Spacing.lg} 0`, gap: 0 }}>
      {steps.map((step, index) => {
        const isDone = index < current
        const isActive = index === current
        const isLast = index === steps.length - 1

        return (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? 0 : 1 }}>
            {/* Step */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.xs, flexShrink: 0 }}>
              <div style={{
                width: '3.6rem',
                height: '3.6rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FontFamily.heading,
                fontWeight: FontWeight.bold,
                fontSize: FontSize.sm,
                transition: 'all 0.2s',
                ...(isDone
                  ? { background: Colors.primaryDark, color: Colors.white }
                  : isActive
                    ? { background: Colors.primaryDark, color: Colors.white, boxShadow: `0 0 0 4px ${Colors.primaryLight}` }
                    : { background: Colors.white, color: Colors.textSub, border: `2px solid ${Colors.surfaceBorder}` }),
              }}>
                {isDone ? <CheckOutlined style={{ fontSize: '1.4rem' }} /> : index + 1}
              </div>
              <div style={{ textAlign: 'center' as const }}>
                <p style={{
                  margin: 0,
                  fontSize: FontSize.sm,
                  fontWeight: isActive ? FontWeight.semibold : FontWeight.regular,
                  color: isActive ? Colors.primaryDark : isDone ? Colors.textMain : Colors.textSub,
                  whiteSpace: 'nowrap' as const,
                }}>
                  {step.label}
                </p>
                {step.sublabel && (
                  <p style={{ margin: 0, fontSize: FontSize.xxs, color: Colors.textSub }}>
                    {step.sublabel}
                  </p>
                )}
              </div>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div style={{
                flex: 1,
                height: '2px',
                marginTop: '1.7rem',
                background: isDone ? Colors.primaryDark : Colors.surfaceBorder,
                transition: 'background 0.2s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
