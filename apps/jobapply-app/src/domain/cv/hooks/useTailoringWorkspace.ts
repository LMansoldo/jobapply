/**
 * @file useTailoringWorkspace.ts
 * @description Manages all operations for the CV tailoring workspace.
 * Loads the CV directly, resolves locale + job description via the setup flow,
 * and owns ATS analysis and resume generation state. Manual mode only:
 * the user pastes the job description in the setup modal.
 *
 * ATS analysis uses TanStack Query (staleTime 30min — no re-dispatch without locale/desc change).
 * Resume generation and re-analyze use useMutation (on-demand).
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { ATSReport } from '../types'
import { localeVersionToMarkdown } from '../helpers'
import { prependObjectiveSection } from '../tailoringHelpers'
import {
  getCV,
  analyzeCV,
  generateResume,
} from '../../../infrastructure/repositories/cvRepository'

export interface TailoringWorkspaceState {
  tailoredContent: string
  setTailoredContent: (value: string) => void
  tailoring: boolean
  chosenLocale: 'en' | 'pt-BR' | null
  atsReport: ATSReport | null
  atsLoading: boolean
  resumeLoading: boolean
  handleGenerateResume: () => Promise<void>
  handleReanalyze: () => Promise<void>
}

export interface WorkspaceSetupResult {
  locale: 'en' | 'pt-BR'
  jobDescription: string
}

interface Params {
  cvId: string
  atsPlatform?: string
  onError: (messageKey: string) => void
  onNeedSetup: (locales: ('en' | 'pt-BR')[], initialJobDescription: string) => Promise<WorkspaceSetupResult>
}

export function useTailoringWorkspace({
  cvId,
  atsPlatform,
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

  // Prevents setup from running twice if cvId re-renders before resolution
  const setupInitiatedRef = useRef(false)

  const shouldInit = !!cvId && !setupInitiatedRef.current

  useEffect(() => {
    if (!shouldInit) return
    setupInitiatedRef.current = true
    setTailoring(true)
    getCV(cvId)
      .then(async (cv) => {
        const versions = cv.localeVersions ?? []
        if (versions.length === 0) return

        const locales = versions.map((v) => v.locale) as ('en' | 'pt-BR')[]
        const { locale, jobDescription } = await onNeedSetupRef.current(locales, '')

        const version = versions.find((v) => v.locale === locale)
        if (version) {
          const raw = localeVersionToMarkdown(version, cv.languages)
          setTailoredContent(prependObjectiveSection(raw, locale, ''))
        }
        setChosenLocale(locale)
        setEditedJobDescription(jobDescription)
      })
      .catch(() => onErrorRef.current('tailoring.loadCVError'))
      .finally(() => setTailoring(false))
  }, [cvId, shouldInit])

  // ── ATS analysis — useQuery: auto re-runs when locale/description change ─
  const atsEnabled = !!(
    cvId &&
    chosenLocale &&
    editedJobDescription !== null &&
    editedJobDescription.trim()
  )

  const atsQuery = useQuery({
    queryKey: ['atsReport', cvId, chosenLocale, editedJobDescription, atsPlatform ?? null],
    queryFn: () => analyzeCV(cvId, undefined, chosenLocale!, editedJobDescription!, tailoredContent, atsPlatform),
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
    mutationFn: () => analyzeCV(cvId, undefined, chosenLocale!, editedJobDescription!, tailoredContent, atsPlatform),
    onSuccess: (result) => setDetectedLocale(result.locale),
    onError: () => onErrorRef.current('tailoring.analysisError'),
  })

  const resumeMutation = useMutation({
    mutationFn: () =>
      generateResume(cvId, undefined, detectedLocale, editedJobDescription!, tailoredContent),
    onSuccess: (result) => setTailoredContent(result.resume),
    onError: () => onErrorRef.current('tailoring.resumeError'),
  })

  const handleGenerateResume = useCallback(async () => {
    if (!cvId) return
    await resumeMutation.mutateAsync()
  }, [cvId, resumeMutation])

  const handleReanalyze = useCallback(async () => {
    if (!atsEnabled) return
    await reanalyzeMutation.mutateAsync()
  }, [atsEnabled, reanalyzeMutation])

  return {
    tailoredContent,
    setTailoredContent,
    tailoring,
    chosenLocale,
    atsReport: reanalyzeMutation.data?.report ?? atsQuery.data?.report ?? null,
    atsLoading: atsQuery.isFetching || reanalyzeMutation.isPending,
    resumeLoading: resumeMutation.isPending,
    handleGenerateResume,
    handleReanalyze,
  }
}
