import { useMemo, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { injectGlobal } from '@emotion/css'
import Editor from '@monaco-editor/react'
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
} from '@ant-design/icons'
import type { TailoringEditorPanelProps, TailoringEditorHandle } from './TailoringEditorPanel.types'
import { countWords } from './TailoringEditorPanel.helpers'
import { useEditorActions } from './useEditorActions'
import { FileDropdownMenu } from './FileDropdownMenu'
import { ExportDropdownMenu } from './ExportDropdownMenu'
import { CVPreviewModal } from './CVPreviewModal'
import { PhrasesModal } from './PhrasesModal'
import { KeywordPhrasesModal } from './KeywordPhrasesModal'
import { SemanticGapsModal } from './SemanticGapsModal'
import { TipsModal } from './TipsModal'
import { RemoveSuggestionsModal } from './RemoveSuggestionsModal'
import * as S from './TailoringEditorPanel.styles'
import React from 'react'

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

  /* ── Rephrase diff — VSCode merge-conflict style ──────────────────────── */

  /* Green "incoming change" background on the replaced lines */
  .te-diff-incoming-line {
    background: rgba(0, 200, 80, 0.08) !important;
  }

  /* Thin green bar in the line-decorations gutter */
  .te-diff-incoming-bar {
    width: 0.3rem !important;
    background: rgba(0, 200, 80, 0.75);
  }

  /* "+" badge in the glyph margin */
  .te-diff-glyph-add {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 200, 80, 0.9);
    font-weight: 700;
    font-size: 1.2rem;
  }
  .te-diff-glyph-add::before {
    content: '+';
  }

  /* Red "deleted text" ViewZone that appears above the replaced line */
  .te-diff-deleted-zone {
    background: rgba(239, 68, 68, 0.10);
    border-left: 0.3rem solid rgba(239, 68, 68, 0.70);
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.50);
    text-decoration: line-through;
    text-decoration-color: rgba(239, 68, 68, 0.55);
    text-decoration-thickness: 0.15rem;
    padding: 0 0.8rem;
    white-space: pre-wrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
  }

  /* Remove-suggestion decorations */
  .te-remove-line {
    background: rgba(239, 68, 68, 0.07) !important;
    border-left: 2px solid rgba(239, 68, 68, 0.45);
  }
  .te-remove-inline {
    text-decoration: line-through;
    text-decoration-color: rgba(239, 68, 68, 0.75);
    text-decoration-thickness: 2px;
    background: rgba(239, 68, 68, 0.14);
    border-radius: 2px;
  }
  .te-remove-glyph::after {
    content: '';
    display: block;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.85);
    margin: 0.45rem auto 0;
  }
