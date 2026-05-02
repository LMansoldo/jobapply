import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TFunction } from 'i18next'
import type { Beat, ChatMessage, InteractionStep, OnboardingData } from './OnboardingPage.types'
import { submitOnboarding } from '../../../infrastructure/repositories/onboardingRepository'

export const MESSAGE_DELAY_MS = 750
export const NEXT_BEAT_DELAY_MS = 350

function buildScript(name: string): Beat[] {
  return [
    { kind: 'message', key: 'onboarding.welcomeMsg1', params: { name } },
    { kind: 'message', key: 'onboarding.welcomeMsg2' },
    { kind: 'message', key: 'onboarding.overviewMsg1' },
    { kind: 'message', key: 'onboarding.overviewCards', msgType: 'overview_cards' },
    { kind: 'message', key: 'onboarding.cvMsg1' },
    { kind: 'message', key: 'onboarding.cvMsg2' },
    { kind: 'message', key: 'onboarding.atsMsg1' },
    { kind: 'message', key: 'onboarding.atsMsg2' },
    { kind: 'message', key: 'onboarding.aiWarnMsg1', msgType: 'ai_warning' },
    { kind: 'message', key: 'onboarding.aiWarnMsg2', msgType: 'ai_warning' },
    { kind: 'message', key: 'onboarding.aiWarnMsg3', msgType: 'ai_warning' },
    { kind: 'message', key: 'onboarding.aiWarnMsg4', msgType: 'ai_warning' },
    { kind: 'message', key: 'onboarding.tailoringMsg1' },
    { kind: 'message', key: 'onboarding.tailoringList', msgType: 'tailoring_list' },
    { kind: 'message', key: 'onboarding.dataMsg1' },
    { kind: 'message', key: 'onboarding.genderQuestion' },
    { kind: 'pause', interaction: 'gender' },
    { kind: 'message', key: 'onboarding.rolesQuestion' },
    { kind: 'pause', interaction: 'roles' },
    { kind: 'message', key: 'onboarding.employedQuestion' },
    { kind: 'pause', interaction: 'employed' },
    { kind: 'message', key: 'onboarding.finalMsg1' },
    { kind: 'message', key: 'onboarding.finalMsg2' },
  ]
}

export function useOnboardingChat(
  name: string,
  t: TFunction,
  onDone: (data: OnboardingData) => void,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [interaction, setInteraction] = useState<InteractionStep>(null)
  const [beatIndex, setBeatIndex] = useState(0)

  const script = useMemo(() => buildScript(name), [name])
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const currentBeatRef = useRef(0)
  const collectedRef = useRef<Partial<OnboardingData>>({ targetRoles: [] })

  const progress = Math.min(100, Math.round((beatIndex / script.length) * 100))

  const runFrom = useCallback(
    (index: number) => {
      if (index >= script.length) {
        onDone(collectedRef.current as OnboardingData)
        return
      }
      const beat = script[index]
      if (beat.kind === 'pause') {
        setBeatIndex(index)
        setInteraction(beat.interaction)
        currentBeatRef.current = index
        return
      }
      setIsTyping(true)
      timerRef.current = setTimeout(() => {
        const content =
          beat.params ? t(beat.key, beat.params) : t(beat.key)
        const msg: ChatMessage = { id: `bot-${index}`, sender: 'bot', content, msgType: beat.msgType }
        setMessages((prev) => [...prev, msg])
        setIsTyping(false)
        setBeatIndex(index + 1)
        currentBeatRef.current = index + 1
        timerRef.current = setTimeout(() => runFrom(index + 1), NEXT_BEAT_DELAY_MS)
      }, MESSAGE_DELAY_MS)
    },
    [script, t, onDone],
  )

  useEffect(() => {
    timerRef.current = setTimeout(() => runFrom(0), 300)
    return () => clearTimeout(timerRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function addUserReply(content: string) {
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: 'user', content }])
    setInteraction(null)
    timerRef.current = setTimeout(() => runFrom(currentBeatRef.current + 1), NEXT_BEAT_DELAY_MS)
  }

  function handleGender(gender: 'M' | 'F' | 'O', other?: string) {
    collectedRef.current = { ...collectedRef.current, gender, genderOther: other }
    const label =
      gender === 'M' ? t('onboarding.genderMale')
      : gender === 'F' ? t('onboarding.genderFemale')
      : other ?? t('onboarding.genderOther')
    addUserReply(label)
  }

  function handleRoles(roles: string[]) {
    collectedRef.current = { ...collectedRef.current, targetRoles: roles }
    addUserReply(t('onboarding.rolesUserReply', { roles: roles.join(', ') }))
  }

  function handleEmployed(employed: boolean) {
    collectedRef.current = { ...collectedRef.current, isEmployed: employed }
    addUserReply(employed ? t('onboarding.employedYes') : t('onboarding.employedNo'))
  }

  return { messages, isTyping, interaction, progress, handleGender, handleRoles, handleEmployed }
}

export { submitOnboarding }
