import { GithubOutlined, LinkedinOutlined, GoogleOutlined } from '@ant-design/icons'
import type { SocialLoginBtnProps } from './SocialLoginBtn.types'
import { styles, providerColors, providerLabels } from './SocialLoginBtn.styles'

const icons = {
  google: <GoogleOutlined />,
  linkedin: <LinkedinOutlined />,
  github: <GithubOutlined />,
}

export function SocialLoginBtn({ provider, onClick }: SocialLoginBtnProps) {
  return (
    <button
      type="button"
      style={styles.btn}
      onClick={onClick}
    >
      <span style={{ color: providerColors[provider], fontSize: '1.8rem' }}>
        {icons[provider]}
      </span>
      {providerLabels[provider]}
    </button>
  )
}
