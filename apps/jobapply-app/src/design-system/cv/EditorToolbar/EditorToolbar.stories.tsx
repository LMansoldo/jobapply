import type { Meta, StoryObj } from '@storybook/react'
import { EditorToolbar } from './EditorToolbar'
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, OrderedListOutlined, UnorderedListOutlined } from '@ant-design/icons'

const meta: Meta<typeof EditorToolbar> = {
  title: 'Design System/CV/EditorToolbar',
  component: EditorToolbar,
  parameters: { layout: 'fullscreen', backgrounds: { default: 'dark' } },
}

export default meta
type Story = StoryObj<typeof EditorToolbar>

export const Default: Story = {
  args: {
    items: [
      { key: 'bold', icon: <BoldOutlined />, label: 'Negrito', group: 'format' },
      { key: 'italic', icon: <ItalicOutlined />, label: 'Itálico', active: true, group: 'format' },
      { key: 'underline', icon: <UnderlineOutlined />, label: 'Sublinhado', group: 'format' },
      { key: 'ol', icon: <OrderedListOutlined />, label: 'Lista Numerada', group: 'list' },
      { key: 'ul', icon: <UnorderedListOutlined />, label: 'Lista', group: 'list' },
    ],
    onAction: (key) => console.log('action:', key),
  },
}
