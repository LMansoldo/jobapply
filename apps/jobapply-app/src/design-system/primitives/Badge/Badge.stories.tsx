import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Design System/Primitives/Badge',
  component: Badge,
}

export default meta
type Story = StoryObj<typeof Badge>

export const Hot: Story = { args: { variant: 'hot', children: 'Hot' } }
export const New: Story = { args: { variant: 'new', children: 'New' } }
export const Remote: Story = { args: { variant: 'remote', children: 'Remote' } }
export const Default: Story = { args: { variant: 'default', children: 'Featured' } }
