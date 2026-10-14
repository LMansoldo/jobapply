import type { CVSkillsPanelProps } from './CVSkillsPanel.types'
import * as styles from './CVSkillsPanel.styles'

export function CVSkillsPanel({ locale }: CVSkillsPanelProps) {
  const allSkillItems = (locale.skills ?? []).flatMap((g) => g.items)
  const skillBars = locale.skillPercentages ?? allSkillItems.slice(0, 5).map((s) => ({ name: s, percent: 80 }))
  const pt = locale.locale === 'pt-BR'

  return (
    <styles.Panel>
      {/* Skills bars */}
      {skillBars.length > 0 && (
        <>
          <styles.SectionHeading>{pt ? 'Habilidades' : 'Skills'}</styles.SectionHeading>
          <styles.SkillsList>
            {skillBars.map((skill) => (
              <div key={skill.name}>
                <styles.SkillLabelRow>
                  <styles.SkillName>{skill.name}</styles.SkillName>
                  <styles.SkillPercent>{skill.percent}%</styles.SkillPercent>
                </styles.SkillLabelRow>
                <styles.SkillBarTrack>
                  <styles.SkillBarFill $pct={skill.percent} />
                </styles.SkillBarTrack>
              </div>
            ))}
          </styles.SkillsList>
        </>
      )}

      {/* Skill groups / Competencies */}
      {(locale.skills ?? []).length > 0 && (
        <>
          <styles.SectionHeading>{pt ? 'Competências' : 'Competencies'}</styles.SectionHeading>
          <styles.GroupsList>
            {(locale.skills ?? []).map((group) => (
              <div key={group.label}>
                <styles.GroupLabel>{group.label}</styles.GroupLabel>
                <styles.GroupItems>
                  {group.items.join(', ')}
                </styles.GroupItems>
              </div>
            ))}
          </styles.GroupsList>
        </>
      )}

      {/* Languages */}
      {locale.languageLevels && locale.languageLevels.length > 0 && (
        <>
          <styles.SectionHeading>{pt ? 'Idiomas' : 'Languages'}</styles.SectionHeading>
          <styles.LanguagesList>
            {locale.languageLevels.map((lang) => (
              <styles.LanguageRow key={lang.name}>
                <styles.LanguageName>{lang.name}</styles.LanguageName>
                <styles.LanguageLevelBadge $native={lang.level === 'Nativo' || lang.level === 'Native'}>
                  {lang.level}
                </styles.LanguageLevelBadge>
              </styles.LanguageRow>
            ))}
          </styles.LanguagesList>
        </>
      )}

      {/* Certifications */}
      {locale.certifications && locale.certifications.length > 0 && (
        <>
          <styles.SectionHeading>{pt ? 'Certificações' : 'Certifications'}</styles.SectionHeading>
          <styles.CertificationsList>
            {locale.certifications.map((cert, i) => (
              <div key={i}>
                <styles.CertificationName>{cert.name}</styles.CertificationName>
                {(cert.org || cert.date) && (
                  <styles.CertificationMeta>
                    {[cert.org, cert.date].filter(Boolean).join(' — ')}
                  </styles.CertificationMeta>
                )}
              </div>
            ))}
          </styles.CertificationsList>
        </>
      )}

      {/* Projects */}
      {locale.projects && locale.projects.length > 0 && (
        <>
          <styles.SectionHeading>{pt ? 'Projetos' : 'Projects'}</styles.SectionHeading>
          <styles.ProjectsList>
            {locale.projects.map((proj, i) => (
              <div key={i}>
                <styles.ProjectName>{proj.name}</styles.ProjectName>
                {proj.url && (
                  <styles.ProjectUrl>{proj.url}</styles.ProjectUrl>
                )}
                <styles.ProjectDescription>
                  {proj.description}
                </styles.ProjectDescription>
                {proj.highlights && proj.highlights.length > 0 && (
                  <styles.ProjectHighlights>
                    {proj.highlights.map((h, j) => (
                      <styles.ProjectHighlight key={j}>{h}</styles.ProjectHighlight>
                    ))}
                  </styles.ProjectHighlights>
                )}
              </div>
            ))}
          </styles.ProjectsList>
        </>
      )}
    </styles.Panel>
  )
}
