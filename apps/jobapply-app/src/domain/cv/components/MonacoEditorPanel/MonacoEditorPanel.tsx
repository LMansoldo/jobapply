/**
 * @file MonacoEditorPanel.tsx
 * @description Monaco Editor panel — redesigned with rich toolbar, section chips, status bar, empty state overlay.
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
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { MonacoEditorPanelProps } from './MonacoEditorPanel.types'
import { Alert } from '../../../../components/Alert'
import { EditorToolbar } from '../../../../design-system/cv/EditorToolbar'
import { PreviewTabs } from '../../../../design-system/cv/PreviewTabs'
import { Spacing } from '../../../../styles/theme/spacing'
import * as styles from './MonacoEditorPanel.styles'

const { useBreakpoint } = Grid

type EditorInstance = Parameters<OnMount>[0]

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

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
  const [previewTab, setPreviewTab] = useState<'preview' | 'html'>('preview')
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

  const handleToolbarAction = (key: string) => {
    switch (key) {
      case 'bold': insertWrap('**', '**'); break
      case 'italic': insertWrap('*', '*'); break
      case 'underline': insertWrap('<u>', '</u>'); break
      case 'strike': insertWrap('~~', '~~'); break
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

  const toolbarItems = [
    { key: 'bold', icon: <BoldOutlined />, label: t('cv.editor.toolbar.bold'), group: 'format' },
    { key: 'italic', icon: <ItalicOutlined />, label: t('cv.editor.toolbar.italic'), group: 'format' },
    { key: 'h1', icon: null, label: 'H1', wide: true, group: 'heading' },
    { key: 'h2', icon: null, label: 'H2', wide: true, group: 'heading' },
    { key: 'h3', icon: null, label: 'H3', wide: true, group: 'heading' },
    { key: 'ul', icon: <UnorderedListOutlined />, label: t('cv.editor.toolbar.bulletList'), group: 'list' },
    { key: 'ol', icon: <OrderedListOutlined />, label: t('cv.editor.toolbar.numberedList'), group: 'list' },
    { key: 'link', icon: <LinkOutlined />, label: 'Link', group: 'insert' },
    { key: 'divider', icon: <MinusOutlined />, label: t('cv.editor.toolbar.divider'), group: 'insert' },
    { key: 'undo', icon: <UndoOutlined />, label: 'Undo', group: 'history' },
    { key: 'redo', icon: <RedoOutlined />, label: 'Redo', group: 'history' },
  ]

  const row2Items = [
    { key: 'alignLeft', icon: <AlignLeftOutlined />, label: 'Alinhar esquerda', group: 'align' },
    { key: 'alignCenter', icon: <AlignCenterOutlined />, label: 'Centralizar', group: 'align' },
    { key: 'alignRight', icon: <AlignRightOutlined />, label: 'Alinhar direita', group: 'align' },
  ]

  const isPtBr = locale === 'pt-BR'
  const sectionChips = isPtBr
    ? [t('cv.sectionResume'), t('cv.sectionExperience'), t('cv.sectionEducation'), t('cv.sectionSkills'), t('cv.sectionLanguages'), t('cv.sectionCerts'), t('cv.sectionProjects'), t('cv.sectionVoluntary'), t('cv.addSection')]
    : ['Summary', 'Experience', 'Education', 'Skills', 'Languages', 'Certifications', 'Projects', t('cv.addSection')]

  const localeTitle = isPtBr ? `🇧🇷 Currículo em Português` : `🇺🇸 CV em Inglês`
  const localeBadge = isPtBr ? 'PT-BR' : 'EN'

  const editorOptions = {
    minimap: { enabled: false },
    wordWrap: 'on' as const,
    lineNumbers: 'off' as const,
    folding: false,
    renderLineHighlight: 'none' as const,
    scrollBeyondLastLine: false,
    fontSize: 13,
    lineDecorationsWidth: 8,
    padding: { top: 12, bottom: 12 },
  }

  return (
    <div className={styles.root}>
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerTitle}>{localeTitle}</span>
          {isOptional && (
            <span className={styles.optionalBadge}>
              {t('common.optional')}
            </span>
          )}
          <span className={styles.localeBadge}>
            {localeBadge}
          </span>
        </div>
        <span className={styles.wordCountLabel}>
          {t('cv.wordCount', { count: wordCount })}
        </span>
      </div>

      {/* Section navigation chips */}
      <div className={styles.chipsBar}>
        <span className={styles.chipsGoToLabel}>
          {t('cv.editor.goTo')}
        </span>
        {sectionChips.map((chip, i) => (
          <button key={i} type="button" className={styles.sectionChip}>
            {chip}
          </button>
        ))}
        {locale === 'en' && onTranslateFromPtBr && (
          <button type="button" onClick={onTranslateFromPtBr} className={styles.translateBtn}>
            {t('cv.translateFromPtBr')}
          </button>
        )}
      </div>

      {/* Toolbar row 1 */}
      <div className={styles.toolbarRow}>
        <EditorToolbar items={toolbarItems} onAction={handleToolbarAction} />
        <div className={styles.toolbarRowRight}>
          {isMobile && <PreviewTabs activeTab={mobileTab} onChange={setMobileTab} />}
        </div>
      </div>

      {/* Toolbar row 2 */}
      <div className={styles.toolbarRow2}>
        <EditorToolbar items={row2Items} onAction={handleToolbarAction} />
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <Alert
          type="error"
          style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}
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
          <div className={styles.mobileBorder}>
            <div className={styles.mobileEditorHeight}>
              {mobileTab === 'editor' ? (
                <Editor height="100%" defaultLanguage="markdown" value={value} onChange={(v) => onChange(v ?? '')} onMount={handleMount} options={editorOptions} />
              ) : (
                <div className={styles.mobilePreviewPane}>
                  <div className="markdown-preview"><ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Preview / HTML tabs */}
            <div className={styles.desktopTabsBar}>
              {(['preview', 'html'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPreviewTab(tab)}
                  className={styles.previewTabBtn(previewTab === tab)}
                >
                  {tab === 'preview' ? `📄 ${t('cv.editor.previewTab')}` : `</> ${t('cv.editor.htmlTab')}`}
                </button>
              ))}
            </div>

            <div className={styles.splitPane(height)}>
              <div className={styles.editorHalf}>
                <Editor height="100%" defaultLanguage="markdown" value={value} onChange={(v) => onChange(v ?? '')} onMount={handleMount} options={editorOptions} />
              </div>
              <div className={styles.previewHalf}>
                {previewTab === 'preview' ? (
                  <div className="markdown-preview"><ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown></div>
                ) : (
                  <pre className={styles.htmlPre}>
                    {value}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty state overlay */}
        {showEmptyOverlay && (
          <div className={styles.emptyOverlay}>
            <span style={{ fontSize: '4rem' }}>🌐</span>
            <p className={styles.overlayTitle}>
              {t('cv.noEnVersion')}
            </p>
            <p className={styles.overlaySubtitle}>
              {t('cv.noEnVersionSub')}
            </p>
            <div className={styles.overlayBtns}>
              <button
                type="button"
                onClick={() => { setEmptyOverlayDismissed(true); onStartFromScratch?.() }}
                className={styles.overlayPrimaryBtn}
              >
                ✏️ {t('cv.startFromScratch')}
              </button>
              <button
                type="button"
                onClick={() => { setEmptyOverlayDismissed(true); onTranslateFromPtBr?.() }}
                className={styles.overlayGhostBtn}
              >
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
        <span>{t('cv.wordCount', { count: wordCount })}</span>
      </div>
    </div>
  )
}
