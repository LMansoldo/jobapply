export interface JobAlert {
  icon: string
  title: string
  subtitle: string
  count: number
}

export interface JobAlertsCardProps {
  alerts: JobAlert[]
  onNew?: () => void
}
