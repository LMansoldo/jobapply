import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { graph, missingOf } from '../graph'
import { mapperNode } from '../graph/nodes/mapper'
import { jdExtractorNode } from '../graph/nodes/jdExtractor'
import { cvExtractorNode, buildCvText } from '../graph/nodes/cvExtractor'
import { keywordComposerNode } from '../graph/nodes/keywordComposer'
import { keywordClassifierNode } from '../graph/nodes/keywordClassifier'
import { booleanMatcherNode } from '../graph/nodes/booleanMatcher'
import { bulletAdvisorNode } from '../graph/nodes/bulletAdvisor'
import { scoreComposerNode } from '../graph/nodes/scoreComposer'
import { gapAdvisorNode } from '../graph/nodes/gapAdvisor'
import { resumeGeneratorNode } from '../graph/nodes/resumeGenerator'
import { interviewPrepAnalyzerNode } from '../graph/nodes/interviewPrepAnalyzer'
import type { AgentInput, ATSReport, CV, VerificationReport } from '../types'

const SkillGroupSchema = z.object({
  label: z.string(),
  items: z.array(z.string()),
})

const ExperienceSchema = z.object({
  role: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  period: z.string().optional(),
  context: z.string().optional(),
  highlights: z.array(z.string()).optional(),
})

const EducationSchema = z.object({
  degree: z.string().optional(),
  field: z.string().optional(),
  institution: z.string().optional(),
  location: z.string().optional(),
  period: z.string().optional(),
  notes: z.string().optional(),
})

const LanguageSchema = z.object({
  language: z.string(),
  level: z.string(),
  score: z.string().optional(),
})

const CertificationSchema = z.object({
  name: z.string(),
  organization: z.string(),
  date: z.string().optional(),
})

const ProjectSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
})

const CVLocaleVersionSchema = z.object({
  locale: z.enum(['en', 'pt-BR']),
  summary: z.string().optional(),
  skills: z.array(SkillGroupSchema).optional(),
  experience: z.array(ExperienceSchema).optional(),
})

