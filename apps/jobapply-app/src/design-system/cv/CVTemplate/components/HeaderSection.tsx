import React from 'react';
import type { CV } from '../../../../domain/cv/types';
import { Header, HeaderTitle, ContactBar } from '../CVTemplate.styles';

export interface HeaderSectionProps {
  cv: CV;
}

/**
 * Renders the header section: name and contact info bar.
 */
export const HeaderSection: React.FC<HeaderSectionProps> = ({ cv }) => (
  <Header>
    <HeaderTitle>{cv.fullName}</HeaderTitle>
    <ContactBar>
      {cv.email && <span>✉ {cv.email}</span>}
      {cv.phone && <span>📞 {cv.phone}</span>}
      {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
      {cv.location && <span>📍 {cv.location}</span>}
      {cv.github && <span>🐙 {cv.github}</span>}
      {cv.portfolio && <span>🌐 {cv.portfolio}</span>}
    </ContactBar>
  </Header>
);
