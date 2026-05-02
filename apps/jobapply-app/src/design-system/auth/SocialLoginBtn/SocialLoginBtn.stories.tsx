import type { Meta, StoryObj } from '@storybook/react'
import { SocialLoginBtn } from './SocialLoginBtn'

const meta: Meta<typeof SocialLoginBtn> = {
  title: 'Design System/Auth/SocialLoginBtn',
  component: SocialLoginBtn,
}

export default meta
type Story = StoryObj<typeof SocialLoginBtn>

export const Google: Story = { args: { provider: 'google', onClick: () => {} } }
export const LinkedIn: Story = { args: { provider: 'linkedin', onClick: () => {} } }
export const GitHub: Story = { args: { provider: 'github', onClick: () => {} } }
