import { useTranslation } from 'react-i18next'
import { Spin } from '../../../../design-system/wrappers/Spin'
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
      <S.EmptyState>
        <Spin size="large" />
      </S.EmptyState>
    )
  }

  if (!resumeContent) {
    return (
      <S.EmptyState>
        <S.EmptyDescription>{t('tailoring.resumeDescription')}</S.EmptyDescription>
        <S.GenerateBtn
          type="button"
          onClick={onGenerateResume}
          disabled={isDisabled}
        >
          ✦ {t('tailoring.generateResume')}
        </S.GenerateBtn>
      </S.EmptyState>
    )
  }

  return (
    <S.Grid>
      <S.MainPane>
        <S.PreviewBox>{resumeContent}</S.PreviewBox>
      </S.MainPane>

      <S.SidePane>
        <S.AiCard>
          <S.AiCardTitle>✦ {t('tailoring.resumeAITitle')}</S.AiCardTitle>
          <S.AiCardDesc>{t('tailoring.resumeDescription')}</S.AiCardDesc>
          <S.GenerateBtn
            type="button"
            onClick={onGenerateResume}
            disabled={isDisabled}
          >
            🔄 {t('tailoring.regenResume')}
          </S.GenerateBtn>
          <S.ActionRow>
            <S.ActionBtn
              type="button"
              onClick={() => navigator.clipboard.writeText(resumeContent)}
            >
              {t('tailoring.copyResume')}
            </S.ActionBtn>
            <S.ActionBtn
              type="button"
              onClick={() => downloadMarkdown(resumeContent)}
            >
              {t('tailoring.downloadResume')}
            </S.ActionBtn>
          </S.ActionRow>
        </S.AiCard>
      </S.SidePane>
    </S.Grid>
  )
}
