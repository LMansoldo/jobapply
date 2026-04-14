/**
 * @file useTailoringWorkspace.ts
 * @description Manages all operations for the CV tailoring workspace.
 * Loads the CV directly (no tailor endpoint), supports locale selection dialog,
 * and owns ATS analysis, cover letter and video script loading states.
 * Supports both job-based and manual job description modes.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import type { Job } from '../../jobs/types'
import type { ATSReport } from '../types'
import { localeVersionToMarkdown } from '../helpers'
import {
  getCV,
  analyzeCV,
  generateCoverLetter,
  generateVideoScript,
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
  handleReanalyze: () => Promise<void>
  handleGenerateCoverLetter: () => Promise<void>
  handleGenerateVideoScript: () => Promise<void>
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
  const [atsReport, setAtsReport] = useState<ATSReport | null>(null)
  const [atsLoading, setAtsLoading] = useState(false)
  const [chosenLocale, setChosenLocale] = useState<'en' | 'pt-BR' | null>(null)
  const [editedJobDescription, setEditedJobDescription] = useState<string | null>(null)
  const [detectedLocale, setDetectedLocale] = useState<'en' | 'pt-BR'>('pt-BR')
  const [coverContent, setCoverContent] = useState('')
  const [coverLoading, setCoverLoading] = useState(false)
  const [videoContent, setVideoContent] = useState('')
  const [videoLoading, setVideoLoading] = useState(false)

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
        if (version) setTailoredContent(localeVersionToMarkdown(version, cv.languages))
        setChosenLocale(locale)
        setEditedJobDescription(jobDescription)
      })
      .catch(() => onErrorRef.current('tailoring.loadCVError'))
      .finally(() => setTailoring(false))
  }, [cvId, job, shouldInit])

  // ATS analysis — runs with job (jobId) or in manual mode (jobDescription only)
  useEffect(() => {
    if (!cvId || !chosenLocale || editedJobDescription === null) return
    if (!job && !manualMode) return
    if (!editedJobDescription.trim()) return
    setAtsLoading(true)
    analyzeCV(cvId, job?._id, chosenLocale, editedJobDescription)
      .then((result) => {
        setAtsReport(result.report)
        setDetectedLocale(result.locale)
      })
      .catch(() => onErrorRef.current('tailoring.analysisError'))
      .finally(() => setAtsLoading(false))
  }, [job, manualMode, cvId, chosenLocale, editedJobDescription])

  const handleReanalyze = useCallback(async () => {
    if (!cvId || !chosenLocale || editedJobDescription === null) return
    if (!job && !manualMode) return
    if (!editedJobDescription.trim()) return
    setAtsLoading(true)
    try {
      const result = await analyzeCV(cvId, job?._id, chosenLocale, editedJobDescription)
      setAtsReport(result.report)
      setDetectedLocale(result.locale)
    } catch {
      onErrorRef.current('tailoring.analysisError')
    } finally {
      setAtsLoading(false)
    }
  }, [job, manualMode, cvId, chosenLocale, editedJobDescription])

  const handleGenerateCoverLetter = useCallback(async () => {
    if (!cvId || (!job && !manualMode)) return
    setCoverLoading(true)
    try {
      const result = await generateCoverLetter(cvId, job?._id, detectedLocale)
      setCoverContent(result.coverLetter)
    } catch {
      onErrorRef.current('tailoring.coverError')
    } finally {
      setCoverLoading(false)
    }
  }, [job, manualMode, cvId, detectedLocale])

  const handleGenerateVideoScript = useCallback(async () => {
    if (!cvId || (!job && !manualMode)) return
    setVideoLoading(true)
    try {
      const result = await generateVideoScript(cvId, job?._id, detectedLocale)
      setVideoContent(result.script)
    } catch {
      onErrorRef.current('tailoring.videoError')
    } finally {
      setVideoLoading(false)
    }
  }, [job, cvId, detectedLocale])

  return {
    tailoredContent,
    setTailoredContent,
    tailoring,
    chosenLocale,
    atsReport,
    atsLoading,
    coverContent,
    setCoverContent,
    coverLoading,
    videoContent,
    setVideoContent,
    videoLoading,
    handleReanalyze,
    handleGenerateCoverLetter,
    handleGenerateVideoScript,
  }
}
