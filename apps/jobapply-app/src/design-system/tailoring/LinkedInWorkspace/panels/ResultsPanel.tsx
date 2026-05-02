import { LinkedinOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { LinkedInAnalysis } from '../../../../domain/linkedin/types'
import * as S from './ResultsPanel.styles'

interface ResultsPanelProps {
  analysis: LinkedInAnalysis
  onReset: () => void
}

const SCORE_COLOR: Record<'weak' | 'moderate' | 'strong', string> = {
  weak: 'danger',
  moderate: 'warning',
  strong: 'success',
}

export function ResultsPanel({ analysis, onReset }: ResultsPanelProps) {
  const { t } = useTranslation()
  const { headlineAnalysis, aboutAudit, experienceGaps, keywordGaps, quickWins, overallScore } = analysis

  return (
    <div className={S.grid}>
      <div className={S.mainPane}>
        <div className={S.topRow}>
          <div className={S.linkedinBadge}><LinkedinOutlined /> LinkedIn</div>
          <div className={S.scoreChip}>
            <span className={S.scoreNumber}>{overallScore.score}</span>
            <span className={S.scoreDivider}>/10</span>
          </div>
        </div>

        <div className={S.priorityBanner}>
          <span className={S.priorityLabel}>{t('tailoring.linkedinPriorityAction')}</span>
          <p className={S.priorityText}>{overallScore.priorityAction}</p>
        </div>

        <div className={S.sectionCard}>
          <div className={S.sectionHeader}>
            <p className={S.sectionLabel}>{t('tailoring.linkedinHeadline')}</p>
            <span className={S[SCORE_COLOR[headlineAnalysis.currentScore] as keyof typeof S]}>
              {headlineAnalysis.currentScore}
            </span>
          </div>
          <p className={S.subLabel}>{t('tailoring.linkedinAlternatives')}</p>
          <ol className={S.alternativesList}>
            {headlineAnalysis.alternatives.map((alt, i) => (
              <li key={i} className={S.alternativeItem}>{alt}</li>
            ))}
          </ol>
        </div>

        <div className={S.sectionCard}>
          <p className={S.sectionLabel}>{t('tailoring.linkedinAbout')}</p>
          <p className={S.subLabel}>{t('tailoring.linkedinIssues')}</p>
          <ul className={S.issuesList}>
            {aboutAudit.issues.map((issue, i) => (
              <li key={i} className={S.issueItem}>{issue}</li>
            ))}
          </ul>
          <p className={S.subLabel}>{t('tailoring.linkedinRewrite')}</p>
          <p className={S.rewriteText}>{aboutAudit.rewrite}</p>
        </div>

        {experienceGaps.length > 0 && (
          <div className={S.sectionCard}>
            <p className={S.sectionLabel}>{t('tailoring.linkedinExperienceGaps')}</p>
            {experienceGaps.map((gap, i) => (
              <div key={i} className={S.gapBlock}>
                <p className={S.gapRole}>{gap.role}</p>
                <div className={S.diffRow}>
                  <div className={S.diffPane}>
                    <span className={S.diffLabel}>{t('tailoring.linkedinOriginal')}</span>
                    <p className={S.diffText}>{gap.original}</p>
                  </div>
                  <div className={S.diffPane}>
                    <span className={S.diffLabel}>{t('tailoring.linkedinImproved')}</span>
                    <p className={S.diffText}>{gap.rewrite}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={S.sidePane}>
        <div className={S.scoreBreakdown}>
          <p className={S.sectionLabel}>{t('tailoring.linkedinStrengths')}</p>
          <ul className={S.bulletList}>
            {overallScore.strengths.map((s, i) => <li key={i} className={S.bulletGreen}>{s}</li>)}
          </ul>
          <p className={S.sectionLabel}>{t('tailoring.linkedinBlockers')}</p>
          <ul className={S.bulletList}>
            {overallScore.blockers.map((b, i) => <li key={i} className={S.bulletRed}>{b}</li>)}
          </ul>
        </div>

        <div className={S.keywordSection}>
          <p className={S.sectionLabel}>{t('tailoring.linkedinKeywordGaps')}</p>
          {(['technical', 'domain', 'softSkills', 'certifications'] as const).map((cat) => (
            keywordGaps[cat].length > 0 && (
              <div key={cat} className={S.keywordGroup}>
                <span className={S.keywordGroupLabel}>{t(`tailoring.linkedin${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}</span>
                <div className={S.tagRow}>
                  {keywordGaps[cat].map((kw) => <span key={kw} className={S.tag}>{kw}</span>)}
                </div>
              </div>
            )
          ))}
        </div>

        <div className={S.quickWinsSection}>
          <p className={S.sectionLabel}>{t('tailoring.linkedinQuickWins')}</p>
          <ol className={S.quickWinsList}>
            {quickWins.map((win, i) => <li key={i} className={S.quickWinItem}>{win}</li>)}
          </ol>
        </div>

        {analysis.voiceProfile && (
          <div className={S.voiceProfileSection}>
            <p className={S.sectionLabel}>{t('tailoring.linkedinVoiceProfile')}</p>
            {analysis.voiceProfile.signaturePatterns.length > 0 && (
              <>
                <span className={S.voiceSubLabel}>{t('tailoring.linkedinSignaturePatterns')}</span>
                <ul className={S.bulletList}>
                  {analysis.voiceProfile.signaturePatterns.map((p, i) => (
                    <li key={i} className={S.bulletGreen}>{p}</li>
                  ))}
                </ul>
              </>
            )}
            <span className={S.voiceSubLabel}>{t('tailoring.linkedinQualityNote')}</span>
            <p className={S.qualityNote}>{analysis.voiceProfile.qualityNote}</p>
          </div>
        )}

        <button type="button" className={S.newAnalysisBtn} onClick={onReset}>
          {t('tailoring.linkedinReanalyze')}
        </button>
      </div>
    </div>
  )
}
