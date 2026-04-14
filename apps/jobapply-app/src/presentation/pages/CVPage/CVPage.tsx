/**
 * @file CVPage.tsx
 * @description CV management page — horizontal stepper, viewer mode with CVTemplate, wizard with rich editor.
 */
import { useState, useEffect } from 'react'
import { Grid } from '../../../components/Grid'
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../application/providers/AuthProvider'
import { useAntApp } from '../../../components/AntApp'
import { Button } from '../../../components/Button'
import { Form } from '../../../components/Form'
import { Popconfirm } from '../../../components/Popconfirm'
import { Space } from '../../../components/Space'
import { Spin } from '../../../components/Spin'
import { CVViewer } from '../../../domain/cv/components/CVViewer'
import { CVBaseForm } from '../../../domain/cv/components/CVBaseForm'
import { MonacoEditorPanel } from '../../../domain/cv/components/MonacoEditorPanel'
import { EN_TEMPLATE, PT_BR_TEMPLATE } from '../../../domain/cv/constants'
import { localeVersionToMarkdown, parseMarkdownToLocale } from '../../../domain/cv/helpers'
import type { CV, CVCreatePayload } from '../../../domain/cv/types'
import {
  createCV,
  deleteCV,
  getCV,
  updateCV,
  updateCVLocale,
} from '../../../infrastructure/repositories/cvRepository'
import { HorizontalStepper } from '../../../design-system/cv/HorizontalStepper'
import * as styles from './CVPage.styles'

const { useBreakpoint } = Grid

