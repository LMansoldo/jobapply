import { CVTemplate } from '../../../../design-system/cv/CVTemplate'
import type { CV, CVLocaleVersion } from '../../types'
import type { CVPublicViewerProps } from './CVPublicViewer.types'
import * as styles from './CVPublicViewer.styles'

export function CVPublicViewer({ cv, isMobile }: CVPublicViewerProps) {
  const fakeCv: CV = {
    _id: cv._id,
    user: cv.user,
    fullName: cv.fullName,
    email: cv.email,
    phone: cv.phone,
    location: cv.location,
    linkedin: cv.linkedin,
    github: cv.github,
    portfolio: cv.portfolio,
    objective: cv.objective,
    languages: cv.languages,
    tailoredVersions: [],
    localeVersions: [],
    updatedAt: cv.published_at,
  }

  const fakeLocale: CVLocaleVersion = {
    locale: 'pt-BR',
    summary: cv.summary ?? '',
    skills: cv.skills,
    experience: cv.experience,
    education: cv.education,
    certifications: cv.certifications?.map((c) => ({ name: c.name, org: c.organization, date: c.date })),
    projects: cv.projects,
    languageLevels: cv.languages.map((l) => ({ name: l.language, level: l.level })),
  }

  return (
    <div className={styles.root}>
      <CVTemplate cv={fakeCv} locale={fakeLocale} isMobile={isMobile} />
    </div>
  )
}
