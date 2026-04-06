/**
 * @file MonacoEditorPanel.tsx
 * @description Monaco Editor panel with markdown toolbar, validation errors, and mobile/desktop split view.
 */
import { useState, useRef, useCallback } from 'react'
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
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { MonacoEditorPanelProps } from './MonacoEditorPanel.types'
import { monacoEditorPanelStyles } from './MonacoEditorPanel.styles'
import { Alert } from '../../../../components/Alert'
import { EditorToolbar } from '../../../../design-system/cv/EditorToolbar'
import { PreviewTabs } from '../../../../design-system/cv/PreviewTabs'
import { LangTabs } from '../../../../design-system/navigation/LangTabs'
import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'

const { useBreakpoint } = Grid

type EditorInstance = Parameters<OnMount>[0]

/**
 * A markdown editor panel with toolbar, validation error display, and mobile/desktop layouts.
 * @param props - MonacoEditorPanelProps
 */
export function MonacoEditorPanel({ value, onChange, errors, height = 520 }: MonacoEditorPanelProps) {
  const { t } = useTranslation()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')
  const [langTab, setLangTab] = useState('pt-BR')
  const editorRef = useRef<EditorInstance | null>(null)

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor
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
    ed.executeEdits('toolbar', [{
      range: { startLineNumber: pos.lineNumber, startColumn: pos.column, endLineNumber: pos.lineNumber, endColumn: pos.column },
      text,
    }])
    ed.focus()
  }

  const handleToolbarAction = (key: string) => {
    switch (key) {
      case 'bold': insertWrap('**', '**'); break
      case 'italic': insertWrap('*', '*'); break
      case 'h1': toggleLinePrefix('# '); break
      case 'h2': toggleLinePrefix('## '); break
      case 'h3': toggleLinePrefix('### '); break
      case 'ul': toggleLinePrefix('- '); break
      case 'ol': toggleLinePrefix('1. '); break
      case 'divider': insertAtCursor('\n\n---\n\n'); break
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
    { key: 'divider', icon: <MinusOutlined />, label: t('cv.editor.toolbar.divider') },
  ]

  return (
    <div>
      {/* Toolbar row */}
      <div style={{ ...monacoEditorPanelStyles.toolbar, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
        <EditorToolbar items={toolbarItems} onAction={handleToolbarAction} />
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, paddingRight: Spacing.md }}>
          {isMobile && (
            <PreviewTabs activeTab={mobileTab} onChange={setMobileTab} />
          )}
          <LangTabs
            tabs={[
              { key: 'pt-BR', label: 'PT-BR' },
              { key: 'en', label: 'EN' },
            ]}
            activeKey={langTab}
            onChange={setLangTab}
          />
        </div>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <Alert
          type="error"
          style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}
          message={t('cv.editor.validationErrors')}
          description={
            <ul style={{ margin: `${Spacing.xs} 0 0`, paddingLeft: Spacing.lg0 }}>
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          }
        />
      )}

      {/* Mobile: tabs Editor / Preview */}
      {isMobile ? (
        <div style={{ border: `1px solid ${Colors.border}`, borderRadius: `0 0 8px 8px`, overflow: 'hidden' }}>
          <div style={{ height: Spacing.editorHeightMobile }}>
            {mobileTab === 'editor' ? (
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={value}
                onChange={(v) => onChange(v ?? '')}
                onMount={handleMount}
                options={{
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  lineNumbers: 'off',
                  folding: false,
                  renderLineHighlight: 'none',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  lineDecorationsWidth: 4,
                  padding: { top: 10, bottom: 10 },
                }}
              />
            ) : (
              <div style={{ height: '100%', overflowY: 'auto', padding: `${Spacing.md2} ${Spacing.md}`, background: Colors.white }}>
                <div className="markdown-preview">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop: split view */
        <div style={{ display: 'flex', height, border: `1px solid ${Colors.border}`, borderRadius: `0 0 8px 8px`, overflow: 'hidden' }}>
          <div style={{ width: '50%', borderRight: `1px solid ${Colors.border}` }}>
            <Editor
              height="100%"
              defaultLanguage="markdown"
              value={value}
              onChange={(v) => onChange(v ?? '')}
              onMount={handleMount}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                lineNumbers: 'off',
                folding: false,
                renderLineHighlight: 'none',
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineDecorationsWidth: 8,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
          <div style={{ width: '50%', overflowY: 'auto', padding: `${Spacing.md} ${Spacing.lg}`, background: Colors.white }}>
            <div className="markdown-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
