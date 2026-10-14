import type { UITheme } from './theme'

declare module '@emotion/react' {
  export interface Theme extends UITheme {}
}
