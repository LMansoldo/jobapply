import { useTranslation } from 'react-i18next'
import { ScoreRing } from '@jobapply/ui'
import { ProgressBar } from '@jobapply/ui'
import { KeywordItem } from '../KeywordItem'
import type { ATSPanelProps } from './ATSPanel.types'
import { Panel, ScoreCenter, CategoryList, SectionTitle, KeywordList, Divider } from './ATSPanel.styles'

export function ATSPanel({ score, categories = [], keywords = [] }: ATSPanelProps) {
  const { t } = useTranslation()

  return (
    <Panel>
      <ScoreCenter>
        <ScoreRing value={score} size={120} label={t('ats.score')} sublabel="/100" />
      </ScoreCenter>

      {categories.length > 0 && (
        <div>
          <SectionTitle>{t('ats.breakdown')}</SectionTitle>
          <CategoryList>
            {categories.map((cat) => (
              <ProgressBar key={cat.name} value={cat.value} label={cat.name} />
            ))}
          </CategoryList>
        </div>
      )}

      {keywords.length > 0 && (
        <>
          <Divider />
          <div>
            <SectionTitle>{t('ats.keywords')}</SectionTitle>
            <KeywordList>
              {keywords.map((kw) => (
                <KeywordItem key={kw.keyword} keyword={kw.keyword} status={kw.status} />
              ))}
            </KeywordList>
          </div>
        </>
      )}
    </Panel>
  )
}
