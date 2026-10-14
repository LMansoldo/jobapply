import { norm } from '../../db/chunks'
import type { ComposedKeyword, KeywordMatch, MappedCV } from '../../types'

const SEARCHABLE_SECTIONS: Array<keyof MappedCV['sections']> = [
  'experience', 'skills', 'summary', 'education', 'languages',
]

const EVIDENCE_CONTEXT = 40

function surfaceRegex(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`)
}

function findEvidence(sectionNorm: string, surfaceNorm: string): string {
  for (const surface of [surfaceNorm, surfaceNorm + 's', surfaceNorm + 'es', surfaceNorm.endsWith('s') && surfaceNorm.length > 3 ? surfaceNorm.slice(0, -1) : '']) {
    if (!surface) continue
    const match = surfaceRegex(surface).exec(sectionNorm)
    if (match?.index !== undefined) {
      const start = Math.max(0, match.index - EVIDENCE_CONTEXT)
      const end = Math.min(sectionNorm.length, match.index + surface.length + EVIDENCE_CONTEXT)
      return (start > 0 ? '…' : '') + sectionNorm.slice(start, end).trim() + (end < sectionNorm.length ? '…' : '')
    }
  }
  return ''
}

function termMatchesText(sectionNorm: string, termNorm: string): boolean {
  if (surfaceRegex(termNorm).test(sectionNorm)) return true
  if (!termNorm.endsWith('s') && surfaceRegex(termNorm + 's').test(sectionNorm)) return true
  if (!termNorm.endsWith('s') && surfaceRegex(termNorm + 'es').test(sectionNorm)) return true
  if (termNorm.endsWith('s') && termNorm.length > 3 && surfaceRegex(termNorm.slice(0, -1)).test(sectionNorm)) return true
  return false
}

export function booleanMatcherNode(state: {
  mapped: MappedCV
  keywords: ComposedKeyword[]
}): { keywordMatches: KeywordMatch[] } {
  const { mapped, keywords } = state

  const sectionNorms = SEARCHABLE_SECTIONS.map((s) => ({ section: s, text: norm(mapped.sections[s] ?? '') }))

  const keywordMatches: KeywordMatch[] = keywords.map((kw) => {
    const surfaces = [kw.term, ...kw.variants].map(norm)
    for (const { section, text } of sectionNorms) {
      for (const surface of surfaces) {
        if (surface.length > 0 && termMatchesText(text, surface)) {
          return { term: kw.term, tier: kw.tier, matched: true, section, evidence: findEvidence(text, surface) }
        }
      }
    }
    return { term: kw.term, tier: kw.tier, matched: false, section: '', evidence: '' }
  })

  return { keywordMatches }
}
