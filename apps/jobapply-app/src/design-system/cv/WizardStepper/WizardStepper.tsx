import type { WizardStepperProps } from './WizardStepper.types'
import { Stepper, Step, StepCircle, StepCheckIcon, StepLabel } from './WizardStepper.styles'

export function WizardStepper({ steps, current }: WizardStepperProps) {
  return (
    <Stepper>
      {steps.map((step, index) => {
        const isDone = index < current
        const isActive = index === current

        return (
          <Step key={index} $active={isActive}>
            <StepCircle $done={isDone} $active={isActive}>
              {isDone ? <StepCheckIcon /> : index + 1}
            </StepCircle>
            <StepLabel $active={isActive}>
              {step.label}
            </StepLabel>
          </Step>
        )
      })}
    </Stepper>
  )
}
