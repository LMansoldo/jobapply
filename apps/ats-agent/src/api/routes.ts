import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { graph } from '../graph'
import { mapperNode } from '../graph/nodes/mapper'
import { jdKeywordExtractorNode } from '../graph/nodes/jdKeywordExtractor'
import { universalScorerNode } from '../graph/nodes/universalScorer'
import { semanticAnalyzerNode } from '../graph/nodes/semanticAnalyzer'
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
    try {
      request.log.info({ requestId, hasCv: !!input.cv, hasMd: !!input.cvMarkdown, jdLen: input.jobDescription.length }, 'analyze: starting graph.invoke')
      const result = await graph.invoke({ input })
      request.log.info({ requestId, hasReport: !!result.report, hasAdaptedCV: !!result.adaptedCV, hasResume: !!result.resume }, 'analyze: graph.invoke completed')
      if (!result.report) {
        job.status = 'error'
        job.error = 'Graph completed without producing a report'
      } else {
        job.status = 'done'
        job.report = result.report
        job.adaptedCV = result.adaptedCV
        job.resume = result.resume
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error'
      request.log.error({ err, requestId }, 'analyze: graph.invoke failed')
      job.status = 'error'
      job.error = message
    } finally {
      job.completedAt = Date.now()
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
      const { jdKeywords, weightedKeywords, jobTitle } = await jdKeywordExtractorNode({ input })
      const { scoreBreakdown, missingKeywords } = universalScorerNode({ mapped, weightedKeywords })
      const semantic = await semanticAnalyzerNode({ input, mapped, scoreBreakdown, missingKeywords })
      const result = await resumeGeneratorNode({
        input,
        mapped,
        jdKeywords,
        weightedKeywords,
        jobTitle,
        semanticGaps: semantic.semanticGaps,
        rephraseSuggestions: semantic.rephraseSuggestions,
        keywordPhrases: semantic.keywordPhrases,
        removeSuggestions: semantic.removeSuggestions,
      })
      return reply.send({ resume: result.resume, verification: result.resumeVerification })
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
      if (!result.adaptedCV) {
        return reply.status(500).send({ message: 'Graph completed without producing an adapted CV' })
      }
      return reply.send({
        report: result.report,
        adaptedCV: result.adaptedCV,
      })
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
        request.log.info('debug: testing jdKeywordExtractorNode')
        const { jdKeywords } = await jdKeywordExtractorNode({ input })
        results.jdKeywordExtractor = { ok: true, count: jdKeywords.length, sample: jdKeywords.slice(0, 10) }
      } catch (err) {
        results.jdKeywordExtractor = { ok: false, error: err instanceof Error ? err.message : String(err) }
      }

      return reply.send(results)
    })
  }
}
