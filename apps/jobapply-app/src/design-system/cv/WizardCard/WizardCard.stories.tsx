import type { Meta, StoryObj } from '@storybook/react'
import { WizardCard } from './WizardCard'

const meta: Meta<typeof WizardCard> = {
  title: 'Design System/CV/WizardCard',
  component: WizardCard,
}

export default meta
type Story = StoryObj<typeof WizardCard>

export const WithHeader: Story = {
  args: {
    header: 'Dados Pessoais',
    children: <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Formulário aqui</p>,
  },
}

export const NoHeader: Story = {
  args: {
    children: <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Conteúdo sem cabeçalho</p>,
  },
}
