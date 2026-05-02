import { CheckOutlined } from '@ant-design/icons'
import type { HorizontalStepperProps } from './HorizontalStepper.types'
import * as styles from './HorizontalStepper.styles'

export function HorizontalStepper({ steps, current, onStepClick }: HorizontalStepperProps) {
  return (
    <div className={styles.root}>
      {steps.map((step, index) => {
        const isDone = index < current
        const isActive = index === current
        const isLast = index === steps.length - 1
        const clickable = !!onStepClick && (isDone || isActive)
        const state = isDone ? 'done' : isActive ? 'active' : 'inactive'

        return (
          <div key={index} className={styles.stepOuter(isLast)}>
            <div className={styles.stepInner}>
              <button
                type="button"
                className={styles.circle(state, clickable)}
                onClick={clickable ? () => onStepClick!(index) : undefined}
              >
                {isDone ? <CheckOutlined className={styles.checkIcon} /> : index + 1}
              </button>
              <div className={styles.labelWrapper}>
                <p className={styles.stepLabel(isActive, isDone)}>{step.label}</p>
                {step.sublabel && (
                  <p className={styles.stepSublabel}>{step.sublabel}</p>
                )}
              </div>
            </div>

            {!isLast && <div className={styles.connector(isDone)} />}
          </div>
        )
      })}
    </div>
  )
}
