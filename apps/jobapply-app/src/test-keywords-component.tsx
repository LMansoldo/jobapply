import React from 'react'
import { KeywordsPanel } from './design-system/tailoring/KeywordsPanel'

export function TestKeywordsComponent() {
  const testKeywords = {
    toAdd: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Swift'],
    toRephrase: [
      { from: 'experienced', to: 'proficient' },
      { from: 'good at', to: 'skilled in' },
      { from: 'know', to: 'have expertise in' },
      { from: 'familiar with', to: 'experienced with' },
    ],
  }

  const handleInsertKeyword = (keyword: string) => {
    console.log('INSERT keyword:', keyword)
  }

  const handleReplaceKeyword = (from: string, to: string) => {
    console.log('REPLACE keyword:', from, '->', to)
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#1e1e1e', minHeight: '100vh' }}>
      <h1 style={{ color: 'white' }}>Test KeywordsPanel</h1>
      <div style={{ border: '2px solid cyan', padding: '20px', margin: '20px 0' }}>
        <KeywordsPanel
          editorKeywords={testKeywords}
          onInsertKeyword={handleInsertKeyword}
          onReplaceKeyword={handleReplaceKeyword}
        />
      </div>
    </div>
  )
}