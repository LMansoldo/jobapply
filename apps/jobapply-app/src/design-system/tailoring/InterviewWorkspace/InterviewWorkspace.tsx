import { useTranslation } from 'react-i18next'
import { Spin } from '../../../components/Spin'
import type { InterviewWorkspaceProps } from './InterviewWorkspace.types'
import * as S from './InterviewWorkspace.styles'

export function InterviewWorkspace({ interviewPrep, loading, onGenerate }: InterviewWorkspaceProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className={S.emptyState}>
        <Spin size="large" />
      </div>
    )
  }

  if (!interviewPrep || interviewPrep.stories.length === 0) {
    return (
      <div className={S.emptyState}>
        <p>{t('tailoring.noInterviewData')}</p>
        <button type="button" className={S.generateBtn} onClick={onGenerate}>
          ✦ {t('tailoring.generateInterviewPrep')}
        </button>
      </div>
    )
  }

  return (
    <div className={S.grid}>
      <div className={S.storiesPane}>
        <p className={S.storiesTitle}>{t('tailoring.interviewStories')}</p>
        {interviewPrep.stories.map((story, i) => (
          <div key={i} className={S.storyCard}>
            <p className={S.storyRequirement}>{story.jdRequirement}</p>
            <p className={S.storyText}>{story.story}</p>
          </div>
        ))}
      </div>

      <div className={S.sidePane}>
        {interviewPrep.overallPositioning && (
          <div className={S.positioningCard}>
            <p className={S.positioningTitle}>{t('tailoring.interviewPositioning')}</p>
            <p className={S.positioningText}>{interviewPrep.overallPositioning}</p>
          </div>
        )}
        <button type="button" className={S.regenBtn} onClick={onGenerate} disabled={loading}>
          🔄 {t('tailoring.regenInterviewPrep')}
        </button>
      </div>
    </div>
  )
}
