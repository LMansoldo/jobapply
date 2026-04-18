/**
 * @file useTailoringPageData.ts
 * @description Fetches job and CV data required by the tailoring workspace.
 * Manages loading states and delegates error handling to the caller.
 */
import { useState, useEffect, useRef } from 'react'
import { getJobById } from '../../../infrastructure/repositories/jobsRepository'
import { getCV } from '../../../infrastructure/repositories/cvRepository'
import type { Job } from '../../jobs/types'
import type { CV } from '../types'

interface UseTailoringPageDataParams {
  cvId: string
  jobId?: string
  onError: (key: string) => void
  onJobNotFound: () => void
}

export interface UseTailoringPageDataReturn {
  job: Job | null
  cv: CV | null
  loadingJob: boolean
  loadingCv: boolean
}

export function useTailoringPageData({
  cvId,
  jobId,
  onError,
  onJobNotFound,
}: UseTailoringPageDataParams): UseTailoringPageDataReturn {
  const [job, setJob] = useState<Job | null>(null)
  const [cv, setCv] = useState<CV | null>(null)
  const [loadingJob, setLoadingJob] = useState(!!jobId)
  const [loadingCv, setLoadingCv] = useState(true)

  const onErrorRef = useRef(onError)
  const onJobNotFoundRef = useRef(onJobNotFound)
  useEffect(() => { onErrorRef.current = onError })
  useEffect(() => { onJobNotFoundRef.current = onJobNotFound })

  useEffect(() => {
    if (!cvId) {
      setLoadingCv(false)
      return
    }
    getCV(cvId)
      .then(setCv)
      .catch(() => onErrorRef.current('tailoring.loadCVError'))
      .finally(() => setLoadingCv(false))
  }, [cvId])

  useEffect(() => {
    if (!jobId) return
    getJobById(jobId)
      .then(setJob)
      .catch(() => {
        onErrorRef.current('tailoring.jobNotFound')
        onJobNotFoundRef.current()
      })
      .finally(() => setLoadingJob(false))
  }, [jobId])

  return { job, cv, loadingJob, loadingCv }
}
