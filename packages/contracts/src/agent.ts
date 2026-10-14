import type { CV } from './cv'

export interface AgentInput {
  cv?: CV
  cvMarkdown?: string
  jobDescription: string
  locale?: 'en' | 'pt-BR'
}
