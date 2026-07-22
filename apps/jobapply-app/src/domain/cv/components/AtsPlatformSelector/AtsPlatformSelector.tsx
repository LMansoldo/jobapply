import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'

const PLATFORMS = [
  { value: 'greenhouse', label: 'Greenhouse' },
  { value: 'lever', label: 'Lever' },
  { value: 'workday', label: 'Workday' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'gupy', label: 'Gupy' },
]

const wrapperClass = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 0;
`

const labelClass = css`
  font-size: 13px;
  color: var(--color-text-sub, #888);
  white-space: nowrap;
`

const chipClass = (selected: boolean) => css`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid ${selected ? 'var(--color-primary, #1677ff)' : 'var(--color-border, #d9d9d9)'};
  background: ${selected ? 'var(--color-primary-light, #e6f4ff)' : 'transparent'};
  color: ${selected ? 'var(--color-primary, #1677ff)' : 'var(--color-text-sub, #888)'};
  transition: all 0.15s;
`

interface Props {
  value: string | null
  onChange: (platform: string | null) => void
}

export function AtsPlatformSelector({ value, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <div className={wrapperClass}>
      <span className={labelClass}>{t('tailoring.atsPlatform', 'ATS:')}</span>
      {PLATFORMS.map((p) => (
        <button
          key={p.value}
          type="button"
          className={chipClass(value === p.value)}
          onClick={() => onChange(value === p.value ? null : p.value)}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
