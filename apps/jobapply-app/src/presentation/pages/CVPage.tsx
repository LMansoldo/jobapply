/**
 * @file CVPage.tsx
 * @description CV management page. Orchestrates state and step flow for the CV wizard.
 * Sub-components live in src/domain/cv/components/.
 */
import { useState, useEffect } from 'react'
import { Grid } from 'antd'
import {
  CheckOutlined,
  DeleteOutlined,
  FileTextOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../application/providers/AuthProvider'
import { useAntApp } from '../../components/AntApp'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Form } from '../../components/Form'
import { Popconfirm } from '../../components/Popconfirm'
import { Space } from '../../components/Space'
import { Spin } from '../../components/Spin'
import { Steps } from '../../components/Steps'
import { Tag } from '../../components/Tag'
import { Title } from '../../components/Typography'
import { CVBaseForm } from '../../domain/cv/components/CVBaseForm'
import { CVViewer } from '../../domain/cv/components/CVViewer'
import { MonacoEditorPanel } from '../../domain/cv/components/MonacoEditorPanel'
import { EN_TEMPLATE, PT_BR_TEMPLATE } from '../../domain/cv/constants'
import { localeVersionToMarkdown, parseMarkdownToLocale } from '../../domain/cv/helpers'
import type { CV, CVCreatePayload } from '../../domain/cv/types'
import {
  createCV,
  deleteCV,
  getCV,
  updateCV,
  updateCVLocale,
} from '../../infrastructure/repositories/cvRepository'
import { Colors } from '../../styles/theme/colors'
import { FontSize } from '../../styles/theme/typography'
import { Spacing } from '../../styles/theme/spacing'

const { useBreakpoint } = Grid

/** CSS injected globally for markdown preview rendering inside the editor panel. */
const PREVIEW_CSS = `
  .markdown-preview h1 { font-size: ${FontSize.xxl}; font-weight: 700; margin: 0 0 ${Spacing.sm}; border-bottom: ${Spacing.xxs} solid ${Colors.info}; padding-bottom: ${Spacing.sm2}; }
  .markdown-preview h2 { font-size: ${FontSize.md2}; font-weight: 600; margin: ${Spacing.lg0} 0 ${Spacing.sm2}; color: ${Colors.textSecondary}; }
  .markdown-preview h3 { font-size: ${FontSize.md0}; font-weight: 600; margin: ${Spacing.md0} 0 ${Spacing.xs}; }
  .markdown-preview p { margin: ${Spacing.xs} 0; font-size: ${FontSize.md0}; line-height: 1.6; }
  .markdown-preview ul { margin: ${Spacing.xs} 0; padding-left: ${Spacing.lg1}; }
  .markdown-preview li { font-size: ${FontSize.md0}; line-height: 1.6; margin: ${Spacing.xxs} 0; }
  .markdown-preview strong { font-weight: 600; }
  .markdown-preview em { color: ${Colors.textMuted}; }
  .markdown-preview hr { border: none; border-top: ${Spacing.px} solid ${Colors.borderLighter}; margin: ${Spacing.md1} 0; }
  .markdown-preview blockquote { border-left: ${Spacing.xxs} solid ${Colors.border}; margin: ${Spacing.sm} 0; padding-left: ${Spacing.md1}; color: ${Colors.textHint}; }
  .markdown-preview code { font-size: ${FontSize.sm}; background: ${Colors.surfaceLight}; padding: ${Spacing.px} ${Spacing.xs}; border-radius: ${Spacing.xxs}; }
`

/**
 * CV page — three-step wizard (base info → PT-BR markdown → EN markdown).
 * When a CV with PT-BR content already exists, shows the viewer instead.
 */
