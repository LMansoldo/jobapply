import { useEffect, useState } from 'react'
import { css } from '@emotion/css'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'

const PLATFORMS = [
  'Greenhouse',
  'Lever',
  'Workday',
  'iCIMS',
  'Gupy',
  'Vagas',
  'Catho',
  'Inhire',
  'Recruitee',
  'BambooHR',
  'Generic',
]

const DOMAIN_MAP: Array<[RegExp, string]> = [
  [/lever\.co/, 'Lever'],
  [/greenhouse\.io/, 'Greenhouse'],
  [/gupy\.io/, 'Gupy'],
  [/workday\.com|myworkdayjobs\.com/, 'Workday'],
  [/catho\.com\.br/, 'Catho'],
  [/vagas\.com\.br/, 'Vagas'],
  [/inhire\.io/, 'Inhire'],
  [/recruitee\.com/, 'Recruitee'],
  [/bamboohr\.com/, 'BambooHR'],
  [/icims\.com/, 'iCIMS'],
]

function detectPlatform(url: string): string | null {
  for (const [pattern, name] of DOMAIN_MAP) {
    if (pattern.test(url)) return name
  }
  return null
}

const wrapper = css({
  display: 'flex',
  alignItems: 'center',
  gap: Spacing.sm,
  flexWrap: 'wrap',
})

const label = css({
  fontSize: FontSize.sm,
  color: Colors.textSecondary,
  whiteSpace: 'nowrap',
})

const select = css({
  fontSize: FontSize.sm,
  padding: `${Spacing.xs} ${Spacing.sm}`,
  background: Colors.surfaceLight,
  color: Colors.textBase,
  border: `1px solid ${Colors.border}`,
  outline: 'none',
  cursor: 'pointer',
})

const detectedNote = css({
  fontSize: FontSize.xs,
  color: Colors.textMuted,
  fontStyle: 'italic',
})

interface Props {
  jobUrl?: string
  value: string | null
  onChange: (platform: string | null) => void
}

export function AtsPlatformSelector({ jobUrl, value, onChange }: Props) {
  const [autoDetected, setAutoDetected] = useState(false)

  useEffect(() => {
    if (!jobUrl) return
    const detected = detectPlatform(jobUrl)
    if (detected) {
      onChange(detected)
      setAutoDetected(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobUrl])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setAutoDetected(false)
    onChange(val === '' ? null : val)
  }

  return (
    <div className={wrapper}>
      <span className={label}>ATS platform:</span>
      <select className={select} value={value ?? ''} onChange={handleChange}>
        <option value="">All platforms (default)</option>
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      {autoDetected && value && (
        <span className={detectedNote}>(detected from job URL)</span>
      )}
    </div>
  )
}
