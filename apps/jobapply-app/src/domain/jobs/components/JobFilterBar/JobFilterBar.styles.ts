import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'

export const checkboxList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const filterBtns = css({
  display: 'flex',
  gap: Spacing.sm,
})

export const filterBtnFlex = css({
  flex: 1,
})

export const companiesList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: Spacing.sm,
})

export const companyRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.md,
  cursor: 'pointer',
})

export const companyInfo = css({
  flex: 1,
})

export const companyName = css({
  margin: 0,
  fontSize: FontSize.sm,
  fontWeight: FontWeight.medium,
  color: Colors.textMain,
})

export const companyJobs = css({
  margin: 0,
  fontSize: FontSize.xxs,
  color: Colors.textSub,
})
