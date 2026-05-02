import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PreviewTabs } from './PreviewTabs'

const meta: Meta<typeof PreviewTabs> = {
  title: 'Design System/CV/PreviewTabs',
  component: PreviewTabs,
}

export default meta
type Story = StoryObj<typeof PreviewTabs>

export const Default: Story = {
  render: () => {
    const [tab, setTab] = useState<'editor' | 'preview'>('editor')
    return <PreviewTabs activeTab={tab} onChange={setTab} />
  },
}
