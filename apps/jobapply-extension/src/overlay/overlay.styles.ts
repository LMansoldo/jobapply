import styled from '@emotion/styled'

export const Shell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.pageBg};
  color: ${({ theme }) => theme.colors.textMain};
  font-family: ${({ theme }) => theme.typography.family.body};
`

// Keep the extension header aligned with the app's AppHeader.
export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  height: 6.4rem;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`

export const HeaderBrand = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`

export const Logo = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-size: 2rem;
  text-decoration: none;
  margin-right: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  letter-spacing: -0.5px;
  cursor: pointer;
`

export const LogoJob = styled.span`
  color: ${({ theme }) => theme.colors.textMain};
`

export const LogoBoard = styled.span`
  color: ${({ theme }) => theme.colors.primaryMid};
`

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;

  @media (max-width: 767px) {
    display: none;
  }
`

export const NavButton = styled.button<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.family.body};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-size: 1.1rem;
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : 'transparent')};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing.sm2} ${theme.spacing.sm}`};
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  border: none;
  min-width: 5.6rem;
  letter-spacing: 0.2px;
`

export const NavIcon = styled.span`
  font-size: 1.7rem;
  line-height: 1;
`

export const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`

export const UserAccount = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: none;
  background: transparent;
  padding: 0;
  color: ${({ theme }) => theme.colors.textMain};
  font-family: ${({ theme }) => theme.typography.family.body};
  cursor: pointer;
`

export const UserAvatar = styled.span`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primaryDark};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.6rem;
`

export const UserName = styled.span`
  color: ${({ theme }) => theme.colors.textMain};
  font-size: 1.4rem;

  @media (max-width: 767px) {
    display: none;
  }
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const CloseButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`

export const UserEmail = styled.span`
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MainContent = styled.main`
  min-height: calc(100vh - 6.4rem);

  @media (max-width: 767px) {
    padding-bottom: 6.4rem;
  }
`

export const BottomNav = styled.nav`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: none;
  height: 6.4rem;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  @media (max-width: 767px) {
    display: flex;
    align-items: stretch;
  }
`

export const BottomNavItem = styled.button<{ $active: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: none;
  background: transparent;
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  padding: ${({ theme }) => theme.spacing.xs} 0;

  svg {
    font-size: 2rem;
  }
`

export const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
`

export const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`

export const AuthWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`

export const AuthCard = styled.div`
  width: 100%;
  max-width: 42rem;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

export const AuthHeading = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.xxs};
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMain};
`

export const AuthSub = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.textSub};
`

export const AuthSwitch = styled.p`
  margin: ${({ theme }) => `${theme.spacing.md} 0 0`};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.textSub};
  text-align: center;
`

export const PageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 145rem;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const Stack = PageStack

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

export const PageTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMain};
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`

export const PageSubtitle = styled.p`
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0`};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.sm};
`

export const SectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSub};
  font-family: ${({ theme }) => theme.typography.family.heading};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.label};
  text-transform: uppercase;
`

export const StackSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
`

export const ScoreSkeletonPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const ScoreSkeletonCircle = styled.div`
  width: 12rem;
  height: 12rem;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceLight} 25%,
    ${({ theme }) => theme.colors.primaryLight} 50%,
    ${({ theme }) => theme.colors.surfaceLight} 75%
  );
  background-size: 200% 100%;
  animation: scoreSkeletonShimmer 1.5s ease-in-out infinite;

  @keyframes scoreSkeletonShimmer {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
  }
`

export const ScoreSkeletonLine = styled.div<{ $width?: string }>`
  width: ${({ $width }) => $width ?? '100%'};
  height: 1.2rem;
  border-radius: ${({ theme }) => theme.radius.xs};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceLight} 25%,
    ${({ theme }) => theme.colors.primaryLight} 50%,
    ${({ theme }) => theme.colors.surfaceLight} 75%
  );
  background-size: 200% 100%;
  animation: scoreSkeletonShimmer 1.5s ease-in-out infinite;
`

export const CvRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    align-items: flex-start;
    flex-direction: column;
  }
`

export const CvName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const CvNameStrong = styled.strong`
  color: ${({ theme }) => theme.colors.textMain};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const CvNameSub = styled.span`
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const EmptyHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.sm};
`

export const ErrorBar = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
`

export const SetupActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`

export const TopActionButton = styled.button`
  display: inline-flex;
  flex: 0 0 3.6rem;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 1.6rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDeeper};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`

export const LocaleTag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 2.8rem;
  border: 1px solid ${({ theme }) => theme.colors.primaryMid};
  border-radius: ${({ theme }) => theme.radius.chip};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDark};
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`

export const ReportActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`

export const ReportActionsBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryMid};
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`

export const ScoreDelta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.sm};
  flex-wrap: wrap;
`

export const DeltaArrow = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`

export const AtsPage = styled.div`
  min-height: calc(100vh - 6.4rem);
  display: flex;
  flex-direction: column;
`

export const ContextBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  min-height: 5.6rem;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  ${({ theme }) => theme.mediaQueries.mobileOnly} {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  }
`

export const ContextCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const ContextEyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.eyebrow};
  text-transform: uppercase;
`

export const ContextDescription = styled.span`
  flex: 1;
  min-width: 12rem;
  max-width: 70rem;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.typography.size.xs};
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ContextStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-left: auto;
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;
`

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.success};
`

export const AtsWorkspaceContainer = styled.div`
  width: 100%;
  max-width: 128rem;
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`

export const AtsWorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 25rem;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  ${({ theme }) => theme.mediaQueries.tabletDown} {
    grid-template-columns: 1fr;
  }
`

export const AtsWorkspaceMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 40px;
`

export const AtsWorkspaceAside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`

export const SuggestionsSurface = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.base};
  background: ${({ theme }) => theme.colors.surfaceDarker};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

export const EditorTabs = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
`

export const EditorTab = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primaryMid : theme.colors.surfaceBorder)};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : theme.colors.white)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.textSub)};
  font-family: ${({ theme }) => theme.typography.family.body};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryMid};
  }
`

export const ResumePanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`
