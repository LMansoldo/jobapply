import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { graph } from '../graph'
import type { LinkedInResult } from '../types'

const VoiceAnswerSchema = z.object({ label: z.string(), answer: z.string() })
const AnchorEvidenceSchema = z.object({ metric: z.string(), timeframe: z.string(), action: z.string() })

const AnalyzeBodySchema = z.object({
  profile: z.object({
    headline: z.string().min(1),
    about: z.string(),
    experience: z.string(),
    skills: z.string(),
    education: z.string(),
    certifications: z.string().optional(),
  }),
  targetRole: z.string().optional(),
  targetSector: z.array(z.string()).optional(),
  positioning: z.array(z.string()).optional(),
  tone: z.string().optional(),
  anchorEvidence: AnchorEvidenceSchema.optional(),
  jobDescription: z.string().optional(),
  locale: z.enum(['en', 'pt-BR']).optional(),
  voiceAnswers: z.array(VoiceAnswerSchema).optional(),
})

interface JobResult {
  status: 'pending' | 'running' | 'done' | 'error'
  result?: LinkedInResult
  error?: string
  createdAt: number
  completedAt?: number
}

const jobs = new Map<string, JobResult>()

setInterval(() => {
  const cutoff = Date.now() - 1000 * 60 * 30
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

    const input = parse.data
    const requestId = randomUUID()
    const job: JobResult = { status: 'pending', createdAt: Date.now() }
    jobs.set(requestId, job)
    reply.send({ requestId, status: 'pending' })

    setImmediate(async () => {
      job.status = 'running'
      try {
        const state = await graph.invoke({ input })
        const result: LinkedInResult = {
          seo: {
            before: state.seoBefore,
            after: state.seoAfter,
            delta: state.delta,
          },
          generation: state.generation,
          locale: input.locale ?? 'en',
        }
        job.status = 'done'
        job.result = result
      } catch (err) {
        job.status = 'error'
        job.error = err instanceof Error ? err.message : 'Internal error'
        request.log.error({ err, requestId }, 'linkedin-agent: graph failed')
      } finally {
        job.completedAt = Date.now()
      }
    })
  })
}
