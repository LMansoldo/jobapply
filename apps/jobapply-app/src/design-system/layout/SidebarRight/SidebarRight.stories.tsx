import type { Meta, StoryObj } from '@storybook/react'
import { SidebarRight } from './SidebarRight'

const meta: Meta<typeof SidebarRight> = {
  title: 'Design System/Layout/SidebarRight',
  component: SidebarRight,
}

export default meta
type Story = StoryObj<typeof SidebarRight>

export const Default: Story = {
  args: {
    children: <p style={{ fontSize: 14, color: '#6b7280' }}>Conteúdo do painel direito</p>,
  },
}
