import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../styles/theme/emotionTheme'
import { ProgressBar } from '@jobapply/ui'

const meta: Meta<typeof ProgressBar> = {
  title: 'Design System/Primitives/ProgressBar',
  component: ProgressBar,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = { args: { value: 72 } }
export const WithLabel: Story = { args: { value: 85, label: 'Perfil' } }
export const Low: Story = { args: { value: 30, label: 'Palavras-chave' } }
