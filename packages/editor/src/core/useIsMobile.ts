import { useTheme } from '@emotion/react'
import { useEffect, useMemo, useState } from 'react'

function buildMobileQuery(breakpoints: Record<string, string>): string {
  const lg = Number.parseInt(breakpoints.lg, 10)
  return `(max-width: ${lg - 1}px)`
}

export function useIsMobile(): boolean {
  const theme = useTheme()
  const query = useMemo(() => buildMobileQuery(theme.breakpoints), [theme])
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }
    setIsMobile(media.matches)
    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [query])

  return isMobile
}
