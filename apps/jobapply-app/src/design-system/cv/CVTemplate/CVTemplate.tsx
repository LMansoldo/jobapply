import type { CVTemplateProps } from './CVTemplate.types'
import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontSize, FontWeight } from '../../../styles/theme/typography'
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

export function CVTemplate({ cv, locale }: CVTemplateProps) {
  const allSkillItems = (locale.skills ?? []).flatMap((g) => g.items)

  // Filter real job experience (exclude entries without company/period used as section headers)
  const jobExperience = (locale.experience ?? []).filter(
    (exp) => exp.company && exp.period
  )

  return (
    <div style={{
      background: Colors.white,
      fontFamily: FontFamily.body,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
    }}>
      {/* Gradient header */}
      <div style={{
        background: Colors.gradientHeroDark,
        padding: `${Spacing.xl} ${Spacing.xxl}`,
        color: Colors.white,
      }}>
        <h1 style={{
          fontFamily: FontFamily.heading,
          fontWeight: FontWeight.bold,
          fontSize: '2.8rem',
          margin: 0,
          lineHeight: 1.1,
          color: Colors.white,
        }}>
          {cv.fullName}
        </h1>
        {cv.title && (
          <p style={{ margin: `${Spacing.xs} 0 ${Spacing.md}`, fontSize: FontSize.base, color: 'rgba(255,255,255,0.8)', fontWeight: FontWeight.medium }}>
            {cv.title}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${Spacing.xs} ${Spacing.lg}`, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)' }}>
          {cv.location && <span>📍 {cv.location}</span>}
          {cv.email && <span>✉ {cv.email}</span>}
          {cv.phone && <span>📞 {cv.phone}</span>}
          {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
          {cv.github && <span>🐙 {cv.github}</span>}
          {(cv.portfolio ?? cv.website) && <span>🌐 {cv.portfolio ?? cv.website}</span>}
        </div>
      </div>

      {/* 2-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 38%', gap: 0 }}>
        {/* LEFT column */}
        <div style={{ padding: `${Spacing.lg} ${Spacing.xl}`, borderRight: `1px solid ${Colors.surfaceBorder}` }}>
          {/* Summary */}
          {locale.summary && (
            <>
              <SectionHeading>Summary</SectionHeading>
              <p style={{ fontSize: FontSize.sm, lineHeight: 1.7, color: Colors.textMain, margin: 0 }}>
                {locale.summary}
              </p>
            </>
          )}

          {/* Experience */}
          {jobExperience.length > 0 && (
            <>
              <SectionHeading>Experience</SectionHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.lg }}>
                {jobExperience.map((exp, i) => (
                  <div key={i}>
                    <p style={{ margin: 0, fontWeight: FontWeight.semibold, fontSize: FontSize.sm, color: Colors.textMain }}>
                      {exp.role} | {exp.company}
                    </p>
                    {exp.location && (
                      <p style={{ margin: `2px 0`, fontSize: FontSize.xxs, color: Colors.primaryDark, fontWeight: FontWeight.medium }}>
                        {exp.location}
                      </p>
                    )}
                    <p style={{ margin: `0 0 ${Spacing.xs}`, fontSize: FontSize.xxs, color: Colors.textSub, fontWeight: FontWeight.semibold }}>
                      {exp.period}
                    </p>
                    {exp.context && (
                      <p style={{ margin: `0 0 ${Spacing.xs}`, fontSize: FontSize.xxs, color: Colors.textSub, fontStyle: 'italic' }}>
                        {exp.context}
                      </p>
                    )}
                    {exp.highlights.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: Spacing.lg, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {exp.highlights.map((h, j) => (
                          <li key={j} style={{ fontSize: FontSize.xxs, lineHeight: 1.6, color: Colors.textMain }}>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Education */}
          {locale.education && locale.education.length > 0 && (
            <>
              <SectionHeading>Education</SectionHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
                {locale.education.map((edu, i) => (
                  <div key={i}>
                    <p style={{ margin: 0, fontWeight: FontWeight.semibold, fontSize: FontSize.sm, color: Colors.textMain }}>
                      {edu.degree}
                    </p>
                    <p style={{ margin: `2px 0`, fontSize: FontSize.xxs, color: Colors.primaryDark, fontWeight: FontWeight.medium }}>
                      {edu.institution}
                    </p>
                    {(edu.location || edu.period) && (
                      <p style={{ margin: 0, fontSize: FontSize.xxs, color: Colors.textSub }}>
                        {[edu.location, edu.period].filter(Boolean).join(' | ')}
                      </p>
                    )}
                    {edu.details && (
                      <p style={{ margin: `${Spacing.xs} 0 0`, fontSize: FontSize.xxs, color: Colors.textMain, lineHeight: 1.5 }}>
                        {edu.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT column */}
        <div style={{ padding: `${Spacing.lg} ${Spacing.xl}`, background: Colors.surfacePage }}>
          {/* Skills bars */}
          {(locale.skillPercentages ?? allSkillItems.slice(0, 5).map((s) => ({ name: s, percent: 80 }))).length > 0 && (
            <>
              <SectionHeading>Skills</SectionHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
                {(locale.skillPercentages ?? allSkillItems.slice(0, 5).map((s) => ({ name: s, percent: 80 }))).map((skill) => (
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

          {/* Skill groups */}
          {(locale.skills ?? []).length > 0 && (
            <>
              <SectionHeading>Competencies</SectionHeading>
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
              <SectionHeading>Languages</SectionHeading>
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
              <SectionHeading>Certifications</SectionHeading>
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
              <SectionHeading>Projects</SectionHeading>
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
      </div>
    </div>
  )
}
