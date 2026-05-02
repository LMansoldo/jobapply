import { CheckOutlined } from '@ant-design/icons'
import type { WizardStepperProps } from './WizardStepper.types'
import { styles } from './WizardStepper.styles'

export function WizardStepper({ steps, current }: WizardStepperProps) {
  return (
    <div style={styles.stepper}>
      {steps.map((step, index) => {
        const isDone = index < current
        const isActive = index === current

        return (
          <div
            key={index}
            style={{
              ...styles.step,
              ...(isActive ? styles.stepActive : styles.stepDefault),
            }}
          >
            <div
              style={{
                ...styles.circle,
                ...(isDone ? styles.circleDone : isActive ? styles.circleActive : styles.circleDefault),
              }}
            >
              {isDone ? <CheckOutlined style={{ fontSize: '1.2rem' }} /> : index + 1}
            </div>
            <span
              style={{
                ...styles.label,
                ...(isActive ? styles.labelActive : styles.labelDefault),
              }}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
