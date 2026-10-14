import type { Extensions } from '@tiptap/core'
import { Markdown } from '@tiptap/markdown'
import { buildStarterKit } from './markdown'

export function buildEditorExtensions(): Extensions {
  return [
    buildStarterKit(),
    Markdown.configure({ markedOptions: { gfm: false } }),
  ]
}
