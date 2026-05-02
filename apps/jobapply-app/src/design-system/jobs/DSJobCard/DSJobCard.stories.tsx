import type { Meta, StoryObj } from '@storybook/react'
import { DSJobCard } from './DSJobCard'

const mockJob = {
  _id: '1',
  title: 'Senior Frontend Engineer',
  company: 'Nubank',
  location: 'São Paulo, SP',
  description: 'Vaga de engenheiro frontend sênior.',
  tags: ['React', 'TypeScript', 'GraphQL', 'Node.js'],
  status: 'open' as const,
  salary: 'R$ 18.000 – R$ 24.000',
  createdAt: new Date().toISOString(),
}

const meta: Meta<typeof DSJobCard> = {
  title: 'Design System/Jobs/DSJobCard',
  component: DSJobCard,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof DSJobCard>

export const Default: Story = { args: { job: mockJob } }
export const Featured: Story = { args: { job: mockJob, variant: 'featured' } }
export const Selected: Story = { args: { job: mockJob, isSelected: true } }
