import React from 'react'
import { Card, Typography, List, Tag } from 'antd'
import type { GenerationOutput } from '../../../domain/linkedin/types'

const { Title, Text, Paragraph } = Typography

type Props = { generation: GenerationOutput }

export function GenerationResults({ generation }: Props) {
  return (
    <div>
      <Title level={3}>Resultados gerados</Title>

      <Card title="Headline" style={{ marginBottom: 16 }}>
        <Tag color={generation.headlineAnalysis.currentScore === 'strong' ? 'green' : generation.headlineAnalysis.currentScore === 'moderate' ? 'orange' : 'red'}>
          {generation.headlineAnalysis.currentScore}
        </Tag>
        <List
          dataSource={generation.headlineAnalysis.alternatives}
          renderItem={alt => <List.Item><Text copyable>{alt}</Text></List.Item>}
        />
      </Card>

      <Card title="Sobre" style={{ marginBottom: 16 }}>
        {generation.aboutAudit.issues.length > 0 && (
          <List
            header={<Text strong>Problemas encontrados</Text>}
            dataSource={generation.aboutAudit.issues}
            renderItem={issue => <List.Item><Text type="danger">{issue}</Text></List.Item>}
            style={{ marginBottom: 16 }}
          />
        )}
        {generation.aboutAudit.rewrite && (
          <Paragraph copyable style={{ whiteSpace: 'pre-wrap' }}>
            {generation.aboutAudit.rewrite}
          </Paragraph>
        )}
      </Card>

      {generation.experienceGaps.length > 0 && (
        <Card title="Experiências" style={{ marginBottom: 16 }}>
          {generation.experienceGaps.map((gap, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <Text strong>{gap.role}</Text>
              <Paragraph type="secondary" style={{ whiteSpace: 'pre-wrap' }}>{gap.original}</Paragraph>
              <Paragraph copyable style={{ whiteSpace: 'pre-wrap' }}>{gap.rewrite}</Paragraph>
            </div>
          ))}
        </Card>
      )}

      {generation.quickWins.length > 0 && (
        <Card title="Quick wins">
          <List
            dataSource={generation.quickWins}
            renderItem={win => <List.Item><Text>{win}</Text></List.Item>}
          />
        </Card>
      )}
    </div>
  )
}
