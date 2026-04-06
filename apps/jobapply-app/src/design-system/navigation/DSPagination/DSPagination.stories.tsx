import type { Meta, StoryObj } from '@storybook/react'
import { DSPagination } from './DSPagination'

const meta: Meta<typeof DSPagination> = {
  title: 'Design System/Navigation/DSPagination',
  component: DSPagination,
}

export default meta
type Story = StoryObj<typeof DSPagination>

export const Default: Story = {
  args: { total: 120, pageSize: 10, current: 1 },
}
