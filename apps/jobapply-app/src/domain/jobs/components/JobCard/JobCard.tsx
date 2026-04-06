/**
 * @file JobCard.tsx
 * @description JobCard component — displays a summary of a job in the list panel.
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import type { JobCardProps } from './JobCard.types'
import { jobCardStyles } from './JobCard.styles'
import { STATUS_COLOR, STATUS_LABEL } from '../../constants'
import { stringToColor } from '../../helpers'
import { Avatar } from '../../../../components/Avatar'
import { Badge } from '../../../../components/Badge'
import { Tag } from '../../../../components/Tag'
import { Text } from '../../../../components/Typography'
import { Space } from '../../../../components/Space'
import { Spacing } from '../../../../styles/theme/spacing'
import { FontSize } from '../../../../styles/theme/typography'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

/**
 * Displays a compact job entry for use in a scrollable job list.
 * @param props - JobCardProps
 */
export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  return (
    <div
      onClick={() => onClick(job)}
      style={isSelected ? jobCardStyles.cardSelected : jobCardStyles.cardDefault}
    >
      <div style={{ display: 'flex', gap: Spacing.md1, alignItems: 'flex-start' }}>
        <Avatar
          size={44}
          style={{ background: stringToColor(job.company), flexShrink: 0, fontWeight: 700, fontSize: FontSize.lg }}
        >
          {job.company[0].toUpperCase()}
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={jobCardStyles.titleText}>{job.title}</div>
          <div style={jobCardStyles.companyText}>{job.company}</div>
          {job.location && (
            <div style={jobCardStyles.locationText}>{job.location}</div>
          )}
          <div style={{ marginTop: Spacing.sm2, display: 'flex', gap: Spacing.sm2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge
              color={STATUS_COLOR[job.status]}
              text={<span style={{ fontSize: FontSize.xs }}>{STATUS_LABEL[job.status]}</span>}
            />
            {job.tags.slice(0, 2).map((t) => (
              <Tag key={t} style={{ fontSize: FontSize.xs, margin: 0, padding: `0 ${Spacing.sm2}` }}>
                {t}
              </Tag>
            ))}
            {job.tags.length > 2 && (
              <Text type="secondary" style={{ fontSize: FontSize.xs }}>
                +{job.tags.length - 2}
              </Text>
            )}
          </div>
        </div>
      </div>
      <div style={jobCardStyles.timestamp}>
        {dayjs(job.createdAt).fromNow()}
      </div>
    </div>
  )
}

