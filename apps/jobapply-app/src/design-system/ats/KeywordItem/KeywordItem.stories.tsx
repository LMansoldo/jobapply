import type { Meta, StoryObj } from '@storybook/react'
import { KeywordItem } from './KeywordItem'

const meta: Meta<typeof KeywordItem> = {
  title: 'Design System/ATS/KeywordItem',
  component: KeywordItem,
}

export default meta
type Story = StoryObj<typeof KeywordItem>

export const Found: Story = { args: { keyword: 'React', status: 'found' } }
export const Missing: Story = { args: { keyword: 'Kubernetes', status: 'missing' } }
export const Weak: Story = { args: { keyword: 'TypeScript', status: 'weak' } }
