import { useTranslation } from 'react-i18next'
import { ToneChips } from '../../../design-system/ats/ToneChips'
import type { CoverLetterWorkspaceProps } from './CoverLetterWorkspace.types'
import * as S from './CoverLetterWorkspace.styles'

export function CoverLetterWorkspace({
  coverContent,
  coverLoading,
  tone,
  toneOptions,
  onCoverContentChange,
  onToneChange,
  onGenerateCoverLetter,
}: CoverLetterWorkspaceProps) {
  const { t } = useTranslation()

  const generateLabel = coverLoading
    ? t('tailoring.generatingCover')
    : `🔄 ${t('tailoring.regenCover')}`

  return (
    <div className={S.coverGrid}>
      <div className={S.coverEditorPane}>
        <div className={S.coverEditorBorder}>
          <textarea
            className={S.coverTextarea}
            value={coverContent}
            onChange={(e) => onCoverContentChange(e.target.value)}
            placeholder={t('tailoring.coverPlaceholder')}
          />
        </div>
      </div>
      <div className={S.coverSidePane}>
        <div className={S.aiCard}>
          <p className={S.aiCardTitle}>✦ {t('tailoring.generateWithAI')}</p>
          <ToneChips options={toneOptions} value={tone} onChange={onToneChange} />
          <button
            type="button"
            className={S.aiGenBtn}
            onClick={onGenerateCoverLetter}
            disabled={coverLoading}
          >
            {generateLabel}
          </button>
        </div>
      </div>
    </div>
  )
}