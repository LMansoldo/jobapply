import styled from '@emotion/styled'
import { Avatar as AvatarPrimitive } from '../../../design-system/wrappers/Avatar'

export const PrimaryAvatar = styled(AvatarPrimitive)`
  && {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

export const AvatarWrapper = styled.div`
  position: relative;
  display: inline-flex;
`

export const AlertBubble = styled.div`
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.avatar};
  font-size: 0.9rem;
  width: 1.6rem;
  height: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  pointer-events: none;
`

export const Trigger = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  user-select: none;
`

export const TriggerName = styled.span`
  color: ${({ theme }) => theme.colors.textMain};
  font-size: ${({ theme }) => theme.typography.size.md};
`

// ── Dropdown panel ───────────────────────────────────────────────────────────

export const Panel = styled.div`
  width: 28rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  overflow: hidden;
`

export const ProfileSection = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`

export const PanelAvatar = styled.div`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: ${({ theme }) => theme.radius.avatar};
  background: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-size: ${({ theme }) => theme.typography.size.base};
  color: ${({ theme }) => theme.colors.white};
  flex-shrink: 0;
`

export const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const ProfileName = styled.p`
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textMain};
  margin: 0 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ProfileEmail = styled.p`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textSub};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ProgressRow = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

export const ProgressLabelText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  color: ${({ theme }) => theme.colors.textSub};
`

export const ProgressLabelValue = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.primaryDark};
`

export const ViewProfileBtn = styled.button`
  display: block;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.primaryDark};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: ${({ theme }) => theme.typography.family.body};
  cursor: pointer;
  text-align: center;
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`

// ── Alerts section ───────────────────────────────────────────────────────────

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg} ${theme.spacing.xs}`};
`

export const SectionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.colors.textSub};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
`

export const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.lg}`};
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfacePage};
  }
`

export const AlertIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`

export const AlertContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const AlertTitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textMain};
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const AlertBadge = styled.span`
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  padding: 1px ${({ theme }) => theme.spacing.sm};
  min-width: 2rem;
  text-align: center;
  flex-shrink: 0;
`

// ── Footer ───────────────────────────────────────────────────────────────────

export const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
`

export const FooterItem = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.textMain)};
  transition: background 0.12s;

  &:hover {
    background: ${({ $danger, theme }) => ($danger ? theme.colors.dangerBg : theme.colors.surfacePage)};
  }
`
