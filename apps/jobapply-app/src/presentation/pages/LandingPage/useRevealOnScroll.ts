import { useEffect } from 'react'
import { fadeInCls, revealInClass } from './LandingPage.styles'

export function useRevealOnScroll(): void {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(`.${fadeInCls}`))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      els.forEach(el => el.classList.add(revealInClass))
      return
    }
    const check = () => {
      const vh = window.innerHeight
      els.forEach(el => {
        if (el.classList.contains(revealInClass)) return
        const r = el.getBoundingClientRect()
        if (r.top < vh - 60 && r.bottom > 0) el.classList.add(revealInClass)
      })
    }
    els.forEach((el, i) => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight) setTimeout(() => el.classList.add(revealInClass), Math.min(i, 8) * 90)
    })
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    const safety = setTimeout(check, 1500)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      clearTimeout(safety)
    }
  }, [])
}
