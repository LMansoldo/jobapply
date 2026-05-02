/**
 * @file MonacoEditorPanel.tsx
 * @description Monaco Editor panel — dark theme matching TailoringEditorPanel style.
 */
import { useState, useRef, useCallback, useMemo } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Grid } from 'antd'
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  MinusOutlined,
  UndoOutlined,
  RedoOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { MonacoEditorPanelProps } from './MonacoEditorPanel.types'
import { Alert } from '../../../../components/Alert'
import { Spacing } from '../../../../styles/theme/spacing'
import * as styles from './MonacoEditorPanel.styles'
import React from 'react'

const { useBreakpoint } = Grid

type EditorInstance = Parameters<OnMount>[0]

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  wordWrap: 'on' as const,
  lineNumbers: 'off' as const,
  folding: false,
  renderLineHighlight: 'none' as const,
  scrollBeyondLastLine: false,
  fontSize: 13,
  lineDecorationsWidth: 8,
  padding: { top: 12, bottom: 12 },
  automaticLayout: true,
  smoothScrolling: true,
  scrollbar: {
    vertical: 'auto' as const,
    horizontal: 'hidden' as const,
  },
}

const GROUPS = ['format', 'heading', 'list', 'insert', 'history'] as const

export function MonacoEditorPanel({
  value,
  onChange,
  errors,
  height = 520,
  locale = 'pt-BR',
  isOptional = false,
  isEmpty = false,
  onStartFromScratch,
  onTranslateFromPtBr,
}: MonacoEditorPanelProps) {
  const { t } = useTranslation()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')
  const [lineCol, setLineCol] = useState({ line: 1, col: 1 })
  const [emptyOverlayDismissed, setEmptyOverlayDismissed] = useState(false)
  const editorRef = useRef<EditorInstance | null>(null)

  const wordCount = useMemo(() => countWords(value), [value])
  const showEmptyOverlay = isEmpty && !emptyOverlayDismissed && locale === 'en' && !value.trim()

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e) => {
      setLineCol({ line: e.position.lineNumber, col: e.position.column })
    })
  }, [])

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

  function insertAtCursor(text: string) {
    const ed = editorRef.current
    if (!ed) return
    const pos = ed.getPosition()
    if (!pos) return
    ed.executeEdits('toolbar', [{ range: { startLineNumber: pos.lineNumber, startColumn: pos.column, endLineNumber: pos.lineNumber, endColumn: pos.column }, text }])
    ed.focus()
  }

  const handleAction = (key: string) => {
    switch (key) {
      case 'bold': insertWrap('**', '**'); break
      case 'italic': insertWrap('*', '*'); break
      case 'h1': toggleLinePrefix('# '); break
      case 'h2': toggleLinePrefix('## '); break
      case 'h3': toggleLinePrefix('### '); break
      case 'ul': toggleLinePrefix('- '); break
      case 'ol': toggleLinePrefix('1. '); break
      case 'divider': insertAtCursor('\n\n---\n\n'); break
      case 'link': insertWrap('[', '](url)'); break
      case 'undo': editorRef.current?.trigger('keyboard', 'undo', null); break
      case 'redo': editorRef.current?.trigger('keyboard', 'redo', null); break
    }
  }

  const TOOLBAR_ITEMS = [
    { group: 'format', key: 'bold',    icon: <BoldOutlined />,          label: 'Bold',    wide: false },
    { group: 'format', key: 'italic',  icon: <ItalicOutlined />,         label: 'Italic',  wide: false },
    { group: 'heading', key: 'h1',     icon: null, label: 'H1',  wide: true  },
    { group: 'heading', key: 'h2',     icon: null, label: 'H2',  wide: true  },
    { group: 'heading', key: 'h3',     icon: null, label: 'H3',  wide: true  },
    { group: 'list', key: 'ul',        icon: <UnorderedListOutlined />,  label: 'List',    wide: false },
    { group: 'list', key: 'ol',        icon: <OrderedListOutlined />,    label: 'OL',      wide: false },
    { group: 'insert', key: 'link',    icon: <LinkOutlined />,           label: 'Link',    wide: false },
    { group: 'insert', key: 'divider', icon: <MinusOutlined />,          label: '---',     wide: false },
    { group: 'history', key: 'undo',   icon: <UndoOutlined />,           label: 'Undo',    wide: false },
    { group: 'history', key: 'redo',   icon: <RedoOutlined />,           label: 'Redo',    wide: false },
  ]

  const isPtBr = locale === 'pt-BR'
  const localeBadge = isPtBr ? 'PT-BR' : 'EN'
  const localeTitle = isPtBr ? '🇧🇷 Português' : '🇺🇸 English'

  return (
    <div className={styles.root}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Row 1: locale info + word count */}
        <div className={styles.toolbarHeaderRow}>
          <div className={styles.toolbarHeaderLeft}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.3rem' }}>{localeTitle}</span>
            <span className={styles.localeBadge}>{localeBadge}</span>
            {isOptional && <span className={styles.optionalBadge}>{t('common.optional')}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            {isMobile && (
              <div className={styles.mobileTabRow}>
                <button type="button" className={styles.mobileTabBtn(mobileTab === 'editor')} onClick={() => setMobileTab('editor')}>
                  {t('cv.editor.editorTab') || 'Editor'}
                </button>
                <button type="button" className={styles.mobileTabBtn(mobileTab === 'preview')} onClick={() => setMobileTab('preview')}>
                  {t('cv.editor.previewTab')}
                </button>
              </div>
            )}
            <span className={styles.wordCountLabel}>{t('cv.wordCount', { count: wordCount })}</span>
          </div>
        </div>

        {/* Row 2: formatting buttons */}
        <div className={styles.toolsRow}>
          {GROUPS.map((group, gi) => {
            const items = TOOLBAR_ITEMS.filter((item) => item.group === group)
            return (
              <React.Fragment key={group}>
                {items.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={styles.toolbarBtn(false, item.wide)}
                    onClick={() => handleAction(item.key)}
                  >
                    {item.icon ?? item.label}
                  </button>
                ))}
                {gi < GROUPS.length - 1 && <div className={styles.toolbarDivider} />}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <Alert
          type="error"
          className={styles.errorBanner}
          message={t('cv.editor.validationErrors')}
          description={
            <ul style={{ margin: `${Spacing.xs} 0 0`, paddingLeft: Spacing.lg0 }}>
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          }
        />
      )}

      {/* Editor area */}
      <div className={styles.editorAreaRelative}>
        {isMobile ? (
          <>
            {mobileTab === 'editor' ? (
              <div className={styles.mobileEditorHeight}>
                <Editor height="100%" defaultLanguage="markdown" theme="vs-dark"
                  value={value} onChange={(v) => onChange(v ?? '')}
                  onMount={handleMount} options={EDITOR_OPTIONS} />
              </div>
            ) : (
              <div className={styles.mobilePreviewPane}>
                <div className="markdown-preview">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.splitPane(height)}>
            <div className={styles.editorHalf}>
              <Editor height="100%" defaultLanguage="markdown" theme="vs-dark"
                value={value} onChange={(v) => onChange(v ?? '')}
                onMount={handleMount} options={EDITOR_OPTIONS} />
            </div>
            <div className={styles.previewHalf}>
              <div className="markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Empty state overlay */}
        {showEmptyOverlay && (
          <div className={styles.emptyOverlay}>
            <span style={{ fontSize: '4rem' }}>🌐</span>
            <p className={styles.overlayTitle}>{t('cv.noEnVersion')}</p>
            <p className={styles.overlaySubtitle}>{t('cv.noEnVersionSub')}</p>
            <div className={styles.overlayBtns}>
              <button type="button" className={styles.overlayPrimaryBtn}
                onClick={() => { setEmptyOverlayDismissed(true); onStartFromScratch?.() }}>
                ✏️ {t('cv.startFromScratch')}
              </button>
              <button type="button" className={styles.overlayGhostBtn}
                onClick={() => { setEmptyOverlayDismissed(true); onTranslateFromPtBr?.() }}>
                🌐 {t('cv.translateFromPtBr')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>Markdown</span>
        <span>Ln {lineCol.line}, Col {lineCol.col}</span>
        <span>UTF-8</span>
        <span className={styles.statusRight}>{localeBadge}</span>
      </div>
    </div>
  )
}
