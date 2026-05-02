const URL_PLATFORM_MAP: Array<{ pattern: RegExp; platform: string }> = [
  { pattern: /lever\.co/i, platform: 'Lever' },
  { pattern: /greenhouse\.io/i, platform: 'Greenhouse' },
  { pattern: /gupy\.io/i, platform: 'Gupy' },
  { pattern: /workday\.com|myworkdayjobs\.com/i, platform: 'Workday' },
  { pattern: /catho\.com\.br/i, platform: 'Catho' },
  { pattern: /vagas\.com\.br/i, platform: 'Vagas' },
  { pattern: /inhire\.io/i, platform: 'Inhire' },
  { pattern: /recruitee\.com/i, platform: 'Recruitee' },
  { pattern: /bamboohr\.com/i, platform: 'BambooHR' },
  { pattern: /icims\.com/i, platform: 'iCIMS' },
  { pattern: /smartrecruiters\.com/i, platform: 'Generic' },
]

export function detectPlatformFromUrl(url: string): string | null {
  for (const { pattern, platform } of URL_PLATFORM_MAP) {
    if (pattern.test(url)) return platform
  }
  return null
}

export const SUPPORTED_PLATFORMS = [
  'Greenhouse',
  'Lever',
  'Workday',
  'iCIMS',
  'Gupy',
  'Vagas',
  'Catho',
  'Inhire',
  'Recruitee',
  'BambooHR',
  'Generic',
] as const

export type SupportedPlatform = typeof SUPPORTED_PLATFORMS[number]
