import { useTranslation } from 'react-i18next'
import type { VideoScriptWorkspaceProps } from './VideoScriptWorkspace.types'
import * as S from './VideoScriptWorkspace.styles'

export function VideoScriptWorkspace({
  videoContent,
  videoLoading,
  onVideoContentChange,
  onGenerateVideoScript,
}: VideoScriptWorkspaceProps) {
  const { t } = useTranslation()

  const generateLabel = videoLoading
    ? t('tailoring.generatingVideo')
    : `🎬 ${t('tailoring.newScript')}`

  return (
    <div className={S.videoGrid}>
      <div className={S.videoEditorPane}>
        <div className={S.coverEditorBorder}>
          <textarea
            className={S.videoTextarea}
            value={videoContent}
            onChange={(e) => onVideoContentChange(e.target.value)}
            placeholder={t('tailoring.videoPlaceholder')}
          />
        </div>
      </div>
      <div className={S.videoSidePane}>
        <button
          type="button"
          className={S.videoScriptBtn}
          onClick={onGenerateVideoScript}
          disabled={videoLoading}
        >
          {generateLabel}
        </button>
      </div>
    </div>
  )
}