import { useTranslation } from 'react-i18next'
import { BarChartOutlined, DownOutlined, MailOutlined, VideoCameraOutlined, CommentOutlined, LinkedinOutlined } from '@ant-design/icons'
import { Dropdown } from '../../../components/Dropdown'
import { Colors } from '../../../styles/theme/colors'
import type { WorkspaceTab, TailoringWorkspaceTabsProps } from './TailoringWorkspaceTabs.types'
import * as S from './TailoringWorkspaceTabs.styles'

export function TailoringWorkspaceTabs({
  activeTab,
  onTabChange,
  suggestionsCount,
}: TailoringWorkspaceTabsProps) {
  const { t } = useTranslation()

  const tabs = [
    {
      key: 'ats' as WorkspaceTab,
      icon: <BarChartOutlined />,
      label: t('tailoring.ats'),
      badgeBg: Colors.primaryLight,
      badgeColor: Colors.primaryDark,
      badgeText: String(suggestionsCount),
    },
    {
      key: 'cover' as WorkspaceTab,
      icon: <MailOutlined />,
      label: t('tailoring.coverLetter'),
      badgeBg: Colors.successBg,
      badgeColor: Colors.success,
      badgeText: t('tailoring.badgeNew'),
    },
    {
      key: 'video' as WorkspaceTab,
      icon: <VideoCameraOutlined />,
      label: t('tailoring.videoScript'),
      badgeBg: Colors.orangeBg,
      badgeColor: Colors.orange,
      badgeText: t('tailoring.badgeBeta'),
    },
    {
      key: 'interview' as WorkspaceTab,
      icon: <CommentOutlined />,
      label: t('tailoring.interviewTraining'),
      badgeBg: Colors.blueBg,
      badgeColor: Colors.blue,
      badgeText: t('tailoring.badgeNew'),
    },
    {
      key: 'linkedin' as WorkspaceTab,
      icon: <LinkedinOutlined />,
      label: t('tailoring.linkedinAnalysis'),
      badgeBg: '#e8f4fb',
      badgeColor: '#0077B5',
      badgeText: t('tailoring.badgeNew'),
    },
  ]

  const activeTabDef = tabs.find((tab) => tab.key === activeTab)!

  const dropdownMenu = {
    items: tabs.map((tab) => ({
      key: tab.key,
      label: (
        <div className={S.dropdownItemContent(tab.key === activeTab)}>
          {tab.icon} {tab.label}
          <span className={S.tabBadge(tab.badgeBg, tab.badgeColor)}>{tab.badgeText}</span>
        </div>
      ),
    })),
    onClick: ({ key }: { key: string }) => onTabChange(key as WorkspaceTab),
  }

  return (
    <>
      <div className={S.workspaceTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={S.tabBtn(activeTab === tab.key)}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.icon} {tab.label}
            <span className={S.tabBadge(tab.badgeBg, tab.badgeColor)}>{tab.badgeText}</span>
          </button>
        ))}
      </div>
      <div className={S.mobileDropdownWrapper}>
        <Dropdown menu={dropdownMenu} trigger={['click']}>
          <button type="button" className={S.mobileDropdownTrigger}>
            {activeTabDef.icon} {activeTabDef.label}
            <span className={S.tabBadge(activeTabDef.badgeBg, activeTabDef.badgeColor)}>
              {activeTabDef.badgeText}
            </span>
            <DownOutlined />
          </button>
        </Dropdown>
      </div>
    </>
  )
}
