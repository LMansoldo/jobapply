import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TailoringPreviewPanelProps } from './TailoringPreviewPanel.types'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

type PreviewTab = 'preview' | 'job'

export function TailoringPreviewPanel({
  job,
  currentScore,
  projectedScore,
  scoreDelta,
  onDownloadPDF,
  onDownloadDOCX,
  onExportMarkdown,
  onSaveAsVersion,
}: TailoringPreviewPanelProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<PreviewTab>('preview')

  const tabBtn = (tab: PreviewTab, label: string) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      style={{
        padding: `${Spacing.sm} ${Spacing.md}`,
        border: 'none', background: 'none',
        fontFamily: FontFamily.body, fontSize: FontSize.sm,
        fontWeight: activeTab === tab ? FontWeight.semibold : FontWeight.regular,
        color: activeTab === tab ? Colors.primaryDark : Colors.textSub,
        borderBottom: `2px solid ${activeTab === tab ? Colors.primaryDark : 'transparent'}`,
        cursor: 'pointer', transition: 'color .15s, border-color .15s',
      }}
    >
      {label}
    </button>
  )

  const exportBtn = (label: string, onClick?: () => void, primary = false) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%', padding: `${Spacing.sm} 0`,
        background: primary ? Colors.primaryDark : Colors.white,
        color: primary ? Colors.white : Colors.primaryDark,
        border: `1.5px solid ${Colors.primaryDark}`,
        borderRadius: BorderRadius.base,
        fontFamily: FontFamily.body, fontSize: FontSize.sm,
        fontWeight: FontWeight.medium, cursor: 'pointer',
        transition: 'background .15s',
        marginBottom: Spacing.sm,
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: `1px solid ${Colors.surfaceBorder}` }}>
      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${Colors.surfaceBorder}`, display: 'flex', padding: `0 ${Spacing.sm}`, background: Colors.white }}>
        {tabBtn('preview', `📄 ${t('tailoring.previewCV')}`)}
        {tabBtn('job', `🔍 ${t('tailoring.jobDescription')}`)}
      </div>

      {/* Score badge */}
      <div style={{
        background: Colors.successBg,
        borderBottom: `1px solid ${Colors.surfaceBorder}`,
        padding: `${Spacing.sm} ${Spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.sm,
      }}>
        <span style={{ fontSize: FontSize.sm, color: Colors.textSub }}>
          {t('tailoring.scoreWithSuggestions')}: <strong style={{ color: Colors.textMain }}>{currentScore} → {projectedScore} pts</strong>
        </span>
        <span style={{
          background: Colors.success, color: Colors.white,
          borderRadius: BorderRadius.full,
          padding: `2px ${Spacing.sm}`,
          fontSize: FontSize.xxs, fontWeight: FontWeight.bold,
        }}>
          +{scoreDelta} pts
        </span>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: Spacing.lg }}>
        {activeTab === 'preview' && (
          <div style={{ fontSize: FontSize.xxs, color: Colors.textMain, lineHeight: 1.6 }}>
            <p style={{ fontWeight: FontWeight.bold, marginBottom: Spacing.sm }}>
              {t('tailoring.previewCV')}
            </p>
            <p style={{ color: Colors.textSub }}>
              {t('tailoring.cvPlaceholder')}
            </p>
          </div>
        )}
        {activeTab === 'job' && job && (
          <div>
            <h4 style={{ fontFamily: FontFamily.heading, fontWeight: FontWeight.semibold, marginBottom: Spacing.md, color: Colors.textMain }}>
              {job.title}
            </h4>
            <p style={{ fontSize: FontSize.sm, color: Colors.textSub, marginBottom: Spacing.sm }}>
              {job.company} {job.location ? `· ${job.location}` : ''}
            </p>
            <p style={{ fontSize: FontSize.sm, color: Colors.textMain, lineHeight: 1.7 }}>
              {job.description}
            </p>
          </div>
        )}
      </div>

      {/* Export section */}
      <div style={{
        background: Colors.surfacePage,
        borderTop: `1px solid ${Colors.surfaceBorder}`,
        padding: Spacing.lg,
      }}>
        <p style={{ margin: `0 0 ${Spacing.md}`, fontSize: FontSize.xxs, fontWeight: FontWeight.bold, color: Colors.textSub, textTransform: 'uppercase' as const, letterSpacing: '0.8px' }}>
          {t('tailoring.exportOptimized')}
        </p>
        {exportBtn(`📄 ${t('tailoring.downloadPDF')}`, onDownloadPDF, true)}
        {exportBtn(`📄 ${t('tailoring.downloadDOCX')}`, onDownloadDOCX)}
        {exportBtn(`📄 ${t('tailoring.exportMarkdown')}`, onExportMarkdown)}
        {exportBtn(`📋 ${t('tailoring.saveAsVersion')}`, onSaveAsVersion)}
      </div>
    </div>
  )
}
