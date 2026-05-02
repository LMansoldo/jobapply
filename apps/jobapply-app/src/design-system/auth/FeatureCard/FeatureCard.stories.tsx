import type { Meta, StoryObj } from '@storybook/react'
import { FeatureCard } from './FeatureCard'
import { RocketOutlined } from '@ant-design/icons'

const meta: Meta<typeof FeatureCard> = {
  title: 'Design System/Auth/FeatureCard',
  component: FeatureCard,
  parameters: { backgrounds: { default: 'dark' } },
}

export default meta
type Story = StoryObj<typeof FeatureCard>

export const Default: Story = {
  args: {
    icon: <RocketOutlined />,
    title: 'Candidatura com IA',
    description: 'Adapte seu CV automaticamente para cada vaga com inteligência artificial.',
  },
}
