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
import { DSCard } from '@jobapply/ui'
import { DSButton } from '@jobapply/ui'
import { ScoreRing } from '@jobapply/ui'
import { Colors } from '../../../styles/theme/colors'
import * as styles from './CVViewerSidebar.styles'

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
      <styles.LocaleBtn
        type="button"
        disabled={!enabled}
        $active={active}
        $enabled={enabled}
        onClick={() => enabled && onLocaleChange(locale)}
      >
        {label}
      </styles.LocaleBtn>
    )
  }

  return (
    <styles.Root>
      {/* Versões */}
      <DSCard title={t('cv.versions')}>
        <styles.LocaleRow>
          {localeBtn('pt-BR', '🇧🇷 PT-BR', hasPtBr)}
          {localeBtn('en', '🇺🇸 English', hasEn)}
        </styles.LocaleRow>
      </DSCard>

      {/* Actions */}
      <DSCard>
        <styles.ActionList>
          <styles.FullWidthBtn>
            <DSButton variant="primary" onClick={onEdit}>
              <EditOutlined /> {t('cv.editCV')}
            </DSButton>
          </styles.FullWidthBtn>
          <styles.FullWidthBtn>
            <DSButton variant="ghost" onClick={onExportPDF}>
              <DownloadOutlined /> {t('cv.exportPDF')}
            </DSButton>
          </styles.FullWidthBtn>
          <styles.FullWidthBtn>
            <DSButton variant="ghost" onClick={onExportMarkdown}>
              <DownloadOutlined /> {t('cv.exportMarkdown')}
            </DSButton>
          </styles.FullWidthBtn>
          {onPublish && (
            <styles.FullWidthBtn>
              <DSButton variant="ghost" onClick={onPublish} loading={publishLoading}>
                <GlobalOutlined /> {t('cv.publishCV')}
              </DSButton>
            </styles.FullWidthBtn>
          )}
          {onShare && (
            <styles.FullWidthBtn>
              <DSButton variant="ghost" onClick={onShare}>
                <ShareAltOutlined /> {t('cv.shareLink')}
              </DSButton>
            </styles.FullWidthBtn>
          )}
          {onDeleteVersion && (
            <styles.DangerBtn>
              <DSButton variant="ghost" onClick={onDeleteVersion}>
                <DeleteOutlined /> {t('cv.deleteVersion')}
              </DSButton>
            </styles.DangerBtn>
          )}
          <styles.DangerBtn>
            <DSButton variant="ghost" onClick={onDelete}>
              <DeleteOutlined /> {t('cv.deleteCV')}
            </DSButton>
          </styles.DangerBtn>
        </styles.ActionList>
      </DSCard>

      {/* Score */}
      <DSCard title={t('cv.profileScore')}>
        <styles.ScoreCenter>
          <ScoreRing value={score} size={120} label={t('cv.atsScore')} sublabel="/100" />
        </styles.ScoreCenter>
        <styles.CompletionList>
          {completionItems.map((item) => (
            <styles.CompletionItem key={item.label}>
              {item.done ? (
                <styles.CompletionIcon $color={Colors.success}>
                  <CheckCircleFilled />
                </styles.CompletionIcon>
              ) : (
                <styles.CompletionIcon $color={item.color ?? Colors.orange}>
                  <PlusCircleFilled />
                </styles.CompletionIcon>
              )}
              {item.label}
            </styles.CompletionItem>
          ))}
        </styles.CompletionList>
      </DSCard>

      {/* Visibilidade */}
      <DSCard title={t('cv.visibility').toUpperCase()}>
        <styles.VisibilityList>
          {[
            { label: t('cv.views'), value: visibility.views },
            { label: t('cv.searchAppearances'), value: visibility.searches },
            { label: t('cv.recruitersSaved'), value: visibility.saved },
          ].map((row) => (
            <styles.VisibilityRow key={row.label}>
              <styles.VisibilityLabel>{row.label}</styles.VisibilityLabel>
              <styles.VisibilityValue>
                {row.value}
              </styles.VisibilityValue>
            </styles.VisibilityRow>
          ))}
        </styles.VisibilityList>
      </DSCard>
    </styles.Root>
  )
}
