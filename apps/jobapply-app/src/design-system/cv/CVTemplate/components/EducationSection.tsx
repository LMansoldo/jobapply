import React from 'react';
import type { Education } from '../../../../domain/cv/types';
import {
  SectionHeading,
  EducationDegree,
  EducationInstitution,
  EducationGraduation,
} from '../CVTemplate.styles';

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  if (!education || education.length === 0) return null;
  return (
    <>
      <SectionHeading>Educação</SectionHeading>
      {education.map((edu, idx) => (
        <div key={idx}>
          <EducationDegree>{edu.degree}{edu.field ? ` em ${edu.field}` : ''}</EducationDegree>
          <EducationInstitution>{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</EducationInstitution>
          <EducationGraduation>{edu.period}</EducationGraduation>
        </div>
      ))}
    </>
  );
};
