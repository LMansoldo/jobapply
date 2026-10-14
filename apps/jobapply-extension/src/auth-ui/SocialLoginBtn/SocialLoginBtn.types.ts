export type SocialProvider = 'google' | 'linkedin' | 'github'

export interface SocialLoginBtnProps {
  provider: SocialProvider
  onClick: () => void
}
