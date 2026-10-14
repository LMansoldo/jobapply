import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../styles/theme/emotionTheme'
import { Badge } from '@jobapply/ui'

const meta: Meta<typeof Badge> = {
  title: 'Design System/Primitives/Badge',
  component: Badge,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Badge>

export const Hot: Story = { args: { variant: 'hot', children: 'Hot' } }
export const New: Story = { args: { variant: 'new', children: 'New' } }
export const Remote: Story = { args: { variant: 'remote', children: 'Remote' } }
export const Default: Story = { args: { variant: 'default', children: 'Featured' } }
