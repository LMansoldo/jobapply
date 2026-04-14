import type { CVLocaleVersion } from '../../../domain/cv/types';
import { Colors } from '../../../styles/theme/colors';

/**
 * Returns a normalized list of skills with percentage values derived from locale.skills.
 * Takes the first 5 items across all skill groups and assigns a fixed 80% bar height.
 */
export function getNormalizedSkills(
  locale: CVLocaleVersion
): Array<{ name: string; percent: number }> {
  const allItems = (locale.skills ?? []).flatMap((group) => group.items);
  return allItems.slice(0, 5).map((name) => ({ name, percent: 80 }));
}

/**
 * Determines background and text colors for a language level badge.
 * @param level - Language level string (e.g., "Native", "Fluent").
 * @returns CSS background and color values.
 */
export function getLanguageLevelStyle(level: string): { background: string; color: string } {
  const isNative = level === 'Nativo' || level === 'Native';
  return {
    background: isNative ? Colors.successBg : Colors.blueBg,
    color: isNative ? Colors.success : Colors.blue,
  };
}