const CVSchema = z.object({
  _id: z.string().optional(),
  user: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(SkillGroupSchema).optional(),
  experience: z.array(ExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
  languages: z.array(LanguageSchema).optional(),
  certifications: z.array(CertificationSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  localeVersions: z.array(CVLocaleVersionSchema).optional(),
  updatedAt: z.string().optional(),
})

const AnalyzeBodySchema = z.object({
  cv: CVSchema.optional(),
  cvMarkdown: z.string().optional(),
  jobDescription: z.string().min(1, 'jobDescription must not be empty'),
  locale: z.enum(['en', 'pt-BR']).optional(),
})

// ── Background job store ─────────────────────────────────────────────────────

interface JobResult {
  status: 'pending' | 'running' | 'done' | 'error'
  report?: ATSReport
  adaptedCV?: CV
  resume?: string
  resumeVerification?: VerificationReport
  error?: string
  createdAt: number
  completedAt?: number
}

const jobs = new Map<string, JobResult>()

// SSE subscribers waiting for a job to reach a terminal status
const subscribers = new Map<string, Set<(job: JobResult) => void>>()

function notifySubscribers(requestId: string, job: JobResult): void {
  const subs = subscribers.get(requestId)
  if (!subs) return
  for (const notify of subs) notify(job)
}

// Clean up old jobs every 10 minutes
setInterval(() => {
  const cutoff = Date.now() - 1000 * 60 * 30 // 30 min TTL
  for (const [id, job] of jobs) {
    if (job.completedAt && job.completedAt < cutoff) jobs.delete(id)
  }
}, 1000 * 60 * 10)

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({ status: 'ok' }))

  app.get('/result/:requestId', async (request, reply) => {
    const { requestId } = request.params as { requestId: string }
    const job = jobs.get(requestId)
    if (!job) return reply.status(404).send({ message: 'Request not found' })
    return reply.send(job)
  })

  app.get('/result/:requestId/stream', (request, reply) => {
    const { requestId } = request.params as { requestId: string }
    const job = jobs.get(requestId)
    if (!job) return reply.status(404).send({ message: 'Request not found' })

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    const send = (snapshot: JobResult) => {
      reply.raw.write(`data: ${JSON.stringify(snapshot)}\n\n`)
    }

    // Terminal state already reached: emit and close
    if (job.status === 'done' || job.status === 'error') {
      send(job)
      reply.raw.end()
      return reply
    }

    send(job)

    const onNotify = (updated: JobResult): void => {
      send(updated)
      if (updated.status === 'done' || updated.status === 'error') {
        cleanup()
        reply.raw.end()
      }
    }

    function cleanup(): void {
      clearInterval(heartbeat)
      subscribers.get(requestId)?.delete(onNotify)
      if (subscribers.get(requestId)?.size === 0) subscribers.delete(requestId)
    }

    let subs = subscribers.get(requestId)
    if (!subs) {
      subs = new Set()
      subscribers.set(requestId, subs)
    }
    subs.add(onNotify)

    // Keep intermediaries from closing an idle stream
    const heartbeat = setInterval(() => reply.raw.write(': ping\n\n'), 15_000)
    request.raw.on('close', cleanup)

    return reply
  })

  app.post('/analyze', async (request, reply) => {
    const parse = AnalyzeBodySchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({ message: parse.error.errors[0]?.message ?? 'Invalid request body' })
    }

    if (!parse.data.cv && !parse.data.cvMarkdown) {
      return reply.status(400).send({ message: 'cv or cvMarkdown is required' })
    }

    const input: AgentInput = parse.data
    const requestId = randomUUID()

    // Register pending job and reply immediately
    const job: JobResult = { status: 'pending', createdAt: Date.now() }
    jobs.set(requestId, job)
    reply.send({ requestId, status: 'pending' })

    // Process in background
    job.status = 'running'
    notifySubscribers(requestId, job)
    try {
      request.log.info({ requestId, hasCv: !!input.cv, hasMd: !!input.cvMarkdown, jdLen: input.jobDescription.length }, 'analyze: starting graph.invoke')
      const result = await graph.invoke({ input })
      request.log.info({ requestId, hasReport: !!result.report }, 'analyze: graph.invoke completed')
      if (!result.report) {
        job.status = 'error'
        job.error = 'Graph completed without producing a report'
      } else {
        job.status = 'done'
        job.report = result.report
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error'
      request.log.error({ err, requestId }, 'analyze: graph.invoke failed')
      job.status = 'error'
      job.error = message
    } finally {
      job.completedAt = Date.now()
      notifySubscribers(requestId, job)
    }
  })

  app.post('/interview-prep', async (request, reply) => {
    const parse = AnalyzeBodySchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({ message: parse.error.errors[0]?.message ?? 'Invalid request body' })
    }

    const input: AgentInput = parse.data

    try {
      const { mapped } = mapperNode({ input })
      const interviewPrep = await interviewPrepAnalyzerNode({
        cv: mapped,
        jobDescription: input.jobDescription,
        locale: input.locale,
      })
      return reply.send(interviewPrep)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error'
      return reply.status(502).send({ message })
    }
  })

  app.post('/generate-resume', async (request, reply) => {
    const parse = AnalyzeBodySchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({ message: parse.error.errors[0]?.message ?? 'Invalid request body' })
    }

    if (!parse.data.cv && !parse.data.cvMarkdown) {
      return reply.status(400).send({ message: 'cv or cvMarkdown is required' })
    }

    const input: AgentInput = parse.data

    try {
      const { mapped } = mapperNode({ input })
      const { jdChunks, jobTitle } = await jdExtractorNode({ input })
      const { cvChunks } = await cvExtractorNode({ cvText: buildCvText(mapped) })
      const { keywords } = await keywordComposerNode({ jdChunks, cvChunks })
      const { keywords: classified } = await keywordClassifierNode({ keywords, jdChunks })
      const { keywordMatches } = booleanMatcherNode({ mapped, keywords: classified })
      // insights guide the writer; the deterministic score (heuristic insights on
      // both sides) decides the loop — same ruler for scoreBefore and scoreAfter
      const { bulletInsights } = await bulletAdvisorNode({ mapped, keywords: classified, jobTitle, locale: input.locale })
      const composed = scoreComposerNode({ mapped, keywords: classified, keywordMatches })
      const { gapAnalysis } = await gapAdvisorNode({
        missingKeywords: missingOf(classified, keywordMatches),
        cvChunks,
        locale: input.locale,
      })
      const result = await resumeGeneratorNode({
        input,
        mapped,
        jobTitle,
        keywords: classified,
        gapAnalysis,
        scoreBefore: composed.universalScore,
        bulletInsights,
      })
      return reply.send({
        resume: result.resume,
        verification: result.resumeVerification,
        scoreBefore: result.scoreBefore,
        scoreAfter: result.scoreAfter,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error'
      return reply.status(502).send({ message })
    }
  })

  app.post('/generate-cv', async (request, reply) => {
    const parse = AnalyzeBodySchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({ message: parse.error.errors[0]?.message ?? 'Invalid request body' })
    }

    const input: AgentInput = parse.data

    try {
      const result = await graph.invoke({ input })
      if (!result.report) {
        return reply.status(500).send({ message: 'Graph completed without producing a report' })
      }
      return reply.send({ report: result.report })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error'
      return reply.status(502).send({ message })
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    app.post('/debug/test-nodes', async (request, reply) => {
      const parse = AnalyzeBodySchema.safeParse(request.body)
      if (!parse.success) {
        return reply.status(400).send({ message: parse.error.errors[0]?.message ?? 'Invalid request body' })
      }

      const input: AgentInput = parse.data
      const results: Record<string, unknown> = {}

      try {
        request.log.info('debug: testing mapperNode')
        const { mapped } = mapperNode({ input })
        results.mapper = { ok: true, sections: Object.keys(mapped.sections), entityCounts: Object.fromEntries(Object.entries(mapped.entities).map(([k, v]) => [k, Array.isArray(v) ? v.length : (v as any[])?.length ?? 0])) }
      } catch (err) {
        results.mapper = { ok: false, error: err instanceof Error ? err.message : String(err) }
      }

      try {
        request.log.info('debug: testing jdExtractorNode')
        const { jdChunks, jobTitle } = await jdExtractorNode({ input })
        results.jdExtractor = { ok: true, jobTitle, count: jdChunks.length, sample: jdChunks.slice(0, 10) }
      } catch (err) {
        results.jdExtractor = { ok: false, error: err instanceof Error ? err.message : String(err) }
      }

      return reply.send(results)
    })
  }
}
