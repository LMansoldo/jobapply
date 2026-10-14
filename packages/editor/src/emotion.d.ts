import type { UITheme } from '@jobapply/ui'

declare module '@emotion/react' {
  export interface Theme extends UITheme {}
}
