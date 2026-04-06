/**
 * @file JobDetail.tsx
 * @description JobDetail component — full detail view of a selected job.
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import {
  DeleteOutlined,
  ThunderboltOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { JobDetailProps } from './JobDetail.types'
import { jobDetailStyles } from './JobDetail.styles'
import { STATUS_COLOR, STATUS_LABEL } from '../../constants'
import { stringToColor } from '../../helpers'
import { Avatar } from '../../../../components/Avatar'
import { Badge } from '../../../../components/Badge'
import { Button } from '../../../../components/Button'
import { Divider } from '../../../../components/Divider'
import { Popconfirm } from '../../../../components/Popconfirm'
import { Space } from '../../../../components/Space'
import { Tag } from '../../../../components/Tag'
import { Tooltip } from '../../../../components/Tooltip'
import { Title, Text, Paragraph } from '../../../../components/Typography'
import { Colors } from '../../../../styles/theme/colors'
import { Spacing } from '../../../../styles/theme/spacing'
import { FontSize } from '../../../../styles/theme/typography'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

/**
 * Displays full details of a job including description, tailored description, and actions.
 * @param props - JobDetailProps
 */
export function JobDetail({ job, deletingId, tailoringId, onDelete, onTailor }: JobDetailProps) {
  const { t } = useTranslation()

  return (
    <div style={jobDetailStyles.container}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md1 }}>
        <div style={{ display: 'flex', gap: Spacing.md1, alignItems: 'center' }}>
          <Avatar
            size={48}
            style={{ background: stringToColor(job.company), fontWeight: 700, fontSize: FontSize.xl }}
          >
            {job.company[0].toUpperCase()}
          </Avatar>
          <Text strong style={{ fontSize: FontSize.md2 }}>
            {job.company}
          </Text>
        </div>
        <Space>
          {job.url && (
            <Tooltip title={t('jobs.viewDetails')}>
              <Button icon={<LinkOutlined />} href={job.url} target="_blank" />
            </Tooltip>
          )}
          <Popconfirm
            title={t('jobs.deleteJob')}
            description={t('jobs.deleteCVConfirm', t('jobs.deleteJobConfirm'))}
            okText={t('common.delete')}
            okButtonProps={{ danger: true }}
            cancelText={t('common.cancel')}
            onConfirm={() => onDelete(job._id)}
          >
            <Button icon={<DeleteOutlined />} danger loading={deletingId === job._id} />
          </Popconfirm>
        </Space>
      </div>

      {/* Title */}
      <Title level={3} style={{ margin: `0 0 ${Spacing.sm}`, lineHeight: '1.3' }}>
        {job.title}
      </Title>

      {/* Meta */}
      <Space size={16} wrap style={{ marginBottom: Spacing.md, color: Colors.textPlaceholder, fontSize: FontSize.md0 }}>
        {job.location && (
          <span>
            <EnvironmentOutlined style={{ marginRight: Spacing.xs }} />
            {job.location}
          </span>
        )}
        <span>
          <CalendarOutlined style={{ marginRight: Spacing.xs }} />
          {dayjs(job.createdAt).fromNow()}
        </span>
        <Badge color={STATUS_COLOR[job.status]} text={STATUS_LABEL[job.status]} />
        {job.salary && <Tag color={Colors.gold}>{job.salary}</Tag>}
      </Space>

      {/* Tags */}
      {job.tags.length > 0 && (
        <Space size={6} wrap style={{ marginBottom: Spacing.lg1 }}>
          {job.tags.map((tag) => (
            <Tag key={tag} style={{ borderRadius: 100, padding: `${Spacing.xxs} ${Spacing.md1}` }}>
              {tag}
            </Tag>
          ))}
        </Space>
      )}

      {/* Tailor */}
      <div style={{ marginBottom: Spacing.lg }}>
        <Button
          type={job.tailoredDescription ? 'default' : 'primary'}
          icon={<ThunderboltOutlined />}
          loading={tailoringId === job._id}
          onClick={() => onTailor(job)}
        >
          {job.tailoredDescription ? t('jobs.retailor', 'Re-tailor Descrição') : t('jobs.tailorJob')}
        </Button>
      </div>

      <Divider style={{ margin: `0 0 ${Spacing.lg1}` }} />

      {/* Description */}
      {job.tailoredDescription && (
        <>
          <Text strong style={{ fontSize: FontSize.md }}>
            {t('jobs.tailoredDesc', 'Descrição Adaptada (Tailor)')}
          </Text>
          <Paragraph style={jobDetailStyles.tailoredBlock}>
            {job.tailoredDescription}
          </Paragraph>
          <Text strong style={{ fontSize: FontSize.md }}>
            {t('jobs.originalDesc', 'Descrição Original')}
          </Text>
        </>
      )}
      {!job.tailoredDescription && (
        <Text strong style={{ fontSize: FontSize.md }}>
          {t('jobs.aboutJob', 'Sobre a vaga')}
        </Text>
      )}
      <Paragraph style={jobDetailStyles.descriptionBlock}>
        {job.description}
      </Paragraph>
    </div>
  )
}
