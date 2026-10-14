import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'

const PLATFORMS = [
  { value: 'greenhouse', label: 'Greenhouse' },
  { value: 'lever', label: 'Lever' },
  { value: 'workday', label: 'Workday' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'gupy', label: 'Gupy' },
]

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 0;
`

const Label = styled.span`
  font-size: 13px;
  color: var(--color-text-sub, #888);
  white-space: nowrap;
`

const Chip = styled.button<{ $selected: boolean }>`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid ${({ $selected }) => ($selected ? 'var(--color-primary, #1677ff)' : 'var(--color-border, #d9d9d9)')};
  background: ${({ $selected }) => ($selected ? 'var(--color-primary-light, #e6f4ff)' : 'transparent')};
  color: ${({ $selected }) => ($selected ? 'var(--color-primary, #1677ff)' : 'var(--color-text-sub, #888)')};
  transition: all 0.15s;
`

interface Props {
  value: string | null
  onChange: (platform: string | null) => void
}

export function AtsPlatformSelector({ value, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Label>{t('tailoring.atsPlatform', 'ATS:')}</Label>
      {PLATFORMS.map((p) => (
        <Chip
          key={p.value}
          type="button"
          $selected={value === p.value}
          onClick={() => onChange(value === p.value ? null : p.value)}
        >
          {p.label}
        </Chip>
      ))}
    </Wrapper>
  )
}
