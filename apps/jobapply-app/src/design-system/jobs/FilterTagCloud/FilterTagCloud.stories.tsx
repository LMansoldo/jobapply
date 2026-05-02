import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FilterTagCloud } from './FilterTagCloud'

const meta: Meta<typeof FilterTagCloud> = {
  title: 'Design System/Jobs/FilterTagCloud',
  component: FilterTagCloud,
}

export default meta
type Story = StoryObj<typeof FilterTagCloud>

export const Default: Story = {
  render: () => {
    const [tags, setTags] = useState([
      { label: 'React', active: false },
      { label: 'TypeScript', active: true },
      { label: 'Node.js', active: false },
      { label: 'Python', active: false },
    ])
    return (
      <FilterTagCloud
        tags={tags}
        onChange={(label, active) =>
          setTags((prev) => prev.map((t) => (t.label === label ? { ...t, active } : t)))
        }
      />
    )
  },
}
