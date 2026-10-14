/**
 * @file CVViewer.tsx
 * @description CVViewer — structured CV template + sidebar with locale toggle, actions, score, visibility.
 */
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ControlOutlined, EditOutlined } from '@ant-design/icons'
import { localeVersionToMarkdown, downloadMarkdownText, downloadMarkdownAsPdf } from '../../../domain/cv/helpers'
import { useAntApp } from '../../../design-system/wrappers/AntApp'
import { Drawer } from '../../../design-system/wrappers/Drawer'
import type { CVViewerProps } from './CVViewer.types'
import { CVTemplate } from '../CVTemplate'
import { CVSkillsPanel } from '../CVSkillsPanel'
import { CVViewerSidebar } from '../../../design-system/cv/CVViewerSidebar'
import { DSCard } from '@jobapply/ui'
import { DSButton } from '@jobapply/ui'
import { Alert } from '../../../design-system/wrappers/Alert'
import * as styles from './CVViewer.styles'

const COMPLETION_ITEMS = [
  { label: 'Informações básicas', done: true },
  { label: 'Experiência', done: true },
  { label: 'Foto de perfil', done: false, color: '#fb923c' },
  { label: 'CV em inglês', done: false, color: '#60a5fa' },
]

export function CVViewer({ cv, onEdit, onDelete, isMobile, onPublish, publishLoading }: CVViewerProps) {
  const { t } = useTranslation()
  const { message } = useAntApp()
  const ptBrVersion = cv.localeVersions?.find((v) => v.locale === 'pt-BR')
  const enVersion = cv.localeVersions?.find((v) => v.locale === 'en')

  const [activeLocale, setActiveLocale] = useState<'pt-BR' | 'en'>(ptBrVersion ? 'pt-BR' : 'en')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const activeVersion = activeLocale === 'pt-BR' ? ptBrVersion : enVersion

  const ptBrDone = !!ptBrVersion
  const enDone = !!enVersion
  const score = ptBrDone && enDone ? 85 : ptBrDone ? 60 : 30

  const handleExportMarkdown = useCallback(() => {
    if (!activeVersion) return
    const markdown = localeVersionToMarkdown(activeVersion)
    const filename = `cv-${cv.fullName.replace(/\s+/g, '-').toLowerCase()}-${activeLocale}`
    downloadMarkdownText(markdown, filename)
  }, [activeVersion, cv, activeLocale])

  const handleExportPDF = useCallback(async () => {
    if (!activeVersion) return
    try {
      message.loading(t('tailoring.generatingPDF'), 0)
      const markdown = localeVersionToMarkdown(activeVersion)
      await downloadMarkdownAsPdf(markdown, cv, activeLocale, '')
      message.destroy()
      message.success(t('tailoring.downloadPDFSuccess'))
    } catch {
      message.destroy()
      message.error(t('tailoring.downloadPDFError'))
    }
  }, [activeVersion, cv, activeLocale, message, t])

  if (!activeVersion) {
    return (
      <DSCard>
        <Alert
          type="warning"
          showIcon
          message={t('cv.noLocaleVersion')}
          action={
            <DSButton variant="primary" onClick={onEdit} size={isMobile ? 'small' : 'middle'}>
              <EditOutlined /> {t('cv.editCV')}
            </DSButton>
          }
        />
      </DSCard>
    )
  }

  const sidebarProps = {
    activeLocale,
    hasPtBr: ptBrDone,
    hasEn: enDone,
    onLocaleChange: setActiveLocale,
    onEdit,
    onExportPDF: handleExportPDF,
    onExportMarkdown: handleExportMarkdown,
    onDelete,
    onPublish,
    publishLoading,
    score,
    completionItems: COMPLETION_ITEMS,
    visibility: { views: 142, searches: 38, saved: 7 },
  }

  if (isMobile) {
    return (
      <>
        <CVTemplate cv={cv} locale={activeVersion} isMobile />

        <styles.Fab
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={t('cv.openActions')}
        >
          <ControlOutlined />
        </styles.Fab>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="right"
          width="85vw"
          title={cv.fullName}
          styles={{ body: { padding: 0, overflowY: 'auto' } }}
        >
          <CVSkillsPanel locale={activeVersion} />
          <styles.DrawerBody>
            <CVViewerSidebar
              {...sidebarProps}
              onLocaleChange={(locale) => { setActiveLocale(locale); setDrawerOpen(false) }}
            />
          </styles.DrawerBody>
        </Drawer>
      </>
    )
  }

  return (
    <styles.DesktopGrid>
      <CVTemplate cv={cv} locale={activeVersion} />
      <CVViewerSidebar {...sidebarProps} />
    </styles.DesktopGrid>
  )
}
