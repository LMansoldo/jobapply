import { describe, it, expect } from 'vitest'
import { sanitizeStyle } from './styleSanitizer'

describe('sanitizeStyle', () => {
  it('em-dash before uppercase clause becomes a period', () => {
    const { text } = sanitizeStyle('Led the migration — Reduced deploy time by 40%')
    expect(text).toBe('Led the migration. Reduced deploy time by 40%')
  })

  it('em-dash before lowercase clause becomes a comma', () => {
    const { text } = sanitizeStyle('Led the migration — reducing deploy time by 40%')
    expect(text).toBe('Led the migration, reducing deploy time by 40%')
  })

  it('en-dash used as a clause separator is handled the same way', () => {
    const { text } = sanitizeStyle('Owned the rollout – Improved reliability')
    expect(text).toBe('Owned the rollout. Improved reliability')
  })

  it('leaves hyphenated words intact', () => {
    const { text } = sanitizeStyle('Built a front-end using AI-assisted tooling')
    expect(text).toBe('Built a front-end using AI-assisted tooling')
  })

  it('removes the English Oxford comma', () => {
    const { text } = sanitizeStyle('React, Node, and Python')
    expect(text).toBe('React, Node and Python')
  })

  it('removes the pt-BR serial comma', () => {
    const { text } = sanitizeStyle('React, Node, e Python')
    expect(text).toBe('React, Node e Python')
  })

  it('a dash converted to a comma right before "and" is cleaned up by pass 2', () => {
    const { text } = sanitizeStyle('Owned backend and frontend — and shipped on time')
    expect(text).toBe('Owned backend and frontend and shipped on time')
  })

  it('collects generic English phrases without altering the text', () => {
    const input = 'Results-driven engineer who leveraged cutting-edge tools for high impact outcomes'
    const { text, genericPhraseHits } = sanitizeStyle(input)
    expect(text).toBe(input)
    expect(genericPhraseHits).toEqual(
      expect.arrayContaining(['results-driven', 'leveraged', 'cutting-edge', 'high impact']),
    )
  })

  it('collects generic pt-BR phrases without altering the text', () => {
    const input = 'Responsável por atuei em projetos, trabalhei com times ágeis'
    const { text, genericPhraseHits } = sanitizeStyle(input)
    expect(text).toBe(input)
    expect(genericPhraseHits).toEqual(
      expect.arrayContaining(['responsável por', 'atuei em', 'trabalhei com']),
    )
  })

  it('clean sober text passes through unchanged with no hits', () => {
    const input = 'Built and shipped a payments API used by three teams'
    const { text, genericPhraseHits } = sanitizeStyle(input)
    expect(text).toBe(input)
    expect(genericPhraseHits).toEqual([])
  })

  it('never produces double spaces', () => {
    const { text } = sanitizeStyle('Led migration — Improved metrics, and reduced costs — Cut latency')
    expect(text).not.toMatch(/ {2}/)
  })
})
