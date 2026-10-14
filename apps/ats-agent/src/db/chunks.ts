import { createHash } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import type { ChunkType, CvChunk, CvChunkInput, CvSection, JdChunk, JdChunkInput } from '../types'

const DEFAULT_DB_PATH = resolve(process.cwd(), 'data/chunks.db')

let db: DatabaseSync | undefined

function getDb(): DatabaseSync {
  if (!db) {
    const path = process.env.CHUNKS_DB_PATH ?? DEFAULT_DB_PATH
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
    db = new DatabaseSync(path)
    db.exec('PRAGMA journal_mode = WAL')
    db.exec(`
      CREATE TABLE IF NOT EXISTS jd_chunks (
        id TEXT NOT NULL,
        jd_id TEXT NOT NULL,
        type TEXT NOT NULL,
        attr TEXT NOT NULL,
        tier TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (jd_id, id)
      );
      CREATE INDEX IF NOT EXISTS idx_jd_chunks_jd ON jd_chunks(jd_id);

      CREATE TABLE IF NOT EXISTS cv_chunks (
        id TEXT NOT NULL,
        cv_id TEXT NOT NULL,
        type TEXT NOT NULL,
        attr TEXT NOT NULL,
        section TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (cv_id, id)
      );
      CREATE INDEX IF NOT EXISTS idx_cv_chunks_cv ON cv_chunks(cv_id);

      CREATE TABLE IF NOT EXISTS jd_meta (
        jd_id TEXT PRIMARY KEY,
        job_title TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `)
  }
  return db
}

export function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function contentHash(...parts: string[]): string {
  return createHash('sha256').update(parts.map(norm).join('::')).digest('hex')
}

export function chunkId(type: ChunkType, attr: string): string {
  return contentHash(type, attr)
}

function insertChunks(
  table: 'jd_chunks' | 'cv_chunks',
  ownerId: string,
  rows: Array<{ id: string; type: string; attr: string; extra: string }>,
): void {
  const d = getDb()
  const stmt = d.prepare(
    `INSERT OR IGNORE INTO ${table} (id, ${table === 'jd_chunks' ? 'jd_id' : 'cv_id'}, type, attr, ${table === 'jd_chunks' ? 'tier' : 'section'}, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
  )
  const now = Date.now()
  d.exec('BEGIN')
  try {
    for (const row of rows) {
      stmt.run(row.id, ownerId, row.type, row.attr, row.extra, now)
    }
    d.exec('COMMIT')
  } catch (err) {
    d.exec('ROLLBACK')
    throw err
  }
}

export function saveJdChunks(jdId: string, chunks: JdChunkInput[]): void {
  insertChunks(
    'jd_chunks',
    jdId,
    chunks.map((c) => ({ id: chunkId(c.type, c.attr), type: c.type, attr: c.attr, extra: c.tier })),
  )
}

export function saveCvChunks(cvId: string, chunks: CvChunkInput[]): void {
  insertChunks(
    'cv_chunks',
    cvId,
    chunks.map((c) => ({ id: chunkId(c.type, c.attr), type: c.type, attr: c.attr, extra: c.section })),
  )
}

export function getJdChunks(jdId: string): JdChunk[] {
  const rows = getDb()
    .prepare('SELECT id, jd_id AS jdId, type, attr, tier, created_at AS createdAt FROM jd_chunks WHERE jd_id = ? ORDER BY rowid')
    .all(jdId) as unknown as JdChunk[]
  return rows
}

export function getCvChunks(cvId: string): CvChunk[] {
  const rows = getDb()
    .prepare('SELECT id, cv_id AS cvId, type, attr, section, created_at AS createdAt FROM cv_chunks WHERE cv_id = ? ORDER BY rowid')
    .all(cvId) as unknown as CvChunk[]
  return rows
}

export function saveJdMeta(jdId: string, jobTitle: string): void {
  getDb()
    .prepare('INSERT OR REPLACE INTO jd_meta (jd_id, job_title, created_at) VALUES (?, ?, ?)')
    .run(jdId, jobTitle, Date.now())
}

export function getJdMeta(jdId: string): { jobTitle: string } | undefined {
  const row = getDb()
    .prepare('SELECT job_title AS jobTitle FROM jd_meta WHERE jd_id = ?')
    .get(jdId) as { jobTitle: string } | undefined
  return row
}
