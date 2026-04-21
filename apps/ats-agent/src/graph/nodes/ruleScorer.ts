import type { MappedCV, PlatformScore } from '../../types'
import { scoreGreenhouse } from '../../platforms/greenhouse'
import { scoreLever } from '../../platforms/lever'
import { scoreWorkday } from '../../platforms/workday'
import { scoreICIMS } from '../../platforms/icims'
import { scoreGupy } from '../../platforms/gupy'
import { scoreVagas } from '../../platforms/vagas'
import { scoreCatho } from '../../platforms/catho'
import { scoreInhire } from '../../platforms/inhire'

export async function ruleScorerNode(state: {
  input: { jobDescription: string }
  mapped?: MappedCV
  jdKeywords?: string[]
}): Promise<{ platformScores: PlatformScore[] }> {
  const cv = state.mapped
  if (!cv) throw new Error('ruleScorerNode: mapped CV is missing from state')

  const jd = state.input.jobDescription
  const kw = state.jdKeywords

  const scores = await Promise.all([
    Promise.resolve(scoreGreenhouse(cv, jd, kw)),
    Promise.resolve(scoreLever(cv, jd, kw)),
    Promise.resolve(scoreWorkday(cv, jd, kw)),
    Promise.resolve(scoreICIMS(cv, jd, kw)),
    Promise.resolve(scoreGupy(cv, jd, kw)),
    Promise.resolve(scoreVagas(cv, jd, kw)),
    Promise.resolve(scoreCatho(cv, jd, kw)),
    Promise.resolve(scoreInhire(cv, jd, kw)),
  ])

  return { platformScores: scores }
}
