import type { Meta, StoryObj } from '@storybook/react'
import { ScoreRing } from './ScoreRing'

const meta: Meta<typeof ScoreRing> = {
  title: 'Design System/Primitives/ScoreRing',
  component: ScoreRing,
}

export default meta
type Story = StoryObj<typeof ScoreRing>

export const Default: Story = { args: { value: 78, label: 'ATS Score', sublabel: '/100' } }
export const High: Story = { args: { value: 94, size: 140, label: 'Score', sublabel: 'pts' } }
export const Low: Story = { args: { value: 42, label: 'Match' } }
