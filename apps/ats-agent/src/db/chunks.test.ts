import { describe, it, expect } from 'vitest'
import { chunkId, contentHash, getCvChunks, getJdChunks, norm, saveCvChunks, saveJdChunks } from './chunks'

process.env.CHUNKS_DB_PATH = ':memory:'

const unique = () => Math.random().toString(36).slice(2)

describe('norm', () => {
  it('strips accents, lowercases and collapses whitespace', () => {
    expect(norm('  Experiência   Profissional ')).toBe('experiencia profissional')
  })
})

describe('contentHash / chunkId', () => {
  it('is deterministic regardless of case, accents and whitespace', () => {
    expect(contentHash('jd', 'Front-End  Engineer')).toBe(contentHash('jd', 'front end engineer'))
    expect(chunkId('tool', 'Node.JS')).toBe(chunkId('tool', 'node js'))
  })

  it('differs across types and attrs', () => {
    expect(chunkId('tool', 'react')).not.toBe(chunkId('skill', 'react'))
    expect(chunkId('tool', 'react')).not.toBe(chunkId('tool', 'vue'))
  })
})

describe('jd chunks roundtrip', () => {
  it('saves and reads back chunks by jdId', () => {
    const jdId = unique()
    saveJdChunks(jdId, [
      { type: 'tool', attr: 'React', tier: 'must-have' },
      { type: 'req', attr: '5+ years of experience', tier: 'must-have' },
      { type: 'domain', attr: 'fintech', tier: 'nice-to-have' },
    ])

    const chunks = getJdChunks(jdId)
    expect(chunks).toHaveLength(3)
    expect(chunks[0]).toMatchObject({ type: 'tool', attr: 'React', tier: 'must-have' })
    expect(chunks[0].jdId).toBe(jdId)
    expect(typeof chunks[0].createdAt).toBe('number')
  })

  it('deduplicates identical (type, attr) pairs across saves', () => {
    const jdId = unique()
    saveJdChunks(jdId, [{ type: 'skill', attr: 'unit testing', tier: 'important' }])
    saveJdChunks(jdId, [{ type: 'skill', attr: 'Unit  Testing', tier: 'must-have' }])

    expect(getJdChunks(jdId)).toHaveLength(1)
  })

  it('the same chunk in a different jd gets its own owner row', () => {
    const jdA = unique()
    const jdB = unique()
    saveJdChunks(jdA, [{ type: 'tool', attr: 'kubernetes', tier: 'must-have' }])
    saveJdChunks(jdB, [{ type: 'tool', attr: 'kubernetes', tier: 'nice-to-have' }])

    expect(getJdChunks(jdA)).toHaveLength(1)
    expect(getJdChunks(jdB)).toHaveLength(1)
  })
})

describe('cv chunks roundtrip', () => {
  it('saves and reads back chunks by cvId with section provenance', () => {
    const cvId = unique()
    saveCvChunks(cvId, [
      { type: 'tool', attr: 'AWS', section: 'experience' },
      { type: 'credential', attr: 'BSc Computer Science', section: 'education' },
    ])

    const chunks = getCvChunks(cvId)
    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toMatchObject({ type: 'tool', attr: 'AWS', section: 'experience' })
    expect(chunks[0].cvId).toBe(cvId)
  })

  it('returns empty array for unknown ids', () => {
    expect(getJdChunks(unique())).toEqual([])
    expect(getCvChunks(unique())).toEqual([])
  })
})
