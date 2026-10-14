import type { HorizontalStepperProps } from './HorizontalStepper.types'
import * as styles from './HorizontalStepper.styles'

export function HorizontalStepper({ steps, current, onStepClick }: HorizontalStepperProps) {
  return (
    <styles.Root>
      {steps.map((step, index) => {
        const isDone = index < current
        const isActive = index === current
        const isLast = index === steps.length - 1
        const clickable = !!onStepClick && (isDone || isActive)
        const state = isDone ? 'done' : isActive ? 'active' : 'inactive'

        return (
          <styles.StepOuter key={index} $last={isLast}>
            <styles.StepInner>
              <styles.Circle
                type="button"
                $state={state}
                $clickable={clickable}
                onClick={clickable ? () => onStepClick!(index) : undefined}
              >
                {isDone ? <styles.CheckIcon /> : index + 1}
              </styles.Circle>
              <styles.LabelWrapper>
                <styles.StepLabel $active={isActive} $done={isDone}>{step.label}</styles.StepLabel>
                {step.sublabel && (
                  <styles.StepSublabel>{step.sublabel}</styles.StepSublabel>
                )}
              </styles.LabelWrapper>
            </styles.StepInner>

            {!isLast && <styles.Connector $done={isDone} />}
          </styles.StepOuter>
        )
      })}
    </styles.Root>
  )
}
