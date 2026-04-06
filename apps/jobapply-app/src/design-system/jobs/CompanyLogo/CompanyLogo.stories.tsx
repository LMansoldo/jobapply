import type { Meta, StoryObj } from '@storybook/react'
import { CompanyLogo } from './CompanyLogo'

const meta: Meta<typeof CompanyLogo> = {
  title: 'Design System/Jobs/CompanyLogo',
  component: CompanyLogo,
}

export default meta
type Story = StoryObj<typeof CompanyLogo>

export const Default: Story = { args: { name: 'Nubank', size: 48 } }
export const Large: Story = { args: { name: 'Google Brasil', size: 64 } }
