import type { CV, CVLocaleVersion } from '../../../domain/cv/types'

export interface CVTemplateProps {
  cv: CV
  locale: CVLocaleVersion
  isMobile?: boolean
}
