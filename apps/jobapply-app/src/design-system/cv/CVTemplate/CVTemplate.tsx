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
  const allSkillItems = locale.skills.tech.flatMap((g) => g.items)

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
          {cv.email && <span>✉ {cv.email}</span>}
          {cv.phone && <span>📞 {cv.phone}</span>}
          {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
          {cv.location && <span>📍 {cv.location}</span>}
          {cv.github && <span>🐙 {cv.github}</span>}
          {cv.website && <span>🌐 {cv.website}</span>}
        </div>
      </div>

      {/* 2-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 38%', gap: 0 }}>
        {/* LEFT column */}
        <div style={{ padding: `${Spacing.lg} ${Spacing.xl}`, borderRight: `1px solid ${Colors.surfaceBorder}` }}>
          {/* Resumo */}
          <SectionHeading>Resumo</SectionHeading>
          <p style={{ fontSize: FontSize.sm, lineHeight: 1.7, color: Colors.textMain, margin: 0 }}>
            {locale.summary.headline}
          </p>

          {/* Experiência */}
          {locale.experience.length > 0 && (
            <>
              <SectionHeading>Experiência</SectionHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.lg }}>
                {locale.experience.map((exp, i) => (
                  <div key={i}>
                    <p style={{ margin: 0, fontWeight: FontWeight.semibold, fontSize: FontSize.sm, color: Colors.textMain }}>
                      {exp.role}
                    </p>
                    <p style={{ margin: `2px 0`, fontSize: FontSize.xxs, color: Colors.primaryDark, fontWeight: FontWeight.medium }}>
                      {exp.company} · {exp.location}
                    </p>
                    <p style={{ margin: `0 0 ${Spacing.sm}`, fontSize: FontSize.xxs, color: Colors.textSub }}>
                      {exp.period}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: Spacing.lg, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {exp.highlights.map((h, j) => (
                        <li key={j} style={{ fontSize: FontSize.xxs, lineHeight: 1.6, color: Colors.textMain }}>
                          {h.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Educação */}
          <SectionHeading>Educação</SectionHeading>
          <p style={{ margin: 0, fontWeight: FontWeight.semibold, fontSize: FontSize.sm, color: Colors.textMain }}>
            {locale.education.degree}
          </p>
          <p style={{ margin: `2px 0`, fontSize: FontSize.xxs, color: Colors.primaryDark }}>
            {locale.education.institution}
          </p>
          <p style={{ margin: 0, fontSize: FontSize.xxs, color: Colors.textSub }}>{locale.education.graduation}</p>
        </div>

        {/* RIGHT column */}
        <div style={{ padding: `${Spacing.lg} ${Spacing.xl}`, background: Colors.surfacePage }}>
          {/* Skills */}
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

          {/* Idiomas */}
          {locale.languageLevels && locale.languageLevels.length > 0 && (
            <>
              <SectionHeading>Idiomas</SectionHeading>
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

          {/* Certificações */}
          {locale.certifications && locale.certifications.length > 0 && (
            <>
              <SectionHeading>Certificações</SectionHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
                {locale.certifications.map((cert) => (
                  <div key={cert.name}>
                    <p style={{ margin: 0, fontSize: FontSize.xxs, fontWeight: FontWeight.semibold, color: Colors.textMain }}>{cert.name}</p>
                    <p style={{ margin: 0, fontSize: FontSize.xxs, color: Colors.textSub }}>{cert.year}</p>
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
