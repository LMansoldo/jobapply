import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { LangTabs } from './LangTabs'

const meta: Meta<typeof LangTabs> = {
  title: 'Design System/Navigation/LangTabs',
  component: LangTabs,
}

export default meta
type Story = StoryObj<typeof LangTabs>

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('pt-BR')
    return (
      <LangTabs
        tabs={[
          { key: 'pt-BR', label: 'PT-BR' },
          { key: 'en', label: 'EN' },
        ]}
        activeKey={active}
        onChange={setActive}
      />
    )
  },
}
