import { useRef, useState } from 'react'
import { FileOutlined, InboxOutlined, CheckCircleOutlined } from '@ant-design/icons'
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
    <div className={S.root}>
      <div className={S.inner}>
        <div className={S.header}>
          <h2 className={S.title}>{t(headlineKey)}</h2>
          <p className={S.subtitle}>{t(subtextKey)}</p>
        </div>

        <div className={S.tutorial}>
          <p className={S.tutorialTitle}>{t('tailoring.onboarding.tutorialTitle')}</p>
          <ol className={S.steps}>
            {TUTORIAL_STEPS.map((n) => (
              <li key={n} className={S.step}>
                <span className={S.stepNumber}>{n}</span>
                <div className={S.stepContent}>
                  <span className={S.stepTitle}>{t(`tailoring.onboarding.step${n}Title`)}</span>
                  <span className={S.stepDesc}>{t(`tailoring.onboarding.step${n}Desc`)}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div
          className={dragging ? S.dropzoneActive : S.dropzone}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <InboxOutlined className={S.dropIcon} />
          <p className={S.dropText}>{t(dragLabelKey)}</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
        </div>

        {file && (
          <div className={S.fileChosen}>
            <CheckCircleOutlined className={S.fileSuccessIcon} />
            <FileOutlined />
            <p className={S.fileName}>{file.name}</p>
          </div>
        )}

        <button
          type="button"
          className={S.analyzeBtn}
          disabled={!file}
          onClick={() => file && onAnalyze(file)}
        >
          {t(analyzeLabelKey)}
        </button>
      </div>
    </div>
  )
}
