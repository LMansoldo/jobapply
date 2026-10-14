import { describe, it, expect, vi } from 'vitest'
import { detectAiSmell, parseAiSmellRewrites, aiSmellValidatorNode, rewriteDraftAiSmell } from './aiSmellValidator'
import type { MappedCV, ResumeDraft } from '../../types'

vi.mock('../../lib/glm', () => ({
  generate: vi.fn(async () => {
    throw new Error('llm down')
  }),
}))

describe('detectAiSmell', () => {
  it('flags every pattern from the base rules', () => {
    expect(detectAiSmell('Built the platform — fast and reliable')).toContain('em-dash')
    expect(detectAiSmell('Led React, Vue, and Angular teams')).toContain('triad')
    expect(detectAiSmell('Played a crucial role in the migration')).toContain('intensifier:crucial')
    expect(detectAiSmell('Not just fast, but reliable delivery')).toContain('not-just-but')
    expect(detectAiSmell("In today's fast-paced world, teams ship daily")).toContain('preamble')
    expect(detectAiSmell('Ready for the next challenge?')).toContain('rhetorical-question')
    expect(detectAiSmell('Leveraged Kubernetes to scale')).toContain('banned:leveraged')
    expect(detectAiSmell('Built a robust API')).toContain('banned:robust')
    expect(detectAiSmell('**Team Lead:** managed 5 engineers')).toContain('leading-bold')
    expect(detectAiSmell("It's important to note that uptime stayed at 99%")).toContain('meta-sentence')
  })

  it('clean factual text passes untouched', () => {
    expect(detectAiSmell('Reduced AWS costs by 40% via caching')).toEqual([])
  })
})

describe('parseAiSmellRewrites', () => {
  const units = [
    { id: 'u:summary', text: 'a', location: 'summary' },
    { id: 'u:p0.b1', text: 'b', location: 'p0.b1' },
  ]

  it('maps rewrites by known id, trims and caps length', () => {
    const raw = JSON.stringify({
      rewrites: [
        { id: 'u:summary', text: '  clean summary  ' },
        { id: 'u:p0.b1', text: 'x'.repeat(700) },
        { id: 'u:unknown', text: 'should be ignored' },
        { text: 'no id' },
      ],
    })
    const map = parseAiSmellRewrites(raw, units)
    expect(map.get('u:summary')).toBe('clean summary')
    expect(map.get('u:p0.b1')).toHaveLength(600)
    expect(map.has('u:unknown')).toBe(false)
    expect(map.size).toBe(2)
  })

  it('throws on invalid JSON (caller falls back)', () => {
    expect(() => parseAiSmellRewrites('not json', units)).toThrow()
  })
})

const baseMapped: MappedCV = {
  sections: {
    contact: '', summary: 'In conclusion, a results-driven engineer', skills: '', experience: '', education: '', languages: '',
  },
  entities: {
    jobTitles: [], companies: [], skills: [], techStack: [], softSkills: [],
    dates: [], degrees: [], urls: [],
    experiencePeriods: [],
  },
  raw: {
    experience: [
      { role: 'Dev', highlights: ['Reduced costs by 40% via caching', 'Revolutionary work on the platform — shipped 3 features'] },
    ],
  },
}

describe('aiSmellValidatorNode (LLM failure path)', () => {
  it('keeps detection with empty rewrite when the LLM is down', async () => {
    const { aiSmellFixes } = await aiSmellValidatorNode({ mapped: baseMapped })
    expect(aiSmellFixes).toHaveLength(2) // summary + bullet 1; bullet 0 is clean
    expect(aiSmellFixes.map((f) => f.location)).toEqual(['summary', 'p0.b1'])
    expect(aiSmellFixes.every((f) => f.rewrite === '')).toBe(true)
    expect(aiSmellFixes[1].issues).toContain('intensifier:revolutionary')
    expect(aiSmellFixes[1].issues).toContain('em-dash')
  })
})

describe('rewriteDraftAiSmell (LLM failure path)', () => {
  it('returns the draft untouched when the LLM is down', async () => {
    const draft: ResumeDraft = {
      summary: 'In conclusion, a robust engineer',
      skills: [{ category: 'Frontend', items: ['React'] }],
      experience: [{
        positionIndex: 0,
        include: true,
        context: 'Led the platform team',
        bullets: [{ sourceIndex: 0, text: 'Reduced costs by 40% via caching' }],
      }],
    }
    const result = await rewriteDraftAiSmell(draft)
    expect(result).toBe(draft)
  })

  it('skips the LLM entirely when nothing smells', async () => {
    const draft: ResumeDraft = {
      summary: 'Backend engineer',
      skills: [],
      experience: [{
        positionIndex: 0,
        include: true,
        context: 'Platform team',
        bullets: [{ sourceIndex: 0, text: 'Reduced costs by 40% via caching' }],
      }],
    }
    const result = await rewriteDraftAiSmell(draft)
    expect(result).toBe(draft)
  })
})
