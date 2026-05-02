import type { Meta, StoryObj } from '@storybook/react'
import { ATSPanel } from './ATSPanel'

const meta: Meta<typeof ATSPanel> = {
  title: 'Design System/ATS/ATSPanel',
  component: ATSPanel,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ATSPanel>

export const Default: Story = {
  args: {
    score: 78,
    categories: [
      { name: 'Palavras-chave', value: 82 },
      { name: 'Formato', value: 90 },
      { name: 'Experiência', value: 65 },
    ],
    keywords: [
      { keyword: 'React', status: 'found' },
      { keyword: 'TypeScript', status: 'found' },
      { keyword: 'Kubernetes', status: 'missing' },
      { keyword: 'CI/CD', status: 'weak' },
    ],
  },
}
