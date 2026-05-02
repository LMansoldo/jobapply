import type { Meta, StoryObj } from '@storybook/react'
import { ProfileCard } from './ProfileCard'

const meta: Meta<typeof ProfileCard> = {
  title: 'Design System/Jobs/ProfileCard',
  component: ProfileCard,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ProfileCard>

export const Default: Story = {
  args: {
    user: { id: '1', name: 'Lucas Mansoldo', email: 'lucas@test.com' },
    completionPercent: 72,
  },
}
