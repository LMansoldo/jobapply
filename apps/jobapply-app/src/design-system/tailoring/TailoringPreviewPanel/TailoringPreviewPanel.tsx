import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileTextOutlined, SearchOutlined, CopyOutlined } from '@ant-design/icons'
import type { TailoringPreviewPanelProps } from './TailoringPreviewPanel.types'
import * as styles from './TailoringPreviewPanel.styles'

type PreviewTab = 'preview' | 'job'

export function TailoringPreviewPanel({
  markdownContent,
  job,
  currentScore,
  projectedScore,
  scoreDelta,
  onDownloadPDF,
  onExportMarkdown,
  onSaveAsVersion,
}: TailoringPreviewPanelProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<PreviewTab>('preview')

  return (
    <styles.PanelRoot>
      {/* Tabs */}
      <styles.TabBar>
        <styles.TabBtn
          active={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
        >
          <FileTextOutlined /> {t('tailoring.previewCV')}
        </styles.TabBtn>
        <styles.TabBtn
          active={activeTab === 'job'}
          onClick={() => setActiveTab('job')}
        >
          <SearchOutlined /> {t('tailoring.jobDescription')}
        </styles.TabBtn>
      </styles.TabBar>

      {/* Score badge */}
      <styles.ScoreRow>
        <styles.ScoreText>
          {t('tailoring.scoreWithSuggestions')}: <strong>{currentScore} → {projectedScore} pts</strong>
        </styles.ScoreText>
        <styles.ScoreBadge>
          +{scoreDelta} pts
        </styles.ScoreBadge>
      </styles.ScoreRow>

      {/* Tab content */}
      <styles.TabContent>
        {activeTab === 'preview' && (
          <div>
            <styles.PreviewTitle>{t('tailoring.previewCV')}</styles.PreviewTitle>
            {markdownContent ? (
              <styles.MarkdownWrapper>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
              </styles.MarkdownWrapper>
            ) : (
              <styles.PreviewPlaceholder>{t('tailoring.cvPlaceholder')}</styles.PreviewPlaceholder>
            )}
          </div>
        )}
        {activeTab === 'job' && job && (
          <div>
            <styles.JobTitle>{job.title}</styles.JobTitle>
            <styles.JobCompany>
              {job.company} {job.location ? `· ${job.location}` : ''}
            </styles.JobCompany>
            <styles.JobDescription>{job.description}</styles.JobDescription>
          </div>
        )}
      </styles.TabContent>

      {/* Export section */}
      <styles.ExportSection>
        <styles.ExportLabel>{t('tailoring.exportOptimized')}</styles.ExportLabel>
        <styles.ExportBtn primary onClick={onDownloadPDF}>
          <FileTextOutlined /> {t('tailoring.downloadPDF')}
        </styles.ExportBtn>
        <styles.ExportBtn onClick={onExportMarkdown}>
          <FileTextOutlined /> {t('tailoring.exportMarkdown')}
        </styles.ExportBtn>
        <styles.ExportBtn onClick={onSaveAsVersion}>
          <CopyOutlined /> {t('tailoring.saveAsVersion')}
        </styles.ExportBtn>
      </styles.ExportSection>
    </styles.PanelRoot>
  )
}
