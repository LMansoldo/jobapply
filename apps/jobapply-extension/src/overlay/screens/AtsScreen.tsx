import { Alert, Input, Tooltip } from 'antd'
import {
  EditOutlined,
  FilePdfOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import type { ATSReport } from '@jobapply/contracts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { RichMarkdownEditor, RichMarkdownEditorSkeleton, type EditorHandle } from '@jobapply/editor'
import { DSButton } from '@jobapply/ui'
import {
  ATSPanel,
  KeywordsPanel,
  PhrasesModal,
  KeywordPhrasesModal,
  SemanticGapsModal,
  TipsModal,
  RemoveSuggestionsModal,
  buildEditorKeywords,
  mapATSReportToPanel
} from '@jobapply/ats-ui'
import { analyzeCV, generateResume } from '../../shared/api'
import { cvToMarkdown, detectLocale } from '../../shared/report'
import { downloadMarkdownAsPdf, type PdfCvMeta } from '../../shared/pdf'
import { getCapturedJob, type StoredAuth } from '../../shared/storage'
import { useCvQuery, useResolvedCvId } from '../../state/cv'
import {
  SetupActions,
  ErrorBar,
  AtsPage,
  AtsWorkspaceAside,
  AtsWorkspaceContainer,
  AtsWorkspaceGrid,
  AtsWorkspaceMain,
  Centered,
  ContextBar,
  ContextCopy,
  ContextDescription,
  ContextEyebrow,
  ContextStatus,
  CvName,
  CvNameStrong,
  CvNameSub,
  DeltaArrow,
  EmptyHint,
  LocaleTag,
  Panel,
  ReportActions,
  ReportActionsBtn,
  ScoreDelta,
  ScoreSkeletonCircle,
  ScoreSkeletonLine,
  ScoreSkeletonPanel,
  SectionTitle,
  StatusDot,
  SuggestionsSurface,
  EditorTabs,
  EditorTab,
  TopActionButton,
} from '../overlay.styles'

interface AtsScreenProps {
  auth: StoredAuth
  onOpenCv: () => void
}

interface ResumeResult {
  scoreBefore: number
  scoreAfter: number
}

export function AtsScreen({ auth, onOpenCv }: AtsScreenProps) {
  const { t } = useTranslation()
  const [jd, setJd] = useState('')
  const [draft, setDraft] = useState<string | null>(null)
  const [report, setReport] = useState<ATSReport | null>(null)
  const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null)
  const [resumeMarkdown, setResumeMarkdown] = useState('')
  const [editorTab, setEditorTab] = useState<'cv' | 'resume'>('cv')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfDownloaded, setPdfDownloaded] = useState(false)
  const [phrasesModalOpen, setPhrasesModalOpen] = useState(false)
  const [keywordPhrasesModalOpen, setKeywordPhrasesModalOpen] = useState(false)
  const [semanticGapsModalOpen, setSemanticGapsModalOpen] = useState(false)
  const [tipsModalOpen, setTipsModalOpen] = useState(false)
  const [removeSuggestionsModalOpen, setRemoveSuggestionsModalOpen] = useState(false)
  const editorRef = useRef<EditorHandle>(null)

  const { cvId, ready } = useResolvedCvId(auth)
  const cvQuery = useCvQuery(cvId)
  const cv = cvQuery.data ?? null

  const cvLoading = !ready || (!!cvId && cvQuery.isLoading)
  const derivedMarkdown = cvLoading ? null : cv ? (cv.markdown ?? cvToMarkdown(cv)) : ''
  const editorMarkdown = draft ?? derivedMarkdown
  const initialLoading = editorMarkdown === null

  useEffect(() => {
    void (async () => {
      const captured = await getCapturedJob()
      if (captured?.jdText) setJd(captured.jdText)
    })()
  }, [])

  useEffect(() => {
    if (cvQuery.isError) {
      setError(cvQuery.error instanceof Error ? cvQuery.error.message : t('extension.loadingCvError'))
    }
  }, [cvQuery.isError, cvQuery.error, t])

  const editorKeywords = useMemo(() => (report ? buildEditorKeywords(report) : undefined), [report])
  const locale = detectLocale(jd)
  const jobTitle = useMemo(() => {
    const firstLine = jd.split('\n').find((line) => line.trim())
    return firstLine?.substring(0, 50) ?? 'untitled'
  }, [jd])

  const handleInsertKeyword = (keyword: string) => {
    editorRef.current?.insertAtCursor(keyword)
  }

  const handleReplaceKeyword = (from: string, to: string) => {
    editorRef.current?.findAndReplace(from, to)
  }

  const validateInputs = (): string | null => {
    if (!jd.trim()) return t('extension.pasteJd')
    if (!editorMarkdown?.trim()) return t('extension.emptyCv')
    return null
  }

  const analyzeMutation = useMutation({
    mutationFn: (input: { markdown: string; jd: string }) => analyzeCV(input.markdown, input.jd, locale),
    onSuccess: (response) => setReport(response.report),
    onError: (err: unknown) => setError(err instanceof Error ? err.message : t('extension.atsAnalysisError')),
  })

  const generateMutation = useMutation({
    mutationFn: (input: { markdown: string; jd: string }) => generateResume(input.markdown, input.jd, locale),
    onSuccess: (response) => {
      setResumeResult({ scoreBefore: response.scoreBefore, scoreAfter: response.scoreAfter })
      setResumeMarkdown(response.resume)
      setEditorTab('resume')
    },
    onError: (err: unknown) => setError(err instanceof Error ? err.message : t('extension.resumeError')),
  })

  const handleAnalyze = () => {
    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    analyzeMutation.mutate({ markdown: editorMarkdown as string, jd })
  }

  const handleGenerate = () => {
    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    generateMutation.mutate({ markdown: editorMarkdown as string, jd })
  }

  const handleCopyResume = async () => {
    try {
      await navigator.clipboard.writeText(resumeMarkdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const exportPdf = async (content: string) => {
    if (!content.trim()) {
      setError(t('extension.noContentToExport'))
      return
    }
    const cvMeta: PdfCvMeta = cv ?? {
      fullName: auth.user.name || 'CV',
      email: auth.user.email,
    }
    setPdfGenerating(true)
    setPdfDownloaded(false)
    try {
      await downloadMarkdownAsPdf(content, cvMeta, locale, jobTitle)
      setPdfDownloaded(true)
      setTimeout(() => setPdfDownloaded(false), 2500)
    } catch {
      setError(t('extension.pdfError'))
    } finally {
      setPdfGenerating(false)
    }
  }

  const handleExportPdf = () => exportPdf(resumeMarkdown)
  const handleExportCvPdf = () => exportPdf(editorMarkdown as string)

  return (
    <AtsPage>
      <ContextBar>
        <ContextCopy>
          <ContextEyebrow>{t('extension.prepTitle')}</ContextEyebrow>
          <ContextDescription>
            {jd.trim() || t('extension.pasteJdStart')}
          </ContextDescription>
        </ContextCopy>
        <SetupActions>
          <LocaleTag>{t('extension.language')}: {locale}</LocaleTag>
          <Tooltip title={cv ? t('extension.editCv') : t('extension.createCv')}>
            <TopActionButton type="button" aria-label={cv ? t('extension.editCv') : t('extension.createCv')} onClick={onOpenCv}>
              <EditOutlined />
            </TopActionButton>
          </Tooltip>
          <Tooltip title={t('extension.analyze')}>
            <TopActionButton type="button" aria-label={t('extension.analyze')} aria-busy={analyzeMutation.isPending} disabled={initialLoading || analyzeMutation.isPending} onClick={handleAnalyze}>
              {analyzeMutation.isPending ? <LoadingOutlined spin /> : <FileSearchOutlined />}
            </TopActionButton>
          </Tooltip>
          <Tooltip title={t('extension.generateResume')}>
            <TopActionButton type="button" aria-label={t('extension.generateResume')} aria-busy={generateMutation.isPending} disabled={initialLoading || generateMutation.isPending} onClick={handleGenerate}>
              {generateMutation.isPending ? <LoadingOutlined spin /> : <FileTextOutlined />}
            </TopActionButton>
          </Tooltip>
          <Tooltip title={pdfDownloaded ? t('extension.pdfDownloaded') : t('extension.exportPdf')}>
            <TopActionButton type="button" aria-label={t('extension.exportPdf')} aria-busy={pdfGenerating} disabled={initialLoading || pdfGenerating || !editorMarkdown?.trim()} onClick={handleExportCvPdf}>
              {pdfGenerating ? <LoadingOutlined spin /> : <FilePdfOutlined />}
            </TopActionButton>
          </Tooltip>
        </SetupActions>
        <ContextStatus>
          <StatusDot />
          {report ? t('extension.analysisComplete') : t('extension.readyToAnalyze')}
        </ContextStatus>
      </ContextBar>

      {error && (
        <ErrorBar>
          <Alert type="error" showIcon closable message={error} onClose={() => setError(null)} />
        </ErrorBar>
      )}
      <AtsWorkspaceContainer>
        <AtsWorkspaceGrid>
          <AtsWorkspaceMain>
            <Panel>
              <SectionTitle>{t('extension.cvEditor')}</SectionTitle>
              {resumeResult && (
                <EditorTabs>
                  <EditorTab type="button" $active={editorTab === 'cv'} onClick={() => setEditorTab('cv')}>
                    {t('extension.tabCv')}
                  </EditorTab>
                  <EditorTab type="button" $active={editorTab === 'resume'} onClick={() => setEditorTab('resume')}>
                    {t('extension.tabResume')}
                  </EditorTab>
                </EditorTabs>
              )}
              {initialLoading ? (
                <RichMarkdownEditorSkeleton height={600} />
              ) : (
                <>
                  {editorTab === 'resume' && resumeResult && (
                    <ScoreDelta>
                      <span>
                        {t('extension.score')} <strong>{resumeResult.scoreBefore}</strong>
                      </span>
                      <DeltaArrow>→</DeltaArrow>
                      <span>
                        {t('extension.score')} <strong>{resumeResult.scoreAfter}</strong>
                      </span>
                      <DSButton variant="ghost" onClick={handleCopyResume}>
                        {copied ? t('extension.copied') : t('extension.copyMarkdown')}
                      </DSButton>
                      <DSButton variant="ghost" loading={pdfGenerating} onClick={handleExportPdf}>
                        {pdfDownloaded ? t('extension.pdfDownloaded') : t('extension.exportPdf')}
                      </DSButton>
                    </ScoreDelta>
                  )}
                  <RichMarkdownEditor
                    ref={editorRef}
                    value={(editorTab === 'resume' && resumeResult ? resumeMarkdown : editorMarkdown) as string}
                    onChange={(md) =>
                      editorTab === 'resume' && resumeResult
                        ? setResumeMarkdown(md)
                        : setDraft(md)
                    }
                    editorKeywords={editorKeywords}
                    layout="split"
                    height={600}
                  />
                </>
              )}
            </Panel>

          </AtsWorkspaceMain>

          <AtsWorkspaceAside>
            {initialLoading || analyzeMutation.isPending ? (
              <ScoreSkeletonPanel>
                <ScoreSkeletonCircle />
                <ScoreSkeletonLine $width="72%" />
                <ScoreSkeletonLine $width="88%" />
                <ScoreSkeletonLine $width="64%" />
              </ScoreSkeletonPanel>
            ) : report ? (
              <>
                <ATSPanel {...mapATSReportToPanel(report)} keywords={[]} />
                <Panel>
                  <SectionTitle>{t('extension.analysisDetails')}</SectionTitle>
                  <ReportActions>
                    <ReportActionsBtn type="button" onClick={() => setTipsModalOpen(true)}>
                      {t('tailoring.atsTips')}
                    </ReportActionsBtn>
                    <ReportActionsBtn type="button" onClick={() => setSemanticGapsModalOpen(true)}>
                      {t('tailoring.semanticGaps')}
                    </ReportActionsBtn>
                    <ReportActionsBtn type="button" onClick={() => setPhrasesModalOpen(true)}>
                      {t('tailoring.phrasesToChange')}
                    </ReportActionsBtn>
                    <ReportActionsBtn type="button" onClick={() => setKeywordPhrasesModalOpen(true)}>
                      {t('tailoring.keywordPhrases')}
                    </ReportActionsBtn>
                    <ReportActionsBtn type="button" onClick={() => setRemoveSuggestionsModalOpen(true)}>
                      {t('tailoring.removeFromCV')}
                    </ReportActionsBtn>
                  </ReportActions>
                </Panel>
              </>
            ) : (
              <Panel>
                <SectionTitle>{t('extension.atsResult')}</SectionTitle>
                <EmptyHint>{t('extension.runAnalysisHint')}</EmptyHint>
              </Panel>
            )}
          </AtsWorkspaceAside>
        </AtsWorkspaceGrid>
      </AtsWorkspaceContainer>

      <PhrasesModal
        open={phrasesModalOpen}
        onClose={() => setPhrasesModalOpen(false)}
        editorKeywords={editorKeywords}
        onReplaceKeyword={handleReplaceKeyword}
      />
      <KeywordPhrasesModal
        open={keywordPhrasesModalOpen}
        onClose={() => setKeywordPhrasesModalOpen(false)}
        phrases={editorKeywords?.keywordPhrases}
      />
      <SemanticGapsModal
        open={semanticGapsModalOpen}
        onClose={() => setSemanticGapsModalOpen(false)}
        gaps={editorKeywords?.semanticGaps}
      />
      <TipsModal
        open={tipsModalOpen}
        onClose={() => setTipsModalOpen(false)}
        tips={editorKeywords?.tips}
      />
      <RemoveSuggestionsModal
        open={removeSuggestionsModalOpen}
        onClose={() => setRemoveSuggestionsModalOpen(false)}
        suggestions={editorKeywords?.removeSuggestions}
      />
    </AtsPage>
  )
}
