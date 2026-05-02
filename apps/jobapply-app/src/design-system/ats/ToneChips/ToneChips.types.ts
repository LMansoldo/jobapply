export type ToneKey = 'formal' | 'direct' | 'creative' | 'confident'

export interface ToneOption {
  key: ToneKey
  label: string
}

export interface ToneChipsProps {
  options: ToneOption[]
  value: ToneKey
  onChange: (key: ToneKey) => void
}
