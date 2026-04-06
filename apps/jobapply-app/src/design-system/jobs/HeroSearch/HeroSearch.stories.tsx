import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { HeroSearch } from './HeroSearch'

const meta: Meta<typeof HeroSearch> = {
  title: 'Design System/Jobs/HeroSearch',
  component: HeroSearch,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof HeroSearch>

export const Default: Story = {
  render: () => {
    const [kw, setKw] = useState('')
    const [loc, setLoc] = useState('')
    return (
      <HeroSearch
        keywordValue={kw}
        locationValue={loc}
        onKeywordChange={setKw}
        onLocationChange={setLoc}
        onSearch={() => alert(`Busca: ${kw} em ${loc}`)}
      />
    )
  },
}
