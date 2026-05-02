import {
  EditOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  PlusCircleFilled,
  GlobalOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { CVViewerSidebarProps } from './CVViewerSidebar.types'
import { DSCard } from '../../primitives/DSCard'
import { DSButton } from '../../primitives/DSButton'
import { ScoreRing } from '../../primitives/ScoreRing'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight, FontFamily } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'
import { BorderRadius } from '../../../styles/theme/radius'

export function CVViewerSidebar({
  activeLocale,
  hasEn,
  hasPtBr,
  onLocaleChange,
  onEdit,
  onExportPDF,
  onExportMarkdown,
  onDelete,
  onShare,
  onDeleteVersion,
  onPublish,
  publishLoading,
  score,
  completionItems,
  visibility,
}: CVViewerSidebarProps) {
  const { t } = useTranslation()

  const localeBtn = (locale: 'pt-BR' | 'en', label: string, enabled: boolean) => {
    const active = activeLocale === locale
    return (
      <button
        type="button"
        disabled={!enabled}
        onClick={() => enabled && onLocaleChange(locale)}
        style={{
          flex: 1,
          padding: `${Spacing.sm} ${Spacing.md}`,
          border: `1.5px solid ${active ? Colors.primaryDark : Colors.surfaceBorder}`,
          borderRadius: BorderRadius.base,
          background: active ? Colors.primaryDark : Colors.white,
          color: active ? Colors.white : enabled ? Colors.textMain : Colors.textDisabled,
          fontFamily: FontFamily.body,
          fontSize: FontSize.sm,
          fontWeight: FontWeight.semibold,
          cursor: enabled ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
      {/* Versões */}
      <DSCard title={t('cv.versions')}>
        <div style={{ display: 'flex', gap: Spacing.sm }}>
          {localeBtn('pt-BR', '🇧🇷 PT-BR', hasPtBr)}
          {localeBtn('en', '🇺🇸 English', hasEn)}
        </div>
      </DSCard>

      {/* Actions */}
      <DSCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
          <DSButton variant="primary" onClick={onEdit} style={{ width: '100%', justifyContent: 'center' }}>
            <EditOutlined /> {t('cv.editCV')}
          </DSButton>
          <DSButton variant="ghost" onClick={onExportPDF} style={{ width: '100%', justifyContent: 'center' }}>
            <DownloadOutlined /> {t('cv.exportPDF')}
          </DSButton>
          <DSButton variant="ghost" onClick={onExportMarkdown} style={{ width: '100%', justifyContent: 'center' }}>
            <DownloadOutlined /> {t('cv.exportMarkdown')}
          </DSButton>
          {onPublish && (
            <DSButton
              variant="ghost"
              onClick={onPublish}
              loading={publishLoading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <GlobalOutlined /> {t('cv.publishCV')}
            </DSButton>
          )}
          {onShare && (
            <DSButton variant="ghost" onClick={onShare} style={{ width: '100%', justifyContent: 'center' }}>
              <ShareAltOutlined /> {t('cv.shareLink')}
            </DSButton>
          )}
          {onDeleteVersion && (
            <DSButton
              variant="ghost"
              onClick={onDeleteVersion}
              style={{ width: '100%', justifyContent: 'center', color: Colors.danger, borderColor: Colors.danger }}
            >
              <DeleteOutlined /> {t('cv.deleteVersion')}
            </DSButton>
          )}
          <DSButton
            variant="ghost"
            onClick={onDelete}
            style={{ width: '100%', justifyContent: 'center', color: Colors.danger, borderColor: Colors.danger }}
          >
            <DeleteOutlined /> {t('cv.deleteCV')}
          </DSButton>
        </div>
      </DSCard>

      {/* Score */}
      <DSCard title={t('cv.profileScore')}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: Spacing.md }}>
          <ScoreRing value={score} size={120} label={t('cv.atsScore')} sublabel="/100" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
          {completionItems.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: Spacing.sm, fontSize: FontSize.sm, color: Colors.textMain }}>
              {item.done ? (
                <CheckCircleFilled style={{ color: Colors.success, fontSize: FontSize.base }} />
              ) : (
                <PlusCircleFilled style={{ color: item.color ?? Colors.orange, fontSize: FontSize.base }} />
              )}
              {item.label}
            </div>
          ))}
        </div>
      </DSCard>

      {/* Visibilidade */}
      <DSCard title={t('cv.visibility').toUpperCase()}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
          {[
            { label: t('cv.views'), value: visibility.views },
            { label: t('cv.searchAppearances'), value: visibility.searches },
            { label: t('cv.recruitersSaved'), value: visibility.saved },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: FontSize.sm }}>
              <span style={{ color: Colors.textSub }}>{row.label}</span>
              <span style={{ fontWeight: FontWeight.bold, color: Colors.primaryDark, fontFamily: FontFamily.heading }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </DSCard>
    </div>
  )
}
