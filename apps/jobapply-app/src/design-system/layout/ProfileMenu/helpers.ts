import type { JobAlert } from '../../jobs/JobAlertsCard/JobAlertsCard.types'

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function totalAlertCount(alerts: JobAlert[]): number {
  return alerts.reduce((sum, a) => sum + a.count, 0)
}

/** Demo alerts shown when no real data is available */
export const DEMO_ALERTS: JobAlert[] = [
  { icon: '⚛️', title: 'React Sênior · Remoto', subtitle: 'Criado há 2 dias', count: 14 },
  { icon: '🔷', title: 'TypeScript · SP', subtitle: 'Criado há 5 dias', count: 7 },
  { icon: '👑', title: 'Tech Lead Frontend', subtitle: 'Criado há 1 semana', count: 3 },
]
