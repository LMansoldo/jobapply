/**
 * @file useTailoringWorkspace.ts
 * @description Manages all operations for the CV tailoring workspace.
 * Loads the CV directly (no tailor endpoint), supports locale selection dialog,
 * and owns ATS analysis, cover letter and video script loading states.
 * Supports both job-based and manual job description modes.
 *
 * ATS analysis uses TanStack Query (staleTime 30min — no re-dispatch without locale/desc change).
 * Cover letter, video script, interview prep and re-analyze use useMutation (on-demand).
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { Job } from '../../jobs/types'
import type { ATSReport, InterviewPrep } from '../types'
import { localeVersionToMarkdown } from '../helpers'
import { prependObjectiveSection } from '../tailoringHelpers'
import {
  getCV,
  analyzeCV,
  generateCoverLetter,
  generateVideoScript,
  generateInterviewPrep,
} from '../../../infrastructure/repositories/cvRepository'

export interface TailoringWorkspaceState {
  tailoredContent: string
  setTailoredContent: (value: string) => void
  tailoring: boolean
  chosenLocale: 'en' | 'pt-BR' | null
  atsReport: ATSReport | null
  atsLoading: boolean
  coverContent: string
  setCoverContent: (value: string) => void
  coverLoading: boolean
  videoContent: string
  setVideoContent: (value: string) => void
  videoLoading: boolean
  interviewPrep: InterviewPrep | null
  interviewPrepLoading: boolean
  handleReanalyze: () => Promise<void>
  handleGenerateCoverLetter: () => Promise<void>
  handleGenerateVideoScript: () => Promise<void>
  handleGenerateInterviewPrep: () => Promise<void>
}

export interface WorkspaceSetupResult {
  locale: 'en' | 'pt-BR'
  jobDescription: string
}

interface Params {
  cvId: string
  job: Job | null
  /** When true, triggers setup flow even without a job (manual description mode) */
  manualMode?: boolean
  onError: (messageKey: string) => void
  onNeedSetup: (locales: ('en' | 'pt-BR')[], initialJobDescription: string) => Promise<WorkspaceSetupResult>
}

