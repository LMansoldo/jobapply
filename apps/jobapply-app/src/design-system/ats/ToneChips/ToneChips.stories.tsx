import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ToneChips } from './ToneChips'

const meta: Meta<typeof ToneChips> = {
  title: 'Design System/ATS/ToneChips',
  component: ToneChips,
}

export default meta
type Story = StoryObj<typeof ToneChips>

export const Default: Story = {
  render: () => {
    const [tone, setTone] = useState('professional')
    return (
      <ToneChips
        options={[
          { key: 'professional', label: 'Profissional' },
          { key: 'casual', label: 'Casual' },
          { key: 'executive', label: 'Executivo' },
          { key: 'creative', label: 'Criativo' },
        ]}
        value={tone}
        onChange={setTone}
      />
    )
  },
}
