import type { Meta, StoryObj } from '@storybook/react'
import { AuthLayout } from './AuthLayout'
import { Colors } from '../../../styles/theme/colors'

const meta: Meta<typeof AuthLayout> = {
  title: 'Design System/Auth/AuthLayout',
  component: AuthLayout,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AuthLayout>

export const Default: Story = {
  args: {
    left: (
      <div>
        <h1 style={{ fontFamily: 'Sora, sans-serif', color: Colors.white, fontSize: 32 }}>
          Encontre sua próxima oportunidade
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
          Plataforma de candidatura inteligente com IA.
        </p>
      </div>
    ),
    right: (
      <div>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, color: '#1e1b2e' }}>
          Entrar
        </h2>
      </div>
    ),
  },
}
