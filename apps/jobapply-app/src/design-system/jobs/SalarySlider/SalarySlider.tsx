import { Slider } from 'antd'
import { useTranslation } from 'react-i18next'
import type { SalarySliderProps } from './SalarySlider.types'
import { Colors } from '../../../styles/theme/colors'
import { FontSize, FontWeight } from '../../../styles/theme/typography'
import { Spacing } from '../../../styles/theme/spacing'

export function SalarySlider({ value, onChange, min = 3000, max = 40000 }: SalarySliderProps) {
  const { t } = useTranslation()
  const label = t('jobs.salaryUpTo', { value: Math.round(value / 1000) })

  return (
    <div style={{ padding: `0 ${Spacing.xs}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
        <span style={{ fontSize: FontSize.sm, color: Colors.textSub }}>
          R$ {(min / 1000).toFixed(0)}k
        </span>
        <span style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primaryDark }}>
          {label}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={1000}
        value={value}
        onChange={onChange}
        tooltip={{ formatter: (v) => `R$ ${((v ?? 0) / 1000).toFixed(0)}k` }}
        styles={{
          track: { background: Colors.primaryDark },
          handle: { borderColor: Colors.primaryDark },
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: Spacing.xs }}>
        <span style={{ fontSize: FontSize.xxs, color: Colors.textDisabled }}>R$ {(min / 1000).toFixed(0)}k</span>
        <span style={{ fontSize: FontSize.xxs, color: Colors.textDisabled }}>R$ {(max / 1000).toFixed(0)}k+</span>
      </div>
    </div>
  )
}
