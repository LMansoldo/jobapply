import {
  BoldOutlined,
  CheckOutlined,
  CopyOutlined,
  ItalicOutlined,
  MinusOutlined,
  OrderedListOutlined,
  RedoOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Global } from '@emotion/react'
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { Tooltip } from 'antd'
import type { ReactNode } from 'react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { EditorKeywords } from '@jobapply/contracts'
import type { EditorHandle } from './handle'
import { buildEditorExtensions } from './core/extensions'
import { docToMarkdown, markdownToDoc } from './core/markdown'
import { useEditorCommands } from './core/useEditorCommands'
import { useIsMobile } from './core/useIsMobile'
import {
  ContentArea,
  CanvasBadge,
  CanvasHeader,
  CanvasHeaderCopy,
  CanvasEyebrow,
  CanvasMeta,
  CanvasMetaItem,
  CanvasTitle,
  DocumentCanvas,
  EditorBody,
  EditorShell,
  FloatingToolbar,
  MobileRailToggle,
  StatusBar,
  StatusBarMeta,
  StatusBarStats,
  StatusBarButton,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarHint,
  ToolbarIntro,
  ToolbarControls,
  ToolbarEyebrow,
  ToolbarGroup,
  contentGlobalStyles,
  suggestionGlobalStyles,
  EditorSkeleton,
  EditorSkeletonBody,
  EditorSkeletonBlock,
  EditorSkeletonToolbar,
} from './RichMarkdownEditor.styles'
import { ApplyPopover } from './suggestions/rail/ApplyPopover'
import { SuggestionRail } from './suggestions/rail/SuggestionRail'
import { SuggestionSheet } from './suggestions/rail/SuggestionSheet'
import {
  clearDiff as dispatchClearDiff,
  createSuggestionsPlugin,
  findRanges,
  flashRange,
  setDiffBase,
  setSuggestions,
  suggestionsPluginKey,
  toggleDiff as dispatchToggleDiff,
} from './suggestions/decorations'
import { findSectionEnd } from './suggestions/sectionUtils'
import { buildSuggestions } from './suggestions/adapter'
import type { Suggestion } from './suggestions/types'

export interface RichMarkdownEditorProps {
  value: string
  onChange: (md: string) => void
  height?: number
  locale?: 'pt-BR' | 'en'
  editorKeywords?: EditorKeywords
  onSuggestionResolved?: (s: Suggestion) => void
  layout?: 'split' | 'editor'
}

interface PopoverState {
  suggestion: Suggestion
  anchor: number
  from: number
  to: number
  top: number
  left: number
}

interface CommandButtonProps {
  label: string
  showTooltip: boolean
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}

function CommandButton({
  label,
  showTooltip,
  active,
  disabled,
  onClick,
  children,
}: CommandButtonProps) {
  const button = (
    <ToolbarButton
      size="small"
      type="text"
      aria-label={label}
      $active={active}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </ToolbarButton>
  )
  if (!showTooltip) return button
  return <Tooltip title={label}>{button}</Tooltip>
}

export const RichMarkdownEditor = forwardRef<
  EditorHandle,
  RichMarkdownEditorProps
