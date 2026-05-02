import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FilterCheckbox } from './FilterCheckbox'

const meta: Meta<typeof FilterCheckbox> = {
  title: 'Design System/Jobs/FilterCheckbox',
  component: FilterCheckbox,
}

export default meta
type Story = StoryObj<typeof FilterCheckbox>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <FilterCheckbox label="Remoto" count={42} checked={checked} onChange={setChecked} />
  },
}
