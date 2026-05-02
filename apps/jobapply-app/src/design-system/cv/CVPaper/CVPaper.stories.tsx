import type { Meta, StoryObj } from '@storybook/react'
import { CVPaper } from './CVPaper'

const meta: Meta<typeof CVPaper> = {
  title: 'Design System/CV/CVPaper',
  component: CVPaper,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CVPaper>

export const Default: Story = {
  args: {
    children: (
      <div>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, color: '#1e1b2e' }}>Lucas Mansoldo</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Engenheiro de Software · lucas@test.com</p>
      </div>
    ),
  },
}
