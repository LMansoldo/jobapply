import type { Meta, StoryObj } from '@storybook/react'
import { PageLayout } from './PageLayout'

const meta: Meta<typeof PageLayout> = {
  title: 'Design System/Layout/PageLayout',
  component: PageLayout,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof PageLayout>

const Panel = ({ label }: { label: string }) => (
  <div style={{ background: '#ede9fe', borderRadius: 14, padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#7c3aed' }}>
    {label}
  </div>
)

export const JobsVariant: Story = {
  args: {
    variant: 'jobs',
    left: <Panel label="Filter Panel" />,
    center: <Panel label="Job List" />,
    right: <Panel label="Profile Sidebar" />,
  },
}

export const CvVariant: Story = {
  args: {
    variant: 'cv',
    left: <Panel label="Wizard Stepper" />,
    center: <Panel label="Form / Editor" />,
    right: <Panel label="CV Preview" />,
  },
}

export const TailoringVariant: Story = {
  args: {
    variant: 'tailoring',
    center: <Panel label="Workspace Tabs" />,
    right: <Panel label="ATS Panel" />,
  },
}