`

const EDITOR_OPTIONS = {
  minimap: { enabled: true },
  glyphMargin: true,
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
  function TailoringEditorPanel({ value, onChange, locale = 'pt-BR', editorKeywords,
    onInsertKeyword, onReplaceKeyword, hasAnalysisNotification = false, jobTitle,
    onReanalyze, reanalyzeLoading = false,
    onDownloadPDF, onExportMarkdown, onSaveAsVersion }, ref) {

    const { t } = useTranslation()
    const wordCount = useMemo(() => countWords(value), [value])

    // Notification dot: appears when new analysis results arrive, dismissed on menu open.
    const [dotDismissed, setDotDismissed] = useState(false)
    const prevNotification = useRef(false)
    useEffect(() => {
      // New result arrived (false → true): reset dismissed so the dot reappears.
      if (hasAnalysisNotification && !prevNotification.current) {
        setDotDismissed(false)
      }
      prevNotification.current = hasAnalysisNotification
    }, [hasAnalysisNotification])
    const showNotificationDot = hasAnalysisNotification && !dotDismissed

    const {
      fileMenuRef, exportMenuRef,
      lineCol, fileMenuOpen, exportMenuOpen, phrasesModalOpen, previewModalOpen, keywordsSubmenuOpen, keywordPhrasesModalOpen, semanticGapsModalOpen, tipsModalOpen, removeSuggestionsModalOpen,
      setFileMenuOpen, setExportMenuOpen, setPhrasesModalOpen, setPreviewModalOpen, setKeywordsSubmenuOpen, setKeywordPhrasesModalOpen, setSemanticGapsModalOpen, setTipsModalOpen, setRemoveSuggestionsModalOpen,
      handleMount, handleAction, showDiff,
      insertAtCursor, findAndReplace, clearDiff, toggleDiff, resetDiffBase,
    } = useEditorActions({ value, editorKeywords, onInsertKeyword, onReplaceKeyword })

    useImperativeHandle(ref, () => ({ insertAtCursor, findAndReplace, clearDiff, toggleDiff, resetDiffBase }))

    const TOOLBAR_ITEMS = [
      { group: 'format', key: 'bold', icon: <BoldOutlined />, label: t('tailoring.bold'), action: 'bold', wide: false },
      { group: 'format', key: 'italic', icon: <ItalicOutlined />, label: t('tailoring.italic'), action: 'italic', wide: false },
      { group: 'heading', key: 'h1', icon: null, label: 'H1', action: 'h1', wide: true },
      { group: 'heading', key: 'h2', icon: null, label: 'H2', action: 'h2', wide: true },
      { group: 'heading', key: 'h3', icon: null, label: 'H3', action: 'h3', wide: true },
      { group: 'list', key: 'ul', icon: <UnorderedListOutlined />, label: t('tailoring.list'), action: 'ul', wide: false },
      { group: 'list', key: 'ol', icon: <OrderedListOutlined />, label: t('tailoring.orderedList'), action: 'ol', wide: false },
      { group: 'insert', key: 'divider', icon: <MinusOutlined />, label: t('tailoring.divider'), action: 'divider', wide: false },
      { group: 'history', key: 'undo', icon: <UndoOutlined />, label: t('tailoring.undo'), action: 'undo', wide: false },
      { group: 'history', key: 'redo', icon: <RedoOutlined />, label: t('tailoring.redo'), action: 'redo', wide: false },
      { group: 'diff', key: 'toggleDiff', icon: showDiff ? <EyeInvisibleOutlined /> : <EyeOutlined />, label: showDiff ? t('tailoring.hideDiff') : t('tailoring.showDiff'), action: 'toggleDiff', wide: true },
    ]

    return (
      <S.Root>
        <S.Toolbar>
          <S.MenusRow>
            <S.FileMenuWrapper ref={fileMenuRef}>
              <S.ToolbarBtn
                type="button"
                wide
                onClick={() => {
                  if (!fileMenuOpen) setDotDismissed(true)
                  setFileMenuOpen(!fileMenuOpen)
                }}
              >
                {t('tailoring.fileBtn')}
                {showNotificationDot && <S.NotificationDot />}
              </S.ToolbarBtn>
              {fileMenuOpen && (
                <FileDropdownMenu
                  editorKeywords={editorKeywords}
                  keywordsSubmenuOpen={keywordsSubmenuOpen}
                  onKeywordsSubmenuEnter={() => setKeywordsSubmenuOpen(true)}
                  onKeywordsSubmenuLeave={() => setKeywordsSubmenuOpen(false)}
                  onInsertKeyword={(kw) => { onInsertKeyword?.(kw); setFileMenuOpen(false) }}
                  onOpenPhrases={() => { setPhrasesModalOpen(true); setFileMenuOpen(false) }}
                  onOpenKeywordPhrases={() => { setKeywordPhrasesModalOpen(true); setFileMenuOpen(false) }}
                  onOpenSemanticGaps={() => { setSemanticGapsModalOpen(true); setFileMenuOpen(false) }}
                  onOpenTips={() => { setTipsModalOpen(true); setFileMenuOpen(false) }}
                  onOpenRemoveSuggestions={() => { setRemoveSuggestionsModalOpen(true); setFileMenuOpen(false) }}
                  onPreviewCV={() => { setPreviewModalOpen(true); setFileMenuOpen(false) }}
                  onSaveCV={() => { onSaveAsVersion?.(); setFileMenuOpen(false) }}
                  onReanalyze={() => { onReanalyze?.(); setFileMenuOpen(false) }}
                  reanalyzeLoading={reanalyzeLoading}
                />
              )}
            </S.FileMenuWrapper>

            <S.FileMenuWrapper ref={exportMenuRef}>
              <S.ToolbarBtn type="button" wide onClick={() => setExportMenuOpen(!exportMenuOpen)}>
                {t('tailoring.exportBtn')}
              </S.ToolbarBtn>
              {exportMenuOpen && (
                <ExportDropdownMenu
                  onDownloadPDF={() => { onDownloadPDF?.(); setExportMenuOpen(false) }}
                  onExportMarkdown={() => { onExportMarkdown?.(); setExportMenuOpen(false) }}
                />
              )}
            </S.FileMenuWrapper>
          </S.MenusRow>

          <S.Tools>
            {GROUPS.map((group, gi) => {
              const items = TOOLBAR_ITEMS.filter(item => item.group === group)
              if (items.length === 0) return null
              return (
                <React.Fragment key={group}>
                  {items.map((item) => (
                    <S.ToolbarBtn
                      key={item.key}
                      type="button"
                      onClick={() => handleAction(item.action)}
                      active={item.action === 'toggleDiff' && showDiff}
                      wide={item.wide}
                    >
                      {item.icon && item.icon}
                      {!item.icon && item.label}
                    </S.ToolbarBtn>
                  ))}
                  {gi < GROUPS.length - 1 && <S.ToolbarDivider />}
                </React.Fragment>
              )
            })}
          </S.Tools>
        </S.Toolbar>

        <S.EditorWrapper>
          <Editor height="100%" defaultLanguage="markdown" theme="vs-dark"
            value={value} onChange={(v) => onChange(v ?? '')}
            onMount={handleMount} options={EDITOR_OPTIONS} />
        </S.EditorWrapper>

        <S.StatusBar>
          <span>Markdown</span>
          <span>{t('tailoring.editorLine', { line: lineCol.line, col: lineCol.col })}</span>
          <span>{t('cv.wordCount', { count: wordCount })}</span>
          <S.StatusRight>{locale === 'pt-BR' ? 'PT-BR' : 'EN'}</S.StatusRight>
        </S.StatusBar>

        <PhrasesModal
          open={phrasesModalOpen}
          onClose={() => setPhrasesModalOpen(false)}
          editorKeywords={editorKeywords}
          onReplaceKeyword={onReplaceKeyword}
        />

        <KeywordPhrasesModal
          open={keywordPhrasesModalOpen}
          onClose={() => setKeywordPhrasesModalOpen(false)}
          phrases={editorKeywords?.keywordPhrases}
        />

        <SemanticGapsModal
          open={semanticGapsModalOpen}
          onClose={() => setSemanticGapsModalOpen(false)}
          gaps={editorKeywords?.semanticGaps}
        />

        <TipsModal
          open={tipsModalOpen}
          onClose={() => setTipsModalOpen(false)}
          tips={editorKeywords?.tips}
        />

        <RemoveSuggestionsModal
          open={removeSuggestionsModalOpen}
          onClose={() => setRemoveSuggestionsModalOpen(false)}
          suggestions={editorKeywords?.removeSuggestions}
        />

        <CVPreviewModal
          open={previewModalOpen}
          markdownContent={value ?? ''}
          onClose={() => setPreviewModalOpen(false)}
        />
      </S.Root>
    )
  }
)