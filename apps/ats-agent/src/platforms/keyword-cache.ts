import * as fs from 'fs'
import * as path from 'fs'
import { createHash } from 'crypto'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CacheEntry {
  keywords: string[]
  source: 'gemini' | 'fallback'
  cachedAt: string
}

export type KeywordCache = Record<string, CacheEntry>

// ── File path ───────────────────────────────────────────────────────────────────

const CACHE_FILE = path.resolve(__dirname, '..', '..', 'data', 'jd-keywords-cache.json')

// ── Load / Save ─────────────────────────────────────────────────────────────────

let cached: KeywordCache | null = null

export function loadCache(): KeywordCache {
  if (cached) return cached
  try {
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8')
    cached = JSON.parse(raw)
  } catch {
    cached = {}
  }
  return cached
}

export function saveCache(cache: KeywordCache): void {
  const dir = path.dirname(CACHE_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8')
  cached = cache
}

// ── Hash ────────────────────────────────────────────────────────────────────────

export function hashJD(jd: string): string {
  const normalized = jd.trim().toLowerCase().replace(/\s+/g, ' ')
  return createHash('sha256').update(normalized).digest('hex')
}

// ── Get / Set ───────────────────────────────────────────────────────────────────

export function getCachedKeywords(jdHash: string): CacheEntry | null {
  const cache = loadCache()
  return cache[jdHash] ?? null
}

export function setCachedKeywords(
  jdHash: string,
  keywords: string[],
  source: 'gemini' | 'fallback'
): void {
  const cache = loadCache()
  cache[jdHash] = { keywords, source, cachedAt: new Date().toISOString() }
  saveCache(cache)
}
