export interface UITheme {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: {
    family: Record<string, string>
    size: Record<string, string>
    weight: Record<string, number>
    lineHeight: Record<string, number>
    letterSpacing: Record<string, string>
  }
  radius: Record<string, string>
  shadows: Record<string, string>
  breakpoints: Record<string, string>
  mediaQueries: Record<string, string>
}
