import { useTranslation } from 'react-i18next'
import { RightOutlined, SyncOutlined, RetweetOutlined, FileTextOutlined } from '@ant-design/icons'
import type { EditorKeywords } from './TailoringEditorPanel.types'
import * as S from './TailoringEditorPanel.styles'

interface FileDropdownMenuProps {
  editorKeywords?: EditorKeywords
  keywordsSubmenuOpen: boolean
  onKeywordsSubmenuEnter: () => void
  onKeywordsSubmenuLeave: () => void
  onInsertKeyword: (keyword: string) => void
  onOpenPhrases: () => void
  onOpenKeywordPhrases: () => void
  onOpenSemanticGaps: () => void
  onOpenTips: () => void
  onOpenRemoveSuggestions: () => void
  onPreviewCV: () => void
  onSaveCV?: () => void
  onReanalyze?: () => void
  reanalyzeLoading?: boolean
  onRewriteCV?: () => void
  rewriteLoading?: boolean
  onGenerateResume?: () => void
  resumeLoading?: boolean
}

export function FileDropdownMenu({
  editorKeywords,
  keywordsSubmenuOpen,
  onKeywordsSubmenuEnter,
  onKeywordsSubmenuLeave,
  onInsertKeyword,
  onOpenPhrases,
  onOpenKeywordPhrases,
  onOpenSemanticGaps,
  onOpenTips,
  onOpenRemoveSuggestions,
  onPreviewCV,
  onSaveCV,
  onReanalyze,
  reanalyzeLoading = false,
  onRewriteCV,
  rewriteLoading = false,
  onGenerateResume,
  resumeLoading = false,
}: FileDropdownMenuProps) {
  const { t } = useTranslation()

  const hasKeywordsToAdd = editorKeywords?.toAdd && editorKeywords.toAdd.length > 0
  const hasPhrasesToChange = editorKeywords?.toRephrase && editorKeywords.toRephrase.length > 0
  const hasKeywordPhrases = editorKeywords?.keywordPhrases && editorKeywords.keywordPhrases.length > 0
  const hasSemanticGaps = editorKeywords?.semanticGaps && editorKeywords.semanticGaps.length > 0
  const hasTips = editorKeywords?.tips && editorKeywords.tips.length > 0
  const hasRemoveSuggestions = editorKeywords?.removeSuggestions && editorKeywords.removeSuggestions.length > 0

  return (
    <S.FileMenuDrop>
      <S.FileMenuList>
        {/* Keywords to Add */}
        <S.MenuItemRow
          onMouseEnter={onKeywordsSubmenuEnter}
          onMouseLeave={onKeywordsSubmenuLeave}
          onClick={(e) => e.preventDefault()}
          disabled={!hasKeywordsToAdd}
        >
          <span>{t('tailoring.keywordsToAdd')}</span>
          <S.RightArrowIcon><RightOutlined /></S.RightArrowIcon>
          {keywordsSubmenuOpen && hasKeywordsToAdd && (
            <S.SubmenuDrop>
              {editorKeywords!.toAdd.map((keyword, idx) => (
                <S.SubmenuItem
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    onInsertKeyword(keyword)
                  }}
                >
                  {keyword}
                </S.SubmenuItem>
              ))}
            </S.SubmenuDrop>
          )}
        </S.MenuItemRow>

        {/* Phrases to Change */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onOpenPhrases()
          }}
          disabled={!hasPhrasesToChange}
        >
          <span>{t('tailoring.phrasesToChange')}</span>
          <S.RightArrowIcon><RightOutlined /></S.RightArrowIcon>
        </S.MenuItemRow>

        {/* Keyword Phrases */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onOpenKeywordPhrases()
          }}
          disabled={!hasKeywordPhrases}
        >
          <span>{t('tailoring.keywordPhrases')}</span>
          <S.RightArrowIcon><RightOutlined /></S.RightArrowIcon>
        </S.MenuItemRow>

        {/* Semantic Gaps */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onOpenSemanticGaps()
          }}
          disabled={!hasSemanticGaps}
        >
          <span>{t('tailoring.semanticGaps')}</span>
          <S.RightArrowIcon><RightOutlined /></S.RightArrowIcon>
        </S.MenuItemRow>

        {/* ATS Tips */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onOpenTips()
          }}
          disabled={!hasTips}
        >
          <span>{t('tailoring.atsTips')}</span>
          <S.RightArrowIcon><RightOutlined /></S.RightArrowIcon>
        </S.MenuItemRow>

        {/* Remove Suggestions */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onOpenRemoveSuggestions()
          }}
          disabled={!hasRemoveSuggestions}
        >
          <span>{t('tailoring.removeFromCV')}</span>
          <S.RightArrowIcon><RightOutlined /></S.RightArrowIcon>
        </S.MenuItemRow>

        {/* Reanalyze */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onReanalyze?.()
          }}
          disabled={reanalyzeLoading}
        >
          <span>{t('tailoring.reanalyze')}</span>
          <S.MenuItemIcon><SyncOutlined spin={reanalyzeLoading} /></S.MenuItemIcon>
        </S.MenuItemRow>

        {/* Rewrite CV */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onRewriteCV?.()
          }}
          disabled={rewriteLoading || !onRewriteCV}
        >
          <span>{t('tailoring.rewriteCV')}</span>
          <S.MenuItemIcon><RetweetOutlined spin={rewriteLoading} /></S.MenuItemIcon>
        </S.MenuItemRow>

        {/* Generate Resume */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onGenerateResume?.()
          }}
          disabled={resumeLoading || !onGenerateResume}
        >
          <span>{t('tailoring.generateResume')}</span>
          <S.MenuItemIcon><FileTextOutlined /></S.MenuItemIcon>
        </S.MenuItemRow>

        {/* Divider */}
        <S.MenuDivider />

        {/* Preview CV */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onPreviewCV()
          }}
        >
          <span>{t('tailoring.previewCV')}</span>
        </S.MenuItemRow>

        {/* Save CV */}
        <S.MenuItemRow
          onClick={(e) => {
            e.stopPropagation()
            onSaveCV?.()
          }}
        >
          <span>{t('tailoring.saveCV')}</span>
        </S.MenuItemRow>
      </S.FileMenuList>
    </S.FileMenuDrop>
  )
}