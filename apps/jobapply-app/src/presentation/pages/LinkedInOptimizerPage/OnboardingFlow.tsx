import React from 'react'
import { Steps, Button, Input, Upload, Typography, Space, Tag } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { useLinkedInOnboarding } from '../../../domain/linkedin/hooks/useLinkedInOnboarding'
import { parsePDFToLinkedInProfile } from '../../../domain/linkedin/pdfParser'

const { Title, Paragraph } = Typography

const POSITIONING_OPTIONS = ['executor', 'estrategista', 'líder', 'técnico', 'visionário']

type OnboardingProps = {
  onboarding: ReturnType<typeof useLinkedInOnboarding>
  onSubmit: () => void
}

export function OnboardingFlow({ onboarding, onSubmit }: OnboardingProps) {
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
    { title: 'Perfil' },
    { title: 'Cargo alvo' },
    { title: 'Posicionamento' },
    { title: 'Evidência' },
    { title: 'Vaga' },
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

  function togglePositioning(opt: string) {
    setPositioning(prev =>
      prev.includes(opt) ? prev.filter(p => p !== opt) : [...prev, opt]
    )
  }

  const anchorValid = metric.trim() && timeframe.trim() && action.trim()

  return (
    <div>
      <Steps current={state.step} items={steps} style={{ marginBottom: 32 }} />

      {state.step === 0 && (
        <div>
          <Title level={4}>Faça upload do seu perfil LinkedIn em PDF</Title>
          <Upload
            accept=".pdf"
            showUploadList={false}
            beforeUpload={handleFileUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Selecionar PDF
            </Button>
          </Upload>
        </div>
      )}

      {state.step === 1 && (
        <div>
          <Title level={4}>Qual é o seu cargo alvo?</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Ex: Senior Frontend Engineer"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            />
            <Input
              placeholder="Setor (ex: fintech, saúde, SaaS)"
              value={targetSector}
              onChange={e => setTargetSector(e.target.value)}
            />
            <Space>
              <Button onClick={goBack}>Voltar</Button>
              <Button
                type="primary"
                disabled={!targetRole.trim()}
                onClick={() => setStep1(targetRole.trim(), targetSector.trim() ? [targetSector.trim()] : [])}
              >
                Continuar
              </Button>
            </Space>
          </Space>
        </div>
      )}

      {state.step === 2 && (
        <div>
          <Title level={4}>Como você se posiciona?</Title>
          <Paragraph>Selecione um ou mais arquétipos:</Paragraph>
          <Space wrap style={{ marginBottom: 16 }}>
            {POSITIONING_OPTIONS.map(opt => (
              <Tag.CheckableTag
                key={opt}
                checked={positioning.includes(opt)}
                onChange={() => togglePositioning(opt)}
              >
                {opt}
              </Tag.CheckableTag>
            ))}
          </Space>
          <Space>
            <Button onClick={goBack}>Voltar</Button>
            <Button type="primary" onClick={() => setStep2(positioning)}>
              Continuar
            </Button>
          </Space>
        </div>
      )}

      {state.step === 3 && (
        <div>
          <Title level={4}>Qual é sua evidência âncora?</Title>
          <Paragraph>Um resultado concreto que define sua carreira.</Paragraph>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Métrica (ex: 40% de redução de latência)"
              value={metric}
              onChange={e => setMetric(e.target.value)}
            />
            <Input
              placeholder="Prazo (ex: em 3 meses)"
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
            />
            <Input
              placeholder="Ação (ex: migração da infraestrutura de pagamentos)"
              value={action}
              onChange={e => setAction(e.target.value)}
            />
            <Space>
              <Button onClick={goBack}>Voltar</Button>
              <Button
                type="primary"
                disabled={!anchorValid}
                onClick={() => setStep3({ metric: metric.trim(), timeframe: timeframe.trim(), action: action.trim() })}
              >
                Continuar
              </Button>
            </Space>
          </Space>
        </div>
      )}

      {state.step === 4 && (
        <div>
          <Title level={4}>Tem uma vaga em mente? (opcional)</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input.TextArea
              rows={6}
              placeholder="Cole a descrição da vaga ou URL aqui..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <Space>
              <Button onClick={goBack}>Voltar</Button>
              <Button
                type="primary"
                onClick={() => { setStep4(jobDescription); onSubmit() }}
              >
                Analisar perfil
              </Button>
            </Space>
          </Space>
        </div>
      )}
    </div>
  )
}
