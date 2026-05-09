import { useState } from 'react'
import { LinkedInInput, LinkedInResult } from '../types'
import { analyzeLinkedIn } from '../../../infrastructure/repositories/linkedinRepository'

export type LinkedInView = 'pdf' | 'results'

export function useLinkedInAnalysis() {
  const [result, setResult] = useState<LinkedInResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze(input: LinkedInInput) {
    setLoading(true)
    setError(null)
    try {
      const data = await analyzeLinkedIn(input)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setResult(null)
    setError(null)
  }

  return { result, loading, error, analyze, reset }
}
