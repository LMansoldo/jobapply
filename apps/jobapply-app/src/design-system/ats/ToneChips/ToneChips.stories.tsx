import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ToneChips } from './ToneChips'
import type { ToneKey } from './ToneChips.types'

const meta: Meta<typeof ToneChips> = {
  title: 'Design System/ATS/ToneChips',
  component: ToneChips,
}

export default meta
type Story = StoryObj<typeof ToneChips>

export const Default: Story = {
  render: () => {
    const [tone, setTone] = useState<ToneKey>('formal')
    return (
      <ToneChips
        options={[
          { key: 'formal', label: 'Formal' },
          { key: 'direct', label: 'Direto' },
          { key: 'creative', label: 'Criativo' },
          { key: 'confident', label: 'Confiante' },
        ]}
        value={tone}
        onChange={setTone}
      />
    )
  },
}
