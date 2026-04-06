import type { Meta, StoryObj } from '@storybook/react'
import { PasswordStrength } from './PasswordStrength'

const meta: Meta<typeof PasswordStrength> = {
  title: 'Design System/Auth/PasswordStrength',
  component: PasswordStrength,
}

export default meta
type Story = StoryObj<typeof PasswordStrength>

export const Level1: Story = { args: { value: 1 } }
export const Level2: Story = { args: { value: 2 } }
export const Level3: Story = { args: { value: 3 } }
export const Level4: Story = { args: { value: 4 } }
