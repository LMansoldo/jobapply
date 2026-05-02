import type { Meta, StoryObj } from '@storybook/react'
import { FilterPanel } from './FilterPanel'

const meta: Meta<typeof FilterPanel> = {
  title: 'Design System/Jobs/FilterPanel',
  component: FilterPanel,
}

export default meta
type Story = StoryObj<typeof FilterPanel>

export const Default: Story = {
  args: {
    children: (
      <div>
        <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Filtros aqui</p>
      </div>
    ),
  },
}
