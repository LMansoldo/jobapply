import type { Meta, StoryObj } from '@storybook/react'
import { AppHeader } from './AppHeader'

const meta: Meta<typeof AppHeader> = {
  title: 'Design System/Layout/AppHeader',
  component: AppHeader,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AppHeader>

export const Default: Story = {
  args: {
    logoText: 'JobApply',
    navItems: [
      { key: 'jobs', label: 'Vagas', href: '/jobs', active: true },
      { key: 'cv', label: 'Meu CV', href: '/cv' },
    ],
  },
}

export const WithRightSlot: Story = {
  args: {
    logoText: 'JobApply',
    navItems: [
      { key: 'jobs', label: 'Vagas', href: '/jobs' },
    ],
    rightSlot: <span style={{ fontSize: '1.4rem' }}>Lucas M.</span>,
  },
}
