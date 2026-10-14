import { GithubOutlined, LinkedinOutlined, GoogleOutlined } from '@ant-design/icons'
import type { SocialLoginBtnProps } from './SocialLoginBtn.types'
import { providerColors, providerLabels, Btn, ProviderIcon } from './SocialLoginBtn.styles'

const icons = {
  google: <GoogleOutlined />,
  linkedin: <LinkedinOutlined />,
  github: <GithubOutlined />,
}

export function SocialLoginBtn({ provider, onClick }: SocialLoginBtnProps) {
  return (
    <Btn type="button" onClick={onClick}>
      <ProviderIcon $color={providerColors[provider]}>
        {icons[provider]}
      </ProviderIcon>
      {providerLabels[provider]}
    </Btn>
  )
}
