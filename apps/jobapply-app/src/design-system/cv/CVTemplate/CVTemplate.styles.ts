import styled from '@emotion/styled';
import { Colors } from '../../../styles/theme/colors';
import { FontFamily, FontSize, FontWeight } from '../../../styles/theme/typography';
import { Spacing } from '../../../styles/theme/spacing';

// ============================================================
// Constants (no magic numbers) – all values in rem (1rem = 10px)
// ============================================================
const CARD_BORDER_RADIUS = '0.8rem';        // 8px
const CARD_BOX_SHADOW = '0 0.2rem 2rem rgba(0,0,0,0.08)'; // 0 2px 20px
const HEADER_TITLE_SIZE = '2.8rem';         // 28px
const HEADER_CONTACT_GAP = `${Spacing.xs} ${Spacing.lg}`;
const SECTION_LETTER_SPACING = '0.12rem';   // 1.2px
const SECTION_BORDER_WIDTH = '0.2rem';      // 2px
const SKILL_BAR_HEIGHT = '0.6rem';          // 6px
const SKILL_BAR_BORDER_RADIUS = '0.3rem';   // 3px
const LANGUAGE_LEVEL_PADDING = `0.2rem ${Spacing.sm}`; // 2px + Spacing.sm
const LANGUAGE_LEVEL_BORDER_RADIUS = '1.2rem';         // 12px
const ASIDE_COLUMN_WIDTH = '19%';
const BORDER_RIGHT_WIDTH = '0.1rem';        // 1px

// ============================================================
// Styled Components
// ============================================================

/** Main card container */
export const Card = styled.div`
  background: ${Colors.white};
  font-family: ${FontFamily.body};
  border-radius: ${CARD_BORDER_RADIUS};
  overflow: hidden;
  box-shadow: ${CARD_BOX_SHADOW};
`;

/** Header section with gradient background */
export const Header = styled.div`
  background: ${Colors.gradientHeroDark};
  padding: ${Spacing.xl} ${Spacing.xxl};
  color: ${Colors.white};
`;

/** Full name title */
export const HeaderTitle = styled.h1`
  font-family: ${FontFamily.heading};
  font-weight: ${FontWeight.bold};
  font-size: ${HEADER_TITLE_SIZE};
  margin: 0;
  line-height: 1.1;
  color: ${Colors.white};
`;

/** Job title / subtitle */
export const HeaderSubtitle = styled.p`
  margin: ${Spacing.xs} 0 ${Spacing.md};
  font-size: ${FontSize.base};
  color: rgba(255, 255, 255, 0.8);
  font-weight: ${FontWeight.medium};
`;

/** Row of contact information (email, phone, etc.) */
export const ContactBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${HEADER_CONTACT_GAP};
  font-size: ${FontSize.sm};
  color: rgba(255, 255, 255, 0.85);
`;

/** Three‑column grid layout */
export const ThreeColumnGrid = styled.div`
  display: grid;
  background: ${Colors.gradientAiToolbar};
  grid-template-columns: ${ASIDE_COLUMN_WIDTH} 1fr ${ASIDE_COLUMN_WIDTH};
  gap: 0;
`;

/** Main column (contains summary, experience, education, skills, languages, certifications) */
export const MainColumn = styled.div`
  padding: ${Spacing.lg} ${Spacing.xl};
  background: ${Colors.white};
  border-right: ${BORDER_RIGHT_WIDTH} solid ${Colors.surfaceBorder};
  border-left: ${BORDER_RIGHT_WIDTH} solid ${Colors.surfaceBorder};
`;

/** Section heading (e.g., "Resumo", "Experiência") */
export const SectionHeading = styled.div`
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.bold};
  color: ${Colors.primaryDark};
  text-transform: uppercase;
  letter-spacing: ${SECTION_LETTER_SPACING};
  border-bottom: ${SECTION_BORDER_WIDTH} solid ${Colors.primaryLight};
  padding-bottom: ${Spacing.xs};
  margin-bottom: ${Spacing.md};
  margin-top: ${Spacing.lg};

  &:first-of-type {
    margin-top: 0;
  }
