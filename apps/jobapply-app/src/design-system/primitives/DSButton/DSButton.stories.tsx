import type { Meta, StoryObj } from '@storybook/react'
import { DSButton } from './DSButton'

const meta: Meta<typeof DSButton> = {
  title: 'Design System/Primitives/DSButton',
  component: DSButton,
}

export default meta
type Story = StoryObj<typeof DSButton>

export const Primary: Story = { args: { variant: 'primary', children: 'Tailor My CV' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ver Detalhes' } }
export const GhostDark: Story = {
  args: { variant: 'ghost-dark', children: 'Login' },
  parameters: { backgrounds: { default: 'dark' } },
}
export const SolidWhite: Story = { args: { variant: 'solid-white', children: 'Saiba mais' } }
