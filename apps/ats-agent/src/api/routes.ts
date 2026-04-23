import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { graph } from '../graph'
import { mapperNode } from '../graph/nodes/mapper'
import { jdKeywordExtractorNode } from '../graph/nodes/jdKeywordExtractor'
import { semanticAnalyzerNode } from '../graph/nodes/semanticAnalyzer'
import { resumeGeneratorNode } from '../graph/nodes/resumeGenerator'
import { interviewPrepAnalyzerNode } from '../graph/nodes/interviewPrepAnalyzer'
import { linkedinAnalyzerNode } from '../graph/nodes/linkedinAnalyzer'
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
  cv: CVSchema.optional(),
  cvMarkdown: z.string().optional(),
  jobDescription: z.string().min(1, 'jobDescription must not be empty'),
  locale: z.enum(['en', 'pt-BR']).optional(),
  platform: z.string().optional(),
  jobUrl: z.string().optional(),
})

const VoiceAnswerSchema = z.object({
  label: z.string(),
  answer: z.string(),
})

const LinkedInAnalyzeBodySchema = z.object({
  profile: z.object({
    headline: z.string(),
    about: z.string(),
    experience: z.string(),
    skills: z.string(),
    education: z.string(),
    certifications: z.string().optional(),
  }),
  targetRole: z.string().optional(),
  locale: z.enum(['en', 'pt-BR']).optional(),
  voiceAnswers: z.array(VoiceAnswerSchema).optional(),
})

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({ status: 'ok' }))

  app.post('/analyze', async (request, reply) => {
    const parse = AnalyzeBodySchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({ message: parse.error.errors[0]?.message ?? 'Invalid request body' })
    }

    if (!parse.data.cv && !parse.data.cvMarkdown) {
      return reply.status(400).send({ message: 'cv or cvMarkdown is required' })
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
      // Run the extraction + semantic analysis pipeline in sequence
      const { mapped } = mapperNode({ input })
      const { jdKeywords } = await jdKeywordExtractorNode({ input })

      const semanticState = {
        input,
        mapped,
        jdKeywords,
        platformScores: [],
      }
      const semantic = await semanticAnalyzerNode(semanticState as Parameters<typeof semanticAnalyzerNode>[0])

      const resume = await resumeGeneratorNode({
        input,
        mapped,
        jdKeywords,
        semanticGaps: semantic.semanticGaps,
        rephraseSuggestions: semantic.rephraseSuggestions,
        keywordPhrases: semantic.keywordPhrases,
        removeSuggestions: semantic.removeSuggestions,
      })

      return reply.send(resume)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error'
      return reply.status(502).send({ message })
    }
  })

  app.post('/linkedin-analyze', async (request, reply) => {
    const parse = LinkedInAnalyzeBodySchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({ message: parse.error.errors[0]?.message ?? 'Invalid request body' })
    }

    const { profile, targetRole, locale, voiceAnswers } = parse.data

    try {
      const linkedinAnalysis = await linkedinAnalyzerNode({
        input: {
          profile,
          targetRole,
          locale,
          voiceAnswers,
        },
      })
      return reply.send(linkedinAnalysis)
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
}
