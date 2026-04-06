/**
 * @file CVViewer.tsx
 * @description CVViewer component — displays a CV's personal info and locale versions as Markdown previews.
 */
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
import { Card } from '../../../../components/Card'
import { Button } from '../../../../components/Button'
import { Space } from '../../../../components/Space'
import { Descriptions, DescriptionsItem } from '../../../../components/Descriptions'
import { Tabs } from '../../../../components/Tabs'
import { Tag } from '../../../../components/Tag'
import { Alert } from '../../../../components/Alert'
import { Spacing } from '../../../../styles/theme/spacing'

/**
 * Displays a read-only view of the CV with personal info and markdown locale versions.
 * @param props - CVViewerProps
 */
export function CVViewer({ cv, onEdit, isMobile }: CVViewerProps) {
  const { t } = useTranslation()
  const ptBrVersion = cv.localeVersions?.find((v) => v.locale === 'pt-BR')
  const enVersion = cv.localeVersions?.find((v) => v.locale === 'en')

  const tabItems = [
    ptBrVersion && {
      key: 'pt-BR',
      label: '🇧🇷 Português',
      children: (
        <div className="markdown-preview" style={{ padding: `${Spacing.sm} ${Spacing.xs}` }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {localeVersionToMarkdown(ptBrVersion)}
          </ReactMarkdown>
        </div>
      ),
    },
    enVersion && {
      key: 'en',
      label: '🇺🇸 English',
      children: (
        <div className="markdown-preview" style={{ padding: `${Spacing.sm} ${Spacing.xs}` }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {localeVersionToMarkdown(enVersion)}
          </ReactMarkdown>
        </div>
      ),
    },
  ].filter(Boolean) as { key: string; label: string; children: React.ReactNode }[]

  return (
    <div>
      <Card
        style={{ marginBottom: Spacing.md }}
        extra={
          <Space size={isMobile ? 4 : 8}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => downloadMarkdown(cv)}
              size={isMobile ? 'small' : 'middle'}
              style={{ padding: isMobile ? `0 ${Spacing.sm}` : Spacing.lg1 }}
            >
              {isMobile ? '.md' : t('cv.exportMarkdown')}
            </Button>
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => exportPDF(cv)}
              size={isMobile ? 'small' : 'middle'}
              style={{ padding: isMobile ? `0 ${Spacing.sm}` : Spacing.lg1 }}
            >
              {isMobile ? '.pdf' : t('cv.exportPDF')}
            </Button>
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
      </Card>

      {tabItems.length > 0 ? (
        <Card
          title={t('cv.cvContent')}
          extra={
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={onEdit}
              size={isMobile ? 'small' : 'middle'}
              style={{ padding: isMobile ? `0 ${Spacing.sm}` : Spacing.lg1 }}
            >
              {isMobile ? t('common.edit', 'Editar') : t('cv.editCV')}
            </Button>
          }
        >
          <Tabs items={tabItems} />
        </Card>
      ) : (
        <Card>
          <Alert
            type="warning"
            showIcon
            message={t('cv.noLocaleVersion')}
            action={
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={onEdit}
                size={isMobile ? 'small' : 'middle'}
                style={{ padding: isMobile ? `0 ${Spacing.sm}` : Spacing.lg1 }}
              >
                {isMobile ? t('common.edit', 'Editar') : t('cv.editCV')}
              </Button>
            }
          />
        </Card>
      )}
    </div>
  )
}
