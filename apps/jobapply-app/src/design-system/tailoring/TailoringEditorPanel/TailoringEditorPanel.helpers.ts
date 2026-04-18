/**
 * @file TailoringEditorPanel.helpers.ts
 * @description Helper functions for editor text operations.
 */

/**
 * Normalise search text before trying to find it in the Monaco model.
 * The AI may return slightly different whitespace or quote characters than
 * what is actually stored in the document.
 */
export function normalizeSearchText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
}

/**
 * Count words in a text string.
 */
export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

/**
 * Get objective section text for the given locale.
 */
export function getObjectiveText(locale: string, jobTitle?: string): string {
  if (locale === 'pt-BR') {
    return `# Objetivo\n\n${jobTitle || 'Posição desejada'}\n\n`
  }
  return `# Objective\n\n${jobTitle || 'Desired position'}\n\n`
}
