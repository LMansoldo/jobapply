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
import { Button } from '../../../../components/Button'
import { Tooltip } from '../../../../components/Tooltip'
import { Segmented } from '../../../../components/Segmented'
import { Text } from '../../../../components/Typography'
import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'
import { FontSize } from '../../../../styles/theme/typography'

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

  const toolbarItems: Array<{ icon?: React.ReactNode; label?: string; title: string; action: () => void } | { divider: true }> = [
    { icon: <BoldOutlined />, title: t('cv.editor.toolbar.bold'), action: () => insertWrap('**', '**') },
    { icon: <ItalicOutlined />, title: t('cv.editor.toolbar.italic'), action: () => insertWrap('*', '*') },
    { divider: true },
    { label: 'H1', title: t('cv.editor.toolbar.h1'), action: () => toggleLinePrefix('# ') },
    { label: 'H2', title: t('cv.editor.toolbar.h2'), action: () => toggleLinePrefix('## ') },
    { label: 'H3', title: t('cv.editor.toolbar.h3'), action: () => toggleLinePrefix('### ') },
    { divider: true },
    { icon: <UnorderedListOutlined />, title: t('cv.editor.toolbar.bulletList'), action: () => toggleLinePrefix('- ') },
    { icon: <OrderedListOutlined />, title: t('cv.editor.toolbar.numberedList'), action: () => toggleLinePrefix('1. ') },
    { divider: true },
    { icon: <MinusOutlined />, title: t('cv.editor.toolbar.divider'), action: () => insertAtCursor('\n\n---\n\n') },
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={monacoEditorPanelStyles.toolbar}>
        {toolbarItems.map((item, idx) =>
          'divider' in item ? (
            <div key={idx} style={monacoEditorPanelStyles.toolbarDivider} />
          ) : (
            <Tooltip key={idx} title={item.title} mouseEnterDelay={0.5}>
              <Button
                size="small"
                onClick={item.action}
                style={{ fontWeight: item.label ? 700 : undefined, minWidth: item.label ? 28 : undefined }}
              >
                {item.icon ?? item.label}
              </Button>
            </Tooltip>
          )
        )}
        <div style={{ marginLeft: 'auto' }}>
          <Text type="secondary" style={{ fontSize: FontSize.xs }}>
            {t('cv.editor.editorTab')} · {t('cv.editor.previewTab')}
          </Text>
        </div>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <Alert
          type="error"
          style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}
          message={t('cv.editor.validationErrors')}
          description={
            <ul style={{ margin: `${Spacing.xs} 0 0`, paddingLeft: Spacing.lg1 }}>
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          }
        />
      )}

      {/* Mobile: tabs Editor / Preview */}
      {isMobile ? (
        <div style={{ border: `${Spacing.px} solid ${Colors.border}`, borderRadius: `0 0 ${Spacing.sm2} ${Spacing.sm2}`, overflow: 'hidden' }}>
          <Segmented
            block
            options={[t('cv.editor.editorTab'), t('cv.editor.previewTab')]}
            value={mobileTab === 'editor' ? t('cv.editor.editorTab') : t('cv.editor.previewTab')}
            onChange={(v) => setMobileTab(v === t('cv.editor.editorTab') ? 'editor' : 'preview')}
            style={{ borderRadius: 0, borderBottom: `${Spacing.px} solid ${Colors.border}` }}
          />
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
        <div style={{ display: 'flex', height, border: `${Spacing.px} solid ${Colors.border}`, borderRadius: `0 0 ${Spacing.sm2} ${Spacing.sm2}`, overflow: 'hidden' }}>
          <div style={{ width: '50%', borderRight: `${Spacing.px} solid ${Colors.border}` }}>
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
