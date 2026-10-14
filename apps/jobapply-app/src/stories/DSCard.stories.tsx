import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../styles/theme/emotionTheme'
import { DSCard } from '@jobapply/ui'

const meta: Meta<typeof DSCard> = {
  title: 'Design System/Primitives/DSCard',
  component: DSCard,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DSCard>

export const Default: Story = {
  args: {
    title: 'Seção',
    children: <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Conteúdo do card.</p>,
  },
}

export const Hoverable: Story = {
  args: {
    title: 'Card Interativo',
    hoverable: true,
    children: <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Passe o mouse para ver o hover.</p>,
  },
}
