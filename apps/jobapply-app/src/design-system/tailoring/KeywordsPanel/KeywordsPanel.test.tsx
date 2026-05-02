import React from 'react'
import { KeywordsPanel } from './KeywordsPanel'
import type { EditorKeywords } from './KeywordsPanel.types'

// Test component to verify KeywordsPanel works
export function TestKeywordsPanel() {
  const [editorKeywords, setEditorKeywords] = React.useState<EditorKeywords>({
    toAdd: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Swift'],
    toRephrase: [
      { from: 'experienced', to: 'proficient' },
      { from: 'good at', to: 'skilled in' },
      { from: 'know', to: 'master' },
      { from: 'basic', to: 'intermediate' },
      { from: 'help', to: 'assist' },
    ],
  })

  const handleInsertKeyword = (keyword: string) => {
    console.log('Insert keyword:', keyword)
    // In real app, this would insert into editor
  }

  const handleReplaceKeyword = (from: string, to: string) => {
    console.log('Replace keyword:', from, 'with:', to)
    // In real app, this would replace in editor
  }

  return (
    <div style={{ width: '800px', height: '400px', border: '1px solid #ccc', padding: '20px' }}>
      <h2>Test KeywordsPanel</h2>
      <KeywordsPanel
        editorKeywords={editorKeywords}
        onInsertKeyword={handleInsertKeyword}
        onReplaceKeyword={handleReplaceKeyword}
      />
    </div>
  )
}