/**
 * @file JobCard.tsx
 * @description JobCard component — displays a summary of a job in the list panel.
 */
import type { JobCardProps } from './JobCard.types'
import { DSJobCard } from '../../../../design-system/jobs/DSJobCard'

/**
 * Displays a compact job entry for use in a scrollable job list.
 * @param props - JobCardProps
 */
export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  return (
    <DSJobCard
      job={job}
      isSelected={isSelected}
      onClick={() => onClick(job)}
    />
  )
}
