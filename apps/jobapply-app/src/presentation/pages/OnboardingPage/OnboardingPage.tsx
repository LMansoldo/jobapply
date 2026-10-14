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
    <S.Root>
      <S.Header>
        <S.HeaderLogo>
          <S.HeaderLogoText>DoJob</S.HeaderLogoText>
          <S.HeaderLogoDot />
        </S.HeaderLogo>
        {(() => {
          const stepNum = interaction === 'gender' ? 1 : interaction === 'roles' ? 2 : interaction === 'employed' ? 3 : 0
          if (!stepNum) return null
          return (
            <S.HeaderStepGroup>
              <S.HeaderDots>
                {[1, 2, 3].map((n) => <S.HeaderDot key={n} $active={n <= stepNum} />)}
              </S.HeaderDots>
              <S.HeaderBadge>Pergunta {stepNum} de 3</S.HeaderBadge>
            </S.HeaderStepGroup>
          )
        })()}
      </S.Header>

      <S.ChatArea>
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <S.UserRow key={msg.id}>
                <S.UserBubble>{msg.content}</S.UserBubble>
              </S.UserRow>
            )
          }
          if (msg.msgType === 'overview_cards') {
            return (
              <S.BotRow key={msg.id}>
                <S.OverviewCards>
                  {(['1', '2', '3'] as const).map((n) => (
                    <S.OverviewCard key={n}>
                      <S.OverviewCardTitle>{t(`onboarding.overviewFeature${n}Title`)}</S.OverviewCardTitle>
                      <S.OverviewCardDesc>{t(`onboarding.overviewFeature${n}Desc`)}</S.OverviewCardDesc>
                    </S.OverviewCard>
                  ))}
                </S.OverviewCards>
              </S.BotRow>
            )
          }
          if (msg.msgType === 'tailoring_list') {
            return (
              <S.BotRow key={msg.id}>
                <S.TailoringList>
                  {(['1', '2', '3'] as const).map((n) => (
                    <S.TailoringItem key={n}>{t(`onboarding.tailoringFeature${n}`)}</S.TailoringItem>
                  ))}
                </S.TailoringList>
              </S.BotRow>
            )
          }
          const Bubble = msg.msgType === 'ai_warning' ? S.BotBubbleWarning : S.BotBubble
          return (
            <S.BotRow key={msg.id}>
              {msg.msgType === 'ai_warning' ? (
                <Bubble>
                  <S.WarningIcon width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L1 21H23L12 3Z" fill="#fbbf24"/>
                    <path d="M12 9V14" stroke="#92400e" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="17.5" r="1.1" fill="#92400e"/>
                  </S.WarningIcon>
                  <span>{msg.content}</span>
                </Bubble>
              ) : (
                <Bubble>{msg.content}</Bubble>
              )}
            </S.BotRow>
          )
        })}

        {isTyping && (
          <S.TypingRow>
            <S.TypingBubble>
              {[0, 0.2, 0.4].map((d, i) => <S.TypingDotEl key={i} $delay={d} />)}
            </S.TypingBubble>
          </S.TypingRow>
        )}
        {isDone && (
          <S.IsDoneRow>
            <S.IsDoneSpinner />
            {t('onboarding.isDoneText')}
          </S.IsDoneRow>
        )}
        <div ref={bottomRef} />
      </S.ChatArea>

      {interaction === 'gender' && (
        <S.InteractionArea>
          <S.SheetTitle>{t('onboarding.genderQuestion')}</S.SheetTitle>
          <S.GenderButtons>
            {(['M', 'F', 'O'] as const).map((g) => (
              <S.GenderBtn key={g} type="button" $active={genderSel === g} onClick={() => setGenderSel(g)}>
                {t(`onboarding.gender${g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}`)}
              </S.GenderBtn>
            ))}
          </S.GenderButtons>
          {genderSel === 'O' && (
            <S.GenderOtherInput
              value={genderOther}
              onChange={(e) => setGenderOther(e.target.value)}
              placeholder={t('onboarding.genderOtherPlaceholder')}
            />
          )}
          <S.SheetSubmitBtn
            type="button"
            $enabled={!!genderSel && (genderSel !== 'O' || genderOther.trim().length > 0)}
            disabled={!genderSel || (genderSel === 'O' && !genderOther.trim())}
            onClick={() => genderSel && handleGender(genderSel, genderOther || undefined)}
          >
            {t('common.next')}
          </S.SheetSubmitBtn>
        </S.InteractionArea>
      )}

      {interaction === 'roles' && (
        <S.InteractionArea>
          <S.SheetTitle>{t('onboarding.rolesQuestion')}</S.SheetTitle>
          <S.SheetSubtitle>{t('onboarding.rolesHint')}</S.SheetSubtitle>
          <S.RolesRow>
            <S.RoleTextInput
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRole() } }}
              placeholder={t('onboarding.rolesPlaceholder')}
            />
            <S.AddRoleBtn
              type="button"
              $enabled={!!roleInput.trim()}
              disabled={!roleInput.trim()}
              onClick={addRole}
            >
              +
            </S.AddRoleBtn>
          </S.RolesRow>
          {roles.length > 0 && (
            <S.RoleTagsArea>
              {roles.map((r) => (
                <S.RoleTag key={r}>
                  {r}
                  <S.RoleTagRemoveBtn
                    type="button"
                    onClick={() => setRoles((prev) => prev.filter((x) => x !== r))}
                  >
                    ✕
                  </S.RoleTagRemoveBtn>
                </S.RoleTag>
              ))}
            </S.RoleTagsArea>
          )}
          <S.SheetSubmitBtn
            type="button"
            $enabled={roles.length > 0}
            disabled={roles.length === 0}
            onClick={() => handleRoles(roles)}
          >
            {t('common.next')}
          </S.SheetSubmitBtn>
        </S.InteractionArea>
      )}

      {interaction === 'employed' && (
        <S.InteractionArea>
          <S.SheetTitle>{t('onboarding.employedQuestion')}</S.SheetTitle>
          <S.EmployedButtons>
            <S.EmployedPrimaryBtn type="button" onClick={() => handleEmployed(true)}>
              {t('onboarding.employedYes')}
            </S.EmployedPrimaryBtn>
            <S.EmployedOutlineBtn type="button" onClick={() => handleEmployed(false)}>
              {t('onboarding.employedNo')}
            </S.EmployedOutlineBtn>
          </S.EmployedButtons>
        </S.InteractionArea>
      )}
    </S.Root>
  )
}