>(function RichMarkdownEditor(
  { value, onChange, height, editorKeywords, onSuggestionResolved, layout = 'editor' },
  ref,
) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const bodyRef = useRef<HTMLDivElement>(null)
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(() => new Set())
  const [popover, setPopover] = useState<PopoverState | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const lastEmittedRef = useRef(value)

  const editor = useEditor({
    extensions: buildEditorExtensions(),
    content: markdownToDoc(value),
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'rich-md-content' },
    },
    onUpdate: ({ editor }) => {
      const md = docToMarkdown(editor.getJSON())
      lastEmittedRef.current = md
      onChange(md)
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value === lastEmittedRef.current) return
    lastEmittedRef.current = value
    editor.commands.setContent(markdownToDoc(value))
  }, [editor, value])

  const { commands, state } = useEditorCommands(editor)

  const handleCopy = useCallback(async () => {
    if (!editor) return
    try {
      await navigator.clipboard.writeText(docToMarkdown(editor.getJSON()))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }, [editor])

  const suggestions = useMemo(
    () => buildSuggestions(editorKeywords),
    [editorKeywords],
  )

  const activeSuggestions = useMemo(
    () => suggestions.filter((sug) => !resolvedIds.has(sug.id)),
    [suggestions, resolvedIds],
  )

  useEffect(() => {
    setResolvedIds(new Set())
  }, [editorKeywords])

  useEffect(() => {
    if (!editor) return
    setSuggestions(editor.view, activeSuggestions)
  }, [editor, activeSuggestions])

  const clickRef = useRef<(id: string, pos: number) => void>(() => {})

  useEffect(() => {
    if (!editor) return
    const plugin = createSuggestionsPlugin({
      onSuggestionClick: (id, pos) => clickRef.current(id, pos),
    })
    editor.registerPlugin(plugin)
    return () => {
      editor.unregisterPlugin(suggestionsPluginKey)
    }
  }, [editor])

  const popoverCoords = (anchor: number) => {
    if (!editor) return null
    const view = editor.view
    const bodyRect = bodyRef.current?.getBoundingClientRect()
    const coords = view.coordsAtPos(anchor)
    const top = coords.bottom - (bodyRect?.top ?? 0) + 4
    const left = Math.max(
      8,
      Math.min(
        coords.left - (bodyRect?.left ?? 0),
        (bodyRect?.width ?? 400) - 260,
      ),
    )
    return { top, left }
  }

  const openPopoverAt = (sug: Suggestion, pos: number) => {
    if (!editor) return
    const view = editor.view
    const ranges = sug.searchText
      ? findRanges(view.state.doc, sug.searchText)
      : []
    const coords = popoverCoords(pos) ?? { top: 0, left: 0 }
    setPopover({
      suggestion: sug,
      anchor: pos,
      from: ranges[0]?.from ?? 0,
      to: ranges[0]?.to ?? 0,
      ...coords,
    })
  }

  useEffect(() => {
    clickRef.current = (id, pos) => {
      const sug = activeSuggestions.find((s) => s.id === id)
      if (sug) openPopoverAt(sug, pos)
    }
  })

  const popoverAnchor = popover?.anchor

  useEffect(() => {
    if (popoverAnchor === undefined || !editor || isMobile) return
    const reposition = () => {
      if (!bodyRef.current) return
      const coords = editor.view.coordsAtPos(popoverAnchor)
      if (coords.bottom < 0 || coords.top > window.innerHeight) {
        setPopover(null)
        return
      }
      const bodyRect = bodyRef.current.getBoundingClientRect()
      const top = coords.bottom - bodyRect.top + 4
      const left = Math.max(
        8,
        Math.min(coords.left - bodyRect.left, bodyRect.width - 260),
      )
      setPopover((prev) => (prev ? { ...prev, top, left } : prev))
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [editor, popoverAnchor, isMobile])

  const resolveSuggestion = (sug: Suggestion) => {
    setResolvedIds((prev) => {
      const next = new Set(prev)
      next.add(sug.id)
      return next
    })
    onSuggestionResolved?.(sug)
    setPopover(null)
  }

  const applyReplace = (sug: Suggestion, from: number, to: number) => {
    if (!editor) return
    const view = editor.view
    const text = sug.to ?? ''
    const tr = view.state.tr.replaceWith(
      from,
      to,
      view.state.schema.text(text),
    )
    tr.scrollIntoView()
    view.dispatch(tr)
    flashRange(view, from, from + text.length, 'green')
    resolveSuggestion(sug)
  }

  const applyRemove = (sug: Suggestion, from: number, to: number) => {
    if (!editor) return
    const view = editor.view
    view.dispatch(view.state.tr.delete(from, to))
    flashRange(view, from, from, 'green')
    resolveSuggestion(sug)
  }

  const applyInsert = (sug: Suggestion) => {
    if (!editor) return
    const view = editor.view
    const text = sug.keyword ?? ''
    const paragraphType = view.state.schema.nodes.paragraph
    if (!paragraphType) return
    const pos = findSectionEnd(view.state.doc, sug.section)
    view.dispatch(
      view.state.tr.insert(
        pos,
        paragraphType.create(null, view.state.schema.text(text)),
      ),
    )
    flashRange(view, pos + 1, pos + 1 + text.length, 'green')
    resolveSuggestion(sug)
  }

  const insertAtCursor = useCallback(
    (text: string) => {
      if (!editor) return
      const view = editor.view
      view.dispatch(
        view.state.tr
          .replaceSelectionWith(view.state.schema.text(text))
          .scrollIntoView(),
      )
      const end = view.state.selection.to
      flashRange(view, Math.max(0, end - text.length), end, 'green')
    },
    [editor],
  )

  const findAndReplace = useCallback(
    (from: string, to: string) => {
      if (!editor) return
      const view = editor.view
      const ranges = findRanges(view.state.doc, from)
      if (ranges.length === 0) {
        const paragraphType = view.state.schema.nodes.paragraph
        if (!paragraphType) return
        const pos = view.state.doc.content.size
        view.dispatch(
          view.state.tr
            .insert(pos, paragraphType.create(null, view.state.schema.text(to)))
            .scrollIntoView(),
        )
        return
      }
      const [range] = ranges
      view.dispatch(
        view.state.tr
          .replaceWith(
            range.from,
            range.to,
            view.state.schema.text(to),
          )
          .scrollIntoView(),
      )
      flashRange(view, range.from, range.from + to.length, 'amber')
    },
    [editor],
  )

  useImperativeHandle(
    ref,
    () => ({
      insertAtCursor,
      findAndReplace,
      clearDiff: () => {
        if (editor) dispatchClearDiff(editor.view)
      },
      toggleDiff: () => {
        if (editor) dispatchToggleDiff(editor.view)
      },
      resetDiffBase: () => {
        if (editor) setDiffBase(editor.view, docToMarkdown(editor.getJSON()))
      },
    }),
    [editor, findAndReplace, insertAtCursor],
  )

  useEffect(() => {
    setPopover(null)
  }, [value])

  if (!editor || !state) return null

  const showRailDesktop =
    layout === 'split' && activeSuggestions.length > 0 && !isMobile
  const showRailMobile =
    layout === 'split' && activeSuggestions.length > 0 && isMobile

  const handleRailSuggestionClick = (sug: Suggestion) => {
    if (!editor || !sug.searchText) return
    const ranges = findRanges(editor.state.doc, sug.searchText)
    if (ranges.length === 0) return
    editor.view.dispatch(editor.state.tr.scrollIntoView())
    setSheetOpen(false)
    openPopoverAt(sug, ranges[0].from)
  }

  const railHandlers = {
    onSuggestionClick: handleRailSuggestionClick,
    onApplyInsert: applyInsert,
    onInsertPhrase: insertAtCursor,
    onDismiss: resolveSuggestion,
  }

  const popoverCanApply = popover
    ? popover.suggestion.kind === 'insert' ||
      (popover.to > popover.from &&
        (popover.suggestion.kind === 'replace' ||
          popover.suggestion.kind === 'remove'))
    : false

  return (
    <EditorShell $height={height}>
      <Toolbar role="toolbar" aria-label={t('tailoring.richEditor.formattingToolbar')}>
        <ToolbarIntro>
          <ToolbarEyebrow>{t('tailoring.richEditor.formatting')}</ToolbarEyebrow>
          <ToolbarHint>{t('tailoring.richEditor.editorHint')}</ToolbarHint>
        </ToolbarIntro>
        <ToolbarControls>
          <ToolbarGroup>
            <CommandButton
              label={t('tailoring.richEditor.bold')}
              showTooltip={!isMobile}
              active={state.bold}
              onClick={commands.toggleBold}
            >
              <BoldOutlined />
            </CommandButton>
            <CommandButton
              label={t('tailoring.richEditor.italic')}
              showTooltip={!isMobile}
              active={state.italic}
              onClick={commands.toggleItalic}
            >
              <ItalicOutlined />
            </CommandButton>
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            {[1, 2, 3].map((level) => (
              <CommandButton
                key={level}
                label={t(`tailoring.richEditor.h${level}`)}
                showTooltip={!isMobile}
                active={state[`h${level}` as 'h1' | 'h2' | 'h3']}
                onClick={() => commands.toggleHeading(level as 1 | 2 | 3)}
              >
                H{level}
              </CommandButton>
            ))}
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            <CommandButton
              label={t('tailoring.richEditor.bulletList')}
              showTooltip={!isMobile}
              active={state.bulletList}
              onClick={commands.toggleBulletList}
            >
              <UnorderedListOutlined />
            </CommandButton>
            <CommandButton
              label={t('tailoring.richEditor.orderedList')}
              showTooltip={!isMobile}
              active={state.orderedList}
              onClick={commands.toggleOrderedList}
            >
              <OrderedListOutlined />
            </CommandButton>
            <CommandButton
              label={t('tailoring.richEditor.horizontalRule')}
              showTooltip={!isMobile}
              onClick={commands.setHorizontalRule}
            >
              <MinusOutlined />
            </CommandButton>
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            <CommandButton
              label={t('tailoring.richEditor.undo')}
              showTooltip={!isMobile}
              disabled={!state.canUndo}
              onClick={commands.undo}
            >
              <UndoOutlined />
            </CommandButton>
            <CommandButton
              label={t('tailoring.richEditor.redo')}
              showTooltip={!isMobile}
              disabled={!state.canRedo}
              onClick={commands.redo}
            >
              <RedoOutlined />
            </CommandButton>
          </ToolbarGroup>
        </ToolbarControls>
      </Toolbar>
      <EditorBody ref={bodyRef}>
        <Global styles={suggestionGlobalStyles} />
        <ContentArea>
          <Global styles={contentGlobalStyles} />
          <DocumentCanvas>
            <CanvasHeader>
              <CanvasHeaderCopy>
                <CanvasEyebrow>{t('tailoring.richEditor.canvasEyebrow')}</CanvasEyebrow>
                <CanvasTitle>{t('cv.cvContent')}</CanvasTitle>
              </CanvasHeaderCopy>
              <CanvasMeta>
                <CanvasMetaItem>{t('tailoring.richEditor.words', { count: state.words })}</CanvasMetaItem>
                <CanvasBadge>
                  <CheckOutlined />
                  {t('tailoring.richEditor.atsFormat')}
                </CanvasBadge>
              </CanvasMeta>
            </CanvasHeader>
            <EditorContent editor={editor} />
          </DocumentCanvas>
        </ContentArea>
        <BubbleMenu
          editor={editor}
          options={{ strategy: 'fixed', placement: 'top', offset: 8 }}
        >
          <FloatingToolbar role="toolbar" aria-label={t('tailoring.richEditor.formattingToolbar')}>
            <CommandButton
              label={t('tailoring.richEditor.bold')}
              showTooltip={!isMobile}
              active={state.bold}
              onClick={commands.toggleBold}
            >
              <BoldOutlined />
            </CommandButton>
            <CommandButton
              label={t('tailoring.richEditor.italic')}
              showTooltip={!isMobile}
              active={state.italic}
              onClick={commands.toggleItalic}
            >
              <ItalicOutlined />
            </CommandButton>
            <ToolbarDivider />
            <CommandButton
              label={t('tailoring.richEditor.h2')}
              showTooltip={!isMobile}
              active={state.h2}
              onClick={() => commands.toggleHeading(2)}
            >
              H2
            </CommandButton>
            <CommandButton
              label={t('tailoring.richEditor.h3')}
              showTooltip={!isMobile}
              active={state.h3}
              onClick={() => commands.toggleHeading(3)}
            >
              H3
            </CommandButton>
            <ToolbarDivider />
            <CommandButton
              label={t('tailoring.richEditor.bulletList')}
              showTooltip={!isMobile}
              active={state.bulletList}
              onClick={commands.toggleBulletList}
            >
              <UnorderedListOutlined />
            </CommandButton>
            <CommandButton
              label={t('tailoring.richEditor.orderedList')}
              showTooltip={!isMobile}
              active={state.orderedList}
              onClick={commands.toggleOrderedList}
            >
              <OrderedListOutlined />
            </CommandButton>
          </FloatingToolbar>
        </BubbleMenu>
        {showRailDesktop && (
          <SuggestionRail suggestions={activeSuggestions} {...railHandlers} />
        )}
        {showRailMobile && (
          <>
            <MobileRailToggle
              type="button"
              onClick={() => setSheetOpen((prev) => !prev)}
            >
              {t('tailoring.richEditor.suggestionsCount', {
                count: activeSuggestions.length,
              })}
            </MobileRailToggle>
            {sheetOpen && (
              <SuggestionSheet
                suggestions={activeSuggestions}
                onClose={() => setSheetOpen(false)}
                {...railHandlers}
              />
            )}
          </>
        )}
        {popover && (
          <ApplyPopover
            suggestion={popover.suggestion}
            coords={{ top: popover.top, left: popover.left }}
            canApply={popoverCanApply}
            $mobile={isMobile}
            onApply={() => {
              if (!popover) return
              if (popover.suggestion.kind === 'replace') {
                applyReplace(popover.suggestion, popover.from, popover.to)
              } else if (popover.suggestion.kind === 'remove') {
                applyRemove(popover.suggestion, popover.from, popover.to)
              } else if (popover.suggestion.kind === 'insert') {
                applyInsert(popover.suggestion)
              } else {
                setPopover(null)
              }
            }}
            onDismiss={() => resolveSuggestion(popover.suggestion)}
            onClose={() => setPopover(null)}
          />
        )}
      </EditorBody>
      <StatusBar>
        <StatusBarButton type="button" onClick={handleCopy}>
          {copied ? <CheckOutlined /> : <CopyOutlined />}
          {copied ? t('tailoring.richEditor.copied') : t('tailoring.richEditor.copyMarkdown')}
        </StatusBarButton>
        <StatusBarMeta>{t('tailoring.richEditor.liveAnalysis')}</StatusBarMeta>
        <StatusBarStats>{t('tailoring.richEditor.words', { count: state.words })}</StatusBarStats>
      </StatusBar>
    </EditorShell>
  )
})

export function RichMarkdownEditorSkeleton({ height }: { height?: number }) {
  return (
    <EditorSkeleton $height={height} aria-label="Loading editor">
      <EditorSkeletonToolbar>
        <EditorSkeletonBlock $width="2.4rem" />
        <EditorSkeletonBlock $width="2.4rem" />
        <EditorSkeletonBlock $width="2.4rem" />
        <EditorSkeletonBlock $width="2.4rem" />
      </EditorSkeletonToolbar>
      <EditorSkeletonBody>
        <EditorSkeletonBlock $width="42%" $height="2rem" />
        <EditorSkeletonBlock $width="92%" />
        <EditorSkeletonBlock $width="84%" />
        <EditorSkeletonBlock $width="76%" />
        <EditorSkeletonBlock $width="88%" />
        <EditorSkeletonBlock $width="68%" />
        <EditorSkeletonBlock $width="81%" />
      </EditorSkeletonBody>
    </EditorSkeleton>
  )
}
