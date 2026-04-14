import React from 'react';
import {
  SectionHeading,
  SkillsContainer,
  SkillRow,
  SkillLabelRow,
  SkillName,
  SkillPercent,
  SkillBarBackground,
  SkillBarFill,
} from '../CVTemplate.styles';

interface Skill {
  name: string;
  percent: number;
}

interface SkillsSectionProps {
  skills: Skill[];
}

/** Renders the skills section with percentage bars. */
export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (skills.length === 0) return null;
  return (
    <>
      <SectionHeading>Skills</SectionHeading>
      <SkillsContainer>
        {skills.map((skill) => (
          <SkillRow key={skill.name}>
            <SkillLabelRow>
              <SkillName>{skill.name}</SkillName>
              <SkillPercent>{skill.percent}%</SkillPercent>
            </SkillLabelRow>
            <SkillBarBackground>
              <SkillBarFill percent={skill.percent} />
            </SkillBarBackground>
          </SkillRow>
        ))}
      </SkillsContainer>
    </>
  );
};