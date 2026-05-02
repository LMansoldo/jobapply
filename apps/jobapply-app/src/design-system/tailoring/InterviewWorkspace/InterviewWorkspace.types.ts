import type { InterviewPrep } from '../../../domain/cv/types'

export interface InterviewWorkspaceProps {
  interviewPrep: InterviewPrep | null
  loading: boolean
  onGenerate: () => void
}
