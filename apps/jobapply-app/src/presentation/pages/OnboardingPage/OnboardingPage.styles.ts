import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { Spacing } from '../../../styles/theme/spacing'

const typingDot = keyframes`
  0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-0.4rem); }
`

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(0.8rem); }
  to   { opacity: 1; transform: translateY(0); }
`

const sheetUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const Root = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
  background-color: #f5f3ff;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: ${({ theme }) => theme.typography.family.body};
  box-shadow: 0 0 60px rgba(91,33,182,0.12);
`

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(245,243,255,0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #e9e4fc;
  flex-shrink: 0;
`

export const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const HeaderLogoText = styled.span`
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.extrabold};
  font-size: 1.6rem;
  color: #1e1b2e;
`

export const HeaderLogoDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a78bfa;
`

export const HeaderStepGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const HeaderDots = styled.div`
  display: flex;
  gap: 4px;
`

export const HeaderDot = styled.span<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#7c3aed' : '#ddd6fe')};
`

export const HeaderBadge = styled.span`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: #6d28d9;
  background: #ede9fe;
  padding: 4px 10px;
  border-radius: 9999px;
  letter-spacing: 0.2px;
`

export const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const BotRow = styled.div`
  display: flex;
  animation: ${fadeSlideIn} 0.3s ease both;
`

export const BotBubble = styled.div`
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  color: #1e1b2e;
  padding: 11px 16px;
  border-radius: 18px 18px 18px 4px;
  max-width: 88%;
  font-size: 1.45rem;
  font-family: ${({ theme }) => theme.typography.family.body};
  line-height: 1.55;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
`

export const BotBubbleWarning = styled.div`
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  color: #92400e;
  padding: 11px 16px 11px 12px;
  border-radius: 18px 18px 18px 4px;
  max-width: 88%;
  font-size: 1.45rem;
  font-family: ${({ theme }) => theme.typography.family.body};
  line-height: 1.55;
  display: flex;
  gap: 8px;
  align-items: flex-start;
`

export const UserRow = styled.div`
  display: flex;
  justify-content: flex-end;
  animation: ${fadeSlideIn} 0.3s ease both;
`

export const UserBubble = styled.div`
  background: linear-gradient(135deg,#7c3aed,#6d28d9);
  color: #ffffff;
  padding: 11px 16px;
  border-radius: 18px 18px 4px 18px;
  max-width: 82%;
  font-size: 1.45rem;
  font-family: ${({ theme }) => theme.typography.family.body};
  line-height: 1.5;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`

export const TypingRow = styled.div`
  display: flex;
`

export const TypingBubble = styled.div`
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  padding: 13px 18px;
  border-radius: 18px 18px 18px 4px;
  display: flex;
  gap: 5px;
  align-items: center;
`

export const TypingDotEl = styled.span<{ $delay: number }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #c4b5fd;
  animation: ${typingDot} 1.2s ease infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`

export const OverviewCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const OverviewCard = styled.div`
  background-color: #f5f0ff;
  border: 1px solid #d3b8ff;
  border-radius: 14px;
  padding: 14px 16px;
`

export const OverviewCardTitle = styled.div`
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-size: 1.4rem;
  color: #6d28d9;
  margin-bottom: 3px;
`

export const OverviewCardDesc = styled.div`
  font-size: 1.25rem;
  color: #6b7280;
  line-height: 1.5;
`

export const TailoringList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const TailoringItem = styled.div`
  background-color: #f5f0ff;
  border: 1px solid #d3b8ff;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 1.35rem;
  color: #1e1b2e;
  font-family: ${({ theme }) => theme.typography.family.body};
  line-height: 1.5;
`

export const InteractionArea = styled.div`
  position: sticky;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e9e4fc;
  border-radius: 20px 20px 0 0;
  padding: 18px 16px calc(18px + env(safe-area-inset-bottom));
  box-shadow: 0 -8px 24px rgba(91,33,182,0.10);
  animation: ${sheetUp} 0.3s ease both;
  flex-shrink: 0;
`

export const SheetTitle = styled.div`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: #1e1b2e;
  margin-bottom: 12px;
  font-family: ${({ theme }) => theme.typography.family.heading};
`

export const SheetSubtitle = styled.div`
  font-size: 1.2rem;
  color: #888888;
  margin-bottom: 12px;
`

export const SheetSubmitBtn = styled.button<{ $enabled: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-size: 1.45rem;
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'not-allowed')};
  background: ${({ $enabled }) => ($enabled ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : '#e9e4fc')};
  color: ${({ $enabled }) => ($enabled ? '#ffffff' : '#a0aec0')};
  box-shadow: ${({ $enabled }) => ($enabled ? '0 2px 12px rgba(124,58,237,0.30)' : 'none')};
  display: block;
