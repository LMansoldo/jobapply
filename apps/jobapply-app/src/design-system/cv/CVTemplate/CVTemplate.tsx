import {
  EnvironmentOutlined,
  MailOutlined,
  WhatsAppOutlined,
  LinkedinOutlined,
  GithubOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import type { CVTemplateProps } from './CVTemplate.types'
import { CVSkillsPanel } from '../CVSkillsPanel'
import { Colors } from '../../../styles/theme/colors'
import { FontFamily, FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

const ICON_STYLE = { fontSize: FontSize.sm, opacity: 0.85 }

function ContactItem({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void }) {
  const content = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {icon}
      {label}
    </span>
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon}{label}
      </a>
    )
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon}{label}
      </button>
    )
  }
  return content
}

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

export function CVTemplate({ cv, locale, isMobile }: CVTemplateProps) {
  // Filter real job experience (exclude entries without company/period used as section headers)
  const jobExperience = (locale.experience ?? []).filter(
    (exp) => exp.company && exp.period
  )

  return (
    <div style={{
      background: Colors.white,
      fontFamily: FontFamily.body,
      borderRadius: 0,
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
        {cv.objective && (
          <p style={{ margin: `${Spacing.xs} 0 ${Spacing.md}`, fontSize: FontSize.base, color: 'rgba(255,255,255,0.8)', fontWeight: FontWeight.medium }}>
            {cv.objective}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: `${Spacing.xs} ${Spacing.lg}`, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)' }}>
          {cv.location && (
            <ContactItem icon={<EnvironmentOutlined style={ICON_STYLE} />} label={cv.location} />
          )}
          {cv.email && (
            <ContactItem
              icon={<MailOutlined style={ICON_STYLE} />}
              label={cv.email}
              onClick={() => navigator.clipboard.writeText(cv.email)}
            />
          )}
          {cv.phone && (
            <ContactItem
              icon={<WhatsAppOutlined style={ICON_STYLE} />}
              label={cv.phone}
              href={`https://wa.me/${cv.phone.replace(/\D/g, '')}`}
            />
          )}
          {cv.linkedin && (
            <ContactItem
              icon={<LinkedinOutlined style={ICON_STYLE} />}
              label={cv.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, '')}
              href={/^https?:\/\//.test(cv.linkedin) ? cv.linkedin : `https://${cv.linkedin}`}
            />
          )}
          {cv.github && (
            <ContactItem
              icon={<GithubOutlined style={ICON_STYLE} />}
              label={cv.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              href={/^https?:\/\//.test(cv.github) ? cv.github : `https://github.com/${cv.github}`}
            />
          )}
          {cv.portfolio && (
            <ContactItem
              icon={<GlobalOutlined style={ICON_STYLE} />}
              label={cv.portfolio.replace(/^https?:\/\//, '')}
              href={/^https?:\/\//.test(cv.portfolio) ? cv.portfolio : `https://${cv.portfolio}`}
            />
          )}
        </div>
      </div>

      {/* 2-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 38%', gap: 0 }}>
        {/* LEFT column */}
        <div style={{ padding: `${Spacing.lg} ${Spacing.xl}`, borderRight: `1px solid ${Colors.surfaceBorder}` }}>
          {/* Objective (step 1) + Summary */}
          {(cv.objective || locale.summary) && (
            <>
              <SectionHeading>{locale.locale === 'pt-BR' ? 'Resumo' : 'Summary'}</SectionHeading>
              {cv.objective && (
                <p style={{ margin: `0 0 ${Spacing.xs}`, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primaryDark }}>
                  {cv.objective}
                </p>
              )}
              {locale.summary && (
                <p style={{ margin: 0, fontSize: FontSize.sm, lineHeight: 1.7, color: Colors.textMain }}>
                  {locale.summary}
                </p>
              )}
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
              <SectionHeading>{locale.locale === 'pt-BR' ? 'Formação' : 'Education'}</SectionHeading>
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

        {/* RIGHT column — hidden on mobile (rendered in Drawer) */}
        {!isMobile && <CVSkillsPanel locale={locale} />}
      </div>
    </div>
  )
}
