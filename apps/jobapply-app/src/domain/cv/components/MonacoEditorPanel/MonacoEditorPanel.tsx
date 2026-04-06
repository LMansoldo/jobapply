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
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'
import { BorderRadius } from '../../../../styles/theme/radius'

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

  // Row 2 toolbar items (alignment + extra)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Card header */}
      <div style={{
        background: Colors.white,
        border: `1px solid ${Colors.surfaceBorder}`,
        borderBottom: 'none',
        borderRadius: `${BorderRadius.base} ${BorderRadius.base} 0 0`,
        padding: `${Spacing.md} ${Spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm }}>
          <span style={{ fontWeight: FontWeight.semibold, fontSize: FontSize.base, color: Colors.textMain }}>{localeTitle}</span>
          {isOptional && (
            <span style={{
              fontSize: FontSize.xxs, fontWeight: FontWeight.semibold,
              background: Colors.infoBg, color: Colors.info,
              padding: `1px ${Spacing.sm}`, borderRadius: '10px',
            }}>
              {t('common.optional')}
            </span>
          )}
          <span style={{
            fontSize: FontSize.xxs, fontWeight: FontWeight.bold,
            background: Colors.primaryLight, color: Colors.primaryDark,
            padding: `1px ${Spacing.sm}`, borderRadius: '10px',
          }}>
            {localeBadge}
          </span>
        </div>
        <span style={{ fontSize: FontSize.sm, color: Colors.textSub }}>
          {t('cv.wordCount', { count: wordCount })}
        </span>
      </div>

      {/* Section navigation chips */}
      <div style={{
        background: Colors.surfaceLight,
        border: `1px solid ${Colors.surfaceBorder}`,
        borderBottom: 'none',
        padding: `${Spacing.sm} ${Spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        gap: Spacing.sm,
        overflowX: 'auto' as const,
      }}>
        <span style={{ fontSize: FontSize.xxs, color: Colors.textSub, whiteSpace: 'nowrap' as const, fontWeight: FontWeight.medium }}>
          {t('cv.editor.goTo')}
        </span>
        {sectionChips.map((chip, i) => (
          <button
            key={i}
            type="button"
            style={{
              background: Colors.white,
              border: `1px solid ${Colors.surfaceBorder}`,
              borderRadius: '12px',
              padding: `2px ${Spacing.sm}`,
              fontSize: FontSize.xxs,
              fontWeight: FontWeight.medium,
              color: Colors.textSub,
              cursor: 'pointer',
              whiteSpace: 'nowrap' as const,
              fontFamily: FontFamily.body,
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            {chip}
          </button>
        ))}
        {locale === 'en' && onTranslateFromPtBr && (
          <button
            type="button"
            onClick={onTranslateFromPtBr}
            style={{
              marginLeft: 'auto',
              background: Colors.primaryLight,
              border: 'none',
              borderRadius: '12px',
              padding: `2px ${Spacing.md}`,
              fontSize: FontSize.xxs,
              fontWeight: FontWeight.semibold,
              color: Colors.primaryDark,
              cursor: 'pointer',
              whiteSpace: 'nowrap' as const,
              fontFamily: FontFamily.body,
            }}
          >
            {t('cv.translateFromPtBr')}
          </button>
        )}
      </div>

      {/* Toolbar row 1 */}
      <div style={{ background: Colors.white, border: `1px solid ${Colors.surfaceBorder}`, borderBottom: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <EditorToolbar items={toolbarItems} onAction={handleToolbarAction} />
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, paddingRight: Spacing.md }}>
          {isMobile && <PreviewTabs activeTab={mobileTab} onChange={setMobileTab} />}
        </div>
      </div>

      {/* Toolbar row 2 */}
      <div style={{ background: Colors.white, border: `1px solid ${Colors.surfaceBorder}`, borderBottom: 'none', padding: 0 }}>
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
      <div style={{ position: 'relative' }}>
        {isMobile ? (
          <div style={{ border: `1px solid ${Colors.surfaceBorder}`, overflow: 'hidden' }}>
            <div style={{ height: Spacing.editorHeightMobile }}>
              {mobileTab === 'editor' ? (
                <Editor height="100%" defaultLanguage="markdown" value={value} onChange={(v) => onChange(v ?? '')} onMount={handleMount} options={editorOptions} />
              ) : (
                <div style={{ height: '100%', overflowY: 'auto', padding: `${Spacing.md2} ${Spacing.md}`, background: Colors.white }}>
                  <div className="markdown-preview"><ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown></div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Preview / HTML tabs */}
            <div style={{
              background: Colors.white,
              border: `1px solid ${Colors.surfaceBorder}`,
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 0,
            }}>
              {(['preview', 'html'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPreviewTab(tab)}
                  style={{
                    padding: `${Spacing.sm} ${Spacing.md}`,
                    border: 'none',
                    background: 'none',
                    fontSize: FontSize.sm,
                    fontWeight: previewTab === tab ? FontWeight.semibold : FontWeight.regular,
                    color: previewTab === tab ? Colors.primaryDark : Colors.textSub,
                    borderBottom: `2px solid ${previewTab === tab ? Colors.primaryDark : 'transparent'}`,
                    cursor: 'pointer',
                    fontFamily: FontFamily.body,
                  }}
                >
                  {tab === 'preview' ? `📄 ${t('cv.editor.previewTab')}` : `</> ${t('cv.editor.htmlTab')}`}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', height, border: `1px solid ${Colors.surfaceBorder}`, overflow: 'hidden' }}>
              <div style={{ width: '50%', borderRight: `1px solid ${Colors.surfaceBorder}` }}>
                <Editor height="100%" defaultLanguage="markdown" value={value} onChange={(v) => onChange(v ?? '')} onMount={handleMount} options={editorOptions} />
              </div>
              <div style={{ width: '50%', overflowY: 'auto', padding: `${Spacing.md} ${Spacing.lg}`, background: Colors.white }}>
                {previewTab === 'preview' ? (
                  <div className="markdown-preview"><ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown></div>
                ) : (
                  <pre style={{ fontFamily: FontFamily.mono, fontSize: FontSize.xxs, color: Colors.textMain, whiteSpace: 'pre-wrap' as const, margin: 0 }}>
                    {value}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty state overlay */}
        {showEmptyOverlay && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(26,7,51,0.88)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: Spacing.md, zIndex: 10,
          }}>
            <span style={{ fontSize: '4rem' }}>🌐</span>
            <p style={{ margin: 0, fontFamily: FontFamily.heading, fontWeight: FontWeight.bold, fontSize: FontSize.xl, color: Colors.white, textAlign: 'center' as const }}>
              {t('cv.noEnVersion')}
            </p>
            <p style={{ margin: 0, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', textAlign: 'center' as const, maxWidth: '40rem' }}>
              {t('cv.noEnVersionSub')}
            </p>
            <div style={{ display: 'flex', gap: Spacing.md, marginTop: Spacing.sm }}>
              <button
                type="button"
                onClick={() => { setEmptyOverlayDismissed(true); onStartFromScratch?.() }}
                style={{
                  background: Colors.primaryDark, color: Colors.white, border: 'none',
                  borderRadius: BorderRadius.full, padding: `${Spacing.sm} ${Spacing.lg}`,
                  fontFamily: FontFamily.body, fontWeight: FontWeight.semibold, fontSize: FontSize.sm, cursor: 'pointer',
                }}
              >
                ✏️ {t('cv.startFromScratch')}
              </button>
              <button
                type="button"
                onClick={() => { setEmptyOverlayDismissed(true); onTranslateFromPtBr?.() }}
                style={{
                  background: 'rgba(255,255,255,0.15)', color: Colors.white, border: `1.5px solid rgba(255,255,255,0.4)`,
                  borderRadius: BorderRadius.full, padding: `${Spacing.sm} ${Spacing.lg}`,
                  fontFamily: FontFamily.body, fontWeight: FontWeight.semibold, fontSize: FontSize.sm, cursor: 'pointer',
                }}
              >
                🌐 {t('cv.translateFromPtBr')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        background: Colors.surfaceEditor,
        borderRadius: `0 0 ${BorderRadius.base} ${BorderRadius.base}`,
        padding: `${Spacing.xs} ${Spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        gap: Spacing.lg,
        fontSize: FontSize.xxs,
        color: 'rgba(255,255,255,0.5)',
        fontFamily: FontFamily.mono,
        border: `1px solid ${Colors.surfaceEditorBorder}`,
        borderTop: 'none',
      }}>
        <span>Markdown</span>
        <span>Ln {lineCol.line}, Col {lineCol.col}</span>
        <span>UTF-8</span>
        <span>{t('cv.wordCount', { count: wordCount })}</span>
      </div>
    </div>
  )
}
