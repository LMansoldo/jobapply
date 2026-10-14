import { ThemeProvider } from '@emotion/react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { useRef, useState } from 'react'
import { theme } from '../styles/theme/emotionTheme'
import type { EditorHandle } from '@jobapply/editor'
import { RichMarkdownEditor } from '@jobapply/editor'
import userCv from './fixtures/user-cv.md?raw'

const meta: Meta<typeof RichMarkdownEditor> = {
  title: 'tailoring/RichMarkdownEditor',
  component: RichMarkdownEditor,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RichMarkdownEditor>

function EditorWithState({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent)
  return (
    <RichMarkdownEditor
      value={content}
      onChange={setContent}
      height={600}
    />
  )
}

export const ComCVReal: Story = {
  name: 'Com CV real',
  render: () => <EditorWithState initialContent={userCv} />,
}

const cvSuggestions = {
  toAdd: ['Terraform'],
  toRephrase: [
    { from: 'Comfortable across the stack', to: 'Proficient across the full stack' },
    { from: 'spots the underlying problem', to: 'diagnoses the root cause' },
  ],
  keywordPhrases: [
    {
      keyword: 'Platform Engineering',
      phrases: ['internal developer platform', 'platform engineering strategy'],
    },
  ],
  semanticGaps: [
    'No measurable outcomes for the mentoring activities',
    'Missing cloud cost optimization experience',
  ],
  tips: [
    {
      priority: 'high',
      tip: 'Quantify the impact of the design system work with adoption metrics',
    },
  ],
  removeSuggestions: [
    {
      section: 'Skills',
      item: 'HTML, CSS',
      reason: 'Too basic for a senior-level position',
    },
    {
      section: 'Education',
      item: 'UNESA',
      reason: 'Institution detail adds little value for this role',
    },
  ],
}

function EditorWithSuggestions() {
  const [content, setContent] = useState(userCv)
  const editorRef = useRef<EditorHandle>(null)
  return (
    <div>
      <button
        type="button"
        onClick={() => editorRef.current?.insertAtCursor('Docker, ')}
      >
        insertAtCursor(&apos;Docker, &apos;)
      </button>
      <button
        type="button"
        onClick={() =>
          editorRef.current?.findAndReplace(
            'senior software engineer',
            'Staff Software Engineer',
          )
        }
      >
        findAndReplace(...)
      </button>
      <button type="button" onClick={() => editorRef.current?.toggleDiff()}>
        toggleDiff
      </button>
      <button
        type="button"
        onClick={() => editorRef.current?.resetDiffBase()}
      >
        resetDiffBase
      </button>
      <button type="button" onClick={() => editorRef.current?.clearDiff()}>
        clearDiff
      </button>
      <RichMarkdownEditor
        ref={editorRef}
        value={content}
        onChange={setContent}
        height={600}
        editorKeywords={cvSuggestions}
        layout="split"
      />
    </div>
  )
}

export const ComSugestoes: Story = {
  name: 'Com sugestões',
  render: () => <EditorWithSuggestions />,
}

export const Mobile: Story = {
  name: 'Mobile',
  parameters: {
    viewport: { defaultViewport: 'iphone14' },
  },
  render: () => <EditorWithSuggestions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = await canvas.findByRole('button', {
      name: /Sugestões \(\d+\)|Suggestions \(\d+\)/,
    })
    await userEvent.click(toggle)
  },
}
