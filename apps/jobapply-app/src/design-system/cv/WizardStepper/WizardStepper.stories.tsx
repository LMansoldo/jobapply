import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { WizardStepper } from './WizardStepper'

const meta: Meta<typeof WizardStepper> = {
  title: 'Design System/CV/WizardStepper',
  component: WizardStepper,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof WizardStepper>

const steps = [
  { label: 'Dados Pessoais' },
  { label: 'Experiência' },
  { label: 'Educação' },
  { label: 'Habilidades' },
  { label: 'Revisão' },
]

export const Step2: Story = { args: { steps, current: 1 } }
export const Step4: Story = { args: { steps, current: 3 } }
