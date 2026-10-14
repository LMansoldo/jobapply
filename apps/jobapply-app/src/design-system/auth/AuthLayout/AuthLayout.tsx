import type { AuthLayoutProps } from './AuthLayout.types'
import { Page, LeftPanel, RightPanel, FormCard } from './AuthLayout.styles'

export function AuthLayout({ left, right }: AuthLayoutProps) {
  return (
    <Page>
      <LeftPanel>{left}</LeftPanel>
      <RightPanel>
        <FormCard>{right}</FormCard>
      </RightPanel>
    </Page>
  )
}
