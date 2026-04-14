import React from 'react';
import type { Certification } from '../../../../domain/cv/types';
import {
  SectionHeading,
  CertificationsContainer,
  CertificationName,
  CertificationYear,
} from '../CVTemplate.styles';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  if (!certifications || certifications.length === 0) return null;
  return (
    <>
      <SectionHeading>Certificações</SectionHeading>
      <CertificationsContainer>
        {certifications.map((cert) => (
          <div key={cert.name}>
            <CertificationName>{cert.name}</CertificationName>
            <CertificationYear>{cert.organization}{cert.date ? ` · ${cert.date}` : ''}</CertificationYear>
          </div>
        ))}
      </CertificationsContainer>
    </>
  );
};
