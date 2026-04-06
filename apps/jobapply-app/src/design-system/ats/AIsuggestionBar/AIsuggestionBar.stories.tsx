import type { Meta, StoryObj } from '@storybook/react'
import { AIsuggestionBar } from './AIsuggestionBar'

const meta: Meta<typeof AIsuggestionBar> = {
  title: 'Design System/ATS/AIsuggestionBar',
  component: AIsuggestionBar,
}

export default meta
type Story = StoryObj<typeof AIsuggestionBar>

export const Default: Story = {
  args: {
    text: 'Adicione "liderança técnica" e "metodologias ágeis" para aumentar seu match em 12%.',
    onRegen: () => console.log('regen'),
  },
}
