import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BookmarkBtn } from './BookmarkBtn'

const meta: Meta<typeof BookmarkBtn> = {
  title: 'Design System/Jobs/BookmarkBtn',
  component: BookmarkBtn,
}

export default meta
type Story = StoryObj<typeof BookmarkBtn>

export const Default: Story = {
  render: () => {
    const [saved, setSaved] = useState(false)
    return <BookmarkBtn saved={saved} onToggle={() => setSaved(!saved)} />
  },
}
