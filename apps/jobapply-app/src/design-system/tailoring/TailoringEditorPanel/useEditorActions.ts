/**
 * @file useEditorActions.ts
 * @description Custom hook for managing editor actions and state.
 */

import { useRef, useState, useCallback, useEffect, RefObject } from 'react'
import type { OnMount } from '@monaco-editor/react'
import { normalizeSearchText } from './TailoringEditorPanel.helpers'
import type { EditorKeywords } from './TailoringEditorPanel.types'

type EditorInstance = Parameters<OnMount>[0]

export interface UseEditorActionsParams {
  value: string
  editorKeywords?: EditorKeywords
  onInsertKeyword?: (keyword: string) => void
  onReplaceKeyword?: (from: string, to: string) => void
}

// Raw data for a single rephrase — kept so diffs can be restored after toggle-off
interface PendingDiff {
  originalText: string
  insertLine: number
  toLineCount: number
  deletedLineCount: number
}

export interface UseEditorActionsReturn {
  fileMenuRef: RefObject<HTMLDivElement>
  exportMenuRef: RefObject<HTMLDivElement>
  lineCol: { line: number; col: number }
  fileMenuOpen: boolean
  exportMenuOpen: boolean
  phrasesModalOpen: boolean
  previewModalOpen: boolean
  keywordsSubmenuOpen: boolean
  keywordPhrasesModalOpen: boolean
  semanticGapsModalOpen: boolean
  tipsModalOpen: boolean
  removeSuggestionsModalOpen: boolean
  setFileMenuOpen: (v: boolean) => void
  setExportMenuOpen: (v: boolean) => void
  setPhrasesModalOpen: (v: boolean) => void
  setPreviewModalOpen: (v: boolean) => void
  setKeywordsSubmenuOpen: (v: boolean) => void
  setKeywordPhrasesModalOpen: (v: boolean) => void
  setSemanticGapsModalOpen: (v: boolean) => void
  setTipsModalOpen: (v: boolean) => void
  setRemoveSuggestionsModalOpen: (v: boolean) => void
  handleMount: OnMount
  handleAction: (key: string) => void
  insertAtCursor: (text: string) => void
  findAndReplace: (from: string, to: string) => void
  clearDiff: () => void
  showDiff: boolean
  toggleDiff: () => void
  resetDiffBase: () => void
}

