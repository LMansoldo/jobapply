/**
 * @file JobFilterBar.tsx
 * @description JobFilterBar component — redesigned filter panel matching mockup.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { JobFilterBarProps } from './JobFilterBar.types'
import { FilterPanel } from '../../../../design-system/jobs/FilterPanel'
import { FilterCheckbox } from '../../../../design-system/jobs/FilterCheckbox'
import { FilterTagCloud } from '../../../../design-system/jobs/FilterTagCloud'
import { SalarySlider } from '../../../../design-system/jobs/SalarySlider'
import { DSCard } from '../../../../design-system/primitives/DSCard'
import { DSButton } from '../../../../design-system/primitives/DSButton'
import { CompanyLogo } from '../../../../design-system/jobs/CompanyLogo'
import { Colors } from '../../../../styles/theme/colors'
import { FontSize, FontWeight } from '../../../../styles/theme/typography'
import { Spacing } from '../../../../styles/theme/spacing'

const CONTRACT_OPTIONS = [
  { key: 'clt', i18nKey: 'jobs.clt', count: 1200 },
  { key: 'pj', i18nKey: 'jobs.pj', count: 843 },
  { key: 'freelance', i18nKey: 'jobs.freelance', count: 319 },
  { key: 'internship', i18nKey: 'jobs.internship', count: 207 },
]

const MODALITY_OPTIONS = [
  { key: 'remote', i18nKey: 'jobs.remote' },
  { key: 'hybrid', i18nKey: 'jobs.hybrid' },
  { key: 'onsite', i18nKey: 'jobs.onsite' },
]

const EXPERIENCE_OPTIONS = [
  { key: 'junior', i18nKey: 'jobs.junior', count: 614 },
  { key: 'mid', i18nKey: 'jobs.mid', count: 887 },
  { key: 'senior', i18nKey: 'jobs.senior', count: 723 },
  { key: 'specialist', i18nKey: 'jobs.specialist', count: 241 },
]

const TECH_TAGS_DEFAULT = [
  { label: 'React', active: false },
  { label: 'TypeScript', active: false },
  { label: 'Node.js', active: false },
  { label: 'Python', active: false },
  { label: 'Java', active: false },
  { label: 'AWS', active: false },
]

const FEATURED_COMPANIES = [
  { name: 'iFood', jobs: 24 },
  { name: 'Nubank', jobs: 18 },
  { name: 'Totvs', jobs: 31 },
  { name: 'Stone', jobs: 12 },
]

export function JobFilterBar({ filters, onFilterChange, onReload }: JobFilterBarProps) {
  const { t } = useTranslation()

  const [contractTypes, setContractTypes] = useState<string[]>(filters.contractTypes ?? [])
  const [modalities, setModalities] = useState<string[]>(filters.modalities ?? [])
  const [experienceLevels, setExperienceLevels] = useState<string[]>(filters.experienceLevels ?? [])
  const [maxSalary, setMaxSalary] = useState(filters.maxSalary ?? 40000)
  const [tags, setTags] = useState(TECH_TAGS_DEFAULT)

  function toggleArrayFilter<T extends string>(
    arr: T[],
    setArr: (v: T[]) => void,
    key: keyof typeof filters,
    val: T,
  ) {
    const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
    setArr(next)
    onFilterChange(key, next)
  }

  function handleApply() {
    onFilterChange('contractTypes', contractTypes)
    onFilterChange('modalities', modalities)
    onFilterChange('experienceLevels', experienceLevels)
    onFilterChange('maxSalary', maxSalary)
    const activeTags = tags.filter((t) => t.active).map((t) => t.label)
    onFilterChange('tags', activeTags.join(','))
    onReload()
  }

  function handleClear() {
    setContractTypes([])
    setModalities([])
    setExperienceLevels([])
    setMaxSalary(40000)
    setTags(TECH_TAGS_DEFAULT)
    onFilterChange('contractTypes', [])
    onFilterChange('modalities', [])
    onFilterChange('experienceLevels', [])
    onFilterChange('maxSalary', undefined)
    onFilterChange('tags', '')
    onReload()
  }

  return (
    <FilterPanel>
      {/* Tipo de Contrato */}
      <DSCard title={t('jobs.contractType')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {CONTRACT_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.key}
              label={t(opt.i18nKey)}
              count={opt.count}
              checked={contractTypes.includes(opt.key)}
              onChange={() => toggleArrayFilter(contractTypes, setContractTypes, 'contractTypes', opt.key)}
            />
          ))}
        </div>
      </DSCard>

      {/* Modalidade */}
      <DSCard title={t('jobs.modality')}>
        <FilterTagCloud
          tags={MODALITY_OPTIONS.map((o) => ({ label: t(o.i18nKey), active: modalities.includes(o.key) }))}
          onChange={(label) => {
            const opt = MODALITY_OPTIONS.find((o) => t(o.i18nKey) === label)
            if (opt) toggleArrayFilter(modalities, setModalities, 'modalities', opt.key)
          }}
        />
      </DSCard>

      {/* Nível de Experiência */}
      <DSCard title={t('jobs.experienceLevel')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.key}
              label={t(opt.i18nKey)}
              count={opt.count}
              checked={experienceLevels.includes(opt.key)}
              onChange={() => toggleArrayFilter(experienceLevels, setExperienceLevels, 'experienceLevels', opt.key)}
            />
          ))}
        </div>
      </DSCard>

      {/* Faixa Salarial */}
      <DSCard title={t('jobs.salaryRange')}>
        <SalarySlider value={maxSalary} onChange={setMaxSalary} />
      </DSCard>

      {/* Tecnologias */}
      <DSCard title={t('jobs.technologies')}>
        <FilterTagCloud
          tags={tags}
          onChange={(label, active) =>
            setTags((prev) => prev.map((t) => (t.label === label ? { ...t, active } : t)))
          }
        />
      </DSCard>

      {/* Botões */}
      <div style={{ display: 'flex', gap: Spacing.sm }}>
        <DSButton variant="primary" style={{ flex: 1 }} onClick={handleApply}>
          {t('jobs.apply')}
        </DSButton>
        <DSButton variant="ghost" style={{ flex: 1 }} onClick={handleClear}>
          {t('jobs.clear')}
        </DSButton>
      </div>

      {/* Empresas em Destaque */}
      <DSCard title={t('jobs.featuredCompanies')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
          {FEATURED_COMPANIES.map((co) => (
            <div key={co.name} style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, cursor: 'pointer' }}>
              <CompanyLogo name={co.name} size={32} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textMain }}>
                  {co.name}
                </p>
                <p style={{ margin: 0, fontSize: FontSize.xxs, color: Colors.textSub }}>
                  {t('jobs.openPositions', { count: co.jobs })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DSCard>
    </FilterPanel>
  )
}
