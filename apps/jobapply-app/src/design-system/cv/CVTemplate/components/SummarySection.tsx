import React from 'react';
import type { CVLocaleVersion } from '../../../../domain/cv/types';
import { SectionHeading, SummaryText } from '../CVTemplate.styles';

interface SummarySectionProps {
  locale: CVLocaleVersion;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ locale }) => (
  <>
    <SectionHeading>Resumo</SectionHeading>
    <SummaryText>{locale.summary}</SummaryText>
  </>
);
