/**
 * @file CVPage.tsx
 * @description CV management page — horizontal stepper, viewer mode with CVTemplate, wizard with rich editor.
 */
import { useState, useEffect, useRef } from 'react'
import { Grid } from '../../../components/Grid'
import { CheckOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../application/providers/AuthProvider'
import { useAntApp } from '../../../components/AntApp'
import { Button } from '../../../components/Button'
import { Form } from '../../../components/Form'
import { Space } from '../../../components/Space'
import { Spin } from '../../../components/Spin'
import { CVViewer } from '../../../domain/cv/components/CVViewer'
import { CVBaseForm } from '../../../domain/cv/components/CVBaseForm'
import { MonacoEditorPanel } from '../../../domain/cv/components/MonacoEditorPanel'
import { EN_TEMPLATE, PT_BR_TEMPLATE } from '../../../domain/cv/constants'
import { localeVersionToMarkdown, parseMarkdownToLocale } from '../../../domain/cv/helpers'
import type { CV, CVCreatePayload } from '../../../domain/cv/types'
import type { CVBaseFormValues } from '../../../domain/cv/components/CVBaseForm/CVBaseForm.types'
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
  .markdown-preview h2 { font-size: 1.5rem; font-weight: 700; margin: 1.8rem 0 0.6rem; color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.1rem; }
  .markdown-preview h3 { font-size: 1.3rem; font-weight: 600; margin: 1.0rem 0 0.4rem; color: #374151; }
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
  const { message, modal } = useAntApp()
  const { t } = useTranslation()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [cv, setCv] = useState<CV | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const skipLoadEffect = useRef(false)

  const [baseForm] = Form.useForm<CVBaseFormValues>()

  const [ptBrMarkdown, setPtBrMarkdown] = useState(PT_BR_TEMPLATE)
  const [ptBrErrors, setPtBrErrors] = useState<string[]>([])

  const [enMarkdown, setEnMarkdown] = useState(EN_TEMPLATE)
  const [enErrors, setEnErrors] = useState<string[]>([])

  useEffect(() => {
    if (!cvId) { setLoading(false); return }
    if (skipLoadEffect.current) { skipLoadEffect.current = false; return }
    getCV(cvId).then((data) => applyCV(data, false)).catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvId])


  function applyCV(data: CV, isNewOrEditing = false) {
    if (isNewOrEditing) skipLoadEffect.current = true
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
      objective: data.objective,
    })

    const ptBrVersion = data.localeVersions?.find((v) => v.locale === 'pt-BR')
    const enVersion = data.localeVersions?.find((v) => v.locale === 'en')

    setPtBrMarkdown(ptBrVersion
      ? localeVersionToMarkdown(ptBrVersion, data.languages)
      : PT_BR_TEMPLATE)

    setEnMarkdown(enVersion
      ? localeVersionToMarkdown(enVersion, data.languages)
      : EN_TEMPLATE)

    setEditMode(isNewOrEditing)
    setCurrentStep(isNewOrEditing ? 1 : 0) // Se é novo ou editando, vai para step 1 (PT-BR)
    setLoading(false)
  }
  async function handleStep1Next() {
    console.log('handleStep1Next called, current editMode:', editMode)
    try {
      const values = await baseForm.validateFields()
      setSaving(true)
      try {
        const payload: CVCreatePayload = {
          ...values,
        }
        const updated = cv ? await updateCV(cv._id, payload) : await createCV(payload)
        console.log('applyCV called with isNewOrEditing=true')
        applyCV(updated, true)
        // Não mostra mensagem de success aqui, só no final
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

  async function handleStep3Finish() {
    // Allow submission even if content is unchanged (per user requirement)
    const result = parseMarkdownToLocale(enMarkdown, 'en')
    if (result.errors.length > 0) { setEnErrors(result.errors); return }
    setEnErrors([])
    if (!cv) return
    setSaving(true)
    try {
      await updateCVLocale(cv._id, 'en', result.data!)
      message.success(t('cv.saveEnSuccess'))
      const refreshed = await getCV(cv._id)
      applyCV(refreshed, false)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t('cv.saveEnError')
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  async function handleSkipEn() {
    setEnErrors([])
    if (!cv) {
      message.error(t('cv.saveFirst'))
      return
    }

    // Se chegou no step 2, o PT-BR já foi salvo pelo handleStep2Next
    // Mas verificar se há erros no PT-BR atual
    const ptBrResult = parseMarkdownToLocale(ptBrMarkdown, 'pt-BR')
    if (ptBrResult.errors.length > 0) {
      setPtBrErrors(ptBrResult.errors)
      setCurrentStep(1) // Voltar para step 1 para corrigir PT-BR
      return
    }

    setSaving(true)
    try {
      // Se o PT-BR atual é diferente do salvo, atualizar
      // (o usuário pode ter editado depois de salvar)
      await updateCVLocale(cv._id, 'pt-BR', ptBrResult.data!)
      message.success(t('cv.skipEnSuccess'))
      const refreshed = await getCV(cv._id)
      applyCV(refreshed, false)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t('cv.savePtBrError')
      message.error(msg)
    } finally {
      setSaving(false)
    }
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

  function handleDeleteRequest() {
    modal.confirm({
      title: t('cv.deleteCVTitle'),
      content: t('cv.deleteCVConfirm'),
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: handleDelete,
    })
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
          <CVViewer
            cv={cv}
            onEdit={() => { setCurrentStep(0); setEditMode(true) }}
            onDelete={handleDeleteRequest}
            isMobile={isMobile}
          />
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

  // ── Mobile bottom nav bar ─────────────────────────────────────────────────
  const mobileBottomNav = isMobile && (
    <div className={styles.mobileBottomNav}>
      {currentStep === 2 && (
        <button
          onClick={handleSkipEn}
          disabled={saving}
          className={styles.mobileSkipBtn}
        >
          {t('cv.editor.skipStep')}
        </button>
      )}
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
                  <Button type="primary" onClick={handleStep2Next} loading={saving}>{t('cv.editor.validateAndContinue')}</Button>
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