export function useTailoringWorkspace({
  cvId,
  job,
  manualMode,
  onError,
  onNeedSetup,
}: Params): TailoringWorkspaceState {
  const onErrorRef = useRef(onError)
  const onNeedSetupRef = useRef(onNeedSetup)
  useEffect(() => { onErrorRef.current = onError })
  useEffect(() => { onNeedSetupRef.current = onNeedSetup })

  const [tailoredContent, setTailoredContent] = useState('')
  const [tailoring, setTailoring] = useState(false)
  const [chosenLocale, setChosenLocale] = useState<'en' | 'pt-BR' | null>(null)
  const [editedJobDescription, setEditedJobDescription] = useState<string | null>(null)
  const [detectedLocale, setDetectedLocale] = useState<'en' | 'pt-BR'>('pt-BR')
  const [coverContent, setCoverContent] = useState('')
  const [videoContent, setVideoContent] = useState('')
  const [interviewPrepData, setInterviewPrepData] = useState<InterviewPrep | null>(null)

  // Prevents setup from running twice if job or cvId re-renders before resolution
  const setupInitiatedRef = useRef(false)

  // Trigger: job-based mode (has job) or manual mode (no job, manualMode=true)
  const shouldInit = cvId && (job || manualMode) && !setupInitiatedRef.current

  useEffect(() => {
    if (!shouldInit) return
    setupInitiatedRef.current = true
    setTailoring(true)
    getCV(cvId)
      .then(async (cv) => {
        const versions = cv.localeVersions ?? []
        if (versions.length === 0) return

        const locales = versions.map((v) => v.locale) as ('en' | 'pt-BR')[]
        const initialDesc = job?.description ?? ''
        const { locale, jobDescription } = await onNeedSetupRef.current(locales, initialDesc)

        const version = versions.find((v) => v.locale === locale)
        if (version) {
          const raw = localeVersionToMarkdown(version, cv.languages)
          setTailoredContent(prependObjectiveSection(raw, locale, job?.title ?? ''))
        }
        setChosenLocale(locale)
        setEditedJobDescription(jobDescription)
      })
      .catch(() => onErrorRef.current('tailoring.loadCVError'))
      .finally(() => setTailoring(false))
  }, [cvId, job, shouldInit])

  // ── ATS analysis — useQuery: auto re-runs when locale/description change ─
  const atsEnabled = !!(
    cvId &&
    chosenLocale &&
    editedJobDescription !== null &&
    editedJobDescription.trim() &&
    (job || manualMode)
  )

  const atsQuery = useQuery({
    queryKey: ['atsReport', cvId, chosenLocale, editedJobDescription, job?._id ?? null],
    queryFn: () => analyzeCV(cvId, job?._id, chosenLocale!, editedJobDescription!),
    enabled: atsEnabled,
    staleTime: 30 * 60 * 1000,
  })

  useEffect(() => {
    if (atsQuery.isError) onErrorRef.current('tailoring.analysisError')
  }, [atsQuery.isError])

  useEffect(() => {
    if (atsQuery.data) setDetectedLocale(atsQuery.data.locale)
  }, [atsQuery.data])

  // ── On-demand mutations ──────────────────────────────────────────────────
  const reanalyzeMutation = useMutation({
    mutationFn: () => analyzeCV(cvId, job?._id, chosenLocale!, editedJobDescription!),
    onSuccess: (result) => setDetectedLocale(result.locale),
    onError: () => onErrorRef.current('tailoring.analysisError'),
  })

  const coverMutation = useMutation({
    mutationFn: () => generateCoverLetter(cvId, job?._id, detectedLocale),
    onSuccess: (result) => setCoverContent(result.coverLetter),
    onError: () => onErrorRef.current('tailoring.coverError'),
  })

  const videoMutation = useMutation({
    mutationFn: () => generateVideoScript(cvId, job?._id, detectedLocale),
    onSuccess: (result) => setVideoContent(result.script),
    onError: () => onErrorRef.current('tailoring.videoError'),
  })

  const interviewMutation = useMutation({
    mutationFn: () =>
      generateInterviewPrep(cvId, job?._id, detectedLocale, editedJobDescription ?? undefined),
    onSuccess: (result) => setInterviewPrepData(result.interviewPrep),
    onError: () => onErrorRef.current('tailoring.interviewError'),
  })

  const handleReanalyze = useCallback(async () => {
    if (!atsEnabled) return
    await reanalyzeMutation.mutateAsync()
  }, [atsEnabled, reanalyzeMutation])

  const handleGenerateCoverLetter = useCallback(async () => {
    if (!cvId || (!job && !manualMode)) return
    await coverMutation.mutateAsync()
  }, [cvId, job, manualMode, coverMutation])

  const handleGenerateVideoScript = useCallback(async () => {
    if (!cvId || (!job && !manualMode)) return
    await videoMutation.mutateAsync()
  }, [cvId, job, manualMode, videoMutation])

  const handleGenerateInterviewPrep = useCallback(async () => {
    if (!cvId || (!job && !manualMode)) return
    await interviewMutation.mutateAsync()
  }, [cvId, job, manualMode, interviewMutation])

  return {
    tailoredContent,
    setTailoredContent,
    tailoring,
    chosenLocale,
    atsReport: atsQuery.data?.report ?? reanalyzeMutation.data?.report ?? null,
    atsLoading: atsQuery.isFetching || reanalyzeMutation.isPending,
    coverContent,
    setCoverContent,
    coverLoading: coverMutation.isPending,
    videoContent,
    setVideoContent,
    videoLoading: videoMutation.isPending,
    interviewPrep: interviewPrepData,
    interviewPrepLoading: interviewMutation.isPending,
    handleReanalyze,
    handleGenerateCoverLetter,
    handleGenerateVideoScript,
    handleGenerateInterviewPrep,
  }
}
