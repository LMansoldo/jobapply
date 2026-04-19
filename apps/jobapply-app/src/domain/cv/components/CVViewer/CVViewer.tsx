/**
 * @file CVViewer.tsx
 * @description CVViewer — structured CV template + sidebar with locale toggle, actions, score, visibility.
 */
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ControlOutlined, EditOutlined } from '@ant-design/icons'
import { localeVersionToMarkdown, downloadMarkdownText, downloadMarkdownAsPdf } from '../../helpers'
import { useAntApp } from '../../../../components/AntApp'
import { Drawer } from '../../../../components/Drawer'
import type { CVViewerProps } from './CVViewer.types'
import { CVTemplate } from '../../../../design-system/cv/CVTemplate'
import { CVSkillsPanel } from '../../../../design-system/cv/CVSkillsPanel'
import { CVViewerSidebar } from '../../../../design-system/cv/CVViewerSidebar'
import { DSCard } from '../../../../design-system/primitives/DSCard'
import { DSButton } from '../../../../design-system/primitives/DSButton'
import { Alert } from '../../../../components/Alert'
import * as styles from './CVViewer.styles'

const COMPLETION_ITEMS = [
  { label: 'Informações básicas', done: true },
  { label: 'Experiência', done: true },
  { label: 'Foto de perfil', done: false, color: '#fb923c' },
  { label: 'CV em inglês', done: false, color: '#60a5fa' },
]

export function CVViewer({ cv, onEdit, onDelete, isMobile }: CVViewerProps) {
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
      await downloadMarkdownAsPdf(markdown, cv, activeLocale, cv.objective ?? '')
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
    score,
    completionItems: COMPLETION_ITEMS,
    visibility: { views: 142, searches: 38, saved: 7 },
  }

  if (isMobile) {
    return (
      <>
        <CVTemplate cv={cv} locale={activeVersion} isMobile />

        <button
          type="button"
          className={styles.fab}
          onClick={() => setDrawerOpen(true)}
          aria-label={t('cv.openActions')}
        >
          <ControlOutlined />
        </button>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="right"
          width="85vw"
          title={cv.fullName}
          styles={{ body: { padding: 0, overflowY: 'auto' } }}
        >
          <CVSkillsPanel locale={activeVersion} />
          <div style={{ padding: '1.6rem' }}>
            <CVViewerSidebar
              {...sidebarProps}
              onLocaleChange={(locale) => { setActiveLocale(locale); setDrawerOpen(false) }}
            />
          </div>
        </Drawer>
      </>
    )
  }

  return (
    <div className={styles.desktopGrid}>
      <CVTemplate cv={cv} locale={activeVersion} />
      <CVViewerSidebar {...sidebarProps} />
    </div>
  )
}
