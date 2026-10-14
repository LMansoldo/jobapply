import { useMemo } from 'react'
import { useEditorState } from '@tiptap/react'
import type { Editor } from '@tiptap/react'

export interface EditorCommandsState {
  bold: boolean
  italic: boolean
  h1: boolean
  h2: boolean
  h3: boolean
  bulletList: boolean
  orderedList: boolean
  canUndo: boolean
  canRedo: boolean
  words: number
}

export interface EditorCommands {
  toggleBold: () => void
  toggleItalic: () => void
  toggleHeading: (level: 1 | 2 | 3) => void
  toggleBulletList: () => void
  toggleOrderedList: () => void
  setHorizontalRule: () => void
  undo: () => void
  redo: () => void
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export function useEditorCommands(editor: Editor | null): {
  commands: EditorCommands
  state: EditorCommandsState | null
} {
  const commands = useMemo<EditorCommands>(
    () => ({
      toggleBold: () => {
        editor?.chain().focus().toggleBold().run()
      },
      toggleItalic: () => {
        editor?.chain().focus().toggleItalic().run()
      },
      toggleHeading: (level) => {
        editor?.chain().focus().toggleHeading({ level }).run()
      },
      toggleBulletList: () => {
        editor?.chain().focus().toggleBulletList().run()
      },
      toggleOrderedList: () => {
        editor?.chain().focus().toggleOrderedList().run()
      },
      setHorizontalRule: () => {
        editor?.chain().focus().setHorizontalRule().run()
      },
      undo: () => {
        editor?.chain().focus().undo().run()
      },
      redo: () => {
        editor?.chain().focus().redo().run()
      },
    }),
    [editor],
  )

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      if (!instance) return null
      const doc = instance.state.doc
      return {
        bold: instance.isActive('bold'),
        italic: instance.isActive('italic'),
        h1: instance.isActive('heading', { level: 1 }),
        h2: instance.isActive('heading', { level: 2 }),
        h3: instance.isActive('heading', { level: 3 }),
        bulletList: instance.isActive('bulletList'),
        orderedList: instance.isActive('orderedList'),
        canUndo: instance.can().undo(),
        canRedo: instance.can().redo(),
        words: countWords(doc.textBetween(0, doc.content.size, ' ', ' ')),
      }
    },
  })

  return { commands, state }
}
