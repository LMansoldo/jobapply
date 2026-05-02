/**
 * @file helpers.ts
 * @description Jobs domain helper functions.
 */

/**
 * Converts a string (e.g. company name) to a deterministic color from a palette.
 * @param str - The input string to hash
 * @returns A hex color string from the palette
 */
export function stringToColor(str: string): string {
  const colors = [
    '#814efa', '#5b8dee', '#f76707', '#2f9e44', '#e64980',
    '#1098ad', '#d6336c', '#7048e8', '#0c8599', '#e67700',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
