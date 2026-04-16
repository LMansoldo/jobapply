import { useTranslation } from 'react-i18next'
import { BarChartOutlined, MailOutlined, VideoCameraOutlined } from '@ant-design/icons'
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
        <BarChartOutlined /> {t('tailoring.ats')}
        <span className={S.tabBadge(Colors.primaryLight, Colors.primaryDark)}>
          {suggestionsCount}
        </span>
      </button>
      <button
        type="button"
        className={S.tabBtn(activeTab === 'cover')}
        onClick={() => onTabChange('cover')}
      >
        <MailOutlined /> {t('tailoring.coverLetter')}
        <span className={S.tabBadge(Colors.successBg, Colors.success)}>
          {t('tailoring.badgeNew')}
        </span>
      </button>
      <button
        type="button"
        className={S.tabBtn(activeTab === 'video')}
        onClick={() => onTabChange('video')}
      >
        <VideoCameraOutlined /> {t('tailoring.videoScript')}
        <span className={S.tabBadge(Colors.orangeBg, Colors.orange)}>
          {t('tailoring.badgeBeta')}
        </span>
      </button>
    </div>
  )
}