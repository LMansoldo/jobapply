// apps/ats-agent/src/lib/jd.ts

const CONTENT_HEADER_RE = /^(responsabilidades?(\s+e\s+atribuições?)?|requisitos?(\s+e\s+qualificações?)?|qualificações?|qualifications?(\s+(and\s+job\s+)?requirements?)?|requirements?|responsibilities|diferencial|nice\s+to\s+have|missão\s+do\s+cargo|job\s+summary|o\s+que\s+(você|voce)\s+(vai|irá)\s+fazer|o\s+que\s+(buscamos|esperamos|precis\w*)|what\s+(you|we)\s+('ll|will|are|re)\s+(do|doing|looking\s+for)|what\s+you['’]ll\s+do|your\s+(responsibilities|profile|qualifications|role)|about\s+the\s+(role|opportunity|job)|the\s+role|competências?|habilidades?|skills?\s+required|gestão\s+(técnica|da\s+entrega|de\s+impedimentos)|interface\s+com\s+produto|para\s+participar)/i

const NOISE_HEADER_RE = /^(informações\s+adicionais|benefícios?|benefits?|what\s+we\s+offer|why\s+(you'?ll|work|us|join)|por\s+que\s+(trabalhar|se\s+juntar|ama)|sobre\s+(a?\s*)?(empresa|nós|nos)|about\s+\w|quem\s+somos|who\s+we\s+are|e\s+aí,?\s+curti|apply\s+now|come\s+join\s+us)/i

const BENEFIT_LINE_RE = /^(vale\s+(refeição|alimentação|transporte)|plano\s+(de\s+)?(saúde|odontológico)|gympass|wellhub|totalpass|auxílio\s+(home|creche|posto)|seguro\s+de\s+vida|day\s+off|folga\s+de\s+aniversário|semana\s+relax|participação\s+nos\s+lucros|great\s+place\s+to\s+work)/i

export function parseJobDescription(jd: string): string {
  const lines = jd.split('\n')
  const contentLines: string[] = []
  let state: 'content' | 'noise' = 'content'

  for (const line of lines) {
    const trimmed = line.trim()
    if (CONTENT_HEADER_RE.test(trimmed)) {
      state = 'content'
      contentLines.push(line)
      continue
    }
    if (NOISE_HEADER_RE.test(trimmed)) {
      state = 'noise'
      continue
    }
    if (state === 'content' && !BENEFIT_LINE_RE.test(trimmed)) {
      contentLines.push(line)
    }
  }

  return contentLines.length > 0 ? contentLines.join('\n') : jd
}
