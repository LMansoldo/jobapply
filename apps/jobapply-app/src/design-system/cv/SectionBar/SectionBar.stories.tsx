import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SectionBar } from './SectionBar'

const meta: Meta<typeof SectionBar> = {
  title: 'Design System/CV/SectionBar',
  component: SectionBar,
}

export default meta
type Story = StoryObj<typeof SectionBar>

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('personal')
    return (
      <SectionBar
        sections={[
          { key: 'personal', label: 'Dados Pessoais' },
          { key: 'experience', label: 'Experiência' },
          { key: 'education', label: 'Educação' },
          { key: 'skills', label: 'Habilidades' },
        ]}
        activeKey={active}
        onChange={setActive}
      />
    )
  },
}
