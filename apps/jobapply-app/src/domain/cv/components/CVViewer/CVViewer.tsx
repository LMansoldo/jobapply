/**
 * @file CVViewer.tsx
 * @description CVViewer component — displays a CV's personal info and locale versions as Markdown previews.
 */
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  DownloadOutlined,
  FilePdfOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { localeVersionToMarkdown, downloadMarkdown, exportPDF } from '../../helpers'
import type { CVViewerProps } from './CVViewer.types'
import { CVPaper } from '../../../../design-system/cv/CVPaper'
import { SectionBar } from '../../../../design-system/cv/SectionBar'
import { DSCard } from '../../../../design-system/primitives/DSCard'
import { DSButton } from '../../../../design-system/primitives/DSButton'
import { Descriptions, DescriptionsItem } from '../../../../components/Descriptions'
import { Alert } from '../../../../components/Alert'
import { Tag } from '../../../../components/Tag'
import { Space } from '../../../../components/Space'
import { Spacing } from '../../../../styles/theme/spacing'

/**
 * Displays a read-only view of the CV with personal info and markdown locale versions.
 * @param props - CVViewerProps
 */
export function CVViewer({ cv, onEdit, isMobile }: CVViewerProps) {
  const { t } = useTranslation()
  const ptBrVersion = cv.localeVersions?.find((v) => v.locale === 'pt-BR')
  const enVersion = cv.localeVersions?.find((v) => v.locale === 'en')

  const sections = [
    ptBrVersion && { key: 'pt-BR', label: '🇧🇷 Português' },
    enVersion && { key: 'en', label: '🇺🇸 English' },
  ].filter(Boolean) as { key: string; label: string }[]

  const [activeSection, setActiveSection] = useState(sections[0]?.key ?? 'pt-BR')

  const activeVersion = activeSection === 'pt-BR' ? ptBrVersion : enVersion

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
      {/* Personal info card */}
      <DSCard
        extra={
          <Space size={isMobile ? 4 : 8}>
            <DSButton
              variant="ghost"
              onClick={() => downloadMarkdown(cv)}
              size={isMobile ? 'small' : 'middle'}
            >
              <DownloadOutlined /> {isMobile ? '.md' : t('cv.exportMarkdown')}
            </DSButton>
            <DSButton
              variant="ghost"
              onClick={() => exportPDF(cv)}
              size={isMobile ? 'small' : 'middle'}
            >
              <FilePdfOutlined /> {isMobile ? '.pdf' : t('cv.exportPDF')}
            </DSButton>
          </Space>
        }
      >
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <DescriptionsItem label={t('cv.viewer.name')}>{cv.fullName}</DescriptionsItem>
          <DescriptionsItem label={t('cv.viewer.email')}>{cv.email}</DescriptionsItem>
          {cv.phone && <DescriptionsItem label={t('cv.viewer.phone')}>{cv.phone}</DescriptionsItem>}
          {cv.location && <DescriptionsItem label={t('cv.viewer.location')}>{cv.location}</DescriptionsItem>}
          {cv.linkedin && <DescriptionsItem label={t('cv.viewer.linkedin')}>{cv.linkedin}</DescriptionsItem>}
          {cv.languages?.length > 0 && (
            <DescriptionsItem label={t('cv.viewer.languages')}>
              <Space size={4} wrap>
                {cv.languages.map((l) => <Tag key={l}>{l}</Tag>)}
              </Space>
            </DescriptionsItem>
          )}
        </Descriptions>
      </DSCard>

      {/* CV content */}
      {sections.length > 0 ? (
        <DSCard
          title={t('cv.cvContent')}
          extra={
            <DSButton
              variant="primary"
              onClick={onEdit}
              size={isMobile ? 'small' : 'middle'}
            >
              <EditOutlined /> {isMobile ? t('common.edit', 'Editar') : t('cv.editCV')}
            </DSButton>
          }
        >
          {sections.length > 1 && (
            <div style={{ marginBottom: Spacing.md }}>
              <SectionBar sections={sections} activeKey={activeSection} onChange={setActiveSection} />
            </div>
          )}
          {activeVersion && (
            <CVPaper>
              <div className="markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {localeVersionToMarkdown(activeVersion)}
                </ReactMarkdown>
              </div>
            </CVPaper>
          )}
        </DSCard>
      ) : (
        <DSCard>
          <Alert
            type="warning"
            showIcon
            message={t('cv.noLocaleVersion')}
            action={
              <DSButton
                variant="primary"
                onClick={onEdit}
                size={isMobile ? 'small' : 'middle'}
              >
                <EditOutlined /> {isMobile ? t('common.edit', 'Editar') : t('cv.editCV')}
              </DSButton>
            }
          />
        </DSCard>
      )}
    </div>
  )
}
