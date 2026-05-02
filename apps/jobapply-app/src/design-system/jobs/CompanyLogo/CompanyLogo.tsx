import type { CompanyLogoProps } from './CompanyLogo.types'
import { getStyles } from './CompanyLogo.styles'

export function CompanyLogo({ name, logoUrl, size = 48 }: CompanyLogoProps) {
  const styles = getStyles(size)
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  return (
    <div style={styles.wrapper}>
      {logoUrl ? (
        <img src={logoUrl} alt={name} style={styles.img} />
      ) : (
        <span style={styles.initials}>{initials}</span>
      )}
    </div>
  )
}
