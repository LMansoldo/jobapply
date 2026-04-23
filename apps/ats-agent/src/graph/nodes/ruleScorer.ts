import type { MappedCV, PlatformScore } from '../../types'
import { scoreGreenhouse } from '../../platforms/greenhouse'
import { scoreLever } from '../../platforms/lever'
import { scoreWorkday } from '../../platforms/workday'
import { scoreICIMS } from '../../platforms/icims'
import { scoreGupy } from '../../platforms/gupy'
import { scoreVagas } from '../../platforms/vagas'
import { scoreCatho } from '../../platforms/catho'
import { scoreInhire } from '../../platforms/inhire'
import { scoreRecruitee } from '../../platforms/recruitee'
import { scoreBambooHR } from '../../platforms/bamboohr'
import { scoreGeneric } from '../../platforms/generic'
import { detectPlatformFromUrl } from '../../platforms/detection'

type ScorerFn = (cv: MappedCV, jd: string, jdKeywords?: string[]) => PlatformScore

const SCORER_MAP: Record<string, ScorerFn> = {
  Greenhouse: scoreGreenhouse,
  Lever: scoreLever,
  Workday: scoreWorkday,
  iCIMS: scoreICIMS,
  Gupy: scoreGupy,
  Vagas: scoreVagas,
  Catho: scoreCatho,
  Inhire: scoreInhire,
  Recruitee: scoreRecruitee,
  BambooHR: scoreBambooHR,
  Generic: scoreGeneric,
}

const ALL_SCORERS: ScorerFn[] = [
  scoreGreenhouse,
  scoreLever,
  scoreWorkday,
  scoreICIMS,
  scoreGupy,
  scoreVagas,
  scoreCatho,
  scoreInhire,
]

export async function ruleScorerNode(state: {
  input: { jobDescription: string; platform?: string; jobUrl?: string }
  mapped?: MappedCV
  jdKeywords?: string[]
}): Promise<{ platformScores: PlatformScore[] }> {
  const cv = state.mapped
  if (!cv) throw new Error('ruleScorerNode: mapped CV is missing from state')

  const jd = state.input.jobDescription
  const kw = state.jdKeywords

  // Resolve platform: explicit > URL detection > run all
  const resolvedPlatform = state.input.platform
    ?? (state.input.jobUrl ? detectPlatformFromUrl(state.input.jobUrl) : null)

  if (resolvedPlatform) {
    const scorer = SCORER_MAP[resolvedPlatform]
    if (scorer) {
      return { platformScores: [scorer(cv, jd, kw)] }
    }
    // Platform named but not in map — fall through to all scorers
  }

  const scores = ALL_SCORERS.map(scorer => scorer(cv, jd, kw))
  return { platformScores: scores }
}