`;

/** Summary text paragraph */
export const SummaryText = styled.p`
  font-size: ${FontSize.sm};
  line-height: 1.7;
  color: ${Colors.textMain};
  margin: 0;
`;

/** Container for all experience items */
export const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.lg};
`;

/** Single experience block */
export const ExperienceItem = styled.div``;

/** Role/title inside experience */
export const ExperienceRole = styled.p`
  margin: 0;
  font-weight: ${FontWeight.semibold};
  font-size: ${FontSize.sm};
  color: ${Colors.textMain};
`;

/** Company and location */
export const ExperienceCompany = styled.p`
  margin: 0.2rem 0;
  font-size: ${FontSize.xxs};
  color: ${Colors.primaryDark};
  font-weight: ${FontWeight.medium};
`;

/** Period of employment */
export const ExperiencePeriod = styled.p`
  margin: 0 0 ${Spacing.sm};
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};
`;

/** Unordered list of highlights */
export const HighlightList = styled.ul`
  margin: 0;
  padding-left: ${Spacing.lg};
  display: flex;
  flex-direction: column;
  gap: 0.4rem; /* 4px */
`;

/** Single highlight item */
export const HighlightItem = styled.li`
  font-size: ${FontSize.xxs};
  line-height: 1.6;
  color: ${Colors.textMain};
`;

/** Education degree text */
export const EducationDegree = styled.p`
  margin: 0;
  font-weight: ${FontWeight.semibold};
  font-size: ${FontSize.sm};
  color: ${Colors.textMain};
`;

/** Education institution */
export const EducationInstitution = styled.p`
  margin: 0.2rem 0;
  font-size: ${FontSize.xxs};
  color: ${Colors.primaryDark};
`;

/** Education graduation year/date */
export const EducationGraduation = styled.p`
  margin: 0;
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};
`;

/** Container for skills section */
export const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`;

/** Row for a single skill (label + bar) */
export const SkillRow = styled.div``;

/** Row containing skill name and percentage */
export const SkillLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem; /* 4px */
`;

/** Skill name text */
export const SkillName = styled.span`
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.medium};
  color: ${Colors.textMain};
`;

/** Percentage text */
export const SkillPercent = styled.span`
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};
`;

/** Background track of skill bar */
export const SkillBarBackground = styled.div`
  height: ${SKILL_BAR_HEIGHT};
  background: ${Colors.surfaceBorder};
  border-radius: ${SKILL_BAR_BORDER_RADIUS};
  overflow: hidden;
`;

/** Filled portion of skill bar – width is dynamic */
export const SkillBarFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => `${percent}%`};
  background: ${Colors.gradientProgressBar};
  border-radius: ${SKILL_BAR_BORDER_RADIUS};
`;

/** Container for languages section */
export const LanguagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`;

/** Row for a single language (name + badge) */
export const LanguageRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/** Language name text */
export const LanguageName = styled.span`
  font-size: ${FontSize.xxs};
  color: ${Colors.textMain};
  font-weight: ${FontWeight.medium};
`;

/** Badge displaying language level */
export const LanguageLevelBadge = styled.span<{ bgColor: string; textColor: string }>`
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.medium};
  padding: ${LANGUAGE_LEVEL_PADDING};
  border-radius: ${LANGUAGE_LEVEL_BORDER_RADIUS};
  background: ${({ bgColor }) => bgColor};
  color: ${({ textColor }) => textColor};
`;

/** Container for certifications section */
export const CertificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.sm};
`;

/** Certification name */
export const CertificationName = styled.p`
  margin: 0;
  font-size: ${FontSize.xxs};
  font-weight: ${FontWeight.semibold};
  color: ${Colors.textMain};
`;

/** Certification year */
export const CertificationYear = styled.p`
  margin: 0;
  font-size: ${FontSize.xxs};
  color: ${Colors.textSub};
`;