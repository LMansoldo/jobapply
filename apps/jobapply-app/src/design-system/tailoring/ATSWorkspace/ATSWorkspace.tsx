import { useTranslation } from 'react-i18next'
import { useRef, useState, useEffect } from 'react'
import { Spin } from '../../../components/Spin'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { ATSPanel } from '../../../design-system/ats/ATSPanel'
import { SuggestionBanner } from '../../../design-system/tailoring/SuggestionBanner'
import { TailoringPreviewPanel } from '../../../design-system/tailoring/TailoringPreviewPanel'
import { TailoringEditorPanel, type TailoringEditorHandle } from '../../../design-system/tailoring/TailoringEditorPanel'
import { KeywordsPanel } from '../../../design-system/tailoring/KeywordsPanel'
import { Colors } from '../../../styles/theme/colors'
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
  onDownloadDOCX,
  onExportMarkdown,
  onSaveAsVersion,
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

  const atsLeftPanel = atsLoading
    ? <div className={S.tailoringSpinWrapper}><Spin size="large" /></div>
    : (
      <>
        <ATSPanel
          score={panelData?.score ?? 0}
          categories={panelData?.categories ?? []}
          keywords={panelData?.keywords ?? []}
        />
        {panelData && (
          <div className={S.atsScoreBadge}>
            {t('tailoring.improvementBadge', { delta: scoreDelta })}
          </div>
        )}
        <div className={S.reanalyzeWrapper}>
          <Button
            type="default"
            size="small"
            onClick={onReanalyze}
            loading={atsLoading}
          >
            {t('tailoring.reanalyze')}
          </Button>
        </div>
      </>
    )

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

  const keywordsPanel = editorKeywords && (editorKeywords.toAdd.length > 0 || editorKeywords.toRephrase.length > 0) && (
    <>
      {suggestionsCount > 0 && (
        <div style={{ padding: '0 1.6rem 0.8rem', display: 'flex', justifyContent: 'center' }}>
          <Button
            type="primary"
            size="small"
            onClick={() => setShowSuggestionsModal(true)}
          >
            {t('tailoring.seeSuggestions')}
          </Button>
        </div>
      )}
      <KeywordsPanel
        editorKeywords={editorKeywords}
        onInsertKeyword={handleInsertKeyword}
        onReplaceKeyword={handleReplaceKeyword}
      />
    </>
  )

  return (
    <>
      <div className={S.atsGrid}>
        <div className={S.atsLeft}>{atsLeftPanel}</div>

        <div className={S.atsCenter}>
          {suggestionsCount > 0 && (
            <>
              {/* Desktop SuggestionBanner - hidden on medium/small screens */}
              <div className={`${S.suggestionBannerPad} ${S.desktopOnly}`}>
                <SuggestionBanner
                  count={allSuggestions.length}
                  current={currentSuggestion}
                  onPrev={() => onSuggestionChange(Math.max(1, currentSuggestion - 1))}
                  onNext={() => onSuggestionChange(Math.min(allSuggestions.length, currentSuggestion + 1))}
                  onAcceptAll={() => {}}
                />
              </div>
              {currentSuggestionText && (
                <div className={`${S.suggestionCard} ${S.desktopOnly}`}>
                  <span className={S.suggestionCardIcon}>✦</span>
                  <span className={S.suggestionCardText}>{currentSuggestionText}</span>
                </div>
              )}
            </>
          )}

          {keywordsPanel}

          {tailoring ? (
            <div className={S.tailoringSpinWrapper}><Spin size="large" /></div>
          ) : (
            <TailoringEditorPanel
              ref={editorRef}
              value={tailoredContent}
              onChange={onTailoredContentChange}
              locale={(chosenLocale ?? 'pt-BR') as 'en' | 'pt-BR'}
            />
          )}
        </div>

        <TailoringPreviewPanel
          markdownContent={tailoredContent}
          job={job}
          currentScore={currentScore}
          projectedScore={projectedScore}
          scoreDelta={scoreDelta}
          onDownloadPDF={onDownloadPDF}
          onDownloadDOCX={onDownloadDOCX}
          onExportMarkdown={onExportMarkdown}
          onSaveAsVersion={onSaveAsVersion}
        />
      </div>

      {/* Suggestions Modal for medium/small screens */}
      <Modal
        open={showSuggestionsModal}
        onCancel={() => setShowSuggestionsModal(false)}
        footer={null}
        styles={{
          body: {
            background: Colors.surfaceEditor,
            padding: '1.6rem',
            borderRadius: '8px',
          },
          content: {
            background: Colors.surfaceEditor,
          }
        }}
      >
        <div className={S.modalContent}>
          <SuggestionBanner
            count={allSuggestions.length}
            current={currentSuggestion}
            onPrev={() => onSuggestionChange(Math.max(1, currentSuggestion - 1))}
            onNext={() => onSuggestionChange(Math.min(allSuggestions.length, currentSuggestion + 1))}
            onAcceptAll={() => {}}
          />
          {currentSuggestionText && (
            <div className={S.suggestionCardModal}>
              <span className={S.suggestionCardIcon}>✦</span>
              <span className={S.suggestionCardText}>{currentSuggestionText}</span>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}