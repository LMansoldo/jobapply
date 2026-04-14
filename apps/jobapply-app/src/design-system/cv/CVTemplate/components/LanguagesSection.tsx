import React from 'react';
import type { Language } from '../../../../domain/cv/types';
import {
  SectionHeading,
  LanguagesContainer,
  LanguageRow,
  LanguageName,
  LanguageLevelBadge,
} from '../CVTemplate.styles';
import { getLanguageLevelStyle } from '../CVTemplate.helpers';

interface LanguagesSectionProps {
  languages: Language[];
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  if (!languages || languages.length === 0) return null;
  return (
    <>
      <SectionHeading>Idiomas</SectionHeading>
      <LanguagesContainer>
        {languages.map((lang) => {
          const { background, color } = getLanguageLevelStyle(lang.level);
          return (
            <LanguageRow key={lang.language}>
              <LanguageName>{lang.language}</LanguageName>
              <LanguageLevelBadge bgColor={background} textColor={color}>
                {lang.level}{lang.score ? ` · ${lang.score}` : ''}
              </LanguageLevelBadge>
            </LanguageRow>
          );
        })}
      </LanguagesContainer>
    </>
  );
};
