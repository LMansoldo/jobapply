import type { Meta, StoryObj } from '@storybook/react'
import { TipBox } from './TipBox'

const meta: Meta<typeof TipBox> = {
  title: 'Design System/Primitives/TipBox',
  component: TipBox,
}

export default meta
type Story = StoryObj<typeof TipBox>

export const Simple: Story = {
  args: { message: 'Dica: Use palavras-chave da vaga no seu CV.' },
}

export const WithDescription: Story = {
  args: {
    message: 'Otimize seu ATS score',
    description: 'Adicione as habilidades listadas na descrição da vaga para aumentar sua pontuação.',
  },
}
