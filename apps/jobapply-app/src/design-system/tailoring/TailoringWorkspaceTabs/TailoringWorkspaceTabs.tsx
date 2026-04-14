import { useTranslation } from 'react-i18next'
import { Colors } from '../../../styles/theme/colors'
import type { TailoringWorkspaceTabsProps } from './TailoringWorkspaceTabs.types'
import * as S from './TailoringWorkspaceTabs.styles'

export function TailoringWorkspaceTabs({
  activeTab,
  onTabChange,
  suggestionsCount,
}: TailoringWorkspaceTabsProps) {
  const { t } = useTranslation()

  return (
    <div className={S.workspaceTabs}>
      <button
        type="button"
        className={S.tabBtn(activeTab === 'ats')}
        onClick={() => onTabChange('ats')}
      >
        📊 {t('tailoring.ats')}
        <span className={S.tabBadge(Colors.primaryLight, Colors.primaryDark)}>
          {suggestionsCount}
        </span>
      </button>
      <button
        type="button"
        className={S.tabBtn(activeTab === 'cover')}
        onClick={() => onTabChange('cover')}
      >
        💌 {t('tailoring.coverLetter')}
        <span className={S.tabBadge(Colors.successBg, Colors.success)}>
          {t('tailoring.badgeNew')}
        </span>
      </button>
      <button
        type="button"
        className={S.tabBtn(activeTab === 'video')}
        onClick={() => onTabChange('video')}
      >
        🎬 {t('tailoring.videoScript')}
        <span className={S.tabBadge(Colors.orangeBg, Colors.orange)}>
          {t('tailoring.badgeBeta')}
        </span>
      </button>
    </div>
  )
}