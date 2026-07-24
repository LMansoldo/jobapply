import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../application/providers/AuthProvider'
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
  const [isDone, setIsDone] = useState(false)

  function handleDone(data: OnboardingData) {
    setIsDone(true)
    localStorage.setItem('jobapply_onboarded', 'true')
    submitOnboarding(data).catch(() => {})
    setTimeout(() => navigate({ to: '/cv' }), 1200)
  }

  const { messages, isTyping, interaction, handleGender, handleRoles, handleEmployed } =
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
      <div className={S.header}>
        <div className={S.headerLogo}>
          <span className={S.headerLogoText}>DoJob</span>
          <span className={S.headerLogoDot} />
        </div>
        {(() => {
          const stepNum = interaction === 'gender' ? 1 : interaction === 'roles' ? 2 : interaction === 'employed' ? 3 : 0
          if (!stepNum) return null
          return (
            <div className={S.headerStepGroup}>
              <div className={S.headerDots}>
                {[1, 2, 3].map((n) => <span key={n} className={S.headerDot(n <= stepNum)} />)}
              </div>
              <span className={S.headerBadge}>Pergunta {stepNum} de 3</span>
            </div>
          )
        })()}
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
              {msg.msgType === 'ai_warning' ? (
                <div className={bubbleCls}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M12 3L1 21H23L12 3Z" fill="#fbbf24"/>
                    <path d="M12 9V14" stroke="#92400e" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="17.5" r="1.1" fill="#92400e"/>
                  </svg>
                  <span>{msg.content}</span>
                </div>
              ) : (
                <div className={bubbleCls}>{msg.content}</div>
              )}
            </div>
          )
        })}

        {isTyping && (
          <div className={S.typingRow}>
            <div className={S.typingBubble}>
              {[0, 0.2, 0.4].map((d, i) => <span key={i} className={S.typingDotEl(d)} />)}
            </div>
          </div>
        )}
        {isDone && (
          <div className={S.isDoneRow}>
            <span className={S.isDoneSpinner} />
            {t('onboarding.isDoneText')}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {interaction === 'gender' && (
        <div className={S.interactionArea}>
          <div className={S.sheetTitle}>{t('onboarding.genderQuestion')}</div>
          <div className={S.genderButtons}>
            {(['M', 'F', 'O'] as const).map((g) => (
              <button key={g} type="button" className={S.genderBtn(genderSel === g)} onClick={() => setGenderSel(g)}>
                {t(`onboarding.gender${g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}`)}
              </button>
            ))}
          </div>
          {genderSel === 'O' && (
            <input
              className={S.genderOtherInput}
              value={genderOther}
              onChange={(e) => setGenderOther(e.target.value)}
              placeholder={t('onboarding.genderOtherPlaceholder')}
            />
          )}
          <button
            type="button"
            className={S.sheetSubmitBtn(!!genderSel && (genderSel !== 'O' || genderOther.trim().length > 0))}
            disabled={!genderSel || (genderSel === 'O' && !genderOther.trim())}
            onClick={() => genderSel && handleGender(genderSel, genderOther || undefined)}
          >
            {t('common.next')}
          </button>
        </div>
      )}

      {interaction === 'roles' && (
        <div className={S.interactionArea}>
          <div className={S.sheetTitle}>{t('onboarding.rolesQuestion')}</div>
          <div className={S.sheetSubtitle}>{t('onboarding.rolesHint')}</div>
          <div className={S.rolesRow}>
            <input
              className={S.roleTextInput}
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRole() } }}
              placeholder={t('onboarding.rolesPlaceholder')}
            />
            <button
              type="button"
              className={S.addRoleBtn(!!roleInput.trim())}
              disabled={!roleInput.trim()}
              onClick={addRole}
            >
              +
            </button>
          </div>
          {roles.length > 0 && (
            <div className={S.roleTagsArea}>
              {roles.map((r) => (
                <div key={r} className={S.roleTag}>
                  {r}
                  <button
                    type="button"
                    className={S.roleTagRemoveBtn}
                    onClick={() => setRoles((prev) => prev.filter((x) => x !== r))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            className={S.sheetSubmitBtn(roles.length > 0)}
            disabled={roles.length === 0}
            onClick={() => handleRoles(roles)}
          >
            {t('common.next')}
          </button>
        </div>
      )}

      {interaction === 'employed' && (
        <div className={S.interactionArea}>
          <div className={S.sheetTitle}>{t('onboarding.employedQuestion')}</div>
          <div className={S.employedButtons}>
            <button type="button" className={S.employedPrimaryBtn} onClick={() => handleEmployed(true)}>
              {t('onboarding.employedYes')}
            </button>
            <button type="button" className={S.employedOutlineBtn} onClick={() => handleEmployed(false)}>
              {t('onboarding.employedNo')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
