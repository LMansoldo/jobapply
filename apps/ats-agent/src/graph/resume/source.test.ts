import { describe, it, expect } from 'vitest'
import { buildResumeSource } from './source'
import type { MappedCV } from '../../types'

const mockMapped: MappedCV = {
  sections: {
    contact: 'john@example.com',
    summary: 'Senior developer',
    skills: 'React, TypeScript',
    experience: '### Senior Dev | Acme\n**Jan 2022 - Present**\n\nLed team\n\n- Built features\n- Reduced latency by 30%',
    education: '### BSc Computer Science\nUFSP | 2019',
    languages: 'English: Fluent',
  },
  entities: { jobTitles: [], companies: [], skills: [], techStack: [], softSkills: [], dates: [], degrees: [], urls: [], experiencePeriods: [] },
  raw: {},
}

const sampleMarkdown = `## Summary
Senior developer with 5 years

## Professional Experience
### Senior Dev | Acme | Remote
**Jan 2022 - Present**

Led the frontend team across 3 products.

- Built React component library
- Reduced page load by 30%

## Education
### BSc Computer Science
UFSP | 2019
`

describe('buildResumeSource', () => {
  it('parses markdown and extracts positions with bullets', () => {
    const result = buildResumeSource(mockMapped, sampleMarkdown)
    expect(result.positions.length).toBeGreaterThan(0)
    expect(result.positions[0].bullets.length).toBeGreaterThan(0)
    expect(result.positions[0].period).toBe('Jan 2022 - Present')
  })

  it('extracts educationRaw from markdown', () => {
    const result = buildResumeSource(mockMapped, sampleMarkdown)
    expect(result.educationRaw).toContain('BSc Computer Science')
  })

  it('falls back to mapped.sections when no markdown or rawCV', () => {
    const result = buildResumeSource(mockMapped)
    expect(result.positions.length).toBeGreaterThan(0)
  })

  it('aliases: "experiência profissional" is recognized', () => {
    const ptMd = `## Experiência Profissional\n### Dev | Co\n**Jan 2021 - Dec 2021**\n\nContext\n\n- Did stuff`
    const result = buildResumeSource(mockMapped, ptMd)
    expect(result.positions.length).toBeGreaterThan(0)
  })
})
