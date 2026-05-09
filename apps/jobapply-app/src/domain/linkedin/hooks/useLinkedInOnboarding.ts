import { useState } from 'react'
import { LinkedInInput, LinkedInProfile, AnchorEvidence } from '../types'

export type OnboardingStep = 0 | 1 | 2 | 3 | 4

interface OnboardingState {
  step: OnboardingStep
  profile: LinkedInProfile | null
  targetRole: string
  targetSector: string[]
  positioning: string[]
  anchorEvidence: AnchorEvidence
  jobDescription: string
}

const INITIAL_ANCHOR: AnchorEvidence = { metric: '', timeframe: '', action: '' }

export function useLinkedInOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    step: 0,
    profile: null,
    targetRole: '',
    targetSector: [],
    positioning: [],
    anchorEvidence: INITIAL_ANCHOR,
    jobDescription: '',
  })

  function setProfile(profile: LinkedInProfile) {
    setState(s => ({ ...s, profile, step: 1 }))
  }

  function setStep1(targetRole: string, targetSector: string[]) {
    setState(s => ({ ...s, targetRole, targetSector, step: 2 }))
  }

  function setStep2(positioning: string[]) {
    setState(s => ({ ...s, positioning, step: 3 }))
  }

  function setStep3(anchorEvidence: AnchorEvidence) {
    // Block advance if anchor evidence is empty
    if (!anchorEvidence.metric || !anchorEvidence.timeframe || !anchorEvidence.action) return
    setState(s => ({ ...s, anchorEvidence, step: 4 }))
  }

  function setStep4(jobDescription: string) {
    setState(s => ({ ...s, jobDescription }))
  }

  function goBack() {
    setState(s => ({ ...s, step: Math.max(0, s.step - 1) as OnboardingStep }))
  }

  function buildInput(): LinkedInInput | null {
    if (!state.profile) return null
    return {
      profile: state.profile,
      targetRole: state.targetRole || undefined,
      targetSector: state.targetSector.length > 0 ? state.targetSector : undefined,
      positioning: state.positioning.length > 0 ? state.positioning : undefined,
      anchorEvidence: state.anchorEvidence,
      jobDescription: state.jobDescription || undefined,
    }
  }

  return { state, setProfile, setStep1, setStep2, setStep3, setStep4, goBack, buildInput }
}
