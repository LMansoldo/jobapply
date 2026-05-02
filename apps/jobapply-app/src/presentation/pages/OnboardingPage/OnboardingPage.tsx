import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { RobotOutlined, WarningOutlined } from '@ant-design/icons'
import { useAuth } from '../../../application/providers/AuthProvider'
import { Tag } from '../../../components/Tag'
import { DSButton } from '../../../design-system/primitives/DSButton'
import { DSInput } from '../../../design-system/primitives/DSInput'
import type { OnboardingData } from './OnboardingPage.types'
import { useOnboardingChat, submitOnboarding } from './helpers'
import * as S from './OnboardingPage.styles'

export default function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [genderSel, setGenderSel] = useState<'M' | 'F' | 'O' | null>(null)
  const [genderOther, setGenderOther] = useState('')
  const [roleInput, setRoleInput] = useState('')
  const [roles, setRoles] = useState<string[]>([])

  function handleDone(data: OnboardingData) {
    localStorage.setItem('jobapply_onboarded', 'true')
    submitOnboarding(data).catch(() => {})
    setTimeout(() => navigate({ to: '/cv' }), 1200)
  }

  const { messages, isTyping, interaction, progress, handleGender, handleRoles, handleEmployed } =
    useOnboardingChat(user?.name?.split(' ')[0] ?? '', t, handleDone)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, interaction])

  function addRole() {
    const trimmed = roleInput.trim()
    if (trimmed && !roles.includes(trimmed)) setRoles((r) => [...r, trimmed])
    setRoleInput('')
  }

  return (
    <div className={S.root}>
      <div className={S.progressTrack}>
        <div className={S.progressFill(progress)} />
      </div>

      <div className={S.chatArea}>
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className={S.userRow}>
                <div className={S.userBubble}>{msg.content}</div>
              </div>
            )
          }
          if (msg.msgType === 'overview_cards') {
            return (
              <div key={msg.id} className={S.botRow}>
                <div className={S.botAvatar}><RobotOutlined /></div>
                <div className={S.overviewCards}>
                  {(['1', '2', '3'] as const).map((n) => (
                    <div key={n} className={S.overviewCard}>
                      <div className={S.overviewCardTitle}>{t(`onboarding.overviewFeature${n}Title`)}</div>
                      <div className={S.overviewCardDesc}>{t(`onboarding.overviewFeature${n}Desc`)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
          if (msg.msgType === 'tailoring_list') {
            return (
              <div key={msg.id} className={S.botRow}>
                <div className={S.botAvatar}><RobotOutlined /></div>
                <div className={S.tailoringList}>
                  {(['1', '2', '3'] as const).map((n) => (
                    <div key={n} className={S.tailoringItem}>{t(`onboarding.tailoringFeature${n}`)}</div>
                  ))}
                </div>
              </div>
            )
          }
          const bubbleCls = msg.msgType === 'ai_warning' ? S.botBubbleWarning : S.botBubble
          return (
            <div key={msg.id} className={S.botRow}>
              <div className={S.botAvatar}>
                {msg.msgType === 'ai_warning' ? <WarningOutlined /> : <RobotOutlined />}
              </div>
              <div className={bubbleCls}>{msg.content}</div>
            </div>
          )
        })}

        {isTyping && (
          <div className={S.typingRow}>
            <div className={S.botAvatar}><RobotOutlined /></div>
            <div className={S.typingBubble}>
              {[0, 0.2, 0.4].map((d, i) => <span key={i} className={S.typingDotEl(d)} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {interaction === 'gender' && (
        <div className={S.interactionArea}>
          <div className={S.genderButtons}>
            {(['M', 'F', 'O'] as const).map((g) => (
              <button key={g} type="button" className={S.genderBtn(genderSel === g)} onClick={() => setGenderSel(g)}>
                {t(`onboarding.gender${g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}`)}
              </button>
            ))}
          </div>
          {genderSel === 'O' && (
            <div className={S.otherInput}>
              <DSInput
                value={genderOther}
                onChange={(e) => setGenderOther(e.target.value)}
                placeholder={t('onboarding.genderOtherPlaceholder')}
                filled
              />
            </div>
          )}
          {genderSel && (
            <div className={S.submitBtn}>
              <DSButton variant="primary" onClick={() => handleGender(genderSel, genderOther || undefined)}>
                {t('common.next')}
              </DSButton>
            </div>
          )}
        </div>
      )}

      {interaction === 'roles' && (
        <div className={S.interactionArea}>
          <p className={S.hintText}>{t('onboarding.rolesHint')}</p>
          <div className={S.rolesRow}>
            <DSInput
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder={t('onboarding.rolesPlaceholder')}
              onPressEnter={addRole}
              filled
            />
            <DSButton variant="secondary" onClick={addRole} disabled={!roleInput.trim()}>
              + {t('onboarding.rolesAdd')}
            </DSButton>
          </div>
          <div className={S.roleTagsArea}>
            {roles.map((r) => (
              <Tag key={r} closable onClose={() => setRoles((prev) => prev.filter((x) => x !== r))}>
                {r}
              </Tag>
            ))}
          </div>
          <DSButton variant="primary" disabled={roles.length === 0} onClick={() => handleRoles(roles)}>
            {t('common.next')}
          </DSButton>
        </div>
      )}

      {interaction === 'employed' && (
        <div className={S.interactionArea}>
          <div className={S.employedButtons}>
            <DSButton variant="primary" onClick={() => handleEmployed(true)}>{t('onboarding.employedYes')}</DSButton>
            <DSButton variant="secondary" onClick={() => handleEmployed(false)}>{t('onboarding.employedNo')}</DSButton>
          </div>
        </div>
      )}
    </div>
  )
}
