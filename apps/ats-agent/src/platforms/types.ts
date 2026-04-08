import type { MappedCV, PlatformScore } from '../types'

export type PlatformScorer = (cv: MappedCV, jd: string) => PlatformScore
