import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { graph } from '../graph'
import { mapperNode } from '../graph/nodes/mapper'
import { interviewPrepAnalyzerNode } from '../graph/nodes/interviewPrepAnalyzer'
import type { AgentInput } from '../types'

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
  cv: CVSchema,
  jobDescription: z.string().min(1, 'jobDescription must not be empty'),
  locale: z.enum(['en', 'pt-BR']).optional(),
})

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({ status: 'ok' }))

  app.post('/analyze', async (request, reply) => {
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
      return reply.send(result.report)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error'
      return reply.status(502).send({ message })
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
}
