import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../styles/theme/emotionTheme'
import { ScoreRing } from '@jobapply/ui'

const meta: Meta<typeof ScoreRing> = {
  title: 'Design System/Primitives/ScoreRing',
  component: ScoreRing,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ScoreRing>

export const Default: Story = { args: { value: 78, label: 'ATS Score', sublabel: '/100' } }
export const High: Story = { args: { value: 94, size: 140, label: 'Score', sublabel: 'pts' } }
export const Low: Story = { args: { value: 42, label: 'Match' } }
