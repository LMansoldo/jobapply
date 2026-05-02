import { Colors } from '../../../styles/theme/colors'
import { BorderRadius } from '../../../styles/theme/radius'
import { FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export const styles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    width: '100%',
    padding: `${Spacing.sm} ${Spacing.md}`,
    borderRadius: BorderRadius.md,
    border: `1px solid ${Colors.surfaceBorder}`,
    background: Colors.white,
    fontSize: '1.4rem',
    fontWeight: FontWeight.medium,
    cursor: 'pointer',
    transition: 'background 0.15s',
    color: Colors.textMain,
  },
}

export const providerColors: Record<string, string> = {
  google: Colors.socialGoogle,
  linkedin: Colors.socialLinkedin,
  github: Colors.socialGithub,
}

export const providerLabels: Record<string, string> = {
  google: 'Entrar com Google',
  linkedin: 'Entrar com LinkedIn',
  github: 'Entrar com GitHub',
}
