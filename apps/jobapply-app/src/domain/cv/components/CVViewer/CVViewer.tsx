/**
 * @file CVViewer.tsx
 * @description CVViewer — structured CV template + sidebar with locale toggle, actions, score, visibility.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { downloadMarkdown, exportPDF } from '../../helpers'
import type { CVViewerProps } from './CVViewer.types'
import { CVTemplate } from '../../../../design-system/cv/CVTemplate'
import { CVViewerSidebar } from '../../../../design-system/cv/CVViewerSidebar'
import { DSCard } from '../../../../design-system/primitives/DSCard'
import { DSButton } from '../../../../design-system/primitives/DSButton'
import { Alert } from '../../../../components/Alert'
import { EditOutlined } from '@ant-design/icons'
import * as styles from './CVViewer.styles'

const COMPLETION_ITEMS = [
  { label: 'Informações básicas', done: true },
  { label: 'Experiência', done: true },
  { label: 'Foto de perfil', done: false, color: '#fb923c' },
  { label: 'CV em inglês', done: false, color: '#60a5fa' },
]

export function CVViewer({ cv, onEdit, isMobile }: CVViewerProps) {
  const { t } = useTranslation()
  const ptBrVersion = cv.localeVersions?.find((v) => v.locale === 'pt-BR')
  const enVersion = cv.localeVersions?.find((v) => v.locale === 'en')

  const [activeLocale, setActiveLocale] = useState<'pt-BR' | 'en'>(ptBrVersion ? 'pt-BR' : 'en')

  const activeVersion = activeLocale === 'pt-BR' ? ptBrVersion : enVersion

  const ptBrDone = !!ptBrVersion
  const enDone = !!enVersion
  const score = ptBrDone && enDone ? 85 : ptBrDone ? 60 : 30

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

  if (isMobile) {
    return (
      <div className={styles.mobileRoot}>
        <CVTemplate cv={cv} locale={activeVersion} />
        <CVViewerSidebar
          activeLocale={activeLocale}
          hasPtBr={ptBrDone}
          hasEn={enDone}
          onLocaleChange={setActiveLocale}
          onEdit={onEdit}
          onExportPDF={() => exportPDF(cv)}
          score={score}
          completionItems={COMPLETION_ITEMS}
          visibility={{ views: 142, searches: 38, saved: 7 }}
        />
      </div>
    )
  }

  return (
    <div className={styles.desktopGrid}>
      <div>
        <CVTemplate cv={cv} locale={activeVersion} />
        <div className={styles.desktopActions}>
          <DSButton variant="ghost" onClick={() => downloadMarkdown(cv)}>
            {t('cv.exportMarkdown')}
          </DSButton>
        </div>
      </div>
      <CVViewerSidebar
        activeLocale={activeLocale}
        hasPtBr={ptBrDone}
        hasEn={enDone}
        onLocaleChange={setActiveLocale}
        onEdit={onEdit}
        onExportPDF={() => exportPDF(cv)}
        score={score}
        completionItems={COMPLETION_ITEMS}
        visibility={{ views: 142, searches: 38, saved: 7 }}
      />
    </div>
  )
}
