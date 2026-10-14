import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../styles/theme/emotionTheme'
import { InlineBadge } from '@jobapply/ui'

const meta: Meta<typeof InlineBadge> = {
  title: 'Design System/Primitives/InlineBadge',
  component: InlineBadge,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof InlineBadge>

export const Success: Story = { args: { variant: 'success', children: 'Aprovado' } }
export const Warning: Story = { args: { variant: 'warning', children: 'Pendente' } }
