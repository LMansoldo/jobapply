import type { CVSkillsPanelProps } from './CVSkillsPanel.types'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: FontSize.xxs,
      fontWeight: FontWeight.bold,
      color: Colors.primaryDark,
      textTransform: 'uppercase' as const,
      letterSpacing: '1.2px',
      borderBottom: `2px solid ${Colors.primaryLight}`,
      paddingBottom: Spacing.xs,
      marginBottom: Spacing.md,
      marginTop: Spacing.lg,
    }}>
      {children}
    </div>
  )
}

export function CVSkillsPanel({ locale }: CVSkillsPanelProps) {
  const allSkillItems = (locale.skills ?? []).flatMap((g) => g.items)
  const skillBars = locale.skillPercentages ?? allSkillItems.slice(0, 5).map((s) => ({ name: s, percent: 80 }))
  const pt = locale.locale === 'pt-BR'

  return (
    <div style={{ padding: `${Spacing.lg} ${Spacing.xl}`, background: Colors.surfacePage }}>
      {/* Skills bars */}
      {skillBars.length > 0 && (
        <>
          <SectionHeading>Skills</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
            {skillBars.map((skill) => (
              <div key={skill.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: FontSize.xxs, fontWeight: FontWeight.medium, color: Colors.textMain }}>{skill.name}</span>
                  <span style={{ fontSize: FontSize.xxs, color: Colors.textSub }}>{skill.percent}%</span>
                </div>
                <div style={{ height: '6px', background: Colors.surfaceBorder, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${skill.percent}%`, background: Colors.gradientProgressBar, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Skill groups / Competencies */}
      {(locale.skills ?? []).length > 0 && (
        <>
          <SectionHeading>{pt ? 'Competências' : 'Competencies'}</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
            {(locale.skills ?? []).map((group) => (
              <div key={group.label}>
                <p style={{ margin: 0, fontSize: FontSize.xxs, fontWeight: FontWeight.semibold, color: Colors.primaryDark }}>{group.label}</p>
                <p style={{ margin: `${Spacing.xs} 0 0`, fontSize: FontSize.xxs, color: Colors.textMain, lineHeight: 1.6 }}>
                  {group.items.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Languages */}
      {locale.languageLevels && locale.languageLevels.length > 0 && (
        <>
          <SectionHeading>{pt ? 'Idiomas' : 'Languages'}</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
            {locale.languageLevels.map((lang) => (
              <div key={lang.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: FontSize.xxs, color: Colors.textMain, fontWeight: FontWeight.medium }}>{lang.name}</span>
                <span style={{
                  fontSize: FontSize.xxs,
                  fontWeight: FontWeight.medium,
                  padding: `2px ${Spacing.sm}`,
                  borderRadius: '12px',
                  background: lang.level === 'Nativo' || lang.level === 'Native' ? Colors.successBg : Colors.blueBg,
                  color: lang.level === 'Nativo' || lang.level === 'Native' ? Colors.success : Colors.blue,
                }}>
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Certifications */}
      {locale.certifications && locale.certifications.length > 0 && (
        <>
          <SectionHeading>{pt ? 'Certificações' : 'Certifications'}</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
            {locale.certifications.map((cert, i) => (
              <div key={i}>
                <p style={{ margin: 0, fontSize: FontSize.xxs, fontWeight: FontWeight.semibold, color: Colors.textMain }}>{cert.name}</p>
                {(cert.org || cert.date) && (
                  <p style={{ margin: 0, fontSize: FontSize.xxs, color: Colors.textSub }}>
                    {[cert.org, cert.date].filter(Boolean).join(' — ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Projects */}
      {locale.projects && locale.projects.length > 0 && (
        <>
          <SectionHeading>{pt ? 'Projetos' : 'Projects'}</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
            {locale.projects.map((proj, i) => (
              <div key={i}>
                <p style={{ margin: 0, fontSize: FontSize.xxs, fontWeight: FontWeight.semibold, color: Colors.textMain }}>{proj.name}</p>
                {proj.url && (
                  <p style={{ margin: 0, fontSize: FontSize.xxs, color: Colors.blue }}>{proj.url}</p>
                )}
                <p style={{ margin: `${Spacing.xs} 0 0`, fontSize: FontSize.xxs, color: Colors.textMain, lineHeight: 1.5 }}>
                  {proj.description}
                </p>
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul style={{ margin: `${Spacing.xs} 0 0`, paddingLeft: Spacing.md, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {proj.highlights.map((h, j) => (
                      <li key={j} style={{ fontSize: FontSize.xxs, color: Colors.textMain }}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
