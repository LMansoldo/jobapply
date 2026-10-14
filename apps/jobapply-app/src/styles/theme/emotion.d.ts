import type { EmotionTheme } from './emotionTheme'

declare module '@emotion/react' {
  export interface Theme extends EmotionTheme {}
}
