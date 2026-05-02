import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RoleCards } from './RoleCards'

const meta: Meta<typeof RoleCards> = {
  title: 'Design System/Auth/RoleCards',
  component: RoleCards,
}

export default meta
type Story = StoryObj<typeof RoleCards>

export const Default: Story = {
  render: () => {
    const [role, setRole] = useState('candidate')
    return (
      <RoleCards
        roles={[
          { key: 'candidate', label: 'Candidato', icon: '👤' },
          { key: 'recruiter', label: 'Recrutador', icon: '🔍' },
          { key: 'company', label: 'Empresa', icon: '🏢' },
        ]}
        value={role}
        onChange={setRole}
      />
    )
  },
}
