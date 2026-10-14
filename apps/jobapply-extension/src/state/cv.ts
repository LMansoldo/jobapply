import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCV } from '../shared/api'
import { getCvId, saveCvId, type StoredAuth } from '../shared/storage'
import type { ExtensionCV } from '../shared/report'

export function useResolvedCvId(auth: StoredAuth): { cvId: string | null; ready: boolean } {
  const [state, setState] = useState<{ cvId: string | null; ready: boolean }>({ cvId: null, ready: false })

  useEffect(() => {
    void (async () => {
      const stored = await getCvId()
      const cvId = stored ?? (typeof auth.user.cv === 'string' ? auth.user.cv : null)
      setState({ cvId, ready: true })
    })()
  }, [auth])

  return state
}

export function useCvQuery(cvId: string | null) {
  return useQuery({
    queryKey: ['cv', cvId],
    queryFn: async () => {
      const { cv } = await getCV(cvId as string)
      void saveCvId(cv._id)
      return cv as ExtensionCV
    },
    enabled: !!cvId,
  })
}
