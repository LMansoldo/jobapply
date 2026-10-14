/**
 * @file useSetupFlow.ts
 * @description Manages the promise-based setup modal lifecycle for the tailoring workspace.
 * Encapsulates locale selection, job description input, and resolves the async setup flow.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import type { WorkspaceSetupResult } from './useTailoringWorkspace'

interface UseSetupFlowParams {
  isManualMode: boolean
  onCancelManual: () => void
}

export interface SetupModalProps {
  open: boolean
  step: 1 | 2
  locales: ('en' | 'pt-BR')[]
  selectedLocale: 'en' | 'pt-BR'
  jobDescription: string
  onLocaleChange: (locale: 'en' | 'pt-BR') => void
  onJobDescriptionChange: (description: string) => void
  onStepChange: (step: 1 | 2) => void
  onConfirm: (result: WorkspaceSetupResult) => void
  onCancel: (result: WorkspaceSetupResult) => void
}

export interface UseSetupFlowReturn {
  setupModalProps: SetupModalProps
  onNeedSetup: (locales: ('en' | 'pt-BR')[], initialJobDescription: string) => Promise<WorkspaceSetupResult>
  setupLocale: 'en' | 'pt-BR'
  manualDescription: string
}

export function useSetupFlow({ isManualMode, onCancelManual }: UseSetupFlowParams): UseSetupFlowReturn {
  const [setupOpen, setSetupOpen] = useState(false)
  const [setupStep, setSetupStep] = useState<1 | 2>(1)
  const [setupLocales, setSetupLocales] = useState<('en' | 'pt-BR')[]>([])
  const [setupLocale, setSetupLocale] = useState<'en' | 'pt-BR'>('pt-BR')
  const [setupJobDesc, setSetupJobDesc] = useState('')
  const [manualDescription, setManualDescription] = useState('')
  const setupResolveRef = useRef<((result: WorkspaceSetupResult) => void) | null>(null)
  const onCancelManualRef = useRef(onCancelManual)
  useEffect(() => { onCancelManualRef.current = onCancelManual })

  const onNeedSetup = useCallback(
    (locales: ('en' | 'pt-BR')[], initialJobDescription: string): Promise<WorkspaceSetupResult> =>
      new Promise((resolve) => {
        setupResolveRef.current = resolve
        setSetupLocales(locales)
        setSetupLocale(locales[0])
        setSetupJobDesc(initialJobDescription)
        setSetupStep(locales.length > 1 ? 1 : 2)
        setSetupOpen(true)
      }),
    [],
  )

  const handleConfirm = useCallback(
    (result: WorkspaceSetupResult) => {
      setupResolveRef.current?.(result)
      setupResolveRef.current = null
      setSetupOpen(false)
      if (isManualMode) {
        setManualDescription(result.jobDescription)
      }
    },
    [isManualMode],
  )

  const handleCancel = useCallback(
    (_result: WorkspaceSetupResult) => {
      if (isManualMode) {
        onCancelManualRef.current()
        return
      }
      setupResolveRef.current?.({ locale: setupLocale, jobDescription: setupJobDesc })
      setupResolveRef.current = null
      setSetupOpen(false)
    },
    [isManualMode, setupLocale, setupJobDesc],
  )

  return {
    setupModalProps: {
      open: setupOpen,
      step: setupStep,
      locales: setupLocales,
      selectedLocale: setupLocale,
      jobDescription: setupJobDesc,
      onLocaleChange: setSetupLocale,
      onJobDescriptionChange: setSetupJobDesc,
      onStepChange: setSetupStep,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
    onNeedSetup,
    setupLocale,
    manualDescription,
  }
}
