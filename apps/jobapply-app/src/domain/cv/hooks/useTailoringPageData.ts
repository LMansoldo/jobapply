/**
 * @file useTailoringPageData.ts
 * @description Fetches the CV required by the tailoring workspace.
 * Uses TanStack Query for zero-latency cache hits on revisit.
 */
import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCV } from '../../../infrastructure/repositories/cvRepository'
import type { CV } from '../types'

interface UseTailoringPageDataParams {
  cvId: string
  onError: (key: string) => void
}

export interface UseTailoringPageDataReturn {
  cv: CV | null
  loadingCv: boolean
}

export function useTailoringPageData({
  cvId,
  onError,
}: UseTailoringPageDataParams): UseTailoringPageDataReturn {
  const onErrorRef = useRef(onError)
  useEffect(() => { onErrorRef.current = onError })

  const cvQuery = useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => getCV(cvId),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (cvQuery.isError) onErrorRef.current('tailoring.loadCVError')
  }, [cvQuery.isError])

  return {
    cv: cvQuery.data ?? null,
    loadingCv: cvQuery.isLoading,
  }
}
