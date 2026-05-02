import React from 'react';
import type { CVLocaleVersion } from '../../../../domain/cv/types';
import {
  SectionHeading,
  SummaryText,
  ExperienceList,
  ExperienceItem,
  ExperienceRole,
  ExperienceCompany,
  ExperiencePeriod,
  HighlightList,
  HighlightItem,
} from '../CVTemplate.styles';

interface ExperienceSectionProps {
  locale: CVLocaleVersion;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ locale }) => {
  const { experience } = locale;
  if (!experience || experience.length === 0) return null;
  return (
    <>
      <SectionHeading>Experiência</SectionHeading>
      <ExperienceList>
        {experience.map((exp, idx) => (
          <ExperienceItem key={idx}>
            <ExperienceRole>{exp.role}</ExperienceRole>
            <ExperienceCompany>
              {exp.company} · {exp.location}
            </ExperienceCompany>
            <ExperiencePeriod>{exp.period}</ExperiencePeriod>
            {exp.context && <SummaryText>{exp.context}</SummaryText>}
            <HighlightList>
              {(exp.highlights ?? []).map((h, j) => (
                <HighlightItem key={j}>{h}</HighlightItem>
              ))}
            </HighlightList>
          </ExperienceItem>
        ))}
      </ExperienceList>
    </>
  );
};
