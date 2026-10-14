import { Alert, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { RichMarkdownEditor } from '@jobapply/editor'
import { DSButton, DSInput } from '@jobapply/ui'
import { createCV, updateCV } from '../../shared/api'
import { getCvId, saveCvId, type StoredAuth } from '../../shared/storage'
import { cvToMarkdown } from '../../shared/report'
import { useCvQuery, useResolvedCvId } from '../../state/cv'
import {
  Centered,
  CvName,
  CvNameStrong,
  CvNameSub,
  CvRow,
  EmptyHint,
  FieldGroup,
  PageHeader,
  PageSubtitle,
  PageTitle,
  Panel,
  SectionTitle,
  Stack
} from '../overlay.styles'

interface CvScreenProps {
  auth: StoredAuth
  onBack: () => void
  onSaved: () => void
}

export function CvScreen({ auth, onBack, onSaved }: CvScreenProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState(auth.user.email)
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { cvId, ready } = useResolvedCvId(auth)
  const cvQuery = useCvQuery(cvId)
  const cv = cvQuery.data ?? null
  const activeCvId = cv?._id ?? cvId

  useEffect(() => {
    if (cv) {
      setName(cv.fullName ?? '')
      setEmail(cv.email || auth.user.email)
      setMarkdown(cv.markdown ?? cvToMarkdown(cv))
    }
  }, [cv, auth.user.email])

  useEffect(() => {
    if (ready && (!cvId || cvQuery.isError)) {
      setMarkdown((cur) => cur ?? '')
      if (cvQuery.isError) {
        setError(cvQuery.error instanceof Error ? cvQuery.error.message : t('extension.loadingCvError'))
      }
    }
  }, [ready, cvId, cvQuery.isError, cvQuery.error, t])

  const loading = !ready || (cvId !== null && markdown === null && !cvQuery.isError)

  const handleUseCurrent = async () => {
    if (!activeCvId) return
    await saveCvId(activeCvId)
    onSaved()
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { fullName: name.trim(), email: email.trim(), markdown: markdown ?? '' }
      const { cv: saved } = activeCvId ? await updateCV(activeCvId, payload) : await createCV(payload)
      await saveCvId(saved._id)
      return saved
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(['cv', saved._id], saved)
      onSaved()
    },
    onError: (err: unknown) => setError(err instanceof Error ? err.message : t('extension.saveCvError')),
  })

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      setError(t('extension.nameEmailRequired'))
      return
    }
    setError(null)
    saveMutation.mutate()
  }

  if (loading || markdown === null) {
    return (
      <Centered>
        <Spin />
      </Centered>
    )
  }

  return (
    <Stack>
      <PageHeader>
        <div>
          <PageTitle>{t('extension.cvTitle')}</PageTitle>
          <PageSubtitle>{t('extension.cvSubtitle')}</PageSubtitle>
        </div>
        <DSButton variant="ghost" onClick={onBack}>
          ← {t('extension.backToAts')}
        </DSButton>
      </PageHeader>
      {activeCvId ? (
        <CvRow>
          <CvName>
            <CvNameStrong>{name || t('extension.unnamedCv')}</CvNameStrong>
            <CvNameSub>
              {email} · id {activeCvId}
            </CvNameSub>
          </CvName>
          <DSButton variant="ghost" onClick={handleUseCurrent}>{t('extension.useThisCv')}</DSButton>
        </CvRow>
      ) : (
        <Panel>
          <EmptyHint>{t('extension.noCvYet')}</EmptyHint>
        </Panel>
      )}
      <Panel>
        <SectionTitle>{t('extension.basicInfo')}</SectionTitle>
        <FieldGroup>
          <DSInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('extension.cvNamePlaceholder')}
            maxLength={120}
            filled
          />
          <DSInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('extension.cvEmailPlaceholder')}
            type="email"
            filled
          />
        </FieldGroup>
        <SectionTitle>{t('extension.cvContent')}</SectionTitle>
        <RichMarkdownEditor
          key={activeCvId ?? 'novo-cv'}
          value={markdown}
          onChange={setMarkdown}
          layout="editor"
          height={600}
        />
        {error && <Alert type="error" showIcon message={error} />}
        <DSButton variant="primary" loading={saveMutation.isPending} onClick={handleSave}>
          {activeCvId ? t('extension.saveChanges') : t('extension.createCv')}
        </DSButton>
      </Panel>
    </Stack>
  )
}
