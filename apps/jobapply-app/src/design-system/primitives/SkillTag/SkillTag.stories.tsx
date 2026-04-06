import type { Meta, StoryObj } from '@storybook/react'
import { SkillTag } from './SkillTag'

const meta: Meta<typeof SkillTag> = {
  title: 'Design System/Primitives/SkillTag',
  component: SkillTag,
}

export default meta
type Story = StoryObj<typeof SkillTag>

export const Purple: Story = { args: { color: 'purple', children: 'React' } }
export const Blue: Story = { args: { color: 'blue', children: 'TypeScript' } }
export const Green: Story = { args: { color: 'green', children: 'Node.js' } }
export const Orange: Story = { args: { color: 'orange', children: 'Python' } }
