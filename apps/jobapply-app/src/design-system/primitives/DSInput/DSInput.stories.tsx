import type { Meta, StoryObj } from '@storybook/react'
import { DSInput } from './DSInput'
import { SearchOutlined } from '@ant-design/icons'

const meta: Meta<typeof DSInput> = {
  title: 'Design System/Primitives/DSInput',
  component: DSInput,
}

export default meta
type Story = StoryObj<typeof DSInput>

export const Default: Story = { args: { placeholder: 'Digite algo...' } }
export const Filled: Story = { args: { placeholder: 'Preenchido', filled: true } }
export const WithIcon: Story = {
  args: {
    placeholder: 'Buscar vagas...',
    leftIcon: <SearchOutlined />,
  },
}
