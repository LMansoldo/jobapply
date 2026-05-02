import type { Meta, StoryObj } from '@storybook/react'
import { InlineBadge } from './InlineBadge'

const meta: Meta<typeof InlineBadge> = {
  title: 'Design System/Primitives/InlineBadge',
  component: InlineBadge,
}

export default meta
type Story = StoryObj<typeof InlineBadge>

export const Success: Story = { args: { variant: 'success', children: 'Aprovado' } }
export const Warning: Story = { args: { variant: 'warning', children: 'Pendente' } }