const PREVIEW_CSS = `
  .markdown-preview h1 { font-size: 2.2rem; font-weight: 700; margin: 0 0 0.8rem; border-bottom: 2px solid #7c3aed; padding-bottom: 0.6rem; }
  .markdown-preview h2 { font-size: 1.5rem; font-weight: 600; margin: 1.8rem 0 0.6rem; color: #6b7280; }
  .markdown-preview h3 { font-size: 1.3rem; font-weight: 600; margin: 1.0rem 0 0.4rem; }
  .markdown-preview p { margin: 0.4rem 0; font-size: 1.3rem; line-height: 1.6; }
  .markdown-preview ul { margin: 0.4rem 0; padding-left: 2.0rem; }
  .markdown-preview li { font-size: 1.3rem; line-height: 1.6; margin: 0.2rem 0; }
  .markdown-preview strong { font-weight: 600; }
  .markdown-preview em { color: #555; }
  .markdown-preview hr { border: none; border-top: 1px solid #e9e4fc; margin: 1.4rem 0; }
  .markdown-preview code { font-size: 1.2rem; background: #f5f5f5; padding: 1px 4px; border-radius: 3px; }
`

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

  useEffect(() => {
    if (!cvId) { setLoading(false); return }
    getCV(cvId).then(applyCV).catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (cv?._id) localStorage.setItem(`cv_md_ptbr_${cv._id}`, ptBrMarkdown)
  }, [ptBrMarkdown, cv?._id])

  useEffect(() => {
    if (cv?._id) localStorage.setItem(`cv_md_en_${cv._id}`, enMarkdown)
  }, [enMarkdown, cv?._id])

  function applyCV(data: CV) {
    setCv(data)
    setCvId(data._id)
    baseForm.setFieldsValue({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      linkedin: data.linkedin,
      github: data.github,
      portfolio: data.portfolio,
    })

    const ptBrVersion = data.localeVersions?.find((v) => v.locale === 'pt-BR')
    const enVersion = data.localeVersions?.find((v) => v.locale === 'en')

    setPtBrMarkdown(ptBrVersion
      ? localeVersionToMarkdown(ptBrVersion, data.languages)
      : (localStorage.getItem(`cv_md_ptbr_${data._id}`) ?? PT_BR_TEMPLATE))

    setEnMarkdown(enVersion
      ? localeVersionToMarkdown(enVersion, data.languages)
      : (localStorage.getItem(`cv_md_en_${data._id}`) ?? EN_TEMPLATE))

    setEditMode(false)
    setCurrentStep(0)
    setLoading(false)
  }
  async function handleStep1Next() {
    try {
      const values = await baseForm.validateFields()
      setSaving(true)
      try {
        const updated = cv ? await updateCV(cv._id, values) : await createCV(values)
        applyCV(updated)
        setCurrentStep(1)
        setEditMode(true)
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

  async function handleStep2Next() {
    const result = parseMarkdownToLocale(ptBrMarkdown, 'pt-BR')
    if (result.errors.length > 0) { setPtBrErrors(result.errors); return }
    setPtBrErrors([])
    if (!cv) { message.error(t('cv.saveFirst')); setCurrentStep(0); return }
    setSaving(true)
    try {
      const saves: Promise<unknown>[] = [updateCVLocale(cv._id, 'pt-BR', result.data!)]
      if (result.languages?.length) saves.push(updateCV(cv._id, { fullName: cv.fullName, email: cv.email, languages: result.languages }))
      await Promise.all(saves)
      message.success(t('cv.savePtBrSuccess'))
      setCurrentStep(2)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t('cv.savePtBrError')
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  async function handleStep3Finish() {
    if (enMarkdown.trim() === EN_TEMPLATE.trim()) { message.success(t('cv.registerSuccess')); setEditMode(false); return }
    const result = parseMarkdownToLocale(enMarkdown, 'en')
    if (result.errors.length > 0) { setEnErrors(result.errors); return }
    setEnErrors([])
    if (!cv) return
    setSaving(true)
    try {
      const saves: Promise<unknown>[] = [updateCVLocale(cv._id, 'en', result.data!)]
      if (result.languages?.length) saves.push(updateCV(cv._id, { fullName: cv.fullName, email: cv.email, languages: result.languages }))
      await Promise.all(saves)
      message.success(t('cv.saveEnSuccess'))
      setEditMode(false)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t('cv.saveEnError')
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  function handleSkipEn() {
    setEnErrors([])
    message.success(t('cv.skipEnSuccess'))
    setEditMode(false)
  }

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

  if (loading) {
    return (
      <div className={styles.spinWrapper}>
        <Spin size="large" tip={t('cv.loadingCV')} />
      </div>
    )
  }

  const previewCssTag = <style>{PREVIEW_CSS}</style>

  // ── Viewer mode ──────────────────────────────────────────────────────────
  if (cv && !editMode) {
    return (
      <>
        <div className={styles.viewerRoot}>
          <div className={styles.viewerTopBar}>
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
          <CVViewer cv={cv} onEdit={() => { setCurrentStep(0); setEditMode(true) }} isMobile={isMobile} />
        </div>
        {previewCssTag}
      </>
    )
  }

  // ── Wizard steps ──────────────────────────────────────────────────────────
  const WIZARD_STEPS = [
    { label: t('cv.steps.base'), sublabel: t('cv.steps.baseDescription') },
    { label: t('cv.steps.ptbr'), sublabel: t('cv.steps.ptbrDescription') },
    { label: t('cv.steps.en'), sublabel: t('cv.steps.enDescription') },
  ]

  const stepLabel = t('cv.stepCounter', { current: currentStep + 1, total: WIZARD_STEPS.length })

  // ── Mobile bottom nav bar ─────────────────────────────────────────────────
  const mobileBottomNav = isMobile && (
    <div className={styles.mobileBottomNav}>
      <button
        onClick={currentStep === 0 ? handleStep1Next : currentStep === 1 ? handleStep2Next : handleStep3Finish}
        disabled={saving}
        className={styles.mobileNavBtn}
      >
        {saving && <CheckOutlined className={styles.savingIcon} />}
        {currentStep === 2 ? t('cv.mobile.finish') : t('cv.mobile.save')}
      </button>
    </div>
  )

  return (
    <>
      <div className={styles.wizardRoot}>
        <HorizontalStepper
          steps={WIZARD_STEPS}
          current={currentStep}
          onStepClick={cv ? (step) => setCurrentStep(step) : undefined}
        />

        <div className={styles.stepContent(isMobile)}>
          {currentStep === 0 && (
            <CVBaseForm
              form={baseForm}
              isMobile={isMobile}
              hasCv={!!cv}
              saving={saving}
              stepLabel={stepLabel}
              onNext={handleStep1Next}
              onBack={() => setEditMode(false)}
            />
          )}

          {currentStep === 1 && (
            <div>
              <MonacoEditorPanel
                value={ptBrMarkdown}
                onChange={setPtBrMarkdown}
                errors={ptBrErrors}
                locale="pt-BR"
              />
              {!isMobile && (
                <div className={styles.editorFooter}>
                  <Button onClick={() => setCurrentStep(0)}>{t('common.back')}</Button>
                  <Space>
                    <span className={styles.footerStepLabel}>{stepLabel}</span>
                    <Button type="primary" onClick={handleStep2Next} loading={saving}>{t('cv.editor.validateAndContinue')}</Button>
                  </Space>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <MonacoEditorPanel
                value={enMarkdown}
                onChange={setEnMarkdown}
                errors={enErrors}
                locale="en"
                isOptional
                isEmpty={enMarkdown.trim() === EN_TEMPLATE.trim() || !enMarkdown.trim()}
                onStartFromScratch={() => setEnMarkdown('')}
                onTranslateFromPtBr={() => {
                  message.info(t('cv.translateFromPtBr'))
                }}
              />
              {!isMobile && (
                <div className={styles.editorFooter}>
                  <Button onClick={() => setCurrentStep(1)}>{t('common.back')}</Button>
                  <Space>
                    <span className={styles.footerStepLabel}>{stepLabel}</span>
                    <Button onClick={handleSkipEn}>{t('cv.editor.skipStep')}</Button>
                    <Button type="primary" onClick={handleStep3Finish} loading={saving} icon={<CheckOutlined />}>
                      {t('cv.editor.validateAndFinish')}
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {mobileBottomNav}
      {previewCssTag}
    </>
  )
}
