export interface SuggestionBannerProps {
  count: number
  current: number
  onPrev: () => void
  onNext: () => void
  onAcceptAll: () => void
}
