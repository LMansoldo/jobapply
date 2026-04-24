export type InteractionStep = 'gender' | 'roles' | 'employed' | null

export type MessageType = 'text' | 'overview_cards' | 'tailoring_list' | 'ai_warning'

export interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  content: string
  msgType?: MessageType
}

export interface OnboardingData {
  gender: 'M' | 'F' | 'O'
  genderOther?: string
  targetRoles: string[]
  isEmployed: boolean
}

export interface ScriptBeat {
  kind: 'message'
  key: string
  params?: Record<string, string>
  msgType?: MessageType
}

export interface PauseBeat {
  kind: 'pause'
  interaction: NonNullable<InteractionStep>
}

export type Beat = ScriptBeat | PauseBeat
