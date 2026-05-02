import type { Meta, StoryObj } from '@storybook/react'
import { AvatarUpload } from './AvatarUpload'

const meta: Meta<typeof AvatarUpload> = {
  title: 'Design System/CV/AvatarUpload',
  component: AvatarUpload,
}

export default meta
type Story = StoryObj<typeof AvatarUpload>

export const Default: Story = { args: { name: 'Lucas Mansoldo' } }
