import { LinkedinOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { LinkedInResult } from '../../../../../domain/linkedin/types'
import type { ScoreVariant } from './ResultsPanel.styles'
import * as S from './ResultsPanel.styles'

interface ResultsPanelProps {
  analysis: LinkedInResult
  onReset: () => void
}

const SCORE_COLOR: Record<'weak' | 'moderate' | 'strong', ScoreVariant> = {
  weak: 'danger',
  moderate: 'warning',
  strong: 'success',
}

export function ResultsPanel({ analysis, onReset }: ResultsPanelProps) {
  const { t } = useTranslation()
  const { headlineAnalysis, aboutAudit, experienceGaps, keywordGaps, quickWins, overallScore, voiceProfile } = analysis.generation

  return (
    <S.Grid>
      <S.MainPane>
        <S.TopRow>
          <S.LinkedinBadge><LinkedinOutlined /> LinkedIn</S.LinkedinBadge>
          <S.ScoreChip>
            <S.ScoreNumber>{overallScore.score}</S.ScoreNumber>
            <S.ScoreDivider>/10</S.ScoreDivider>
          </S.ScoreChip>
        </S.TopRow>

        <S.PriorityBanner>
          <S.PriorityLabel>{t('tailoring.linkedinPriorityAction')}</S.PriorityLabel>
          <S.PriorityText>{overallScore.priorityAction}</S.PriorityText>
        </S.PriorityBanner>

        <S.SectionCard>
          <S.SectionHeader>
            <S.SectionLabel>{t('tailoring.linkedinHeadline')}</S.SectionLabel>
            <S.ScoreBadge $variant={SCORE_COLOR[headlineAnalysis.currentScore]}>
              {headlineAnalysis.currentScore}
            </S.ScoreBadge>
          </S.SectionHeader>
          <S.SubLabel>{t('tailoring.linkedinAlternatives')}</S.SubLabel>
          <S.AlternativesList>
            {headlineAnalysis.alternatives.map((alt, i) => (
              <S.AlternativeItem key={i}>{alt}</S.AlternativeItem>
            ))}
          </S.AlternativesList>
        </S.SectionCard>

        <S.SectionCard>
          <S.SectionLabel>{t('tailoring.linkedinAbout')}</S.SectionLabel>
          <S.SubLabel>{t('tailoring.linkedinIssues')}</S.SubLabel>
          <S.IssuesList>
            {aboutAudit.issues.map((issue, i) => (
              <S.IssueItem key={i}>{issue}</S.IssueItem>
            ))}
          </S.IssuesList>
          <S.SubLabel>{t('tailoring.linkedinRewrite')}</S.SubLabel>
          <S.RewriteText>{aboutAudit.rewrite}</S.RewriteText>
        </S.SectionCard>

        {experienceGaps.length > 0 && (
          <S.SectionCard>
            <S.SectionLabel>{t('tailoring.linkedinExperienceGaps')}</S.SectionLabel>
            {experienceGaps.map((gap, i) => (
              <S.GapBlock key={i}>
                <S.GapRole>{gap.role}</S.GapRole>
                <S.DiffRow>
                  <S.DiffPane>
                    <S.DiffLabel>{t('tailoring.linkedinOriginal')}</S.DiffLabel>
                    <S.DiffText>{gap.original}</S.DiffText>
                  </S.DiffPane>
                  <S.DiffPane>
                    <S.DiffLabel>{t('tailoring.linkedinImproved')}</S.DiffLabel>
                    <S.DiffText>{gap.rewrite}</S.DiffText>
                  </S.DiffPane>
                </S.DiffRow>
              </S.GapBlock>
            ))}
          </S.SectionCard>
        )}
      </S.MainPane>

      <S.SidePane>
        <S.ScoreBreakdown>
          <S.SectionLabel>{t('tailoring.linkedinStrengths')}</S.SectionLabel>
          <S.BulletList>
            {overallScore.strengths.map((s, i) => <S.BulletGreen key={i}>{s}</S.BulletGreen>)}
          </S.BulletList>
          <S.SectionLabel>{t('tailoring.linkedinBlockers')}</S.SectionLabel>
          <S.BulletList>
            {overallScore.blockers.map((b, i) => <S.BulletRed key={i}>{b}</S.BulletRed>)}
          </S.BulletList>
        </S.ScoreBreakdown>

        <S.KeywordSection>
          <S.SectionLabel>{t('tailoring.linkedinKeywordGaps')}</S.SectionLabel>
          {(['technical', 'domain', 'softSkills', 'certifications'] as const).map((cat) => (
            keywordGaps[cat].length > 0 && (
              <S.KeywordGroup key={cat}>
                <S.KeywordGroupLabel>{t(`tailoring.linkedin${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}</S.KeywordGroupLabel>
                <S.TagRow>
                  {keywordGaps[cat].map((kw) => <S.Tag key={kw}>{kw}</S.Tag>)}
                </S.TagRow>
              </S.KeywordGroup>
            )
          ))}
        </S.KeywordSection>

        <S.QuickWinsSection>
          <S.SectionLabel>{t('tailoring.linkedinQuickWins')}</S.SectionLabel>
          <S.QuickWinsList>
            {quickWins.map((win, i) => <S.QuickWinItem key={i}>{win}</S.QuickWinItem>)}
          </S.QuickWinsList>
        </S.QuickWinsSection>

        {voiceProfile && !voiceProfile.rawInputMissing && (
          <S.VoiceProfileSection>
            <S.SectionLabel>{t('tailoring.linkedinVoiceProfile')}</S.SectionLabel>
            {voiceProfile.signaturePatterns.length > 0 && (
              <>
                <S.VoiceSubLabel>{t('tailoring.linkedinSignaturePatterns')}</S.VoiceSubLabel>
                <S.BulletList>
                  {voiceProfile.signaturePatterns.map((p, i) => (
                    <S.BulletGreen key={i}>{p}</S.BulletGreen>
                  ))}
                </S.BulletList>
              </>
            )}
            <S.VoiceSubLabel>{t('tailoring.linkedinQualityNote')}</S.VoiceSubLabel>
            <S.QualityNote>{voiceProfile.qualityNote}</S.QualityNote>
          </S.VoiceProfileSection>
        )}

        <S.NewAnalysisBtn type="button" onClick={onReset}>
          {t('tailoring.linkedinReanalyze')}
        </S.NewAnalysisBtn>
      </S.SidePane>
    </S.Grid>
  )
}