`

export const GenderButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`

export const GenderBtn = styled.button<{ $active: boolean }>`
  padding: 10px 18px;
  height: 44px;
  border-radius: 9999px;
  border: 1.5px solid ${({ $active }) => ($active ? '#7c3aed' : '#e9e4fc')};
  background: ${({ $active }) => ($active ? '#ede9fe' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#6d28d9' : '#1e1b2e')};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-size: 1.4rem;
  cursor: pointer;
`

export const GenderOtherInput = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1px solid #e9e4fc;
  background: #f5f3ff;
  padding: 0 14px;
  font-size: 1.45rem;
  font-family: ${({ theme }) => theme.typography.family.body};
  margin-bottom: 12px;
  outline: none;
  color: #1e1b2e;
  box-sizing: border-box;
  display: block;
`

export const RolesRow = styled.div`
  display: flex; gap: 8px; margin-bottom: 10px;
`

export const RoleTextInput = styled.input`
  flex: 1; height: 48px; border-radius: 12px;
  border: 1px solid #e9e4fc; background: #f5f3ff;
  padding: 0 14px; font-size: 1.45rem; font-family: ${({ theme }) => theme.typography.family.body};
  outline: none; color: #1e1b2e; min-width: 0; box-sizing: border-box;
`

export const AddRoleBtn = styled.button<{ $enabled: boolean }>`
  width: 48px; height: 48px; flex-shrink: 0; border-radius: 12px;
  border: none; font-size: 2.0rem; font-weight: ${({ theme }) => theme.typography.weight.semibold};
  background: ${({ $enabled }) => ($enabled ? '#ede9fe' : '#f5f3ff')}; color: #6d28d9;
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'not-allowed')};
  display: flex; align-items: center; justify-content: center;
`

export const RoleTagsArea = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;
`

export const RoleTag = styled.div`
  display: flex; align-items: center; gap: 6px;
  background: #ede9fe; color: #6d28d9; font-size: 1.3rem;
  font-weight: ${({ theme }) => theme.typography.weight.semibold}; padding: 6px 8px 6px 12px;
  border-radius: 9999px;
`

export const RoleTagRemoveBtn = styled.button`
  width: 16px; height: 16px; border-radius: 50%; border: none;
  background: rgba(124,58,237,0.15); color: #6d28d9; font-size: 1.1rem;
  line-height: 1; cursor: pointer; display: flex; align-items: center;
  justify-content: center; padding: 0; flex-shrink: 0;
`

export const EmployedButtons = styled.div`
  display: flex; flex-direction: column; gap: 10px;
`

export const EmployedPrimaryBtn = styled.button`
  height: 48px; border-radius: 12px; border: none;
  background: linear-gradient(135deg,#7c3aed,#6d28d9); color: #ffffff;
  font-family: ${({ theme }) => theme.typography.family.body}; font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-size: 1.45rem; cursor: pointer;
  box-shadow: 0 2px 12px rgba(124,58,237,0.30);
`

export const EmployedOutlineBtn = styled.button`
  height: 48px; border-radius: 12px; border: 1.5px solid #7c3aed;
  background: transparent; color: #6d28d9;
  font-family: ${({ theme }) => theme.typography.family.body}; font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-size: 1.45rem; cursor: pointer;
`

export const IsDoneRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  color: #7c3aed;
  font-size: 1.3rem;
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
`

export const IsDoneSpinner = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ddd6fe;
  border-top-color: #7c3aed;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
  display: inline-block;
`

export const WarningIcon = styled.svg`
  flex-shrink: 0;
  margin-top: ${Spacing.xxs};
`
