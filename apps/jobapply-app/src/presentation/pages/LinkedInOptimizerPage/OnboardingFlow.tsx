import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Upload, Typography, Space, Tag } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { useLinkedInOnboarding } from '../../hooks/useLinkedInOnboarding'
import { parsePDFToLinkedInProfile } from '../../../domain/linkedin/pdfParser'
import * as styles from './LinkedInOptimizerPage.styles'

const { Title, Paragraph } = Typography

const POSITIONING_OPTIONS = [
  { value: 'executor', labelKey: 'linkedin.positioning.executor' },
  { value: 'estrategista', labelKey: 'linkedin.positioning.strategist' },
  { value: 'líder', labelKey: 'linkedin.positioning.leader' },
  { value: 'técnico', labelKey: 'linkedin.positioning.technical' },
  { value: 'visionário', labelKey: 'linkedin.positioning.visionary' },
] as const

type OnboardingProps = {
  onboarding: ReturnType<typeof useLinkedInOnboarding>
  onSubmit: () => void
}

export function OnboardingFlow({ onboarding, onSubmit }: OnboardingProps) {
  const { t } = useTranslation()
  const { state, setProfile, setStep1, setStep2, setStep3, setStep4, goBack } = onboarding
  const [targetRole, setTargetRole] = React.useState('')
  const [targetSector, setTargetSector] = React.useState('')
  const [positioning, setPositioning] = React.useState<string[]>([])
  const [metric, setMetric] = React.useState('')
  const [timeframe, setTimeframe] = React.useState('')
  const [action, setAction] = React.useState('')
  const [jobDescription, setJobDescription] = React.useState('')
  const [uploading, setUploading] = React.useState(false)

  const steps = [
    { title: t('linkedin.onboarding.stepProfile') },
    { title: t('linkedin.onboarding.stepRole') },
    { title: t('linkedin.onboarding.stepPositioning') },
    { title: t('linkedin.onboarding.stepEvidence') },
    { title: t('linkedin.onboarding.stepJob') },
  ]

  async function handleFileUpload(file: File) {
    setUploading(true)
    try {
      const profile = await parsePDFToLinkedInProfile(file)
      setProfile(profile)
    } finally {
      setUploading(false)
    }
    return false
  }

  function togglePositioning(value: string) {
    setPositioning(prev =>
      prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
    )
  }

  const anchorValid = metric.trim() && timeframe.trim() && action.trim()

  return (
    <div>
      <styles.OnboardingSteps current={state.step} items={steps} />

      {state.step === 0 && (
        <div>
          <Title level={4}>{t('linkedin.onboarding.uploadTitle')}</Title>
          <Upload
            accept=".pdf"
            showUploadList={false}
            beforeUpload={handleFileUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              {t('linkedin.onboarding.selectPdf')}
            </Button>
          </Upload>
        </div>
      )}

      {state.step === 1 && (
        <div>
          <Title level={4}>{t('linkedin.onboarding.roleTitle')}</Title>
          <styles.FullWidthSpace direction="vertical">
            <Input
              placeholder={t('linkedin.onboarding.rolePlaceholder')}
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            />
            <Input
              placeholder={t('linkedin.onboarding.sectorPlaceholder')}
              value={targetSector}
              onChange={e => setTargetSector(e.target.value)}
            />
            <Space>
              <Button onClick={goBack}>{t('common.back')}</Button>
              <Button
                type="primary"
                disabled={!targetRole.trim()}
                onClick={() => setStep1(targetRole.trim(), targetSector.trim() ? [targetSector.trim()] : [])}
              >
                {t('common.next')}
              </Button>
            </Space>
          </styles.FullWidthSpace>
        </div>
      )}

      {state.step === 2 && (
        <div>
          <Title level={4}>{t('linkedin.onboarding.positioningTitle')}</Title>
          <Paragraph>{t('linkedin.onboarding.positioningSubtitle')}</Paragraph>
          <styles.TagRowSpace wrap>
            {POSITIONING_OPTIONS.map(opt => (
              <Tag.CheckableTag
                key={opt.value}
                checked={positioning.includes(opt.value)}
                onChange={() => togglePositioning(opt.value)}
              >
                {t(opt.labelKey)}
              </Tag.CheckableTag>
            ))}
          </styles.TagRowSpace>
          <Space>
            <Button onClick={goBack}>{t('common.back')}</Button>
            <Button type="primary" onClick={() => setStep2(positioning)}>
              {t('common.next')}
            </Button>
          </Space>
        </div>
      )}

      {state.step === 3 && (
        <div>
          <Title level={4}>{t('linkedin.onboarding.evidenceTitle')}</Title>
          <Paragraph>{t('linkedin.onboarding.evidenceSubtitle')}</Paragraph>
          <styles.FullWidthSpace direction="vertical">
            <Input
              placeholder={t('linkedin.onboarding.metricPlaceholder')}
              value={metric}
              onChange={e => setMetric(e.target.value)}
            />
            <Input
              placeholder={t('linkedin.onboarding.timeframePlaceholder')}
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
            />
            <Input
              placeholder={t('linkedin.onboarding.actionPlaceholder')}
              value={action}
              onChange={e => setAction(e.target.value)}
            />
            <Space>
              <Button onClick={goBack}>{t('common.back')}</Button>
              <Button
                type="primary"
                disabled={!anchorValid}
                onClick={() => setStep3({ metric: metric.trim(), timeframe: timeframe.trim(), action: action.trim() })}
              >
                {t('common.next')}
              </Button>
            </Space>
          </styles.FullWidthSpace>
        </div>
      )}

      {state.step === 4 && (
        <div>
          <Title level={4}>{t('linkedin.onboarding.jobTitle')} ({t('common.optional')})</Title>
          <styles.FullWidthSpace direction="vertical">
            <Input.TextArea
              rows={6}
              placeholder={t('linkedin.onboarding.jobPlaceholder')}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <Space>
              <Button onClick={goBack}>{t('common.back')}</Button>
              <Button
                type="primary"
                onClick={() => { setStep4(jobDescription); onSubmit() }}
              >
                {t('linkedin.onboarding.analyzeProfile')}
              </Button>
            </Space>
          </styles.FullWidthSpace>
        </div>
      )}
    </div>
  )
}
