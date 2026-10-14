import { describe, it, expect } from 'vitest'
import { parseJobDescription } from './jd'

const jd = `Senior Frontend Developer

We are looking for someone to join a team that thinks big. If this way of working resonates with you, come join us.
What you will do:
Develop and evolve features for the API Studio platform using TypeScript and React.

What we are looking for:
Hands-on experience with Franca IDL.
Solid experience with TypeScript and JavaScript.

Nice to have:
Experience with Monaco Editor.
Knowledge of GitHub Actions and CI/CD pipelines.

Why join us:
Great place to work awards, health plan, meal voucher.
`

const ptJd = `Desenvolvedor Sênior

Sobre a empresa: somos uma fintech.

O que buscamos:
- Experiência com React
- Conhecimento em PostgreSQL

Benefícios:
- vale refeição
- plano de saúde

Responsabilidades:
- Desenvolver features
`

describe('parseJobDescription', () => {
  it('keeps sections with unrecognized EN headers (what you will do / what we are looking for)', () => {
    const parsed = parseJobDescription(jd)
    expect(parsed).toContain('API Studio platform')
    expect(parsed).toContain('Franca IDL')
    expect(parsed).toContain('Nice to have')
  })

  it('drops noise sections (benefits) — preamble is kept on purpose', () => {
    const parsed = parseJobDescription(jd)
    expect(parsed).not.toContain('health plan')
    expect(parsed).not.toContain('meal voucher')
    expect(parsed).toContain('thinks big') // unrecognized preamble: extractor prompt filters culture prose
  })

  it('keeps PT-BR sections and drops benefits', () => {
    const parsed = parseJobDescription(ptJd)
    expect(parsed).toContain('React')
    expect(parsed).toContain('Responsabilidades')
    expect(parsed).not.toContain('vale refeição')
    expect(parsed).not.toContain('plano de saúde')
    expect(parsed).not.toContain('fintech')
  })

  it('returns the raw jd when nothing matches at all', () => {
    const raw = 'Just a plain description with no headers.'
    expect(parseJobDescription(raw)).toBe(raw)
  })
})
