/**
 * @file useTailoringPageData.ts
 * @description Fetches job and CV data required by the tailoring workspace.
 * Uses parallel TanStack Query calls for zero-latency cache hits on revisit.
 */
import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  const onErrorRef = useRef(onError)
  const onJobNotFoundRef = useRef(onJobNotFound)
  useEffect(() => { onErrorRef.current = onError })
  useEffect(() => { onJobNotFoundRef.current = onJobNotFound })

  const cvQuery = useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => getCV(cvId),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000,
  })

  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobById(jobId!),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  useEffect(() => {
    if (cvQuery.isError) onErrorRef.current('tailoring.loadCVError')
  }, [cvQuery.isError])

  useEffect(() => {
    if (jobQuery.isError) {
      onErrorRef.current('tailoring.jobNotFound')
      onJobNotFoundRef.current()
    }
  }, [jobQuery.isError])

  return {
    cv: cvQuery.data ?? null,
    job: jobQuery.data ?? null,
    loadingCv: cvQuery.isLoading,
    loadingJob: !!jobId && jobQuery.isLoading,
  }
}
