/**
 * @file constants.ts
 * @description Jobs domain constants: status color and label mappings.
 */
import type { Job } from './types'

/** Color mapping for each job status */
export const STATUS_COLOR: Record<Job['status'], string> = {
  open: 'green',
  applied: '#814efa',
  closed: 'red',
}

/** Display label mapping for each job status */
export const STATUS_LABEL: Record<Job['status'], string> = {
  open: 'Aberta',
  applied: 'Candidatado',
  closed: 'Fechada',
}