export function useEditorActions({
  value,
  editorKeywords,
  onInsertKeyword,
}: UseEditorActionsParams): UseEditorActionsReturn {
  const editorRef = useRef<EditorInstance | null>(null)
  const decorationsRef = useRef<string[]>([])
  const diffDecorationsRef = useRef<string[]>([])
  const removeDecorationsRef = useRef<string[]>([])
  // ViewZone IDs for the "deleted text" ghost lines (VSCode merge-conflict style)
  const viewZoneIds = useRef<string[]>([])
  // Raw data for every rephrase — persists across toggle-off so diffs can be restored
  const pendingDiffsRef = useRef<PendingDiff[]>([])
  const [editorReady, setEditorReady] = useState(false)
  const fileMenuRef = useRef<HTMLDivElement>(null)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  const [lineCol, setLineCol] = useState({ line: 1, col: 1 })
  const [showDiff, setShowDiff] = useState(false)
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [phrasesModalOpen, setPhrasesModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [keywordsSubmenuOpen, setKeywordsSubmenuOpen] = useState(false)
  const [keywordPhrasesModalOpen, setKeywordPhrasesModalOpen] = useState(false)
  const [semanticGapsModalOpen, setSemanticGapsModalOpen] = useState(false)
  const [tipsModalOpen, setTipsModalOpen] = useState(false)
  const [removeSuggestionsModalOpen, setRemoveSuggestionsModalOpen] = useState(false)

  // Apply remove-suggestion decorations when editor is ready or suggestions/content change
  useEffect(() => {
    if (!editorReady) return
    const ed = editorRef.current
    const model = ed?.getModel()
    if (!ed || !model) return

    const suggestions = editorKeywords?.removeSuggestions
    if (!suggestions?.length) {
      removeDecorationsRef.current = ed.deltaDecorations(removeDecorationsRef.current, [])
      return
    }

    const decorations: Array<{
      range: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number }
      options: object
    }> = []

    for (const s of suggestions) {
      const matches = model.findMatches(s.item, false, false, false, null, false)
      for (const match of matches) {
        decorations.push({
          range: match.range,
          options: {
            isWholeLine: false,
            className: 'te-remove-line',
            inlineClassName: 'te-remove-inline',
            glyphMarginClassName: 'te-remove-glyph',
            overviewRuler: { color: 'rgba(239,68,68,0.7)', position: 1 },
            minimap: { color: 'rgba(239,68,68,0.6)', position: 1 },
            hoverMessage: { value: `**${s.section} — ${s.item}**\n\n${s.reason}` },
          },
        })
      }
    }

    removeDecorationsRef.current = ed.deltaDecorations(removeDecorationsRef.current, decorations as never)
  }, [editorReady, value, editorKeywords?.removeSuggestions])

  // Close file menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
        setFileMenuOpen(false)
      }
    }
    if (fileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => { document.removeEventListener('click', handleClickOutside) }
    }
  }, [fileMenuOpen])

  // Close export menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false)
      }
    }
    if (exportMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => { document.removeEventListener('click', handleClickOutside) }
    }
  }, [exportMenuOpen])

  function flashDecoration(
    range: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number },
    className: string,
    durationMs: number
  ) {
    const ed = editorRef.current
    if (!ed) return
    decorationsRef.current = ed.deltaDecorations(decorationsRef.current, [{
      range,
      options: { inlineClassName: className },
    }])
    setTimeout(() => {
      decorationsRef.current = ed.deltaDecorations(decorationsRef.current, [])
    }, durationMs)
  }

  function insertWrap(before: string, after = '') {
    const ed = editorRef.current
    if (!ed) return
    const sel = ed.getSelection()
    if (!sel) return
    const model = ed.getModel()
    if (!model) return
    const text = model.getValueInRange(sel)
    ed.executeEdits('toolbar', [{ range: sel, text: before + text + after, forceMoveMarkers: true }])
    ed.focus()
  }

  function toggleLinePrefix(prefix: string) {
    const ed = editorRef.current
    if (!ed) return
    const sel = ed.getSelection()
    if (!sel) return
    const model = ed.getModel()
    if (!model) return
    const edits: Array<{ range: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number }; text: string }> = []
    for (let line = sel.startLineNumber; line <= sel.endLineNumber; line++) {
      const content = model.getLineContent(line)
      if (content.startsWith(prefix)) {
        edits.push({ range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: prefix.length + 1 }, text: '' })
      } else {
        edits.push({ range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 }, text: prefix })
      }
    }
    ed.executeEdits('toolbar', edits)
    ed.focus()
  }

  function insertAtCursorToolbar(text: string) {
    const ed = editorRef.current
    if (!ed) return
    const pos = ed.getPosition()
    if (!pos) return
    ed.executeEdits('toolbar', [{
      range: { startLineNumber: pos.lineNumber, startColumn: pos.column, endLineNumber: pos.lineNumber, endColumn: pos.column },
      text,
    }])
    ed.focus()
  }

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e) => {
      setLineCol({ line: e.position.lineNumber, col: e.position.column })
    })
    setEditorReady(true)
  }, [])

  // ---------------------------------------------------------------------------
  // Diff helpers — VSCode merge-conflict style
  // ---------------------------------------------------------------------------

  /** Apply visual artifacts (decorations + ViewZones) for all pending diffs. */
  const applyDiffVisuals = useCallback((ed: EditorInstance) => {
    for (const diff of pendingDiffsRef.current) {
      // Green "incoming" whole-line decorations
      const newDecorations = []
      for (let l = diff.insertLine; l <= diff.insertLine + diff.toLineCount - 1; l++) {
        newDecorations.push({
          range: { startLineNumber: l, startColumn: 1, endLineNumber: l, endColumn: 1 },
          options: {
            isWholeLine: true,
            className: 'te-diff-incoming-line',
            linesDecorationsClassName: 'te-diff-incoming-bar',
            glyphMarginClassName: 'te-diff-glyph-add',
          },
        })
      }
      const addedIds = ed.deltaDecorations([], newDecorations as never)
      diffDecorationsRef.current = [...diffDecorationsRef.current, ...addedIds]

      // Red "deleted text" ViewZone
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(ed as any).changeViewZones((accessor: any) => {
        const domNode = document.createElement('div')
        domNode.className = 'te-diff-deleted-zone'
        domNode.textContent = diff.originalText
        const zoneId = accessor.addZone({
          afterLineNumber: diff.insertLine - 1,
          heightInLines: diff.deletedLineCount,
          domNode,
        })
        viewZoneIds.current.push(zoneId)
      })
    }
  }, [])

  /** Remove all diff visual artifacts without touching pendingDiffsRef. */
  const removeDiffVisuals = useCallback((ed: EditorInstance) => {
    diffDecorationsRef.current = ed.deltaDecorations(diffDecorationsRef.current, [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ed as any).changeViewZones((accessor: any) => {
      viewZoneIds.current.forEach((id) => accessor.removeZone(id))
      viewZoneIds.current = []
    })
  }, [])

  /**
   * Clear all diff data and visuals permanently (e.g. user explicitly dismisses).
   */
  const clearDiff = useCallback(() => {
    const ed = editorRef.current
    if (!ed) return
    removeDiffVisuals(ed)
    pendingDiffsRef.current = []
    setShowDiff(false)
  }, [removeDiffVisuals])

  /**
   * Toggle diff visibility. When re-enabled, re-applies all pending diffs from
   * stored data so the user sees them again without re-running the rephrase.
   */
  const toggleDiff = useCallback(() => {
    const ed = editorRef.current
    if (!ed) return
    if (showDiff) {
      removeDiffVisuals(ed)
      setShowDiff(false)
    } else if (pendingDiffsRef.current.length > 0) {
      applyDiffVisuals(ed)
      setShowDiff(true)
    }
  }, [showDiff, removeDiffVisuals, applyDiffVisuals])

  const resetDiffBase = useCallback(() => {
    clearDiff()
  }, [clearDiff])

  // ---------------------------------------------------------------------------
  // Public actions
  // ---------------------------------------------------------------------------

  const insertAtCursor = useCallback((text: string) => {
    const ed = editorRef.current
    if (!ed) return
    const pos = ed.getPosition()
    if (!pos) return
    const range = { startLineNumber: pos.lineNumber, startColumn: pos.column, endLineNumber: pos.lineNumber, endColumn: pos.column }
    ed.executeEdits('keyword', [{ range, text, forceMoveMarkers: true }])
    ed.focus()
    const endPos = ed.getPosition()
    if (endPos) {
      flashDecoration(
        { startLineNumber: pos.lineNumber, startColumn: pos.column, endLineNumber: endPos.lineNumber, endColumn: endPos.column },
        'te-highlight-add',
        2000,
      )
    }
  }, [])

  const findAndReplace = useCallback((from: string, to: string) => {
    const ed = editorRef.current
    const model = ed?.getModel()
    if (!ed || !model) return

    // 1. Try exact match, then normalised fallback
    let matches = model.findMatches(from, false, false, false, null, false)
    if (matches.length === 0) {
      const normalized = normalizeSearchText(from)
      if (normalized !== from) {
        matches = model.findMatches(normalized, false, false, false, null, false)
      }
    }

    // 2. Nothing found — append at end (last-resort fallback)
    if (matches.length === 0) {
      const lineCount = model.getLineCount()
      const lastCol = model.getLineMaxColumn(lineCount)
      ed.executeEdits('rephrase', [{
        range: { startLineNumber: lineCount, startColumn: lastCol, endLineNumber: lineCount, endColumn: lastCol },
        text: `\n${to}`,
        forceMoveMarkers: true,
      }])
      ed.revealLineInCenter(lineCount + 1)
      ed.focus()
      return
    }

    const match = matches[0]
    const originalText = model.getValueInRange(match.range)
    const insertLine = match.range.startLineNumber

    // 3. Execute the substitution
    ed.executeEdits('rephrase', [{ range: match.range, text: to, forceMoveMarkers: true }])

    // 4. Record the diff data so it can be re-applied after a toggle-off
    const toLineCount = to.split('\n').length
    const deletedLineCount = Math.max(1, originalText.split('\n').length)
    const pending: PendingDiff = { originalText, insertLine, toLineCount, deletedLineCount }
    pendingDiffsRef.current = [...pendingDiffsRef.current, pending]

    // 5. Apply visuals immediately via the shared helper
    applyDiffVisuals(ed)

    setShowDiff(true)

    requestAnimationFrame(() => {
      ed.revealLineInCenter(insertLine)
      ed.focus()
    })
  }, [applyDiffVisuals])

  function handleAction(key: string) {
    switch (key) {
      case 'bold': insertWrap('**', '**'); break
      case 'italic': insertWrap('*', '*'); break
      case 'h1': insertWrap('# '); break
      case 'h2': toggleLinePrefix('## '); break
      case 'h3': toggleLinePrefix('### '); break
      case 'ul': toggleLinePrefix('- '); break
      case 'ol': toggleLinePrefix('1. '); break
      case 'divider': insertAtCursorToolbar('\n\n---\n\n'); break
      case 'undo': editorRef.current?.trigger('keyboard', 'undo', null); break
      case 'redo': editorRef.current?.trigger('keyboard', 'redo', null); break
      case 'toggleDiff': toggleDiff(); break
    }
  }

  return {
    fileMenuRef,
    exportMenuRef,
    lineCol,
    fileMenuOpen,
    exportMenuOpen,
    phrasesModalOpen,
    previewModalOpen,
    keywordsSubmenuOpen,
    keywordPhrasesModalOpen,
    semanticGapsModalOpen,
    tipsModalOpen,
    removeSuggestionsModalOpen,
    setFileMenuOpen,
    setExportMenuOpen,
    setPhrasesModalOpen,
    setPreviewModalOpen,
    setKeywordsSubmenuOpen,
    setKeywordPhrasesModalOpen,
    setSemanticGapsModalOpen,
    setTipsModalOpen,
    setRemoveSuggestionsModalOpen,
    handleMount,
    handleAction,
    insertAtCursor,
    findAndReplace,
    clearDiff,
    showDiff,
    toggleDiff,
    resetDiffBase,
  }
}
