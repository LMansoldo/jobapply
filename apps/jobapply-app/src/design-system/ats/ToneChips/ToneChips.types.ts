export interface ToneOption {
  key: string
  label: string
}

export interface ToneChipsProps {
  options: ToneOption[]
  value: string
  onChange: (key: string) => void
}
