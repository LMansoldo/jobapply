import { useTranslation } from 'react-i18next'
import { Spin } from '../../../components/Spin'
import type { ResumeWorkspaceProps } from './ResumeWorkspace.types'
import * as S from './ResumeWorkspace.styles'

function downloadMarkdown(content: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resume-tailored.md'
  a.click()
  URL.revokeObjectURL(url)
}

export function ResumeWorkspace({
  resumeContent,
  resumeLoading,
  hasJobDescription,
  onGenerateResume,
}: ResumeWorkspaceProps) {
  const { t } = useTranslation()

  const isDisabled = resumeLoading || !hasJobDescription

  if (resumeLoading) {
    return (
      <div className={S.emptyState}>
        <Spin size="large" />
      </div>
    )
  }

  if (!resumeContent) {
    return (
      <div className={S.emptyState}>
        <p className={S.emptyDescription}>{t('tailoring.resumeDescription')}</p>
        <button
          type="button"
          className={S.generateBtn}
          onClick={onGenerateResume}
          disabled={isDisabled}
        >
          ✦ {t('tailoring.generateResume')}
        </button>
      </div>
    )
  }

  return (
    <div className={S.grid}>
      <div className={S.mainPane}>
        <pre className={S.previewBox}>{resumeContent}</pre>
      </div>

      <div className={S.sidePane}>
        <div className={S.aiCard}>
          <p className={S.aiCardTitle}>✦ {t('tailoring.resumeAITitle')}</p>
          <p className={S.aiCardDesc}>{t('tailoring.resumeDescription')}</p>
          <button
            type="button"
            className={S.generateBtn}
            onClick={onGenerateResume}
            disabled={isDisabled}
          >
            🔄 {t('tailoring.regenResume')}
          </button>
          <div className={S.actionRow}>
            <button
              type="button"
              className={S.actionBtn}
              onClick={() => navigator.clipboard.writeText(resumeContent)}
            >
              {t('tailoring.copyResume')}
            </button>
            <button
              type="button"
              className={S.actionBtn}
              onClick={() => downloadMarkdown(resumeContent)}
            >
              {t('tailoring.downloadResume')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
