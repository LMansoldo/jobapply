import { useTranslation } from 'react-i18next'
import { useRef, useState, useEffect } from 'react'
import { Spin } from '../../../components/Spin'
import { Button } from '../../../components/Button'
import { ExportPanel } from '../../../design-system/tailoring/TailoringPreviewPanel'
import { TailoringEditorPanel, type TailoringEditorHandle } from '../../../design-system/tailoring/TailoringEditorPanel'
import { KeywordsPanel } from '../../../design-system/tailoring/KeywordsPanel'
import { KeywordPhrasesPanel } from '../../../design-system/tailoring/KeywordPhrasesPanel'
import { RemoveSuggestionsPanel } from '../../../design-system/tailoring/RemoveSuggestionsPanel'
import type { ATSWorkspaceProps } from './ATSWorkspace.types'
import * as S from './ATSWorkspace.styles'

export function ATSWorkspace({
  atsLoading,
  panelData,
  scoreDelta,
  allSuggestions,
  currentSuggestion,
  suggestionsCount,
  editorKeywords,
  tailoring,
  tailoredContent,
  chosenLocale,
  onTailoredContentChange,
  job,
  currentScore,
  projectedScore,
  onSuggestionChange,
  onInsertKeyword,
  onReplaceKeyword,
  onReanalyze,
  onDownloadPDF,
  onExportMarkdown,
  onSaveAsVersion,
  keywordPhrases = [],
  removeSuggestions = [],
  onCopyPhrase,
}: ATSWorkspaceProps) {
  const { t } = useTranslation()
  const editorRef = useRef<TailoringEditorHandle>(null)
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false)

  // Auto-open suggestions modal on medium/small screens when tailoring loads
  useEffect(() => {
    if (suggestionsCount > 0 && !tailoring) {
      const isMediumOrSmallScreen = window.matchMedia('(max-width: 768px)').matches
      if (isMediumOrSmallScreen) {
        setShowSuggestionsModal(true)
      }
    }
  }, [suggestionsCount, tailoring])

  const currentSuggestionText = allSuggestions[currentSuggestion - 1] ?? ''

  const handleInsertKeyword = (keyword: string) => {
    if (editorRef.current) {
      editorRef.current.insertAtCursor(keyword)
    } else {
      // Fallback to the original callback if editor ref is not available
      onInsertKeyword?.(keyword)
    }
  }

  const handleReplaceKeyword = (from: string, to: string) => {
    if (editorRef.current) {
      editorRef.current.findAndReplace(from, to)
    } else {
      // Fallback to the original callback if editor ref is not available
      onReplaceKeyword?.(from, to)
    }
  }

  const hasKeywords = editorKeywords && (editorKeywords.toAdd.length > 0 || editorKeywords.toRephrase.length > 0)
  const hasPhrases = keywordPhrases.length > 0
  const hasRemove = removeSuggestions.length > 0

  const keywordsPanel = (hasKeywords || hasPhrases || hasRemove) && (
    <>
      {suggestionsCount > 0 && (
        <div className={S.suggestionsButtonWrapper}>
          <Button
            type="primary"
            size="small"
            onClick={() => setShowSuggestionsModal(true)}
          >
            {t('tailoring.seeSuggestions')}
          </Button>
        </div>
      )}
      {hasKeywords && (
        <KeywordsPanel
          editorKeywords={editorKeywords!}
          onInsertKeyword={handleInsertKeyword}
          onReplaceKeyword={handleReplaceKeyword}
        />
      )}
      {hasPhrases && (
        <KeywordPhrasesPanel
          phrases={keywordPhrases}
          onCopyPhrase={onCopyPhrase ?? (() => {})}
        />
      )}
      {hasRemove && (
        <RemoveSuggestionsPanel suggestions={removeSuggestions} />
      )}
    </>
  )

  return (
    <>
      <div className={S.atsGrid}>
        <div className={S.atsCenter}>

          {tailoring ? (
            <div className={S.tailoringSpinWrapper}><Spin size="large" /></div>
          ) : (
            <TailoringEditorPanel
              ref={editorRef}
              value={tailoredContent}
              onChange={onTailoredContentChange}
              locale={(chosenLocale ?? 'pt-BR') as 'en' | 'pt-BR'}
              editorKeywords={editorKeywords}
              onInsertKeyword={handleInsertKeyword}
              onReplaceKeyword={handleReplaceKeyword}
              hasAnalysisNotification={!!panelData}
              jobTitle={job?.title}
              onReanalyze={onReanalyze}
              reanalyzeLoading={atsLoading}
              onDownloadPDF={onDownloadPDF}
              onExportMarkdown={onExportMarkdown}
              onSaveAsVersion={onSaveAsVersion}
            />
          )}
        </div>

        <ExportPanel
          atsScore={panelData?.score ?? 0}
          atsCategories={panelData?.categories ?? []}
          currentScore={currentScore}
          projectedScore={projectedScore}
          scoreDelta={scoreDelta}
          onDownloadPDF={onDownloadPDF}
          onExportMarkdown={onExportMarkdown}
          onSaveAsVersion={onSaveAsVersion}
        />
      </div>
    </>
  )
}