export default function CVPage() {
  const { cvId, setCvId } = useAuth()
  const { message } = useAntApp()
  const { t } = useTranslation()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [cv, setCv] = useState<CV | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [editMode, setEditMode] = useState(false)

  const [baseForm] = Form.useForm<CVCreatePayload>()

  const [ptBrMarkdown, setPtBrMarkdown] = useState(PT_BR_TEMPLATE)
  const [ptBrErrors, setPtBrErrors] = useState<string[]>([])

  const [enMarkdown, setEnMarkdown] = useState(EN_TEMPLATE)
  const [enErrors, setEnErrors] = useState<string[]>([])

  /** Loads the CV on mount if a cvId is known. */
  useEffect(() => {
    if (!cvId) { setLoading(false); return }
    getCV(cvId).then(applyCV).catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Persists PT-BR markdown draft to localStorage on change. */
  useEffect(() => {
    if (cv?._id) localStorage.setItem(`cv_md_ptbr_${cv._id}`, ptBrMarkdown)
  }, [ptBrMarkdown, cv?._id])

  /** Persists EN markdown draft to localStorage on change. */
  useEffect(() => {
    if (cv?._id) localStorage.setItem(`cv_md_en_${cv._id}`, enMarkdown)
  }, [enMarkdown, cv?._id])

  /**
   * Applies loaded CV data to local state, populating form fields and markdown editors.
   * Server data always takes priority over localStorage drafts.
   * @param data - CV object returned from the repository
   */
  function applyCV(data: CV) {
    setCv(data)
    setCvId(data._id)
    baseForm.setFieldsValue({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      linkedin: data.linkedin,
      languages: data.languages,
    })

    const ptBrVersion = data.localeVersions?.find((v) => v.locale === 'pt-BR')
    const enVersion = data.localeVersions?.find((v) => v.locale === 'en')

    setPtBrMarkdown(ptBrVersion
      ? localeVersionToMarkdown(ptBrVersion)
      : (localStorage.getItem(`cv_md_ptbr_${data._id}`) ?? PT_BR_TEMPLATE))

    setEnMarkdown(enVersion
      ? localeVersionToMarkdown(enVersion)
      : (localStorage.getItem(`cv_md_en_${data._id}`) ?? EN_TEMPLATE))

    setEditMode(!ptBrVersion)
    setCurrentStep(ptBrVersion ? 1 : 1)
    setLoading(false)
  }

  /** Validates base form and saves personal info before advancing to step 1. */
  async function handleStep1Next() {
    try {
      const values = await baseForm.validateFields()
      setSaving(true)
      try {
        const updated = cv ? await updateCV(cv._id, values) : await createCV(values)
        applyCV(updated)
        setCurrentStep(1)
        message.success(t('cv.savePersonalInfo'))
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t('cv.savePersonalError')
        message.error(msg)
      } finally {
        setSaving(false)
      }
    } catch {
      // AntD Form shows inline validation errors automatically
    }
  }

  /** Parses PT-BR markdown, validates it, and saves the locale version. */
  async function handleStep2Next() {
    const result = parseMarkdownToLocale(ptBrMarkdown, 'pt-BR')
    if (result.errors.length > 0) { setPtBrErrors(result.errors); return }
    setPtBrErrors([])
    if (!cv) { message.error(t('cv.saveFirst')); setCurrentStep(0); return }
    setSaving(true)
    try {
      await updateCVLocale(cv._id, 'pt-BR', result.data!)
      message.success(t('cv.savePtBrSuccess'))
      setCurrentStep(2)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t('cv.savePtBrError')
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  /** Parses EN markdown (if changed), validates it, and saves the locale version. */
  async function handleStep3Finish() {
    if (enMarkdown.trim() === EN_TEMPLATE.trim()) { message.success(t('cv.registerSuccess')); return }
    const result = parseMarkdownToLocale(enMarkdown, 'en')
    if (result.errors.length > 0) { setEnErrors(result.errors); return }
    setEnErrors([])
    if (!cv) return
    setSaving(true)
    try {
      await updateCVLocale(cv._id, 'en', result.data!)
      message.success(t('cv.saveEnSuccess'))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t('cv.saveEnError')
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  /** Skips the EN step and marks the CV as complete. */
  function handleSkipEn() {
    setEnErrors([])
    message.success(t('cv.skipEnSuccess'))
  }

  /** Deletes the current CV and resets all state. */
  async function handleDelete() {
    if (!cv) return
    setSaving(true)
    try {
      await deleteCV(cv._id)
      setCv(null)
      setCvId(null)
      baseForm.resetFields()
      setPtBrMarkdown(PT_BR_TEMPLATE)
      setEnMarkdown(EN_TEMPLATE)
      setPtBrErrors([])
      setEnErrors([])
      setCurrentStep(0)
      message.success(t('cv.deleteSuccess'))
    } catch {
      message.error(t('cv.deleteError'))
    } finally {
      setSaving(false)
    }
  }

  const ptBrDone = cv?.localeVersions?.some((v) => v.locale === 'pt-BR') ?? false
  const enDone = cv?.localeVersions?.some((v) => v.locale === 'en') ?? false

  /**
   * Returns the status of a wizard step for the Steps component.
   * @param idx - Step index (0, 1, or 2)
   */
  function getStepStatus(idx: number): 'wait' | 'process' | 'finish' | 'error' {
    if (idx === 0) return cv ? 'finish' : currentStep === 0 ? 'process' : 'wait'
    if (idx === 1) return ptBrDone ? 'finish' : currentStep === 1 ? 'process' : 'wait'
    if (idx === 2) return enDone ? 'finish' : currentStep === 2 ? 'process' : 'wait'
    return 'wait'
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: Spacing.xxxl }}>
        <Spin size="large" tip={t('cv.loadingCV')} />
      </div>
    )
  }

  const pageHeader = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl0 }}>
      <Space align="center">
        <FileTextOutlined style={{ fontSize: FontSize.xxl, color: Colors.info }} />
        <Title level={3} style={{ margin: 0 }}>{t('cv.title')}</Title>
      </Space>
    </div>
  )

  const previewCssTag = <style>{PREVIEW_CSS}</style>

  // ── Viewer mode (CV exists and not editing) ──────────────────────────────
  if (cv && !editMode) {
    return (
      <div style={{ maxWidth: Spacing.pageMaxWidth, margin: '0 auto', padding: `${Spacing.lg} ${Spacing.md}` }}>
        {pageHeader}
        <CVViewer cv={cv} onEdit={() => { setCurrentStep(0); setEditMode(true) }} isMobile={isMobile} />
        <div style={{ marginTop: Spacing.lg, display: 'flex', justifyContent: 'center' }}>
          <Popconfirm
            title={t('cv.deleteCVTitle')}
            description={t('cv.deleteCVConfirm')}
            onConfirm={handleDelete}
            okText={t('common.delete')}
            okButtonProps={{ danger: true }}
            cancelText={t('common.cancel')}
          >
            <Button danger icon={<DeleteOutlined />} loading={saving}>
              {t('cv.deleteCV')}
            </Button>
          </Popconfirm>
        </div>
        {previewCssTag}
      </div>
    )
  }

  // ── Step content ──────────────────────────────────────────────────────────
  const stepContent = (
    <>
      {currentStep === 0 && (
        <CVBaseForm
          form={baseForm}
          isMobile={isMobile}
          hasCv={!!cv}
          saving={saving}
          onNext={handleStep1Next}
          onBack={() => setEditMode(false)}
        />
      )}

      {currentStep === 1 && (
        <Card bodyStyle={{ padding: isMobile ? Spacing.md1 : `${Spacing.md} ${Spacing.lg1}` }}>
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: Spacing.md2 }}
            message={t('cv.editor.ptbrHint')}
            description={isMobile ? undefined : t('cv.editor.ptbrHintDetail')}
          />
          <MonacoEditorPanel value={ptBrMarkdown} onChange={setPtBrMarkdown} errors={ptBrErrors} />
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: Spacing.md }}>
              <Button icon={<CheckOutlined />} onClick={() => setCurrentStep(0)}>{t('common.back')}</Button>
              <Button type="primary" onClick={handleStep2Next} loading={saving}>
                {t('cv.editor.validateAndContinue')}
              </Button>
            </div>
          )}
        </Card>
      )}

      {currentStep === 2 && (
        <Card bodyStyle={{ padding: isMobile ? Spacing.md1 : `${Spacing.md} ${Spacing.lg1}` }}>
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: Spacing.md2 }}
            message={
              <Space>
                {t('cv.editor.enHint')}
                <Tag color="blue" style={{ fontSize: FontSize.xxs, lineHeight: Spacing.md, padding: `0 ${Spacing.xs}` }}>
                  {t('common.optional')}
                </Tag>
              </Space>
            }
            description={isMobile ? undefined : t('cv.editor.enHintDetail')}
          />
          <MonacoEditorPanel value={enMarkdown} onChange={setEnMarkdown} errors={enErrors} />
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: Spacing.md }}>
              <Button onClick={() => setCurrentStep(1)}>{t('common.back')}</Button>
              <Space>
                <Button onClick={handleSkipEn}>{t('cv.editor.skipStep')}</Button>
                <Button type="primary" onClick={handleStep3Finish} loading={saving} icon={<CheckOutlined />}>
                  {t('cv.editor.validateAndFinish')}
                </Button>
              </Space>
            </div>
          )}
        </Card>
      )}
    </>
  )

  // ── Mobile bottom nav bar ─────────────────────────────────────────────────
  const mobileBottomNav = isMobile && (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: Colors.white, borderTop: `${Spacing.px} solid ${Colors.borderLight}`,
      display: 'flex', height: Spacing.mobileNavHeight,
    }}>
      {[
        { step: 0, icon: <UserOutlined />, label: t('cv.mobile.base') },
        { step: 1, icon: <FileTextOutlined />, label: t('cv.mobile.ptbr') },
        { step: 2, icon: <GlobalOutlined />, label: t('cv.mobile.en') },
      ].map(({ step, icon, label }) => {
        const done = step === 0 ? !!cv : step === 1 ? ptBrDone : enDone
        const active = currentStep === step
        return (
          <button
            key={step}
            onClick={() => (cv || step === 0) ? setCurrentStep(step) : undefined}
            style={{
              flex: 1, border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: Spacing.xxs,
              color: active ? Colors.info : done ? Colors.success : Colors.textDisabled,
              borderTop: active ? `${Spacing.xxs} solid ${Colors.info}` : `${Spacing.xxs} solid transparent`,
              padding: `${Spacing.sm2} 0`,
            }}
          >
            <span style={{ fontSize: FontSize.lg }}>{icon}</span>
            <span style={{ fontSize: FontSize.xs, fontWeight: active ? 600 : 400 }}>{label}</span>
          </button>
        )
      })}
      <div style={{ width: Spacing.px, background: Colors.borderLight, alignSelf: 'stretch', margin: `${Spacing.sm} 0` }} />
      <button
        onClick={currentStep === 0 ? handleStep1Next : currentStep === 1 ? handleStep2Next : handleStep3Finish}
        disabled={saving}
        style={{
          flex: 1.2, border: 'none', background: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: Spacing.xxs,
          color: Colors.info, padding: `${Spacing.sm2} 0`,
        }}
      >
        <span style={{ fontSize: FontSize.lg }}><CheckOutlined /></span>
        <span style={{ fontSize: FontSize.xs, fontWeight: 600 }}>
          {currentStep === 2 ? t('cv.mobile.finish') : t('cv.mobile.save')}
        </span>
      </button>
    </div>
  )

  // ── Editor mode (steps wizard) ────────────────────────────────────────────
  return (
    <div style={{ maxWidth: Spacing.pageMaxWidth, margin: '0 auto', paddingBottom: isMobile ? Spacing.mobileNavPad : 0 }}>
      {pageHeader}

      {!isMobile && (
        <Steps
          current={currentStep}
          onChange={cv ? setCurrentStep : undefined}
          style={{ marginBottom: Spacing.xl0 }}
          items={[
            { title: t('cv.steps.base'), description: t('cv.steps.baseDescription'), status: getStepStatus(0) },
            { title: t('cv.steps.ptbr'), description: t('cv.steps.ptbrDescription'), status: getStepStatus(1) },
            {
              title: (
                <Space size={4}>
                  {t('cv.steps.en')}
                  <Tag color="blue" style={{ fontSize: FontSize.xxs, lineHeight: Spacing.md, padding: `0 ${Spacing.xs}` }}>
                    {t('common.optional')}
                  </Tag>
                </Space>
              ),
              description: t('cv.steps.enDescription'),
              status: getStepStatus(2),
            },
          ]}
        />
      )}

      {stepContent}
      {mobileBottomNav}
      {previewCssTag}
    </div>
  )
}
