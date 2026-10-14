import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Typography, List, Tag } from 'antd'
import type { GenerationOutput } from '../../../domain/linkedin/types'
import * as styles from './LinkedInOptimizerPage.styles'

const { Title, Text } = Typography

type Props = { generation: GenerationOutput }

export function GenerationResults({ generation }: Props) {
  const { t } = useTranslation()

  return (
    <div>
      <Title level={3}>{t("linkedin.results.title")}</Title>

      <styles.ResultCard title="Headline">
        <Tag color={generation.headlineAnalysis.currentScore === 'strong' ? 'green' : generation.headlineAnalysis.currentScore === 'moderate' ? 'orange' : 'red'}>
          {generation.headlineAnalysis.currentScore}
        </Tag>
        <List
          dataSource={generation.headlineAnalysis.alternatives}
          renderItem={alt => <List.Item><Text copyable>{alt}</Text></List.Item>}
        />
      </styles.ResultCard>

      <styles.ResultCard title={t("linkedin.results.about")}>
        {generation.aboutAudit.issues.length > 0 && (
          <styles.IssueList
            header={<Text strong>{t("linkedin.results.issues")}</Text>}
            dataSource={generation.aboutAudit.issues}
            renderItem={issue => <List.Item><Text type="danger">{issue}</Text></List.Item>}
          />
        )}
        {generation.aboutAudit.rewrite && (
          <styles.PreWrapParagraph copyable>
            {generation.aboutAudit.rewrite}
          </styles.PreWrapParagraph>
        )}
      </styles.ResultCard>

      {generation.experienceGaps.length > 0 && (
        <styles.ResultCard title={t("linkedin.results.experience")}>
          {generation.experienceGaps.map((gap, i) => (
            <styles.GapItem key={i}>
              <Text strong>{gap.role}</Text>
              <styles.PreWrapParagraph type="secondary">{gap.original}</styles.PreWrapParagraph>
              <styles.PreWrapParagraph copyable>{gap.rewrite}</styles.PreWrapParagraph>
            </styles.GapItem>
          ))}
        </styles.ResultCard>
      )}

      {generation.quickWins.length > 0 && (
        <Card title={t("linkedin.results.quickWins")}>
          <List
            dataSource={generation.quickWins}
            renderItem={win => <List.Item><Text>{win}</Text></List.Item>}
          />
        </Card>
      )}
    </div>
  )
}
