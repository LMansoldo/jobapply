// ── Prompt injection sanitizer ────────────────────────────────────────────────
// Applied to all user-supplied text that reaches LLM prompts.

const MAX_INPUT_LENGTH = 24_000

// Patterns that attempt to hijack prompt structure or override instructions
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+instructions?/gi,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /forget\s+(everything|all|your\s+instructions?)/gi,
  /you\s+are\s+now\s+(?:a\s+)?(?:different|new|another|an?\s+)/gi,
  /act\s+as\s+(?:a\s+)?(?:different|new|another|an?\s+)/gi,
  /new\s+(?:system\s+)?prompt\s*:/gi,
  /override\s+(?:your\s+)?(?:system\s+)?instructions?/gi,
  /\[INST\]|\[\/INST\]|\[SYS\]|\[\/SYS\]/gi,
  /<<SYS>>|<<\/SYS>>/gi,
]

// XML/markdown tags that simulate prompt structure
const STRUCTURAL_TAG_RE = /<\/?(system|instructions?|prompt|role|assistant|human|user|context|task)\b[^>]*>/gi

export function sanitizeUserInput(text: string): string {
  if (!text) return ''

  // Truncate to max safe length
  let s = text.slice(0, MAX_INPUT_LENGTH)

  // Strip null bytes and non-printable control characters (keep \n \r \t)
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Remove structural prompt tags
  s = s.replace(STRUCTURAL_TAG_RE, '')

  // Remove injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    s = s.replace(pattern, '[removed]')
  }

  return s.trim()
}
