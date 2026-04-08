import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { graph } from '../graph'
import type { AgentInput } from '../types'

const HighlightSchema = z.object({
  text: z.string(),
  category: z.string().optional(),
})

const ExperienceSchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  period: z.string().optional(),
  highlights: z.array(HighlightSchema).optional(),
})

const EducationSchema = z.object({
  institution: z.string().optional(),
  degree: z.string().optional(),
  graduation: z.string().optional(),
})

const SummarySchema = z.object({
  headline: z.string().optional(),
  focus_areas: z.array(z.string()).optional(),
  tagline: z.string().optional(),
})

const SkillGroupSchema = z.object({
  label: z.string(),
  items: z.array(z.string()),
})

const SkillsSchema = z.object({
  tech: z.array(SkillGroupSchema).optional(),
  competencies: z.array(SkillGroupSchema).optional(),
  soft_skills: z.array(z.string()).optional(),
})

const ObjectiveSchema = z.object({
  role: z.string().optional(),
  main_stack: z.array(z.string()).optional(),
})

const CVLocaleVersionSchema = z.object({
  locale: z.enum(['en', 'pt-BR']),
  objective: ObjectiveSchema.optional(),
  summary: SummarySchema.optional(),
  skills: SkillsSchema.optional(),
  expertise: z.array(z.string()).optional(),
  experience: z.array(ExperienceSchema).optional(),
  education: EducationSchema.optional(),
})

const CVSchema = z.object({
  _id: z.string().optional(),
  user: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  objective: ObjectiveSchema.optional(),
  summary: SummarySchema.optional(),
  skills: SkillsSchema.optional(),
  expertise: z.array(z.string()).optional(),
  experience: z.array(ExperienceSchema).optional(),
  education: EducationSchema.optional(),
  languages: z.array(z.string()).optional(),
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
}
