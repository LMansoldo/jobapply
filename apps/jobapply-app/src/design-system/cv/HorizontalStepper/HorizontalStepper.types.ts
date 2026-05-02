export interface StepItem {
  label: string
  sublabel?: string
}

export interface HorizontalStepperProps {
  steps: StepItem[]
  current: number
  onStepClick?: (step: number) => void
}
