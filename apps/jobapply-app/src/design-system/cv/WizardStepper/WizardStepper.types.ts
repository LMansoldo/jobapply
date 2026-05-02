export interface WizardStep {
  label: string
}

export interface WizardStepperProps {
  steps: WizardStep[]
  current: number
}
