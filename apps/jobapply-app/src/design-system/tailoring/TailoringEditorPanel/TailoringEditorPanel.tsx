import { useRef, useCallback, useMemo, useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { injectGlobal } from '@emotion/css'
import Editor, { type OnMount } from '@monaco-editor/react'
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  MinusOutlined,
  UndoOutlined,
  RedoOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ClearOutlined,
  HistoryOutlined,
  FileOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { Colors } from '../../../styles/theme/colors'
import { Spacing } from '../../../styles/theme/spacing'
import { FontSize, FontFamily, FontWeight } from '../../../styles/theme/typography'
import { BorderRadius } from '../../../styles/theme/radius'
import type { TailoringEditorPanelProps, TailoringEditorHandle } from './TailoringEditorPanel.types'
import { applyDiffDecorations, useTextDiff } from './TailoringEditorPanel.helpers'
import * as S from './TailoringEditorPanel.styles'

type EditorInstance = Parameters<OnMount>[0]

injectGlobal`
  @keyframes te-fade-add {
    0%   { background: rgba(34, 197, 94, 0.45); }
    100% { background: transparent; }
  }
  @keyframes te-fade-rephrase {
    0%   { background: rgba(245, 158, 11, 0.45); }
    100% { background: transparent; }
  }
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  .te-highlight-add {
    border-radius: 2px;
    animation: te-fade-add 2s ease-out forwards;
  }
  .te-highlight-rephrase {
    border-radius: 2px;
    animation: te-fade-rephrase 2.5s ease-out forwards;
  }

  /* Diff styling */
  .te-diff-insert {
    background: rgba(34, 197, 94, 0.15);
    border-left: 2px solid rgba(34, 197, 94, 0.5);
    border-radius: 0 2px 2px 0;
  }

  .te-diff-delete {
    text-decoration: line-through;
    text-decoration-color: rgba(239, 68, 68, 0.7);
    text-decoration-thickness: 2px;
    background: rgba(239, 68, 68, 0.1);
    border-left: 2px solid rgba(239, 68, 68, 0.5);
    border-radius: 0 2px 2px 0;
    color: rgba(255, 255, 255, 0.5);
  }

  .te-diff-replace {
    background: rgba(245, 158, 11, 0.15);
    border-left: 2px solid rgba(245, 158, 11, 0.5);
    border-radius: 0 2px 2px 0;
  }
`

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

const EDITOR_OPTIONS = {
  minimap: { enabled: true },
  wordWrap: 'on' as const,
  lineNumbers: 'off' as const,
  folding: false,
  renderLineHighlight: 'none' as const,
  scrollBeyondLastLine: false,
  fontSize: 10,
  lineDecorationsWidth: 10,
  padding: { top: 12, bottom: 12 },
  automaticLayout: true,
  smoothScrolling: true,
  scrollbar: {
    vertical: 'auto' as const,
    horizontal: 'hidden' as const,
    verticalScrollbarSize: 14,
    useShadows: true,
  },
  find: {
    addExtraSpaceOnTop: false,
    seedSearchStringFromSelection: 'selection' as const,
  },
  mouseWheelScrollSensitivity: 1.5,
}

const GROUPS = ['format', 'heading', 'list', 'insert', 'history', 'diff']


export const TailoringEditorPanel = forwardRef<TailoringEditorHandle, TailoringEditorPanelProps>(
  function TailoringEditorPanel({ value, onChange, locale = 'pt-BR', editorKeywords, onInsertKeyword, onReplaceKeyword, hasAnalysisNotification = false, jobTitle }, ref) {
    const editorRef = useRef<EditorInstance | null>(null)
    const decorationsRef = useRef<string[]>([])
    const diffDecorationsRef = useRef<string[]>([])
    const [lineCol, setLineCol] = useState({ line: 1, col: 1 })
    const [fileMenuOpen, setFileMenuOpen] = useState(false)
    const [phrasesModalOpen, setPhrasesModalOpen] = useState(false)
    const [keywordsSubmenuOpen, setKeywordsSubmenuOpen] = useState(false)
    const fileMenuRef = useRef<HTMLDivElement>(null)

    // Text diff management
    const {
      diffChanges,
      updateDiff,
      resetDiff,
      showDiff,
      toggleDiff,
    } = useTextDiff(value)

    console.log('TailoringEditorPanel diff state:', {
      diffChangesCount: diffChanges.length,
      showDiff,
      valueLength: value.length,
    })

    const wordCount = useMemo(() => countWords(value), [value])

    // Apply diff decorations when changes occur
    useEffect(() => {
      console.log('Diff useEffect triggered:', {
        hasEditor: !!editorRef.current,
        showDiff,
        valueLength: value.length,
        value: value.substring(0, 50) + (value.length > 50 ? '...' : '')
      })
      if (editorRef.current && showDiff) {
        // Update diff when text changes
        console.log('Calling updateDiff with value')
        updateDiff(value)
      } else {
        console.log('Skipping updateDiff:', { hasEditor: !!editorRef.current, showDiff })
      }
    }, [value, showDiff, updateDiff])

    // Debug: log when editor mounts
    const handleMount: OnMount = useCallback((editor) => {
      console.log('Editor mounted:', !!editor)
      editorRef.current = editor
      editor.onDidChangeCursorPosition((e) => {
        setLineCol({ line: e.position.lineNumber, col: e.position.column })
      })
    }, [])

    // Apply diff decorations when diff changes occur
    useEffect(() => {
      if (editorRef.current && showDiff && diffChanges.length > 0) {
        // Apply diff decorations
        diffDecorationsRef.current = applyDiffDecorations(
          editorRef.current,
          diffChanges,
          diffDecorationsRef.current
        )
      } else if (editorRef.current && !showDiff) {
        // Clear diff decorations when diff is hidden
        diffDecorationsRef.current = editorRef.current.deltaDecorations(diffDecorationsRef.current, [])
      }
    }, [diffChanges, showDiff])

    // Close file menu when clicking outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
          setFileMenuOpen(false)
        }
      }
      if (fileMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
      }
    }, [fileMenuOpen])

    function flashDecoration(range: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number }, className: string, durationMs: number) {
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

    useImperativeHandle(ref, () => ({
      insertAtCursor(text: string) {
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
        // Update diff after insertion
        updateDiff(ed.getModel()?.getValue() || '')
      },

      findAndReplace(from: string, to: string) {
        const ed = editorRef.current
        const model = ed?.getModel()
        if (!ed || !model) return

        const matches = model.findMatches(from, false, false, false, null, false)
        if (matches.length === 0) {
          // not found — append at end with rephrase highlight
          const lineCount = model.getLineCount()
          const lastCol = model.getLineMaxColumn(lineCount)
          const appendRange = { startLineNumber: lineCount, startColumn: lastCol, endLineNumber: lineCount, endColumn: lastCol }
          ed.executeEdits('keyword', [{ range: appendRange, text: `\n${to}`, forceMoveMarkers: true }])
          ed.revealLineInCenter(lineCount + 1)
          ed.focus()
          return
        }

        const match = matches[0]
        ed.executeEdits('keyword', [{ range: match.range, text: to, forceMoveMarkers: true }])

        requestAnimationFrame(() => {
          ed.revealRangeInCenter(match.range)
          ed.focus()
          const endPos = ed.getPosition()
          const highlightRange = endPos
            ? { startLineNumber: match.range.startLineNumber, startColumn: match.range.startColumn, endLineNumber: endPos.lineNumber, endColumn: endPos.column }
            : match.range
          flashDecoration(highlightRange, 'te-highlight-rephrase', 2500)
        })
        // Update diff after replacement
        updateDiff(model.getValue())
      },

      /** Clear all diff decorations */
      clearDiff: () => {
        if (editorRef.current) {
          diffDecorationsRef.current = editorRef.current.deltaDecorations(diffDecorationsRef.current, [])
        }
      },

      /** Toggle diff visibility */
      toggleDiff: () => {
        toggleDiff()
      },

      /** Reset diff base to current text */
      resetDiffBase: () => {
        resetDiff(value)
      },
    }))

    // Remove the duplicate handleMount function

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

    function insertObjectiveSection() {
      const ed = editorRef.current
      if (!ed) return

      const objectiveText = locale === 'pt-BR'
        ? `# Objetivo\n\n${jobTitle || 'Posição desejada'}\n\n`
        : `# Objective\n\n${jobTitle || 'Desired position'}\n\n`

      // Insert at the beginning of the document
      ed.executeEdits('objective', [{
        range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 },
        text: objectiveText,
      }])
      ed.focus()

      // Scroll to top
      ed.revealLineInCenter(1)
    }

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
        case 'clearDiff':
          if (editorRef.current) {
            diffDecorationsRef.current = editorRef.current.deltaDecorations(diffDecorationsRef.current, [])
          }
          break
        case 'resetDiff': resetDiff(value); break
      }
    }

    const TOOLBAR_ITEMS = [
      { key: 'bold', icon: <BoldOutlined />, label: 'Bold', group: 'format' },
      { key: 'italic', icon: <ItalicOutlined />, label: 'Italic', group: 'format' },
      { key: 'h1', label: 'H1', wide: true, group: 'heading' },
      { key: 'h2', label: 'H2', wide: true, group: 'heading' },
      { key: 'h3', label: 'H3', wide: true, group: 'heading' },
      { key: 'ul', icon: <UnorderedListOutlined />, label: 'Bullet list', group: 'list' },
      { key: 'ol', icon: <OrderedListOutlined />, label: 'Numbered list', group: 'list' },
      { key: 'divider', icon: <MinusOutlined />, label: 'Divider', group: 'insert' },
      { key: 'undo', icon: <UndoOutlined />, label: 'Undo', group: 'history' },
      { key: 'redo', icon: <RedoOutlined />, label: 'Redo', group: 'history' },
      { key: 'toggleDiff', icon: showDiff ? <EyeInvisibleOutlined /> : <EyeOutlined />, label: showDiff ? 'Hide diff' : 'Show diff', group: 'diff' },
      { key: 'clearDiff', icon: <ClearOutlined />, label: 'Clear diff', group: 'diff' },
      { key: 'resetDiff', icon: <HistoryOutlined />, label: 'Reset diff base', group: 'diff' },
    ]

    const localeLabel = locale === 'pt-BR' ? 'PT-BR' : 'EN'

    // File dropdown menu
    const fileMenu = (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        background: Colors.surfaceDarker,
        border: `1px solid ${Colors.surfaceEditorBorder}`,
        borderRadius: BorderRadius.xs,
        minWidth: '200px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          padding: `${Spacing.xs} 0`,
        }}>
          {/* Keywords to Add submenu */}
          <div
            style={{
              position: 'relative',
            }}
            onMouseEnter={() => setKeywordsSubmenuOpen(true)}
            onMouseLeave={() => setKeywordsSubmenuOpen(false)}
          >
            <div
              style={{
                width: '100%',
                padding: `${Spacing.xs} ${Spacing.md}`,
                background: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'left',
                fontSize: FontSize.sm,
                fontFamily: FontFamily.body,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Keywords to Add</span>
              <DownOutlined style={{ fontSize: '10px' }} />
            </div>
            {/* Keywords submenu */}
            {editorKeywords?.toAdd && editorKeywords.toAdd.length > 0 && keywordsSubmenuOpen && (
              <div style={{
                position: 'absolute',
                left: '100%',
                top: 0,
                background: Colors.surfaceDarker,
                border: `1px solid ${Colors.surfaceEditorBorder}`,
                borderRadius: BorderRadius.xs,
                minWidth: '180px',
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}>
                {editorKeywords.toAdd.map((keyword, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onInsertKeyword?.(keyword)
                      setFileMenuOpen(false)
                    }}
                    style={{
                      width: '100%',
                      padding: `${Spacing.xs} ${Spacing.md}`,
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.8)',
                      textAlign: 'left',
                      fontSize: FontSize.sm,
                      fontFamily: FontFamily.body,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phrases to Change */}
          <button
            type="button"
            onClick={() => {
              setPhrasesModalOpen(true)
              setFileMenuOpen(false)
            }}
            style={{
              width: '100%',
              padding: `${Spacing.xs} ${Spacing.md}`,
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'left',
              fontSize: FontSize.sm,
              fontFamily: FontFamily.body,
              cursor: 'pointer',
            }}
          >
            Phrases to Change
          </button>

          {/* Add Objective Section */}
          <button
            type="button"
            onClick={() => {
              insertObjectiveSection()
              setFileMenuOpen(false)
            }}
            disabled={!jobTitle}
            style={{
              width: '100%',
              padding: `${Spacing.xs} ${Spacing.md}`,
              background: 'transparent',
              border: 'none',
              color: jobTitle ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
              textAlign: 'left',
              fontSize: FontSize.sm,
              fontFamily: FontFamily.body,
              cursor: jobTitle ? 'pointer' : 'not-allowed',
            }}
          >
            Add Objective Section
          </button>
        </div>
      </div>
    )

    // Phrases modal
    const phrasesModal = (
      <Modal
        open={phrasesModalOpen}
        onCancel={() => setPhrasesModalOpen(false)}
        title={null}
        footer={null}
        width={600}
        styles={{
          body: {
            background: Colors.gradientAiToolbar,
            border: `1px solid rgba(124,58,237,0.2)`,
            padding: 0,
            margin: 0,
          },
          content: {
            background: Colors.gradientAiToolbar,
            border: `1px solid rgba(124,58,237,0.2)`,
          },
        }}
      >
        <div style={{
          padding: `${Spacing.lg} ${Spacing.xl}`,
        }}>
          {/* Header with pulse dot */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: Spacing.sm,
            marginBottom: Spacing.lg,
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: Colors.primaryDark,
              flexShrink: 0,
              animation: 'pulse 2s infinite'
            }} />
            <span style={{
              fontSize: FontSize.md,
              color: Colors.primaryDark,
              fontWeight: FontWeight.semibold,
            }}>
              Phrases to Change
            </span>
          </div>

          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}>
            {editorKeywords?.toRephrase && editorKeywords.toRephrase.length > 0 ? (
              editorKeywords.toRephrase.map((phrase, index) => (
                <div
                  key={index}
                  style={{
                    padding: `${Spacing.md} ${Spacing.lg}`,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid rgba(124,58,237,0.1)`,
                    marginBottom: Spacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: Spacing.md,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: FontSize.sm,
                      color: Colors.primaryDark,
                      marginBottom: Spacing.xs,
                      fontWeight: FontWeight.medium,
                    }}>
                      <span style={{ opacity: 0.7 }}>From:</span> {phrase.from}
                    </div>
                    <div style={{
                      fontSize: FontSize.sm,
                      color: 'rgba(255,255,255,0.8)',
                    }}>
                      <span style={{ opacity: 0.7 }}>To:</span> {phrase.to}
                    </div>
                  </div>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      onReplaceKeyword?.(phrase.from, phrase.to)
                      setPhrasesModalOpen(false)
                    }}
                    style={{
                      background: Colors.primaryDark,
                      border: 'none',
                      borderRadius: BorderRadius.full,
                      color: Colors.white,
                      fontSize: FontSize.xxs,
                      fontWeight: FontWeight.semibold,
                      padding: `${Spacing.xs} ${Spacing.md}`,
                      cursor: 'pointer',
                      fontFamily: FontFamily.body,
                      minWidth: '80px',
                    }}
                  >
                    Replace
                  </Button>
                </div>
              ))
            ) : (
              <div style={{
                padding: Spacing.xl,
                textAlign: 'center',
                color: Colors.primaryDark,
                opacity: 0.7,
                fontSize: FontSize.sm,
              }}>
                No phrases to change
              </div>
            )}
          </div>

          {/* Close button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: Spacing.lg,
            paddingTop: Spacing.md,
            borderTop: `1px solid rgba(124,58,237,0.2)`,
          }}>
            <Button
              onClick={() => setPhrasesModalOpen(false)}
              style={{
                background: 'none',
                border: `1px solid ${Colors.primaryDark}`,
                borderRadius: '6px',
                color: Colors.primaryDark,
                fontSize: FontSize.xxs,
                fontWeight: FontWeight.medium,
                padding: `2px ${Spacing.md}`,
                cursor: 'pointer',
                fontFamily: FontFamily.body,
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    )

    return (
      <S.Root>
        <S.Toolbar>
          {/* File dropdown */}
          <div style={{ position: 'relative' }} ref={fileMenuRef}>
            <S.ToolbarBtn
              type="button"
              onClick={() => setFileMenuOpen(!fileMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: Spacing.xs, position: 'relative' }}
            >
              <FileOutlined />
              File
              <DownOutlined style={{ fontSize: '10px' }} />
              {hasAnalysisNotification && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ff4d4f',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
                  animation: 'pulse 1.5s infinite',
                }} />
              )}
            </S.ToolbarBtn>
            {fileMenuOpen && fileMenu}
          </div>

          <S.ToolbarDivider />

          {GROUPS.map((group, gi) => {
            const items = TOOLBAR_ITEMS.filter((i) => i.group === group)
            return (
              <>
                {gi > 0 && <S.ToolbarDivider key={`div-${group}`} />}
                {items.map((item) => (
                  <S.ToolbarBtn
                    key={item.key}
                    type="button"
                    title={item.label}
                    wide={item.wide}
                    onClick={() => handleAction(item.key)}
                  >
                    {item.icon ?? item.label}
                  </S.ToolbarBtn>
                ))}
              </>
            )
          })}
        </S.Toolbar>

        <S.EditorWrapper>
          <Editor
            height="100%"
            defaultLanguage="markdown"
            theme="vs-dark"
            value={value}
            onChange={(v) => onChange(v ?? '')}
            onMount={handleMount}
            options={EDITOR_OPTIONS}
          />
        </S.EditorWrapper>

        <S.StatusBar>
          <span>Markdown</span>
          <span>Ln {lineCol.line}, Col {lineCol.col}</span>
          <span>{wordCount} palavras</span>
          <S.StatusRight>{localeLabel}</S.StatusRight>
        </S.StatusBar>
        {phrasesModal}
      </S.Root>
    )
  }
)
