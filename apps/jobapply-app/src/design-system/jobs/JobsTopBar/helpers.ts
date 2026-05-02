export interface FilterChipDef {
  key: string
  label: string
}

export const CONTRACT_CHIPS: FilterChipDef[] = [
  { key: 'clt', label: 'CLT' },
  { key: 'pj', label: 'PJ' },
  { key: 'freelance', label: 'Freelance' },
  { key: 'internship', label: 'Estágio' },
]

export const MODALITY_CHIPS: FilterChipDef[] = [
  { key: 'remote', label: 'Remoto' },
  { key: 'hybrid', label: 'Híbrido' },
  { key: 'onsite', label: 'Presencial' },
]

export function toggleChip(active: string[], key: string): string[] {
  return active.includes(key)
    ? active.filter((k) => k !== key)
    : [...active, key]
}

export function hasActiveFilters(
  contractTypes: string[],
  modalities: string[],
  search: string,
): boolean {
  return contractTypes.length > 0 || modalities.length > 0 || search.trim().length > 0
}
