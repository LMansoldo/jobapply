/**
 * @file CVPage.tsx
 * @description CV management page — horizontal stepper, viewer mode with CVTemplate, wizard with rich editor.
 */
import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  publishCV,
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
  const { cvId, setCvId, user } = useAuth()
  const { message, modal } = useAntApp()
  const { t } = useTranslation()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const queryClient = useQueryClient()

  const [cv, setCv] = useState<CV | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const skipApplyRef = useRef(false)

  const [baseForm] = Form.useForm<CVBaseFormValues>()

  const [ptBrMarkdown, setPtBrMarkdown] = useState(PT_BR_TEMPLATE)
  const [ptBrErrors, setPtBrErrors] = useState<string[]>([])

  const [enMarkdown, setEnMarkdown] = useState(EN_TEMPLATE)
  const [enErrors, setEnErrors] = useState<string[]>([])

  // ── Initial CV fetch ──────────────────────────────────────────────────────
  const cvQuery = useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => getCV(cvId!),
    enabled: !!cvId,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!cvQuery.data || skipApplyRef.current) {
      skipApplyRef.current = false
      return
    }
    applyCV(cvQuery.data, false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvQuery.data])

  // Pre-fill base form with auth user data when creating a new CV
  useEffect(() => {
    if (cvId || !user) return
    const fromLinkedIn = sessionStorage.getItem('cv_prefill_from_linkedin') === 'true'
    sessionStorage.removeItem('cv_prefill_from_linkedin')
    baseForm.setFieldsValue({
      fullName: user.name,
      email: user.email,
    })
    if (fromLinkedIn) {
      message.info(t('cv.prefillFromLinkedIn'))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function applyCV(data: CV, isNewOrEditing = false) {
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
    setCurrentStep(isNewOrEditing ? 1 : 0)
  }

  // ── Mutations ─────────────────────────────────────────────────────────────
  const saveBaseMutation = useMutation({
    mutationFn: async (values: CVBaseFormValues) => {
      const { languages: _langs, ...rest } = values
      const payload: CVCreatePayload = rest
      return cv ? updateCV(cv._id, payload) : createCV(payload)
    },
    onSuccess: (updated) => {
      skipApplyRef.current = true
      queryClient.setQueryData(['cv', updated._id], updated)
      applyCV(updated, true)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t('cv.savePersonalError')
      message.error(msg)
    },
  })

  const savePtBrMutation = useMutation({
    mutationFn: async () => {
      const result = parseMarkdownToLocale(ptBrMarkdown, 'pt-BR')
      if (result.errors.length > 0) throw Object.assign(new Error('validation'), { errors: result.errors })
      if (!cv) throw new Error('no-cv')
      await updateCVLocale(cv._id, 'pt-BR', result.data!)
    },
    onSuccess: () => {
      message.success(t('cv.savePtBrSuccess'))
      setCurrentStep(2)
    },
    onError: (err: unknown) => {
      const typed = err as { errors?: string[]; message?: string; response?: { data?: { message?: string } } }
      if (typed.errors?.length) { setPtBrErrors(typed.errors); return }
      if (typed.message === 'no-cv') { message.error(t('cv.saveFirst')); setCurrentStep(0); return }
      const msg = typed.response?.data?.message ?? t('cv.savePtBrError')
      message.error(msg)
    },
  })

  const saveEnMutation = useMutation({
    mutationFn: async () => {
      const result = parseMarkdownToLocale(enMarkdown, 'en')
      if (result.errors.length > 0) throw Object.assign(new Error('validation'), { errors: result.errors })
      if (!cv) throw new Error('no-cv')
      await updateCVLocale(cv._id, 'en', result.data!)
      const refreshed = await getCV(cv._id)
      return refreshed
    },
    onSuccess: (refreshed) => {
      message.success(t('cv.saveEnSuccess'))
      skipApplyRef.current = true
      queryClient.setQueryData(['cv', refreshed._id], refreshed)
      applyCV(refreshed, false)
    },
    onError: (err: unknown) => {
      const typed = err as { errors?: string[]; message?: string; response?: { data?: { message?: string } } }
      if (typed.errors?.length) { setEnErrors(typed.errors); return }
      const msg = typed.response?.data?.message ?? t('cv.saveEnError')
      message.error(msg)
    },
  })

  const skipEnMutation = useMutation({
    mutationFn: async () => {
      if (!cv) throw new Error('no-cv')
      const ptBrResult = parseMarkdownToLocale(ptBrMarkdown, 'pt-BR')
      if (ptBrResult.errors.length > 0) throw Object.assign(new Error('pt-br-validation'), { errors: ptBrResult.errors })
      await updateCVLocale(cv._id, 'pt-BR', ptBrResult.data!)
      const refreshed = await getCV(cv._id)
      return refreshed
    },
    onSuccess: (refreshed) => {
      setEnErrors([])
      message.success(t('cv.skipEnSuccess'))
      skipApplyRef.current = true
      queryClient.setQueryData(['cv', refreshed._id], refreshed)
      applyCV(refreshed, false)
    },
    onError: (err: unknown) => {
      const typed = err as { errors?: string[]; message?: string; response?: { data?: { message?: string } } }
      if (typed.message === 'no-cv') { message.error(t('cv.saveFirst')); return }
      if (typed.message === 'pt-br-validation') { setPtBrErrors(typed.errors ?? []); setCurrentStep(1); return }
      const msg = typed.response?.data?.message ?? t('cv.savePtBrError')
      message.error(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteCV(cv!._id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['cv', cv?._id] })
      setCv(null)
      setCvId(null)
      baseForm.resetFields()
      setPtBrMarkdown(PT_BR_TEMPLATE)
      setEnMarkdown(EN_TEMPLATE)
      setPtBrErrors([])
      setEnErrors([])
      setCurrentStep(0)
      message.success(t('cv.deleteSuccess'))
    },
    onError: () => message.error(t('cv.deleteError')),
  })

  const publishMutation = useMutation({
    mutationFn: () => {
      const ptBr = cv!.localeVersions?.find((v) => v.locale === 'pt-BR')
      const en = cv!.localeVersions?.find((v) => v.locale === 'en')
      const locale = ptBr ? 'pt-BR' : en ? 'en' : undefined
      return publishCV(cv!._id, locale ? { locale } : undefined)
    },
    onSuccess: (response) => {
      const publicUrl = `${window.location.origin}/public/${response.public_id}`
      modal.info({
        title: t('cv.publishLinkTitle'),
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.2rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', wordBreak: 'break-all', background: '#f5f5f5', padding: '0.8rem', borderRadius: '0.4rem' }}>
              {publicUrl}
            </span>
          </div>
        ),
        okText: t('cv.copyLink'),
        onOk: () => {
          navigator.clipboard.writeText(publicUrl)
          message.success(t('cv.publishSuccess'))
        },
      })
    },
    onError: () => message.error(t('cv.publishError')),
  })

  async function handleStep1Next() {
    try {
      const values = await baseForm.validateFields()
      saveBaseMutation.mutate(values)
    } catch {
      // AntD Form shows inline validation errors automatically
    }
  }

  function handleStep2Next() {
    setPtBrErrors([])
    savePtBrMutation.mutate()
  }

  function handleStep3Finish() {
    setEnErrors([])
    saveEnMutation.mutate()
  }

  function handleSkipEn() {
    setEnErrors([])
    skipEnMutation.mutate()
  }

  function handleDeleteRequest() {
    modal.confirm({
      title: t('cv.deleteCVTitle'),
      content: t('cv.deleteCVConfirm'),
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: () => deleteMutation.mutate(),
    })
  }

  const saving =
    saveBaseMutation.isPending ||
    savePtBrMutation.isPending ||
    saveEnMutation.isPending ||
    skipEnMutation.isPending ||
    deleteMutation.isPending ||
    publishMutation.isPending

  if (cvQuery.isLoading) {
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
            onPublish={() => publishMutation.mutate()}
            publishLoading={publishMutation.isPending}
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
