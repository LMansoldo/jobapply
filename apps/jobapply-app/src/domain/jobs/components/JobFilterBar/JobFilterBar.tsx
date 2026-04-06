/**
 * @file JobFilterBar.tsx
 * @description JobFilterBar component — search and filter controls for the jobs list.
 */
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { JobFilterBarProps } from './JobFilterBar.types'
import { jobFilterBarStyles } from './JobFilterBar.styles'
import type { JobFilters } from '../../types'
import { Row } from '../../../../components/Row'
import { Col } from '../../../../components/Col'
import { Input } from '../../../../components/Input'
import { Select } from '../../../../components/Select'
import { Button } from '../../../../components/Button'
import { Tooltip } from '../../../../components/Tooltip'

/**
 * Filter bar for the jobs list page with search, company, and status filters.
 * @param props - JobFilterBarProps
 */
export function JobFilterBar({ onFilterChange, onReload }: JobFilterBarProps) {
  const { t } = useTranslation()

  return (
    <div style={jobFilterBarStyles.container}>
      <Row gutter={[12, 8]} align="middle">
        <Col flex="1">
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('jobs.search')}
            allowClear
            onChange={(e) => onFilterChange('title', e.target.value)}
          />
        </Col>
        <Col xs={24} sm={8} md={5}>
          <Input
            placeholder={t('jobs.company')}
            allowClear
            onChange={(e) => onFilterChange('company', e.target.value)}
          />
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Select
            placeholder={t('jobs.status')}
            allowClear
            style={{ width: '100%' }}
            options={[
              { label: t('jobs.open'), value: 'open' },
              { label: t('jobs.closed'), value: 'closed' },
              { label: t('jobs.applied'), value: 'applied' },
            ]}
            onChange={(v) => onFilterChange('status', (v as JobFilters['status']) ?? '')}
          />
        </Col>
        <Col>
          <Tooltip title={t('common.reload', 'Recarregar')}>
            <Button icon={<ReloadOutlined />} onClick={onReload} />
          </Tooltip>
        </Col>
      </Row>
    </div>
  )
}
