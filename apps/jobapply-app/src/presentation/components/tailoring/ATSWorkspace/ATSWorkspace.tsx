import { useTranslation } from 'react-i18next'
import { useRef, useState, useEffect } from 'react'
import { Spin } from '../../../../design-system/wrappers/Spin'
import { Button } from '../../../../design-system/wrappers/Button'
import { ExportPanel } from '../TailoringPreviewPanel'
import { TailoringEditorPanel, type TailoringEditorHandle } from '../TailoringEditorPanel'
import { KeywordsPanel } from '@jobapply/ats-ui'
import { KeywordPhrasesPanel } from '@jobapply/ats-ui'
import { RemoveSuggestionsPanel } from '@jobapply/ats-ui'
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
  currentScore,
  projectedScore,
  onSuggestionChange,
  onInsertKeyword,
  onReplaceKeyword,
  onReanalyze,
  onGenerateResume,
  resumeLoading,
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
        <S.SuggestionsButtonWrapper>
          <Button
            type="primary"
            size="small"
            onClick={() => setShowSuggestionsModal(true)}
          >
            {t('tailoring.seeSuggestions')}
          </Button>
        </S.SuggestionsButtonWrapper>
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
      <S.AtsGrid>
        <S.AtsCenter>

          {tailoring ? (
            <S.TailoringSpinWrapper><Spin size="large" /></S.TailoringSpinWrapper>
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
              onReanalyze={onReanalyze}
              reanalyzeLoading={atsLoading}
              onGenerateResume={onGenerateResume}
              resumeLoading={resumeLoading}
              onDownloadPDF={onDownloadPDF}
              onExportMarkdown={onExportMarkdown}
              onSaveAsVersion={onSaveAsVersion}
            />
          )}
        </S.AtsCenter>

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
      </S.AtsGrid>
    </>
  )
}