import { useRef, useState } from 'react'
import { FileOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import * as S from './PDFUploadPanel.styles'

interface PDFUploadPanelProps {
  onAnalyze: (file: File) => Promise<void>
  headlineKey?: string
  subtextKey?: string
  dragLabelKey?: string
  analyzeLabelKey?: string
}

const TUTORIAL_STEPS = ['1', '2', '3'] as const

export function PDFUploadPanel({
  onAnalyze,
  headlineKey = 'tailoring.linkedinTitle',
  subtextKey = 'tailoring.linkedinSubtitle',
  dragLabelKey = 'tailoring.linkedinPDFDrop',
  analyzeLabelKey = 'tailoring.linkedinAnalyzeNow',
}: PDFUploadPanelProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') setFile(dropped)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0]
    if (chosen) setFile(chosen)
  }

  return (
    <S.Root>
      <S.Inner>
        <S.Header>
          <S.Title>{t(headlineKey)}</S.Title>
          <S.Subtitle>{t(subtextKey)}</S.Subtitle>
        </S.Header>

        <S.Tutorial>
          <S.TutorialTitle>{t('tailoring.onboarding.tutorialTitle')}</S.TutorialTitle>
          <S.Steps>
            {TUTORIAL_STEPS.map((n) => (
              <S.Step key={n}>
                <S.StepNumber>{n}</S.StepNumber>
                <S.StepContent>
                  <S.StepTitle>{t(`tailoring.onboarding.step${n}Title`)}</S.StepTitle>
                  <S.StepDesc>{t(`tailoring.onboarding.step${n}Desc`)}</S.StepDesc>
                </S.StepContent>
              </S.Step>
            ))}
          </S.Steps>
        </S.Tutorial>

        <S.Dropzone
          $active={dragging}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <S.DropIcon />
          <S.DropText>{t(dragLabelKey)}</S.DropText>
          <S.HiddenInput
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
          />
        </S.Dropzone>

        {file && (
          <S.FileChosen>
            <S.FileSuccessIcon />
            <FileOutlined />
            <S.FileName>{file.name}</S.FileName>
          </S.FileChosen>
        )}

        <S.AnalyzeBtn
          type="button"
          disabled={!file}
          onClick={() => file && onAnalyze(file)}
        >
          {t(analyzeLabelKey)}
        </S.AnalyzeBtn>
      </S.Inner>
    </S.Root>
  )
}
