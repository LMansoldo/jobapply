const GENERIC_PHRASES = [
  // English
  'results-driven',
  'passionate about',
  'significantly improved',
  'high impact',
  'notable increase',
  'seamlessly',
  'seamless',
  'cutting-edge',
  'robust solution',
  'dynamic professional',
  'leveraged',
  'spearheaded',
  'world-class',
  'state-of-the-art',
  'game-changer',
  'synergy',
  // pt-BR
  'responsável por',
  'atuei em',
  'trabalhei com',
  'melhorou significativamente',
  'grande impacto',
  'aumento expressivo',
  'apaixonado por',
  'profissional dedicado',
]

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripClauseDashes(text: string): string {
  return text.replace(/\s*[—–]\s*/g, (match, offset: number, str: string) => {
    const after = str.slice(offset + match.length)
    const nextChar = after.trimStart()[0] ?? ''
    const isUpper = /\p{Lu}/u.test(nextChar)
    return isUpper ? '. ' : ', '
  })
}

function removeOxfordComma(text: string): string {
  return text.replace(/, and /g, ' and ').replace(/, e /g, ' e ')
}

function collapseArtifacts(text: string): string {
  return text
    .replace(/\.\s*\.+/g, '.')
    .replace(/,\s*,+/g, ',')
    .replace(/ {2,}/g, ' ')
    .replace(/\s+([.,])/g, '$1')
}

function detectGenericPhrases(text: string): string[] {
  const hits: string[] = []
  const lower = text.toLowerCase()
  for (const phrase of GENERIC_PHRASES) {
    const regex = new RegExp(escapeRegExp(phrase.toLowerCase()), 'g')
    const matches = lower.match(regex)
    if (matches) hits.push(...matches)
  }
  return hits
}

export function sanitizeStyle(text: string): { text: string; genericPhraseHits: string[] } {
  let result = stripClauseDashes(text)
  result = removeOxfordComma(result)
  result = collapseArtifacts(result)

  const genericPhraseHits = detectGenericPhrases(result)

  return { text: result, genericPhraseHits }
}
