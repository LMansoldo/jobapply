import React from 'react'
import { Card, Row, Col, Typography, Progress, Tag, List } from 'antd'
import type { LinkedInResult } from '../../../domain/linkedin/types'

const { Title, Text } = Typography

type Props = { seo: LinkedInResult['seo'] }

function scoreColor(score: number): string {
  if (score >= 70) return '#52c41a'
  if (score >= 40) return '#faad14'
  return '#f5222d'
}

export function Dashboard({ seo }: Props) {
  const { before, after, delta } = seo

  return (
    <div style={{ marginBottom: 32 }}>
      <Title level={3}>Dashboard SEO</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card title="Score antes">
            <Progress
              type="circle"
              percent={before.overall_score}
              strokeColor={scoreColor(before.overall_score)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title={`Score após (+${delta} pts)`}>
            <Progress
              type="circle"
              percent={after.overall_score}
              strokeColor={scoreColor(after.overall_score)}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Dimensões" style={{ marginTop: 16 }}>
        {(['keyword_density_score', 'completeness_score', 'specificity_score', 'role_alignment_score', 'authority_score'] as const).map(key => (
          <div key={key} style={{ marginBottom: 8 }}>
            <Text>{key.replace(/_score$/, '').replace(/_/g, ' ')}</Text>
            <Progress percent={before[key]} strokeColor={scoreColor(before[key])} />
          </div>
        ))}
      </Card>

      {before.action_items.length > 0 && (
        <Card title="Plano de ação" style={{ marginTop: 16 }}>
          <List
            dataSource={before.action_items}
            renderItem={item => (
              <List.Item>
                <Tag color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'default'}>
                  {item.priority}
                </Tag>
                <div>
                  <Text strong>{item.action}</Text>
                  <br />
                  <Text type="secondary">{item.reason}</Text>
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  )
}
