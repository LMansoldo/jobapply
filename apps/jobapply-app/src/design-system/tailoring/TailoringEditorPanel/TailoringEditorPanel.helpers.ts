/**
 * @file TailoringEditorPanel.helpers.ts
 * @description Helper functions for diff and text comparison.
 */

import { useState, useCallback } from 'react'

export interface DiffChange {
  type: 'insert' | 'delete' | 'replace'
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
  originalText?: string
  newText?: string
}

/**
 * Simple diff algorithm to find changes between two texts
 * This is a simplified implementation for demonstration
 * In production, consider using a library like diff-match-patch
 */
export function calculateTextDiff(previousText: string, currentText: string): DiffChange[] {
  console.log('calculateTextDiff called')
  const changes: DiffChange[] = []

  if (previousText === currentText) {
    console.log('Texts are identical, no changes')
    return changes
  }

  console.log('Texts differ, calculating diff...')

  // Split texts into lines
  const prevLines = previousText.split('\n')
  const currLines = currentText.split('\n')

  console.log('Previous lines:', prevLines.length, 'Current lines:', currLines.length)

  // Simple line-by-line comparison
  const maxLines = Math.max(prevLines.length, currLines.length)

  for (let lineNum = 0; lineNum < maxLines; lineNum++) {
    const prevLine = prevLines[lineNum] || ''
    const currLine = currLines[lineNum] || ''

    if (prevLine !== currLine) {
      console.log(`Line ${lineNum + 1} differs:`, { prevLine, currLine })
      // Find character differences within the line
      const maxLength = Math.max(prevLine.length, currLine.length)

      for (let col = 0; col < maxLength; col++) {
        const prevChar = prevLine[col] || ''
        const currChar = currLine[col] || ''

        if (prevChar !== currChar) {
          console.log(`Char difference at line ${lineNum + 1}, col ${col + 1}:`, { prevChar, currChar })
          // Simple detection: if both have characters, it's a replace
          // if only previous has, it's a delete
          // if only current has, it's an insert
          if (prevChar && currChar) {
            changes.push({
              type: 'replace',
              startLine: lineNum + 1,
              startColumn: col + 1,
              endLine: lineNum + 1,
              endColumn: col + 2,
              originalText: prevChar,
              newText: currChar,
            })
          } else if (prevChar && !currChar) {
            // Find the end of deletion
            let deleteEnd = col + 1
            while (prevLine[deleteEnd] && prevLine[deleteEnd] !== currLine[col]) {
              deleteEnd++
            }

            changes.push({
              type: 'delete',
              startLine: lineNum + 1,
              startColumn: col + 1,
              endLine: lineNum + 1,
              endColumn: deleteEnd + 1,
              originalText: prevLine.substring(col, deleteEnd),
            })
          } else if (!prevChar && currChar) {
            // Find the end of insertion
            let insertEnd = col + 1
            while (currLine[insertEnd] && currLine[insertEnd] !== prevLine[col]) {
              insertEnd++
            }

            changes.push({
              type: 'insert',
              startLine: lineNum + 1,
              startColumn: col + 1,
              endLine: lineNum + 1,
              endColumn: insertEnd + 1,
              newText: currLine.substring(col, insertEnd),
            })
          }
        }
      }
    }
  }

  console.log('Total changes found:', changes.length)
  return changes
}

/**
 * Apply diff decorations to Monaco editor
 */
interface MonacoDecoration {
  range: {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }
  options: {
    className: string
    inlineClassName: string
    hoverMessage: Array<{value: string}>
  }
}

export function applyDiffDecorations(
  editor: { deltaDecorations: (oldDecorations: string[], newDecorations: MonacoDecoration[]) => string[] },
  changes: DiffChange[],
  previousDecorations: string[]
): string[] {
  console.log('applyDiffDecorations called:', { changesCount: changes.length, previousDecorationsCount: previousDecorations.length })

  if (!editor || !editor.deltaDecorations) {
    console.log('No editor or deltaDecorations method')
    return previousDecorations
  }

  const newDecorations = changes.map(change => {
    const range = {
      startLineNumber: change.startLine,
      startColumn: change.startColumn,
      endLineNumber: change.endLine,
      endColumn: change.endColumn,
    }

    let className = ''
    switch (change.type) {
      case 'insert':
        className = 'te-diff-insert'
        break
      case 'delete':
        className = 'te-diff-delete'
        break
      case 'replace':
        className = 'te-diff-replace'
        break
    }

    console.log('Creating decoration:', { type: change.type, range, className })
    return {
      range,
      options: {
        className,
        inlineClassName: className,
        hoverMessage: getDiffHoverMessage(change),
      },
    }
  })

  const result = editor.deltaDecorations(previousDecorations, newDecorations)
  console.log('Decorations applied, new decoration IDs:', result.length)
  return result
}

/**
 * Get hover message for diff change
 */
function getDiffHoverMessage(change: DiffChange): { value: string }[] {
  switch (change.type) {
    case 'insert':
      return [{ value: `Inserted: "${change.newText}"` }]
    case 'delete':
      return [{ value: `Deleted: "${change.originalText}"` }]
    case 'replace':
      return [{ value: `Replaced "${change.originalText}" with "${change.newText}"` }]
    default:
      return [{ value: 'Modified' }]
  }
}

/**
 * Hook to manage text diff state
 */
export function useTextDiff(initialText: string) {
  const [previousText, setPreviousText] = useState<string>(initialText)
  const [diffChanges, setDiffChanges] = useState<DiffChange[]>([])
  const [showDiff, setShowDiff] = useState(true)

  const updateDiff = useCallback((currentText: string) => {
    console.log('updateDiff called:', { previousText, currentText })
    if (currentText !== previousText) {
      const changes = calculateTextDiff(previousText, currentText)
      console.log('Diff changes calculated:', changes.length, 'changes')
      setDiffChanges(changes)
      // Update previousText to currentText so next diff is incremental
      setPreviousText(currentText)
    }
  }, [previousText])

  const resetDiff = useCallback((newBaseText: string) => {
    setPreviousText(newBaseText)
    setDiffChanges([])
  }, [])

  const toggleDiff = useCallback(() => {
    setShowDiff(prev => !prev)
  }, [])

  return {
    diffChanges,
    updateDiff,
    resetDiff,
    previousText,
    showDiff,
    toggleDiff,
  }
}