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
import * as styles from './CVTemplate.styles'

function ContactItem({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void }) {
  const content = (
    <styles.ContactItem>
      {icon}
      {label}
    </styles.ContactItem>
  )
  if (href) {
    return (
      <styles.ContactLink href={href} target="_blank" rel="noopener noreferrer">
        {icon}{label}
      </styles.ContactLink>
    )
  }
  if (onClick) {
    return (
      <styles.ContactButton type="button" onClick={onClick}>
        {icon}{label}
      </styles.ContactButton>
    )
  }
  return content
}

export function CVTemplate({ cv, locale, isMobile }: CVTemplateProps) {
  // Filter real job experience (exclude entries without company/period used as section headers)
  const jobExperience = (locale.experience ?? []).filter(
    (exp) => exp.company && exp.period
  )

  return (
    <styles.Card>
      {/* Gradient header */}
      <styles.Header>
        <styles.HeaderTitle>
          {cv.fullName}
        </styles.HeaderTitle>
        {cv.objective && (
          <styles.HeaderSubtitle>
            {cv.objective}
          </styles.HeaderSubtitle>
        )}
        <styles.ContactBar>
          {cv.location && (
            <ContactItem icon={<styles.ContactIcon><EnvironmentOutlined /></styles.ContactIcon>} label={cv.location} />
          )}
          {cv.email && (
            <ContactItem
              icon={<styles.ContactIcon><MailOutlined /></styles.ContactIcon>}
              label={cv.email}
              onClick={() => navigator.clipboard.writeText(cv.email)}
            />
          )}
          {cv.phone && (
            <ContactItem
              icon={<styles.ContactIcon><WhatsAppOutlined /></styles.ContactIcon>}
              label={cv.phone}
              href={`https://wa.me/${cv.phone.replace(/\D/g, '')}`}
            />
          )}
          {cv.linkedin && (
            <ContactItem
              icon={<styles.ContactIcon><LinkedinOutlined /></styles.ContactIcon>}
              label={cv.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, '')}
              href={/^https?:\/\//.test(cv.linkedin) ? cv.linkedin : `https://${cv.linkedin}`}
            />
          )}
          {cv.github && (
            <ContactItem
              icon={<styles.ContactIcon><GithubOutlined /></styles.ContactIcon>}
              label={cv.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              href={/^https?:\/\//.test(cv.github) ? cv.github : `https://github.com/${cv.github}`}
            />
          )}
          {cv.portfolio && (
            <ContactItem
              icon={<styles.ContactIcon><GlobalOutlined /></styles.ContactIcon>}
              label={cv.portfolio.replace(/^https?:\/\//, '')}
              href={/^https?:\/\//.test(cv.portfolio) ? cv.portfolio : `https://${cv.portfolio}`}
            />
          )}
        </styles.ContactBar>
      </styles.Header>

      {/* 2-column body */}
      <styles.BodyGrid $mobile={!!isMobile}>
        {/* LEFT column */}
        <styles.BodyColumn>
          {/* Objective (step 1) + Summary */}
          {(cv.objective || locale.summary) && (
            <>
              <styles.SectionHeading>{locale.locale === 'pt-BR' ? 'Resumo' : 'Summary'}</styles.SectionHeading>
              {cv.objective && (
                <styles.ObjectiveText>
                  {cv.objective}
                </styles.ObjectiveText>
              )}
              {locale.summary && (
                <styles.SummaryText>
                  {locale.summary}
                </styles.SummaryText>
              )}
            </>
          )}

          {/* Experience */}
          {jobExperience.length > 0 && (
            <>
              <styles.SectionHeading>{locale.locale === 'pt-BR' ? 'Experiência' : 'Experience'}</styles.SectionHeading>
              <styles.ExperienceList>
                {jobExperience.map((exp, i) => (
                  <styles.ExperienceItem key={i}>
                    <styles.ExperienceRole>
                      {exp.role} | {exp.company}
                    </styles.ExperienceRole>
                    {exp.location && (
                      <styles.ExperienceCompany>
                        {exp.location}
                      </styles.ExperienceCompany>
                    )}
                    <styles.ExperiencePeriod>
                      {exp.period}
                    </styles.ExperiencePeriod>
                    {exp.context && (
                      <styles.ExperienceContext>
                        {exp.context}
                      </styles.ExperienceContext>
                    )}
                    {(exp.highlights ?? []).length > 0 && (
                      <styles.HighlightList>
                        {(exp.highlights ?? []).map((h, j) => (
                          <styles.HighlightItem key={j}>
                            {h}
                          </styles.HighlightItem>
                        ))}
                      </styles.HighlightList>
                    )}
                  </styles.ExperienceItem>
                ))}
              </styles.ExperienceList>
            </>
          )}

          {/* Education */}
          {locale.education && locale.education.length > 0 && (
            <>
              <styles.SectionHeading>{locale.locale === 'pt-BR' ? 'Formação' : 'Education'}</styles.SectionHeading>
              <styles.EducationList>
                {locale.education.map((edu, i) => (
                  <div key={i}>
                    <styles.EducationDegree>
                      {edu.degree}
                    </styles.EducationDegree>
                    <styles.EducationInstitution>
                      {edu.institution}
                    </styles.EducationInstitution>
                    {(edu.location || edu.period) && (
                      <styles.EducationGraduation>
                        {[edu.location, edu.period].filter(Boolean).join(' | ')}
                      </styles.EducationGraduation>
                    )}
                    {edu.details && (
                      <styles.EducationDetails>
                        {edu.details}
                      </styles.EducationDetails>
                    )}
                  </div>
                ))}
              </styles.EducationList>
            </>
          )}
        </styles.BodyColumn>

        {/* RIGHT column — hidden on mobile (rendered in Drawer) */}
        {!isMobile && <CVSkillsPanel locale={locale} />}
      </styles.BodyGrid>
    </styles.Card>
  )
}
