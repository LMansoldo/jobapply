import type { GraphState, LinkedInProfile } from '../../types'

const MAX_FIELD_LENGTH = 8000

function truncate(value: string): string {
  return value.length > MAX_FIELD_LENGTH ? value.slice(0, MAX_FIELD_LENGTH) : value
}

export function profileParserNode(state: Pick<GraphState, 'input'>): Pick<GraphState, 'normalizedProfile'> {
  const { profile } = state.input

  if (!profile || !profile.headline) {
    throw new Error('profileParser: profile with at least a headline is required')
  }

  const normalizedProfile: LinkedInProfile = {
    headline: truncate(profile.headline.trim()),
    about: truncate((profile.about ?? '').trim()),
    experience: truncate((profile.experience ?? '').trim()),
    skills: truncate((profile.skills ?? '').trim()),
    education: truncate((profile.education ?? '').trim()),
    certifications: profile.certifications ? truncate(profile.certifications.trim()) : undefined,
  }

  return { normalizedProfile }
}
